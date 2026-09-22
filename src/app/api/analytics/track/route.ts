import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { slug, businessId, eventType, rating, deviceType } = await req.json();

    const business = await prisma.business.findFirst({
      where: {
        OR: [
          ...(businessId ? [{ id: businessId }] : []),
          ...(slug ? [{ slug }] : []),
        ],
      },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    await prisma.reviewAnalytics.create({
      data: {
        businessId: business.id,
        eventType,
        rating: rating ? Number(rating) : null,
        deviceType: deviceType || "mobile",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
