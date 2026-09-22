import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAiReviews } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { businessId, slug, selectedTags = [], customNote } = await req.json();

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

    const reviews = await generateAiReviews({
      businessName: business.name,
      tagline: business.tagline,
      selectedTags: Array.isArray(selectedTags) ? selectedTags : [],
      keywords: business.keywords,
      tone: business.reviewPromptTone,
      customNote,
    });

    // Log analytics in the background
    try {
      await prisma.reviewAnalytics.create({
        data: {
          businessId: business.id,
          eventType: "AI_GENERATED",
          rating: 5,
          deviceType: "mobile",
        },
      });
    } catch (e) {
      console.warn("Analytics error:", e);
    }

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("Generate review error:", error);
    return NextResponse.json(
      { error: "Failed to generate reviews" },
      { status: 500 }
    );
  }
}
