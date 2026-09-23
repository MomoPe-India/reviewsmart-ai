const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Platform Settings
  await prisma.platformSetting.upsert({
    where: { id: "default" },
    update: {
      upiId: "momopedeals@oksbi",
      upiPayeeName: "Damerla Mohan",
      supportEmail: "momopedeals@gmail.com",
      digitalPrice: 299,
      physicalPrice: 999,
      minNegotiatedPrice: 499,
    },
    create: {
      id: "default",
      platformName: "ReviewSmart AI",
      supportEmail: "momopedeals@gmail.com",
      currencySymbol: "₹",
      upiId: "momopedeals@oksbi",
      upiPayeeName: "Damerla Mohan",
      digitalPrice: 299,
      physicalPrice: 999,
      minNegotiatedPrice: 499,
    },
  });

  // 2. Subscription Plans (INR with Launch Offers)
  const starterPlan = await prisma.subscriptionPlan.upsert({
    where: { id: "plan_starter" },
    update: {
      name: "1 Month Digital Pass",
      price: 299.0,
      currency: "INR",
      durationDays: 30,
      maxCards: 1,
      features: JSON.stringify([
        "1 Smart NFC/QR Review Card",
        "Gemini AI Review Generator",
        "Negative Review Shield (1-3 stars)",
        "Print Studio (PDF/SVG Stand & Card)",
        "Direct UPI Activation (0% fee)",
      ]),
      isActive: true,
    },
    create: {
      id: "plan_starter",
      name: "1 Month Digital Pass",
      price: 299.0,
      currency: "INR",
      durationDays: 30,
      maxCards: 1,
      features: JSON.stringify([
        "1 Smart NFC/QR Review Card",
        "Gemini AI Review Generator",
        "Negative Review Shield (1-3 stars)",
        "Print Studio (PDF/SVG Stand & Card)",
        "Direct UPI Activation (0% fee)",
      ]),
      isActive: true,
    },
  });

  const proPlan = await prisma.subscriptionPlan.upsert({
    where: { id: "plan_pro" },
    update: {
      name: "1 Year / Lifetime Pass",
      price: 999.0,
      currency: "INR",
      durationDays: 3650,
      maxCards: 1,
      features: JSON.stringify([
        "Special Launch Offer: was ₹1,999 (Save ₹1,000!)",
        "Full 1 Year / Lifetime Uninterrupted Access",
        "1 Business Location License (1 Card)",
        "Gemini AI Unlimited Review Generations",
        "Print Studio: Unlimited Acrylic Stands & Cards",
        "AI Review Reply Assistant for Google Maps",
        "0% Fee Direct UPI Payment",
      ]),
      isActive: true,
    },
    create: {
      id: "plan_pro",
      name: "1 Year / Lifetime Pass",
      price: 999.0,
      currency: "INR",
      durationDays: 3650,
      maxCards: 1,
      features: JSON.stringify([
        "Special Launch Offer: was ₹1,999 (Save ₹1,000!)",
        "Full 1 Year / Lifetime Uninterrupted Access",
        "1 Business Location License (1 Card)",
        "Gemini AI Unlimited Review Generations",
        "Print Studio: Unlimited Acrylic Stands & Cards",
        "AI Review Reply Assistant for Google Maps",
        "0% Fee Direct UPI Payment",
      ]),
      isActive: true,
    },
  });

  // Additional Branch / Multi-Location Pass (Only ₹99 per Extra Branch, Unlimited Branches)
  const addonPlan = await prisma.subscriptionPlan.upsert({
    where: { id: "plan_addon" },
    update: {
      name: "Additional Branch Location Pass (₹99/branch)",
      price: 99.0,
      currency: "INR",
      durationDays: 3650,
      maxCards: 999,
      features: JSON.stringify([
        "1 Additional Store / Branch Review Card (Only ₹99)",
        "No Limit: Add as many branches as you operate",
        "Separate Google Place ID & Review Funnel",
        "Unlimited AI Review Generations for Branch",
        "Print Studio Access for Branch Stand (PDF & 300 DPI)",
        "Direct UPI Activation (0% Fee)",
      ]),
      isActive: true,
    },
    create: {
      id: "plan_addon",
      name: "Additional Branch Location Pass (₹99/branch)",
      price: 99.0,
      currency: "INR",
      durationDays: 3650,
      maxCards: 999,
      features: JSON.stringify([
        "1 Additional Store / Branch Review Card (Only ₹99)",
        "No Limit: Add as many branches as you operate",
        "Separate Google Place ID & Review Funnel",
        "Unlimited AI Review Generations for Branch",
        "Print Studio Access for Branch Stand (PDF & 300 DPI)",
        "Direct UPI Activation (0% Fee)",
      ]),
      isActive: true,
    },
  });

  // Deactivate old agency reseller plan if present
  try {
    await prisma.subscriptionPlan.updateMany({
      where: { id: "plan_agency" },
      data: { isActive: false },
    });
  } catch (e) {}

  // 3. Super Admin (Email & Password Only) - Main Owner: momopedeals@gmail.com
  const adminPassword = await bcrypt.hash("admin123", 10);
  const adminPin = await bcrypt.hash("1234", 10);

  const mainAdmin = await prisma.user.upsert({
    where: { email: "momopedeals@gmail.com" },
    update: {
      password: adminPassword,
      pinCode: adminPin,
      userIdTag: "momopedeals",
      role: "SUPER_ADMIN",
    },
    create: {
      email: "momopedeals@gmail.com",
      name: "MomoPe Owner",
      password: adminPassword,
      pinCode: adminPin,
      userIdTag: "momopedeals",
      role: "SUPER_ADMIN",
    },
  });

  const secondaryAdmin = await prisma.user.upsert({
    where: { email: "admin@reviewsmart.ai" },
    update: {
      password: adminPassword,
      pinCode: adminPin,
      userIdTag: "admin",
      role: "SUPER_ADMIN",
    },
    create: {
      email: "admin@reviewsmart.ai",
      name: "Platform Admin",
      password: adminPassword,
      pinCode: adminPin,
      userIdTag: "admin",
      role: "SUPER_ADMIN",
    },
  });

  // 4. Marketing Agent (Field Sales Rep: MKT-01, PIN: 1234)
  const agentPin = await bcrypt.hash("1234", 10);
  const agentUser = await prisma.user.upsert({
    where: { email: "mkt01@agent.reviewsmart.local" },
    update: {
      agentCode: "MKT-01",
      userIdTag: "MKT-01",
      pinCode: agentPin,
      role: "MARKETING_AGENT",
    },
    create: {
      email: "mkt01@agent.reviewsmart.local",
      name: "Rajesh Sharma (Field Rep)",
      agentCode: "MKT-01",
      userIdTag: "MKT-01",
      phone: "9876543200",
      pinCode: agentPin,
      password: agentPin,
      role: "MARKETING_AGENT",
    },
  });

  // 5. Demo Business User (Phone / User ID: 9876543210, PIN: 1234)
  const demoPin = await bcrypt.hash("1234", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@foodbites.com" },
    update: {
      userIdTag: "9876543210",
      phone: "9876543210",
      pinCode: demoPin,
      role: "BUSINESS_OWNER",
    },
    create: {
      email: "demo@foodbites.com",
      name: "Alex Rivera",
      userIdTag: "9876543210",
      phone: "9876543210",
      pinCode: demoPin,
      password: demoPin,
      role: "BUSINESS_OWNER",
      referredBy: agentUser.id,
    },
  });

  // User Subscription
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setDate(oneMonthFromNow.getDate() + 30);

  await prisma.userSubscription.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      planId: proPlan.id,
      status: "ACTIVE",
      endDate: oneMonthFromNow,
    },
  });

  // 5. Demo Business: "Food Bites"
  const business = await prisma.business.upsert({
    where: { slug: "food-bites" },
    update: {},
    create: {
      userId: demoUser.id,
      name: "Food Bites Cafe & Bistro",
      slug: "food-bites",
      tagline: "Artisanal bakery, organic brunch & handcrafted coffee",
      logoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop&crop=faces",
      primaryColor: "#4f46e5",
      googlePlaceId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
      googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
      googleAddress: "124 Market St, Downtown City",
      phone: "+1 (555) 234-5678",
      whatsapp: "https://wa.me/15552345678",
      instagram: "https://instagram.com/foodbites_demo",
      facebook: "https://facebook.com/foodbites_demo",
      website: "https://example.com/foodbites",
      minRatingForGoogle: 4,
      keywords: "best brunch downtown, freshly baked sourdough, specialty coffee, friendly staff, cozy ambiance",
      tagChips: "Delicious Food,Fast Service,Friendly Staff,Cozy Ambiance,Great Coffee,Fair Prices",
      reviewPromptTone: "friendly",
    },
  });

  // Sample Analytics & Negative Feedback
  await prisma.reviewAnalytics.createMany({
    data: [
      { businessId: business.id, eventType: "PAGE_VIEW", deviceType: "mobile" },
      { businessId: business.id, eventType: "STAR_SELECTED", rating: 5, deviceType: "mobile" },
      { businessId: business.id, eventType: "AI_GENERATED", rating: 5, deviceType: "mobile" },
      { businessId: business.id, eventType: "GOOGLE_REDIRECT", rating: 5, deviceType: "mobile" },
      { businessId: business.id, eventType: "PAGE_VIEW", deviceType: "mobile" },
      { businessId: business.id, eventType: "STAR_SELECTED", rating: 2, deviceType: "mobile" },
      { businessId: business.id, eventType: "FEEDBACK_SUBMITTED", rating: 2, deviceType: "mobile" },
    ],
  });

  await prisma.privateFeedback.create({
    data: {
      businessId: business.id,
      rating: 2,
      customerName: "David Miller",
      customerEmail: "david.m@example.com",
      customerPhone: "+1 (555) 987-6543",
      comments: "The food was delicious as usual, but the table was not cleaned quickly and wait time for coffee was over 20 minutes.",
      status: "NEW",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
