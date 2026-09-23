import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      googleAddress,
      googleReviewUrl,
      googlePlaceId,
      primaryColor,
      tagline,
      logoUrl,
      whatsapp,
      instagram,
      website,
      tagChips,
      keywords,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Branch name is required" },
        { status: 400 }
      );
    }

    // Enforce max 1 extra branch (Total 2 locations: 1 main + 1 extra)
    const existingCount = await prisma.business.count({
      where: { userId: user.id },
    });

    if (existingCount >= 2 && user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          error:
            "Self-serve limit reached (1 Main + 1 Extra Branch). To connect 3 or more branch locations for your chain, please contact our enterprise team on WhatsApp.",
        },
        { status: 403 }
      );
    }

    // Base business for fallback phone or branding
    const existingBranch = await prisma.business.findFirst({
      where: { userId: user.id },
    });

    // Unique slug generator
    let baseSlug = slugify(name.trim());
    if (!baseSlug || baseSlug.length < 2) {
      baseSlug = `branch-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.business.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const branch = await prisma.business.create({
      data: {
        userId: user.id,
        name: name.trim(),
        slug: uniqueSlug,
        tagline: tagline || "Review our service & share your experience!",
        logoUrl: logoUrl || existingBranch?.logoUrl || null,
        primaryColor: primaryColor || existingBranch?.primaryColor || "#4f46e5",
        googleReviewUrl: googleReviewUrl || null,
        googlePlaceId: googlePlaceId || null,
        googleAddress: googleAddress || null,
        phone: existingBranch?.phone || null,
        whatsapp: whatsapp ? whatsapp.trim() : existingBranch?.whatsapp || null,
        instagram: instagram ? instagram.trim() : existingBranch?.instagram || null,
        website: website ? website.trim() : existingBranch?.website || null,
        minRatingForGoogle: 4,
        keywords:
          keywords ||
          existingBranch?.keywords ||
          "exceptional service, highly recommended, friendly staff, prompt delivery, great experience",
        tagChips:
          tagChips ||
          existingBranch?.tagChips ||
          "Friendly Staff,Fast Service,Great Quality,Fair Pricing,Clean Ambiance",
        reviewPromptTone: "friendly",
        isPaid: true,
      },
    });

    return NextResponse.json({
      success: true,
      branch,
      message: "Branch created successfully! Your new review card and stand are ready.",
    });
  } catch (error) {
    console.error("Create branch error:", error);
    return NextResponse.json(
      { error: "Failed to create new branch" },
      { status: 500 }
    );
  }
}
