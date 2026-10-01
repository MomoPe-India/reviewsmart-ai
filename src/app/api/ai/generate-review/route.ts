import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAiReviews } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessId,
      slug,
      businessName: directName,
      tagline: directTagline,
      selectedTags = [],
      customNote,
      keywords: directKeywords,
      tone: directTone,
      languageMode = "AUTO",
      location: directLocation,
      tagChips: directTagChips,
    } = body;

    let businessName = directName || "Our Store";
    let tagline = directTagline || null;
    let keywords = directKeywords || "";
    let tone = directTone || "friendly";
    let foundBusinessId: string | null = null;
    let category = body.category || "";
    let location = directLocation || "";
    let tagChips = directTagChips || "";

    if (businessId || slug) {
      const business = await prisma.business.findFirst({
        where: {
          OR: [
            ...(businessId ? [{ id: businessId }] : []),
            ...(slug ? [{ slug }] : []),
          ],
        },
      });

      if (business) {
        businessName = business.name;
        tagline = business.tagline;
        keywords = business.keywords || keywords;
        tone = business.reviewPromptTone || tone;
        category = business.category || category;
        location = business.googleAddress || business.visitingCardAddress || location;
        tagChips = business.tagChips || tagChips;
        foundBusinessId = business.id;
      }
    }

    const reviews = await generateAiReviews({
      businessId: foundBusinessId || businessId || undefined,
      businessName,
      tagline,
      location,
      keywords,
      tagChips,
      selectedTags: Array.isArray(selectedTags) ? selectedTags : [],
      tone,
      customNote,
      category,
      languageMode,
    });

    // Log analytics in the background if business exists
    if (foundBusinessId) {
      prisma.reviewAnalytics
        .create({
          data: {
            businessId: foundBusinessId,
            eventType: "AI_GENERATED",
            rating: 5,
            deviceType: "mobile",
          },
        })
        .catch(() => {});
    }

    return NextResponse.json({
      success: true,
      reviews,
      review: reviews[0]?.text || "Really liked their service. Clean work and timely delivery!",
    });
  } catch (error) {
    console.error("Generate review error:", error);
    return NextResponse.json(
      { error: "Failed to generate reviews" },
      { status: 500 }
    );
  }
}
