import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const {
      slug,
      businessId,
      rating,
      customerName,
      customerEmail,
      customerPhone,
      comments,
    } = await req.json();

    if (!comments || !rating) {
      return NextResponse.json(
        { error: "Rating and feedback comments are required" },
        { status: 400 }
      );
    }

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

    const feedback = await prisma.privateFeedback.create({
      data: {
        businessId: business.id,
        rating: Number(rating),
        customerName: customerName || null,
        customerEmail: customerEmail || null,
        customerPhone: customerPhone || null,
        comments,
        status: "NEW",
      },
    });

    await prisma.reviewAnalytics.create({
      data: {
        businessId: business.id,
        eventType: "FEEDBACK_SUBMITTED",
        rating: Number(rating),
        deviceType: "mobile",
      },
    });

    return NextResponse.json({
      success: true,
      feedbackId: feedback.id,
      message: "Thank you! Your feedback has been received and will be reviewed by management immediately.",
    });
  } catch (error) {
    console.error("Submit feedback error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
