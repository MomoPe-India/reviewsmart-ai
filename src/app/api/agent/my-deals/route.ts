import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (
      !session ||
      (session.role !== "MARKETING_AGENT" && session.role !== "SUPER_ADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Fetch platform settings for commission rate
    const platformSettings = await prisma.platformSetting.findUnique({
      where: { id: "default" },
    });
    const commissionRate = platformSettings?.commissionRate ?? 0.4;

    // Fetch all payments for this agent, newest first
    const payments = await prisma.upiPayment.findMany({
      where: { agentId: session.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    if (payments.length === 0) {
      return NextResponse.json({ deals: [] });
    }

    // Collect unique businessIds and userIds for batch lookup
    const businessIds = Array.from(new Set(payments.map((p) => p.businessId).filter((id): id is string => id !== null)));
    const userIds = Array.from(new Set(payments.map((p) => p.userId).filter((id): id is string => Boolean(id))));

    // Batch fetch businesses and merchant users
    const [businesses, merchantUsers] = await Promise.all([
      prisma.business.findMany({
        where: { id: { in: businessIds } },
        select: {
          id: true,
          name: true,
          slug: true,
          googleReviewUrl: true,
          googleAddress: true,
          logoUrl: true,
          category: true,
          isPaid: true,
        },
      }),
      prisma.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          name: true,
          phone: true,
          userIdTag: true,
        },
      }),
    ]);

    // Index for O(1) lookup
    const bizMap = new Map(businesses.map((b) => [b.id, b]));
    const userMap = new Map(merchantUsers.map((u) => [u.id, u]));

    const deals = payments.map((p) => {
      const biz = p.businessId ? bizMap.get(p.businessId) : null;
      const merchant = p.userId ? userMap.get(p.userId) : null;

      return {
        paymentId: p.id,
        status: p.status as "PENDING" | "APPROVED" | "REJECTED",
        amount: p.amount,
        agentCommission: Math.round(p.amount * commissionRate),
        createdAt: p.createdAt.toISOString(),
        utrNumber: p.utrNumber || null,
        businessName: biz?.name || "Unknown Business",
        businessSlug: biz?.slug || "",
        businessCategory: biz?.category || "",
        businessAddress: biz?.googleAddress || "",
        businessLogoUrl: biz?.logoUrl || null,
        isPaid: biz?.isPaid || false,
        googleReviewUrl: biz?.googleReviewUrl || "",
        merchantName: merchant?.name || "",
        merchantPhone: merchant?.phone || p.customerPhone || "",
        merchantUserId: merchant?.userIdTag || p.customerPhone || "",
      };
    });

    return NextResponse.json({ deals });
  } catch (err) {
    console.error("agent/my-deals error:", err);
    return NextResponse.json(
      { error: "Failed to fetch deals" },
      { status: 500 }
    );
  }
}
