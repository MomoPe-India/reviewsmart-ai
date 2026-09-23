import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, COOKIE_NAME } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { detectIndustry } from "@/lib/industry";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessName,
      phone,
      email,
      googleReviewUrl,
      primaryColor,
      keywords,
      tagChips,
      tagline,
      logoUrl,
      whatsapp,
      instagram,
      website,
    } = body;

    if (!businessName || !businessName.trim()) {
      return NextResponse.json(
        { error: "Business name is required" },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: "WhatsApp / Phone number is required to claim your card" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim().replace(/[^\d+]/g, "");
    const cleanEmail = email && email.trim()
      ? email.toLowerCase().trim()
      : `wa_${cleanPhone.replace("+", "")}@reviewsmart.ai`;

    // Check if user already exists with this email or phone
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email: cleanEmail }],
      },
    });

    if (!user) {
      // Auto-generate random secure password for guest
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await hashPassword(randomPassword);

      user = await prisma.user.create({
        data: {
          name: businessName,
          email: cleanEmail,
          password: hashedPassword,
          role: "BUSINESS_OWNER",
        },
      });
    }

    // Generate unique slug for business
    let baseSlug = slugify(businessName);
    if (!baseSlug || baseSlug.length < 2) {
      baseSlug = `card-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.business.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Detect Industry Intelligence
    const industry = detectIndustry(businessName, body.category || "", tagline || "");
    const finalCategory = body.category || industry.label;
    const finalTagline = tagline || industry.tagline;
    const finalTags =
      tagChips && tagChips.trim() && tagChips !== "Friendly Staff,Fast Service,Great Quality,Fair Pricing,Clean Ambiance"
        ? tagChips.trim()
        : industry.tags.join(",");
    const finalKeywords = keywords && keywords.trim() ? keywords.trim() : industry.keywords;

    const business = await prisma.business.create({
      data: {
        userId: user.id,
        name: businessName.trim(),
        slug: uniqueSlug,
        tagline: finalTagline,
        category: finalCategory,
        logoUrl: logoUrl || null,
        primaryColor: primaryColor || "#4f46e5",
        googleReviewUrl: googleReviewUrl || null,
        phone: cleanPhone,
        whatsapp: whatsapp && whatsapp.trim() ? whatsapp.trim() : cleanPhone,
        instagram: instagram && instagram.trim() ? instagram.trim() : null,
        website: website && website.trim() ? website.trim() : null,
        minRatingForGoogle: 4,
        keywords: finalKeywords,
        tagChips: finalTags,
        reviewPromptTone: "friendly",
        isPaid: true,
      },
    });

    // Assign starter subscription plan if exists
    const starterPlan = await prisma.subscriptionPlan.findFirst({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });

    if (starterPlan) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + starterPlan.durationDays);

      const existingSub = await prisma.userSubscription.findUnique({
        where: { userId: user.id },
      });

      if (!existingSub) {
        await prisma.userSubscription.create({
          data: {
            userId: user.id,
            planId: starterPlan.id,
            status: "ACTIVE",
            endDate,
          },
        });
      }
    }

    // Create session token and set cookie so user is logged in
    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      slug: business.slug,
      businessId: business.id,
      reviewUrl: `/r/${business.slug}`,
      dashboardUrl: `/dashboard`,
      billingUrl: `/dashboard/billing`,
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Instant create error:", error);
    return NextResponse.json(
      { error: "Failed to create smart review card" },
      { status: 500 }
    );
  }
}
