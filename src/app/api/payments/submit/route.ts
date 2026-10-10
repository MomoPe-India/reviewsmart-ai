import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { utrNumber, amount, planType, packageTier, customerPhone, agentCode: requestedAgentCode } = await req.json();

    const cleanUtr = String(utrNumber || "").trim();
    if (!cleanUtr || cleanUtr.length < 6) {
      return NextResponse.json(
        { error: "Please enter a valid 12-digit UPI Reference / UTR Number" },
        { status: 400 }
      );
    }

    // 1. Guard against duplicate UTR submission
    const existingPayment = await prisma.upiPayment.findFirst({
      where: { utrNumber: cleanUtr },
    });

    if (existingPayment) {
      if (existingPayment.status === "APPROVED") {
        return NextResponse.json(
          { error: "This UTR Number has already been verified and used. If you made a new payment, please submit the new UTR." },
          { status: 400 }
        );
      }
      if (existingPayment.status === "PENDING") {
        return NextResponse.json(
          { error: "This UTR Number is already under verification. Our team is reviewing it." },
          { status: 400 }
        );
      }
    }

    const business = await prisma.business.findFirst({
      where: { userId: user.id },
    });

    const paymentAmount = Number(amount) || 2999;
    const resolvedTier =
      packageTier ||
      (paymentAmount >= 2800
        ? "ALL_IN_ONE_HUB"
        : paymentAmount >= 2200
        ? "EXECUTIVE_STANDEE"
        : "STARTER_PVC");

    // 2. Resolve Agent Referral Attribution (e.g. from ?ref=MKT-01)
    let attributedAgentId: string | null = null;
    let attributedAgentCode: string | null = null;
    let precalculatedCommission: number | null = null;

    const candidateCode = requestedAgentCode ? String(requestedAgentCode).trim().toUpperCase() : null;
    if (candidateCode) {
      const agentUser = await prisma.user.findFirst({
        where: {
          OR: [
            { agentCode: candidateCode },
            { userIdTag: candidateCode },
          ],
          role: "MARKETING_AGENT",
        },
        select: { id: true, agentCode: true, commissionRate: true, isActive: true },
      });

      if (agentUser && agentUser.isActive) {
        attributedAgentId = agentUser.id;
        attributedAgentCode = agentUser.agentCode || candidateCode;
        const rate = agentUser.commissionRate != null ? agentUser.commissionRate : 0.30;
        precalculatedCommission = Math.round(paymentAmount * rate * 100) / 100;

        // Associate merchant user with referring agent if not already set
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { referredBy: true },
        });

        if (dbUser && !dbUser.referredBy) {
          await prisma.user.update({
            where: { id: user.id },
            data: { referredBy: agentUser.id },
          });
        }
      }
    }

    const payment = await prisma.upiPayment.create({
      data: {
        userId: user.id,
        businessId: business?.id,
        agentId: attributedAgentId,
        agentCode: attributedAgentCode,
        commission: precalculatedCommission,
        planType: planType || "ONLINE_DIRECT",
        packageTier: resolvedTier,
        amount: paymentAmount,
        utrNumber: cleanUtr,
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
