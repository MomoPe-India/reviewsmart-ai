import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
      const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          userIdTag: true,
          agentCode: true,
          phone: true,
          customerType: true,
          isActive: true,
          businesses: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
              primaryColor: true,
              isPaid: true,
              customerType: true,
            },
          },
        },
      });

      let agentStats = null;
      if (fullUser?.role === "MARKETING_AGENT" || user.role === "MARKETING_AGENT") {
        const payments = await prisma.upiPayment.findMany({
          where: { agentId: user.id },
          select: { amount: true, status: true, commission: true },
        });

        const dealsClosed = payments.filter((p) => p.status === "APPROVED").length;
        const totalRevenue = payments
          .filter((p) => p.status === "APPROVED")
          .reduce((sum, p) => sum + p.amount, 0);
        const totalCommission = payments
          .filter((p) => p.status === "APPROVED")
          .reduce((sum, p) => sum + (p.commission || 0), 0);
        const pendingDeals = payments.filter((p) => p.status === "PENDING").length;

        agentStats = {
          dealsClosed,
          totalRevenue,
          totalCommission,
          pendingDeals,
        };
      }

      return NextResponse.json({
        user: {
          ...(fullUser || user),
          agentStats,
        },
      });
    } catch (dbErr) {
      console.warn("DB lookup in /api/auth/me failed, falling back to session user:", dbErr);
      return NextResponse.json({ user });
    }
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
