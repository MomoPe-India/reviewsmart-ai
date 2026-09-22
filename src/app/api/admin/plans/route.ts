import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plans = await prisma.subscriptionPlan.findMany({
    orderBy: { price: "asc" },
    include: {
      _count: {
        select: { subscriptions: true },
      },
    },
  });

  return NextResponse.json({ plans });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, price, currency, durationDays, maxCards, features, isActive } = await req.json();

    if (!name || price === undefined) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    const plan = await prisma.subscriptionPlan.create({
      data: {
        name,
        price: Number(price),
        currency: currency || "USD",
        durationDays: Number(durationDays) || 30,
        maxCards: Number(maxCards) || 1,
        features: typeof features === "string" ? features : JSON.stringify(features || []),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error("Create plan error:", error);
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}
