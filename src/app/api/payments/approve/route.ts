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
      // 1. Get platform settings for default commission rate
      const settings = await prisma.platformSetting.findUnique({
        where: { id: "default" },
      });
      let effectiveCommissionRate = settings?.commissionRate ?? 0.30;

      // 2. Lookup agent's individual commission rate if agent deal
      const isAgentDeal = Boolean(payment.agentId || payment.agentCode);
      let resolvedAgentId = payment.agentId;

      if (payment.agentId) {
        const agentUser = await prisma.user.findUnique({
          where: { id: payment.agentId },
          select: { commissionRate: true },
        });
        if (agentUser?.commissionRate != null) {
          effectiveCommissionRate = agentUser.commissionRate;
        }
      } else if (payment.agentCode) {
        const agentUser = await prisma.user.findFirst({
          where: {
            OR: [
              { agentCode: payment.agentCode },
              { userIdTag: payment.agentCode },
            ],
          },
          select: { id: true, commissionRate: true },
        });
        if (agentUser) {
          resolvedAgentId = agentUser.id;
          if (agentUser.commissionRate != null) {
            effectiveCommissionRate = agentUser.commissionRate;
          }
        }
      }

      // 3. Calculate commission
      const commission = isAgentDeal
        ? Math.round(payment.amount * effectiveCommissionRate * 100) / 100
        : null;

      // 3. Update payment status + set commission
      await prisma.upiPayment.update({
        where: { id: paymentId },
        data: {
          status: "APPROVED",
          commission: commission,
          ...(resolvedAgentId && !payment.agentId ? { agentId: resolvedAgentId } : {}),
        },
      });

      // 4. Auto-activate the business card & update package tier
      if (payment.businessId) {
        await prisma.business.update({
          where: { id: payment.businessId },
          data: {
            isPaid: true,
            ...(payment.packageTier ? { packageTier: payment.packageTier } : {}),
          },
        });
      }

      const commissionMsg = commission
        ? ` Agent earns ₹${commission.toFixed(2)} (${Math.round(effectiveCommissionRate * 100)}%) commission.`
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
