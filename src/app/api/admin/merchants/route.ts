import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, hashPin, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

// ─── GET: List all merchants with complete details ────────────────────────────
export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const merchants = await prisma.user.findMany({
      where: { role: "BUSINESS_OWNER" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        phone: true,
        userIdTag: true,
        email: true,
        customerType: true,
        isActive: true,
        referredBy: true,
        createdAt: true,
        businesses: {
          select: {
            id: true,
            name: true,
            slug: true,
            tagline: true,
            category: true,
            logoUrl: true,
            primaryColor: true,
            googleReviewUrl: true,
            googlePlaceId: true,
            googleAddress: true,
            phone: true,
            whatsapp: true,
            instagram: true,
            website: true,
            minRatingForGoogle: true,
            tagChips: true,
            keywords: true,
            isPaid: true,
            customerType: true,
            createdAt: true,
          },
        },
        upiPayments: {
          select: { amount: true, status: true, agentCode: true, commission: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    // Enrich with payment totals
    const enriched = merchants.map((m) => {
      const approved = m.upiPayments.filter((p) => p.status === "APPROVED");
      const totalPaid = approved.reduce((s, p) => s + p.amount, 0);
      return { ...m, totalPaid, dealCount: m.upiPayments.length };
    });

    return NextResponse.json({ merchants: enriched });
  } catch (error) {
    console.error("Fetch merchants error:", error);
    return NextResponse.json({ error: "Failed to fetch merchants." }, { status: 500 });
  }
}

// ─── POST: Create new merchant (admin-only) ───────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, phone, customerType = "ONLINE", businessName, category, googleReviewUrl } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone number are required." }, { status: 400 });
    }

    const cleanPhone = String(phone).replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    // Check duplicate phone or userIdTag
    const existing = await prisma.user.findFirst({
      where: { OR: [{ userIdTag: cleanPhone }, { phone: cleanPhone }] },
    });
    if (existing) {
      return NextResponse.json(
        { error: `A merchant with phone ${cleanPhone} already exists.` },
        { status: 400 }
      );
    }

    // Generate random 4-digit PIN
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedPin = await hashPin(randomPin);
    const hashedPassword = await hashPassword(randomPin);

    // Create user and initial business
    const merchant = await prisma.user.create({
      data: {
        email: `${cleanPhone}@merchant.reviewsmart.local`,
        name: name.trim(),
        phone: cleanPhone,
        userIdTag: cleanPhone,
        pinCode: hashedPin,
        password: hashedPassword,
        role: "BUSINESS_OWNER",
        customerType: customerType || "ONLINE",
        isActive: true,
        businesses: {
          create: {
            name: (businessName || name).trim(),
            slug: slugify((businessName || name).trim()) + "-" + cleanPhone.slice(-4),
            category: category || "Local Business & Services",
            tagline: "Thank you for visiting! Share your review.",
            customerType: customerType || "ONLINE",
            isPaid: false,
            phone: cleanPhone,
            whatsapp: cleanPhone,
            googleReviewUrl: googleReviewUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((businessName || name).trim())}`,
          },
        },
      },
      include: {
        businesses: true,
      },
    });

    const business = merchant.businesses[0];

    return NextResponse.json({
      success: true,
      merchant,
      pin: randomPin,
      slug: business?.slug,
      phone: cleanPhone,
      businessName: business?.name,
    });
  } catch (error) {
    console.error("Create merchant error:", error);
    return NextResponse.json({ error: "Failed to create merchant." }, { status: 500 });
  }
}

// ─── PUT: Edit existing merchant & their business ─────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const {
      merchantId,
      name,
      phone,
      customerType,
      isActive,
      businessId,
      businessName,
      slug,
      category,
      tagline,
      googlePlaceId,
      googleReviewUrl,
      googleAddress,
      whatsapp,
      website,
      minRatingForGoogle,
      isPaid,
    } = body;

    if (!merchantId) {
      return NextResponse.json({ error: "merchantId is required." }, { status: 400 });
    }

    const cleanPhone = phone ? String(phone).replace(/[^0-9]/g, "") : undefined;

    // Check if new phone conflicts with another merchant
    if (cleanPhone) {
      const conflict = await prisma.user.findFirst({
        where: {
          id: { not: merchantId },
          OR: [{ phone: cleanPhone }, { userIdTag: cleanPhone }],
        },
      });
      if (conflict) {
        return NextResponse.json(
          { error: `Phone number ${cleanPhone} is already in use by another user.` },
          { status: 400 }
        );
      }
    }

    // Prepare merchant user update
    const updateUserData: Record<string, unknown> = {
      ...(name !== undefined && { name: name.trim() }),
      ...(cleanPhone !== undefined && {
        phone: cleanPhone,
        userIdTag: cleanPhone,
        email: `${cleanPhone}@merchant.reviewsmart.local`,
      }),
      ...(customerType !== undefined && { customerType }),
      ...(isActive !== undefined && { isActive }),
    };

    if (body.pin && String(body.pin).trim().length === 4) {
      const cleanPin = String(body.pin).trim().replace(/[^0-9]/g, "");
      if (cleanPin.length === 4) {
        const hp = await hashPin(cleanPin);
        updateUserData.pinCode = hp;
        updateUserData.password = hp;
      }
    }

    // Update merchant user
    const updatedUser = await prisma.user.update({
      where: { id: merchantId },
      data: updateUserData,
    });

    // Find and update associated business
    const targetBusinessId =
      businessId ||
      (await prisma.business.findFirst({ where: { userId: merchantId }, select: { id: true } }))?.id;

    if (targetBusinessId) {
      await prisma.business.update({
        where: { id: targetBusinessId },
        data: {
          ...(businessName !== undefined && { name: businessName.trim() }),
          ...(slug !== undefined && { slug: slugify(slug) }),
          ...(category !== undefined && { category }),
          ...(tagline !== undefined && { tagline }),
          ...(googlePlaceId !== undefined && { googlePlaceId }),
          ...(googleReviewUrl !== undefined && { googleReviewUrl }),
          ...(googleAddress !== undefined && { googleAddress }),
          ...(cleanPhone !== undefined && { phone: cleanPhone }),
          ...(whatsapp !== undefined ? { whatsapp } : cleanPhone !== undefined ? { whatsapp: cleanPhone } : {}),
          ...(website !== undefined && { website }),
          ...(minRatingForGoogle !== undefined && { minRatingForGoogle: Number(minRatingForGoogle) }),
          ...(isPaid !== undefined && { isPaid }),
          ...(customerType !== undefined && { customerType }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Merchant updated successfully.",
      merchant: updatedUser,
    });
  } catch (error) {
    console.error("Edit merchant error:", error);
    return NextResponse.json({ error: "Failed to update merchant." }, { status: 500 });
  }
}

// ─── PATCH: Suspend/Activate or Reset PIN ─────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { merchantId, action } = await req.json();

    if (!merchantId || !action) {
      return NextResponse.json({ error: "merchantId and action are required." }, { status: 400 });
    }

    if (action === "toggle_active") {
      const merchant = await prisma.user.findUnique({ where: { id: merchantId } });
      if (!merchant) return NextResponse.json({ error: "Merchant not found." }, { status: 404 });

      const updated = await prisma.user.update({
        where: { id: merchantId },
        data: { isActive: !merchant.isActive },
        select: { id: true, isActive: true, name: true },
      });

      return NextResponse.json({
        success: true,
        isActive: updated.isActive,
        message: `${updated.name}'s account is now ${updated.isActive ? "ACTIVE" : "SUSPENDED"}.`,
      });
    }

    if (action === "reset_pin") {
      const merchant = await prisma.user.findUnique({
        where: { id: merchantId },
        include: { businesses: { select: { slug: true, name: true }, take: 1 } },
      });
      if (!merchant) return NextResponse.json({ error: "Merchant not found." }, { status: 404 });

      const newPin = Math.floor(1000 + Math.random() * 9000).toString();
      const hashedPin = await hashPin(newPin);
      const hashedPassword = await hashPassword(newPin);

      await prisma.user.update({
        where: { id: merchantId },
        data: { pinCode: hashedPin, password: hashedPassword },
      });

      return NextResponse.json({
        success: true,
        newPin,
        phone: merchant.phone,
        name: merchant.name,
        slug: merchant.businesses[0]?.slug,
        message: "PIN has been reset successfully.",
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("Merchant PATCH error:", error);
    return NextResponse.json({ error: "Failed to update merchant." }, { status: 500 });
  }
}

// ─── DELETE: Delete merchant & cascade associated data ────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    let merchantId: string | null = null;
    try {
      const body = await req.json();
      merchantId = body?.merchantId || body?.id || null;
    } catch {
      // Body might be empty, fallback to searchParams
    }
    if (!merchantId) {
      merchantId = req.nextUrl.searchParams.get("merchantId") || req.nextUrl.searchParams.get("id");
    }
    if (!merchantId) return NextResponse.json({ error: "merchantId is required." }, { status: 400 });

    const merchant = await prisma.user.findUnique({
      where: { id: merchantId },
      select: { id: true, name: true },
    });
    if (!merchant) return NextResponse.json({ error: "Merchant not found." }, { status: 404 });

    // Explicit cascaded deletion in a transaction to prevent any foreign key constraint violations
    await prisma.$transaction(async (tx) => {
      // 1. Find all businesses belonging to the merchant
      const businesses = await tx.business.findMany({
        where: { userId: merchantId },
        select: { id: true },
      });
      const businessIds = businesses.map((b) => b.id);

      if (businessIds.length > 0) {
        // 2. Delete analytics
        await tx.reviewAnalytics.deleteMany({
          where: { businessId: { in: businessIds } },
        });

        // 3. Delete private feedbacks
        await tx.privateFeedback.deleteMany({
          where: { businessId: { in: businessIds } },
        });

        // 4. Delete payments linked to these businesses
        await tx.upiPayment.deleteMany({
          where: { businessId: { in: businessIds } },
        });
      }

      // 5. Delete any payments linked directly to this user
      await tx.upiPayment.deleteMany({
        where: { userId: merchantId },
      });

      // 6. Delete subscriptions for this user
      await tx.userSubscription.deleteMany({
        where: { userId: merchantId },
      });

      // 7. Delete businesses
      await tx.business.deleteMany({
        where: { userId: merchantId },
      });

      // 8. Nullify referredBy on any other user
      await tx.user.updateMany({
        where: { referredBy: merchantId },
        data: { referredBy: null },
      });

      // 9. Finally delete the user record
      await tx.user.delete({
        where: { id: merchantId },
      });
    });

    return NextResponse.json({
      success: true,
      message: `${merchant.name || "Merchant"} and all associated data have been permanently deleted.`,
    });
  } catch (error: any) {
    console.error("Delete merchant error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete merchant." },
      { status: 500 }
    );
  }
}
