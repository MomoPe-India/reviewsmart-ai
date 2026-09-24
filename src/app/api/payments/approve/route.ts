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
      return NextResponse.json({ error: "Payment ID and action are required." }, { status: 400 });
    }

    const payment = await prisma.upiPayment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment record not found." }, { status: 404 });
    }

    if (action === "APPROVE") {
      // 1. Get platform settings for commission rate
      const settings = await prisma.platformSetting.findUnique({
        where: { id: "default" },
      });
      const commissionRate = settings?.commissionRate ?? 0.40;

      // 2. Calculate commission (only for agent deals)
      const commission =
        payment.agentId ? Math.round(payment.amount * commissionRate * 100) / 100 : null;

      // 3. Update payment status + set commission
      await prisma.upiPayment.update({
        where: { id: paymentId },
        data: {
          status: "APPROVED",
          commission: commission,
        },
      });

      // 4. Auto-activate the business card
      if (payment.businessId) {
        await prisma.business.update({
          where: { id: payment.businessId },
          data: { isPaid: true },
        });
      }

      const commissionMsg = commission
        ? ` Agent earns ₹${commission.toFixed(2)} commission.`
        : "";

      return NextResponse.json({
        success: true,
        message: `Payment approved! Business card is now LIVE.${commissionMsg}`,
        commission,
      });
    } else if (action === "REJECT") {
      await prisma.upiPayment.update({
        where: { id: paymentId },
        data: { status: "REJECTED" },
      });

      // Keep business as isPaid = false (stays inactive)
      return NextResponse.json({ success: true, message: "Payment rejected. Business card remains inactive." });
    } else {
      return NextResponse.json({ error: "Invalid action. Use APPROVE or REJECT." }, { status: 400 });
    }
  } catch (error) {
    console.error("Approve payment error:", error);
    return NextResponse.json(
      { error: "Failed to process payment action." },
      { status: 500 }
    );
  }
}
