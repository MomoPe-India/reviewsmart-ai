/**
 * Onboarding script: AS Refrigeration - Kadapa
 * Run: node scripts/onboard-as-refrigeration.mjs
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const MERCHANT_NAME     = "AS Refrigeration - Kadapa";
const BIZ_FULL_NAME     = "AS Refrigeration - Top #1 AC Repair & Services in Kadapa.";
const MERCHANT_PHONE    = "7815851330";
const RAW_PIN           = "1330";
const RAW_PASSWORD      = "Password@1330";
const PRIMARY_COLOR     = "#0284c7"; // Sky 600 - cooling & refrigeration blue
const SLUG              = "as-refrigeration";
const ADDRESS           = "74/15/1 Ground Floor, Lohiya Nagar, Kadapa - Pulivendula Rd, beside 2, Mariapuram, Mariyapuram, Andhra Pradesh 516003";
const GOOGLE_PLACE_ID   = "ChIJuX7dAX5zszsROYSpGZLNNfw";
const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJuX7dAX5zszsROYSpGZLNNfw";
const WEBSITE           = "https://asrefrigeration.co.in/";
const INSTAGRAM         = "https://www.instagram.com/asrefrigerations.kadapa/";
const LOGO_URL          = "/images/as-refrigeration-logo.png";
const CATEGORY          = "AC, Refrigerator & Washing Machine Repair";
const TAGLINE           = "Top #1 AC Repair & Home Appliance Services in Kadapa | Quick Doorstep Solutions";
const TAG_CHIPS         = "Deep AC Jet Wash,Quick Cooling Restored,Fast Doorstep Service,AC Gas Refilling,Affordable & Fair Rates,Genuine Spare Parts,Expert Fridge Repair,Washing Machine Fixed,Professional Technician,Prompt Same-Day Visit";
const KEYWORDS          = "as refrigeration kadapa top ac repair best ac service ac gas charging r32 r410 r22 deep jet wash ac foam wash ac installation fridge repair kadapa refrigerator gas charging single door double door washing machine repair kadapa doorstep appliance repair 24 hours ac mechanic";

async function main() {
  console.log("\n🚀 Onboarding Merchant: AS Refrigeration - Kadapa\n");

  const hashedPin = await bcrypt.hash(RAW_PIN, 10);
  const hashedPassword = await bcrypt.hash(RAW_PASSWORD, 10);

  // 1. Find or create merchant user under Admin (referredBy: null, customerType: OFFLINE)
  let merchantUser = await prisma.user.findFirst({
    where: { OR: [{ userIdTag: MERCHANT_PHONE }, { phone: MERCHANT_PHONE }] },
  });

  if (!merchantUser) {
    merchantUser = await prisma.user.create({
      data: {
        email: `${MERCHANT_PHONE}@merchant.reviewsmart.local`,
        name: MERCHANT_NAME,
        phone: MERCHANT_PHONE,
        userIdTag: MERCHANT_PHONE,
        pinCode: hashedPin,
        password: hashedPassword,
        role: "BUSINESS_OWNER",
        customerType: "OFFLINE",
        referredBy: null,
        isActive: true,
      },
    });
    console.log(`✅ Created merchant user (ID: ${merchantUser.id})`);
  } else {
    merchantUser = await prisma.user.update({
      where: { id: merchantUser.id },
      data: {
        name: MERCHANT_NAME,
        pinCode: hashedPin,
        password: hashedPassword,
        role: "BUSINESS_OWNER",
        customerType: "OFFLINE",
        referredBy: null,
        isActive: true,
      },
    });
    console.log(`ℹ️ Updated existing merchant user (ID: ${merchantUser.id})`);
  }

  // 2. Upsert business profile
  let biz = await prisma.business.findFirst({
    where: { slug: SLUG },
  });

  const bizData = {
    userId: merchantUser.id,
    name: BIZ_FULL_NAME,
    slug: SLUG,
    category: CATEGORY,
    tagline: TAGLINE,
    tagChips: TAG_CHIPS,
    keywords: KEYWORDS,
    googlePlaceId: GOOGLE_PLACE_ID,
    googleReviewUrl: GOOGLE_REVIEW_URL,
    googleAddress: ADDRESS,
    phone: MERCHANT_PHONE,
    whatsapp: MERCHANT_PHONE,
    website: WEBSITE,
    instagram: INSTAGRAM,
    logoUrl: LOGO_URL,
    primaryColor: PRIMARY_COLOR,
    minRatingForGoogle: 4,
    reviewPromptTone: "POLITE",
    qrMode: "SMART_HUB",
    isPaid: true,
    packageTier: "EXECUTIVE_STANDEE",
    customerType: "OFFLINE",
  };

  if (!biz) {
    biz = await prisma.business.create({ data: bizData });
    console.log(`✅ Created business: ${biz.name} (slug: /r/${biz.slug})`);
  } else {
    biz = await prisma.business.update({
      where: { id: biz.id },
      data: bizData,
    });
    console.log(`✅ Updated existing business: ${biz.name} (slug: /r/${biz.slug})`);
  }

  console.log("\n🎉 Onboarding complete!");
  console.log(`🔗 Review Smart Link: https://www.reviewsmart.online/r/${SLUG}`);
  console.log(`📱 Merchant Phone / User ID: ${MERCHANT_PHONE}`);
  console.log(`🔑 PIN: ${RAW_PIN}`);
  console.log(`🔐 Password: ${RAW_PASSWORD}`);
  console.log(`📍 Place ID: ${GOOGLE_PLACE_ID}`);
  console.log(`⭐ Direct Write Review Link: ${GOOGLE_REVIEW_URL}\n`);
}

main()
  .catch((e) => {
    console.error("❌ Onboarding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
