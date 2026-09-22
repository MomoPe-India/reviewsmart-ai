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
    },
  });

  // 2. Subscription Plans
  const starterPlan = await prisma.subscriptionPlan.upsert({
    where: { id: "plan_starter" },
    update: {},
    create: {
      id: "plan_starter",
      name: "Starter Merchant",
      price: 19.0,
      currency: "USD",
      durationDays: 30,
      maxCards: 1,
      features: JSON.stringify([
        "1 Smart NFC/QR Review Card",
        "AI Review Generation (Gemini 2.5)",
        "Negative Review Shield (1-3 stars)",
        "Standard Analytics",
      ]),
      isActive: true,
    },
  });

  const proPlan = await prisma.subscriptionPlan.upsert({
    where: { id: "plan_pro" },
    update: {},
    create: {
      id: "plan_pro",
      name: "Growth Pro",
      price: 49.0,
      currency: "USD",
      durationDays: 30,
      maxCards: 5,
      features: JSON.stringify([
        "Up to 5 Smart Cards / Locations",
        "Unlimited AI Review Generations",
        "Print Studio (PDF Acrylic Stands)",
        "AI Review Reply Assistant",
        "Direct WhatsApp & Email Alerts",
      ]),
      isActive: true,
    },
  });

  const agencyPlan = await prisma.subscriptionPlan.upsert({
    where: { id: "plan_agency" },
    update: {},
    create: {
      id: "plan_agency",
      name: "Agency Reseller",
      price: 149.0,
      currency: "USD",
      durationDays: 30,
      maxCards: 50,
      features: JSON.stringify([
        "50 Smart Review Cards",
        "100% White-Label Branding",
        "Custom Domain Support",
        "Reseller Multi-Client Management",
        "Dedicated VIP Support",
      ]),
      isActive: true,
    },
  });

  // 3. Super Admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@reviewsmart.ai" },
    update: {},
    create: {
      email: "admin@reviewsmart.ai",
      name: "Platform Admin",
      password: adminPassword,
      role: "SUPER_ADMIN",
    },
  });

  // 4. Demo Business User
  const demoPassword = await bcrypt.hash("demo123", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@foodbites.com" },
    update: {},
    create: {
      email: "demo@foodbites.com",
      name: "Alex Rivera",
      password: demoPassword,
      role: "BUSINESS_OWNER",
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
