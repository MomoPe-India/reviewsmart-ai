import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, COOKIE_NAME } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, businessName } = await req.json();

    if (!name || !email || !password || !businessName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: cleanEmail,
        password: hashedPassword,
        role: "BUSINESS_OWNER",
      },
    });

    // Create base business for user
    let baseSlug = slugify(businessName);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.business.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    await prisma.business.create({
      data: {
        userId: user.id,
        name: businessName,
        slug: uniqueSlug,
        tagline: "Review our service & share your experience!",
        primaryColor: "#4f46e5",
        minRatingForGoogle: 4,
        keywords: "excellent service, highly recommend, friendly staff, top quality",
        tagChips: "Friendly Staff,Fast Service,High Quality,Fair Price,Great Atmosphere",
        reviewPromptTone: "friendly",
      },
    });

    // Assign starter subscription plan if available
    const starterPlan = await prisma.subscriptionPlan.findFirst({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });

    if (starterPlan) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + starterPlan.durationDays);

      await prisma.userSubscription.create({
        data: {
          userId: user.id,
          planId: starterPlan.id,
          status: "ACTIVE",
          endDate,
        },
      });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
