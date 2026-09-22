import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { generateReviewReply } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId, reviewText, rating, reviewerName } = await req.json();

    if (!reviewText || !rating) {
      return NextResponse.json(
        { error: "Review text and rating are required" },
        { status: 400 }
      );
    }

    let businessName = "Our Business";
    if (businessId) {
      const b = await prisma.business.findUnique({
        where: { id: businessId },
        select: { name: true },
      });
      if (b) businessName = b.name;
    }

    const reply = await generateReviewReply(
      businessName,
      reviewText,
      Number(rating),
      reviewerName
    );

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("Reply generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate reply" },
      { status: 500 }
    );
  }
}
