import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { utrNumber, amount, planType, customerPhone } = await req.json();

    if (!utrNumber || utrNumber.trim().length < 6) {
      return NextResponse.json(
        { error: "Please enter a valid 12-digit UPI Reference / UTR Number" },
        { status: 400 }
      );
    }

    const business = await prisma.business.findFirst({
      where: { userId: user.id },
    });

    const payment = await prisma.upiPayment.create({
      data: {
        userId: user.id,
        businessId: business?.id,
        planType: planType || "MONTHLY_299",
        amount: Number(amount) || 299,
        utrNumber: utrNumber.trim(),
        customerPhone: customerPhone || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      payment,
      message: "Payment submitted successfully! Your account will be verified shortly.",
    });
  } catch (error) {
    console.error("Payment submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit payment details" },
      { status: 500 }
    );
  }
}
