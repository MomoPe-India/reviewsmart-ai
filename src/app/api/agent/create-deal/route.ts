import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, hashPin, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "MARKETING_AGENT" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Unauthorized. Marketing agent or administrator credentials required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      merchantName,
      merchantPhone,
      merchantPin,
      googlePlaceId,
      googleAddress,
      googleReviewUrl,
      logoUrl,
      whatsapp,
      instagram,
      website,
      negotiatedPrice,
      utrNumber,
    } = body;

    if (!merchantName || !merchantPhone || !googleReviewUrl) {
      return NextResponse.json(
        { error: "Business name, merchant mobile number, and Google Review URL are mandatory." },
        { status: 400 }
      );
    }

    // Clean and validate phone number
    const cleanPhone = String(merchantPhone).replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number for the merchant." },
        { status: 400 }
      );
    }

    // Fetch platform minimum price floor
    const platformSettings = await prisma.platformSetting.findUnique({
      where: { id: "default" },
    });
    const minFloor = platformSettings?.minNegotiatedPrice || 499;

    const finalAmount = Number(negotiatedPrice);
    if (isNaN(finalAmount) || finalAmount < minFloor) {
      return NextResponse.json(
        {
          error: `Minimum authorized price floor is ₹${minFloor}. You cannot submit a lower amount.`,
        },
        { status: 400 }
      );
    }

    // Determine merchant PIN (use provided 4-digit PIN or default to last 4 digits of phone)
    const pinString = String(merchantPin || cleanPhone.slice(-4)).trim();
    if (pinString.length < 4) {
      return NextResponse.json(
        { error: "PIN must be at least 4 digits." },
        { status: 400 }
      );
    }

    const hashedPin = await hashPin(pinString);
    const hashedPassword = await hashPassword(pinString);

    // Check if merchant already exists by phone/userIdTag
    let merchantUser = await prisma.user.findFirst({
      where: {
        OR: [{ userIdTag: cleanPhone }, { phone: cleanPhone }],
      },
    });

    if (!merchantUser) {
      merchantUser = await prisma.user.create({
        data: {
          email: `${cleanPhone}@reviewsmart.local`,
          name: merchantName,
          phone: cleanPhone,
          userIdTag: cleanPhone,
          pinCode: hashedPin,
          password: hashedPassword,
          role: "BUSINESS_OWNER",
          referredBy: session.id,
        },
      });
    }

    // Generate collision-resistant slug
    const baseSlug = merchantName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const randomSuffix = crypto.randomBytes(2).toString("hex");
    const uniqueSlug = `${baseSlug || "store"}-${randomSuffix}`;

    // Create Business Profile
    const business = await prisma.business.create({
      data: {
        userId: merchantUser.id,
        name: merchantName,
        slug: uniqueSlug,
        tagline: "Review our service & share your experience!",
        logoUrl: logoUrl || null,
        googlePlaceId: googlePlaceId || null,
        googleReviewUrl: googleReviewUrl,
        googleAddress: googleAddress || null,
        whatsapp: whatsapp || null,
        instagram: instagram || null,
        website: website || null,
        isPaid: true,
      },
    });

    // Create UpiPayment record linked to Agent
    const upiPayment = await prisma.upiPayment.create({
      data: {
        userId: merchantUser.id,
        businessId: business.id,
        agentId: session.id,
        agentCode: session.agentCode || "DIRECT_AGENT",
        planType: "NEGOTIATED_DEAL",
        amount: finalAmount,
        utrNumber: utrNumber ? String(utrNumber).trim() : `AGT-${Date.now().toString().slice(-8)}`,
        customerPhone: cleanPhone,
        status: utrNumber ? "PENDING" : "PENDING",
        notes: `Negotiated on-site deal by Agent ${session.agentCode || session.name || session.id}`,
      },
    });

    // Format central UPI payment payload
    const upiId = platformSettings?.upiId || "momopedeals@oksbi";
    const upiPayee = platformSettings?.upiPayeeName || "Damerla Mohan";
    const upiNote = `RS-${cleanPhone}-${session.agentCode || "AGT"}`;
    const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      upiPayee
    )}&am=${finalAmount}&cu=INR&tn=${encodeURIComponent(upiNote)}`;

    return NextResponse.json({
      success: true,
      deal: {
        paymentId: upiPayment.id,
        merchantUserId: cleanPhone,
        merchantPin: pinString,
        businessId: business.id,
        businessSlug: business.slug,
        businessName: business.name,
        negotiatedAmount: finalAmount,
        upiId,
        upiPayee,
        upiNote,
        upiDeepLink,
      },
    });
  } catch (error) {
    console.error("Agent deal creation error:", error);
    return NextResponse.json(
      { error: "Failed to create deal. Please verify details." },
      { status: 500 }
    );
  }
}
