import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, hashPin, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { detectIndustry } from "@/lib/industry";
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

    // Validate phone
    const cleanPhone = String(merchantPhone).replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    // Fetch platform settings
    const platformSettings = await prisma.platformSetting.findUnique({
      where: { id: "default" },
    });
    const minFloor = platformSettings?.minNegotiatedPrice ?? 499;
    const commissionRate = platformSettings?.commissionRate ?? 0.40;

    const finalAmount = Number(negotiatedPrice);
    if (isNaN(finalAmount) || finalAmount < minFloor) {
      return NextResponse.json(
        { error: `Minimum authorized price floor is ₹${minFloor}. Cannot submit a lower amount.` },
        { status: 400 }
      );
    }

    // Generate random 4-digit PIN if not provided
    const rawPin = merchantPin
      ? String(merchantPin).trim().replace(/[^0-9]/g, "").slice(0, 4)
      : Math.floor(1000 + Math.random() * 9000).toString();

    if (rawPin.length !== 4) {
      return NextResponse.json({ error: "PIN must be exactly 4 digits." }, { status: 400 });
    }

    const hashedPin = await hashPin(rawPin);
    const hashedPassword = await hashPassword(rawPin);

    // Upsert merchant user (use phone as userIdTag)
    let merchantUser = await prisma.user.findFirst({
      where: { OR: [{ userIdTag: cleanPhone }, { phone: cleanPhone }] },
    });

    if (!merchantUser) {
      merchantUser = await prisma.user.create({
        data: {
          email: `${cleanPhone}@merchant.reviewsmart.local`,
          name: merchantName,
          phone: cleanPhone,
          userIdTag: cleanPhone,
          pinCode: hashedPin,
          password: hashedPassword,
          role: "BUSINESS_OWNER",
          customerType: "OFFLINE",
          isActive: true,
          referredBy: session.id,
        },
      });
    }

    // Generate unique slug
    const baseSlug = merchantName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const randomSuffix = crypto.randomBytes(2).toString("hex");
    const uniqueSlug = `${baseSlug || "store"}-${randomSuffix}`;

    // Detect industry
    const industry = detectIndustry(merchantName, body.category || "", body.tagline || "");
    const finalCategory = body.category || industry.label;
    const finalTagline = body.tagline || industry.tagline;
    const finalTags = body.tagChips || industry.tags.join(",");
    const finalKeywords = body.keywords || industry.keywords;

    // Create business — isPaid = false until admin approves
    const business = await prisma.business.create({
      data: {
        userId: merchantUser.id,
        name: merchantName,
        slug: uniqueSlug,
        tagline: finalTagline,
        category: finalCategory,
        customerType: "OFFLINE",
        logoUrl: logoUrl || null,
        googlePlaceId: googlePlaceId || null,
        googleReviewUrl,
        googleAddress: googleAddress || null,
        phone: cleanPhone,
        whatsapp: whatsapp || null,
        instagram: instagram || null,
        website: website || null,
        tagChips: finalTags,
        keywords: finalKeywords,
        minRatingForGoogle: 4,
        reviewPromptTone: "friendly",
        isPaid: false, // CRITICAL: never auto-activate
      },
    });

    // Create UPI payment record
    const upiPayment = await prisma.upiPayment.create({
      data: {
        userId: merchantUser.id,
        businessId: business.id,
        agentId: session.role === "MARKETING_AGENT" ? session.id : null,
        agentCode: session.agentCode || null,
        planType: "NEGOTIATED_DEAL",
        amount: finalAmount,
        utrNumber: utrNumber ? String(utrNumber).trim() : `PENDING-${Date.now().toString().slice(-8)}`,
        customerPhone: cleanPhone,
        status: "PENDING",
        notes: `Offline deal by Agent ${session.agentCode || session.name || "DIRECT"}. Negotiated: ₹${finalAmount}`,
      },
    });

    // Format UPI deep link
    const upiId = platformSettings?.upiId || "momopedeals@oksbi";
    const upiPayee = platformSettings?.upiPayeeName || "Damerla Mohan";
    const upiNote = `RS-${cleanPhone.slice(-4)}-${session.agentCode || "AGT"}`;
    const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiPayee)}&am=${finalAmount}&cu=INR&tn=${encodeURIComponent(upiNote)}`;

    // Preview commission for agent UI
    const agentCommission = session.role === "MARKETING_AGENT"
      ? Math.round(finalAmount * commissionRate)
      : 0;

    return NextResponse.json({
      success: true,
      deal: {
        paymentId: upiPayment.id,
        merchantUserId: cleanPhone,
        merchantPin: rawPin, // Show ONCE — admin/agent must note this
        businessId: business.id,
        businessSlug: business.slug,
        businessName: business.name,
        negotiatedAmount: finalAmount,
        agentCommission,
        upiId,
        upiPayee,
        upiNote,
        upiDeepLink,
      },
    });
  } catch (error) {
    console.error("Agent deal creation error:", error);
    return NextResponse.json(
      { error: "Failed to create deal. Please check details and try again." },
      { status: 500 }
    );
  }
}
