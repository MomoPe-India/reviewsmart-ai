/**
 * Onboarding script: Karthik Tattoo Studio KTS - Kadapa
 * Run: node scripts/onboard-karthik-tattoo.mjs
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const MERCHANT_NAME    = "Karthik Tattoo Studio KTS";
const MERCHANT_PHONE   = "9394088110";
const RAW_PIN          = "9394";
const PRIMARY_COLOR    = "#D4AF37"; // Rich gold matching the KTS emblem
const SLUG             = "karthik-tattoo-studio";
const ADDRESS          = "Dno 45/385 Balaji nagar Elite ladies hostel, Iti circle, opposite Taluka police station line, Kadapa, Andhra Pradesh, 516003";
const GOOGLE_PLACE_ID  = "ChIJk9Nc0StzszsRzi_A87Em9Kw";
const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJk9Nc0StzszsRzi_A87Em9Kw";
const WEBSITE          = "https://karthik-tattoo-studio.grexa.site/";
const INSTAGRAM        = "https://www.instagram.com/karthik_tattoo_studio/";
const FACEBOOK         = "https://www.facebook.com/KarthikTattooStudiokarthik/";
const YOUTUBE          = "https://www.youtube.com/@karthiktattoostudio";
const LOGO_URL         = "/images/kts-tattoo-logo.jpg";
const CATEGORY         = "Tattoo & Body Piercing Studio";
const TAGLINE          = "Professional Tattoo & Body Piercing Studio in Kadapa | Custom Art, Portraits & Hygienic Piercings";
const TAG_CHIPS        = "Custom Tattoo Art,Hygienic Studio,Skilled Artist,Sterilized Needles,Portrait Tattoo,Ear & Nose Piercing,Cover-Up Tattoo,Painless Experience,Aftercare Guidance,Fair Pricing";
const KEYWORDS         = "karthik tattoo studio kts kadapa professional tattoo artist permanent tattoo body piercing ear piercing nose piercing helix piercing custom tattoo art portrait tattoo realistic tattoo cover up tattoo name tattoo tribal tattoo polynesian tattoo large full body tattoo skin pigmentation memorial tattoo temporary tattoo wireless tattoo machine hygienic sterile studio affordable tattoo artist kadapa andhra pradesh 516003";

async function main() {
  console.log("\n🚀 Onboarding Merchant: Karthik Tattoo Studio KTS - Kadapa\n");

  const hashedPin = await bcrypt.hash(RAW_PIN, 10);
  const hashedPassword = await bcrypt.hash(RAW_PIN, 10);

  // 1. Find or create merchant user
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
        isActive: true,
      },
    });
    console.log(`✅ Created merchant user (ID: ${merchantUser.id})`);
  } else {
    console.log(`ℹ️ Merchant user exists (ID: ${merchantUser.id})`);
  }

  // 2. Upsert business profile
  let biz = await prisma.business.findFirst({
    where: { slug: SLUG },
  });

  const bizData = {
    userId: merchantUser.id,
    name: MERCHANT_NAME,
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
    facebook: FACEBOOK,
    logoUrl: LOGO_URL,
    primaryColor: PRIMARY_COLOR,
    minRatingForGoogle: 4,
    reviewPromptTone: "friendly",
    qrMode: "SMART_HUB",
    isPaid: true,
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
  console.log(`📱 Merchant Phone: ${MERCHANT_PHONE}`);
  console.log(`🔑 Login PIN: ${RAW_PIN}\n`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("❌ Onboarding failed:", err);
  prisma.$disconnect();
  process.exit(1);
});
