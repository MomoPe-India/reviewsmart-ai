import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentId, action } = await req.json(); // action: "APPROVE" | "REJECT"

    if (!paymentId || !action) {
      return NextResponse.json(
        { error: "Payment ID and action are required" },
        { status: 400 }
      );
    }

    const payment = await prisma.upiPayment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    if (action === "APPROVE") {
      // 1. Mark payment as APPROVED
      await prisma.upiPayment.update({
        where: { id: paymentId },
        data: { status: "APPROVED" },
      });

      // 2. Mark business as isPaid = true
      if (payment.businessId) {
        await prisma.business.update({
          where: { id: payment.businessId },
          data: { isPaid: true },
        });
      }

      // 3. Extend subscription based on planType (30 Days for Monthly ₹299 vs 365 Days for 1-Year / Lifetime ₹999)
      const isMonthly = payment.planType === "MONTHLY_299";
      const daysToAdd = isMonthly ? 30 : 365;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + daysToAdd);

      const starterPlan = await prisma.subscriptionPlan.findFirst({
        where: { isActive: true },
        orderBy: { price: "asc" },
      });

      if (starterPlan) {
        await prisma.userSubscription.upsert({
          where: { userId: payment.userId },
          update: {
            status: "ACTIVE",
            endDate: expiryDate,
          },
          create: {
            userId: payment.userId,
            planId: starterPlan.id,
            status: "ACTIVE",
            endDate: expiryDate,
          },
        });
      }

      const planLabel = isMonthly ? "1 Month (30 Days)" : "1 Year / Lifetime";
      return NextResponse.json({
        success: true,
        message: `Payment approved & store activated for ${planLabel}!`,
      });
    } else {
      await prisma.upiPayment.update({
        where: { id: paymentId },
        data: { status: "REJECTED" },
      });
      return NextResponse.json({ success: true, message: "Payment rejected." });
    }
  } catch (error) {
    console.error("Approve payment error:", error);
    return NextResponse.json(
      { error: "Failed to process payment action" },
      { status: 500 }
    );
  }
}
