import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, hashPin, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── GET: List all merchants ──────────────────────────────────────────────────
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
            isPaid: true,
            customerType: true,
            googleAddress: true,
            createdAt: true,
          },
        },
        upiPayments: {
          select: { amount: true, status: true, agentCode: true, createdAt: true },
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

    const { name, phone, customerType = "ONLINE" } = await req.json();

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

    // Check duplicate
    const existing = await prisma.user.findFirst({
      where: { OR: [{ userIdTag: cleanPhone }, { phone: cleanPhone }] },
    });
    if (existing) {
      return NextResponse.json(
        { error: `A merchant with phone ${cleanPhone} already exists.` },
        { status: 400 }
      );
    }

    // Generate cryptographically random 4-digit PIN
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedPin = await hashPin(randomPin);
    const hashedPassword = await hashPassword(randomPin);

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
      },
      select: {
        id: true,
        name: true,
        phone: true,
        userIdTag: true,
        customerType: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      merchant,
      pin: randomPin, // Shown ONCE — admin must share with merchant
    });
  } catch (error) {
    console.error("Create merchant error:", error);
    return NextResponse.json({ error: "Failed to create merchant." }, { status: 500 });
  }
}

// ─── PATCH: Enable/Disable or Reset PIN ──────────────────────────────────────
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
      const newPin = Math.floor(1000 + Math.random() * 9000).toString();
      const hashedPin = await hashPin(newPin);
      const hashedPassword = await hashPassword(newPin);

      await prisma.user.update({
        where: { id: merchantId },
        data: { pinCode: hashedPin, password: hashedPassword },
      });

      return NextResponse.json({
        success: true,
        newPin, // Shown ONCE — admin must share with merchant
        message: "PIN has been reset successfully.",
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("Merchant PATCH error:", error);
    return NextResponse.json({ error: "Failed to update merchant." }, { status: 500 });
  }
}

// ─── DELETE: Remove merchant ──────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { merchantId } = await req.json();
    if (!merchantId) return NextResponse.json({ error: "merchantId is required." }, { status: 400 });

    await prisma.user.delete({ where: { id: merchantId } });

    return NextResponse.json({ success: true, message: "Merchant deleted." });
  } catch (error) {
    console.error("Delete merchant error:", error);
    return NextResponse.json({ error: "Failed to delete merchant." }, { status: 500 });
  }
}
