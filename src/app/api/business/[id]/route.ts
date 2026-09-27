import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function canUserAccessBusiness(
  user: { id: string; role: string },
  business: { id: string; userId: string }
): Promise<boolean> {
  if (user.role === "SUPER_ADMIN") return true;
  if (business.userId === user.id) return true;
  if (user.role === "MARKETING_AGENT") {
    const merchantUser = await prisma.user.findUnique({
      where: { id: business.userId },
      select: { referredBy: true },
    });
    if (merchantUser?.referredBy === user.id) return true;

    const payment = await prisma.upiPayment.findFirst({
      where: {
        agentId: user.id,
        OR: [{ businessId: business.id }, { userId: business.userId }],
      },
    });
    if (payment) return true;
  }
  return false;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const business = await prisma.business.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const hasAccess = await canUserAccessBusiness(user, business);
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Prepare slug if updated
    let newSlug = business.slug;
    if (body.slug && body.slug !== business.slug) {
      newSlug = slugify(body.slug);
      const clash = await prisma.business.findFirst({
        where: { slug: newSlug, NOT: { id: business.id } },
      });
      if (clash) {
        return NextResponse.json(
          { error: "Slug already in use by another card" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.business.update({
      where: { id },
      data: {
        name: body.name !== undefined ? body.name : business.name,
        slug: newSlug,
        tagline: body.tagline !== undefined ? body.tagline : business.tagline,
        logoUrl: body.logoUrl !== undefined ? body.logoUrl : business.logoUrl,
        primaryColor: body.primaryColor || business.primaryColor,
        googlePlaceId: body.googlePlaceId !== undefined ? body.googlePlaceId : business.googlePlaceId,
        googleReviewUrl: body.googleReviewUrl !== undefined ? body.googleReviewUrl : business.googleReviewUrl,
        category: body.category !== undefined ? body.category : business.category,
        googleAddress: body.googleAddress !== undefined ? body.googleAddress : business.googleAddress,
        phone: body.phone !== undefined ? body.phone : business.phone,
        whatsapp: body.whatsapp !== undefined ? body.whatsapp : business.whatsapp,
        instagram: body.instagram !== undefined ? body.instagram : business.instagram,
        facebook: body.facebook !== undefined ? body.facebook : business.facebook,
        website: body.website !== undefined ? body.website : business.website,
        minRatingForGoogle: body.minRatingForGoogle !== undefined ? Number(body.minRatingForGoogle) : business.minRatingForGoogle,
        keywords: body.keywords !== undefined ? body.keywords : business.keywords,
        tagChips: body.tagChips !== undefined ? body.tagChips : business.tagChips,
        reviewPromptTone: body.reviewPromptTone || business.reviewPromptTone,
      },
    });

    return NextResponse.json({ success: true, business: updated });
  } catch (error) {
    console.error("Update business error:", error);
    return NextResponse.json({ error: "Failed to update business" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return PUT(req, context);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const business = await prisma.business.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        feedbacks: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
        analytics: {
          orderBy: { createdAt: "desc" },
          take: 100,
        },
      },
    });

    if (!business) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const hasAccess = await canUserAccessBusiness(user, business);
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ business });
  } catch (error) {
    console.error("Get business error:", error);
    return NextResponse.json({ error: "Failed to fetch business" }, { status: 500 });
  }
}
