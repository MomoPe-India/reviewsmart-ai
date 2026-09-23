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
    } = body;

    let businessName = directName || "Our Store";
    let tagline = directTagline || null;
    let keywords = directKeywords || "";
    let tone = directTone || "friendly";
    let foundBusinessId: string | null = null;

    let category = body.category || "";

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
        foundBusinessId = business.id;
      }
    }

    const reviews = await generateAiReviews({
      businessName,
      tagline,
      selectedTags: Array.isArray(selectedTags) ? selectedTags : [],
      keywords,
      tone,
      customNote,
      category,
    });

    // Log analytics in the background if business exists
    if (foundBusinessId) {
      try {
        await prisma.reviewAnalytics.create({
          data: {
            businessId: foundBusinessId,
            eventType: "AI_GENERATED",
            rating: 5,
            deviceType: "mobile",
          },
        });
      } catch (e) {
        console.warn("Analytics error:", e);
      }
    }

    return NextResponse.json({
      success: true,
      reviews,
      review: reviews[0]?.text || "Excellent service and high quality! Highly recommended.",
    });
  } catch (error) {
    console.error("Generate review error:", error);
    return NextResponse.json(
      { error: "Failed to generate reviews" },
      { status: 500 }
    );
  }
}
