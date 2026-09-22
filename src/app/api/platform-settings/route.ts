import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await prisma.platformSetting.findUnique({
      where: { id: "default" },
    });
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Settings get error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updated = await prisma.platformSetting.upsert({
      where: { id: "default" },
      update: {
        platformName: body.platformName,
        supportEmail: body.supportEmail,
        currencySymbol: body.currencySymbol || "₹",
        upiId: body.upiId,
        upiPayeeName: body.upiPayeeName,
        digitalPrice: Number(body.digitalPrice) || 299,
        physicalPrice: Number(body.physicalPrice) || 999,
      },
      create: {
        id: "default",
        platformName: body.platformName || "ReviewSmart AI",
        supportEmail: body.supportEmail || "support@reviewsmart.ai",
        currencySymbol: body.currencySymbol || "₹",
        upiId: body.upiId || "business@upi",
        upiPayeeName: body.upiPayeeName || "ReviewSmart Pay",
        digitalPrice: Number(body.digitalPrice) || 299,
        physicalPrice: Number(body.physicalPrice) || 999,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
