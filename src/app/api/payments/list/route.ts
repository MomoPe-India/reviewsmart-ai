import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payments = await prisma.upiPayment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            businesses: {
              select: { name: true, slug: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("List payments error:", error);
    return NextResponse.json({ error: "Failed to list payments" }, { status: 500 });
  }
}
