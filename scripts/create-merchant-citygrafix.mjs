/**
 * One-shot onboarding seed: City Grafix (Kadapa) under agent MKT-04 (Smiling Star)
 * Run: node scripts/create-merchant-citygrafix.mjs
 */
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ── Config ──────────────────────────────────────────────────────────────────
const MERCHANT_NAME   = "City Grafix";
const MERCHANT_PHONE  = "7601043674";
const SECONDARY_PHONE = "7287867584";
const RAW_PIN         = "7601";         // 4-digit PIN for merchant login
const AGENT_CODE      = "MKT-04";        // Smiling Star
const NEGOTIATED_PRICE = 2999;
const PRIMARY_COLOR   = "#0284c7";
const SLUG            = "citygrafix";
const ADDRESS         = "21/135, Seven Roads Cir, opp. Tirumala hospital, beside New AF Automart street, Ganagapeta, Kadapa, Andhra Pradesh 516001";
const GOOGLE_REVIEW_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("CITY GRAFIX - KADAPA 21/135, Seven Roads Cir, opp. Tirumala hospital, beside New AF Automart street, Ganagapeta, Kadapa, Andhra Pradesh 516001")}`;
const TAG_CHIPS       = "Flex Printing,Sign Boards,Banner Printing,Visiting Cards,Graphic Design,Mug Printing,T-Shirt Printing,Brochures & Pamphlets,Fast Delivery";
const KEYWORDS        = "city grafix kadapa flex printing sign boards banners graphic design visiting cards mug printing t-shirt printing seven roads ganagapeta kadapa";
const CATEGORY        = "Flex Printing, Sign Boards & Graphic Design";
const TAGLINE         = "Premier Flex Printing, Sign Boards, Banners & Graphic Design in Kadapa";

async function main() {
  console.log("\n🚀 Onboarding Merchant: City Grafix under MKT-04\n");

  // 1. Find agent MKT-04
  const agent = await prisma.user.findFirst({ where: { agentCode: AGENT_CODE } });
  if (!agent) {
    console.warn(`⚠️ Agent ${AGENT_CODE} not found, checking fallback...`);
  } else {
    console.log("👤 Agent found:", agent.name, `(${agent.agentCode})`);
  }

  // 2. Hash PIN & password
  const hashedPin = await bcrypt.hash(RAW_PIN, 10);
  const hashedPassword = await bcrypt.hash(RAW_PIN, 10);

  // 3. Upsert merchant user
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
        referredBy: agent ? agent.id : undefined,
      },
    });
    console.log("✅ Created merchant user:", merchantUser.id);
  } else {
    merchantUser = await prisma.user.update({
      where: { id: merchantUser.id },
      data: {
        name: MERCHANT_NAME,
        pinCode: hashedPin,
        password: hashedPassword,
        isActive: true,
        referredBy: agent ? agent.id : undefined,
      },
    });
    console.log("ℹ️  Updated merchant user:", merchantUser.id);
  }

  // 4. Upsert business record
  let business = await prisma.business.findFirst({
    where: {
      OR: [
        { slug: SLUG },
        { name: MERCHANT_NAME },
        { phone: MERCHANT_PHONE }
      ]
    }
  });

  if (!business) {
    business = await prisma.business.create({
      data: {
        userId: merchantUser.id,
        name: MERCHANT_NAME,
        slug: SLUG,
        tagline: TAGLINE,
        category: CATEGORY,
        customerType: "OFFLINE",
        primaryColor: PRIMARY_COLOR,
        googleReviewUrl: GOOGLE_REVIEW_URL,
        googleAddress: ADDRESS,
        phone: MERCHANT_PHONE,
        whatsapp: `91${MERCHANT_PHONE}`,
        instagram: "https://www.instagram.com/citygrafix1/",
        tagChips: TAG_CHIPS,
        keywords: KEYWORDS,
        minRatingForGoogle: 4,
        reviewPromptTone: "friendly",
        qrMode: "SMART_HUB",
        packageTier: "EXECUTIVE_STANDEE",
        isPaid: true,
      },
    });
    console.log("✅ Created business:", business.id, "| Slug:", SLUG);
  } else {
    business = await prisma.business.update({
      where: { id: business.id },
      data: {
        userId: merchantUser.id,
        name: MERCHANT_NAME,
        slug: SLUG,
        tagline: TAGLINE,
        category: CATEGORY,
        primaryColor: PRIMARY_COLOR,
        googleReviewUrl: GOOGLE_REVIEW_URL,
        googleAddress: ADDRESS,
        phone: MERCHANT_PHONE,
        whatsapp: `91${MERCHANT_PHONE}`,
        instagram: "https://www.instagram.com/citygrafix1/",
        tagChips: TAG_CHIPS,
        keywords: KEYWORDS,
        isPaid: true,
      },
    });
    console.log("ℹ️  Updated business:", business.id, "| Slug:", SLUG);
  }

  // 5. Create or update UPI payment record
  let upiPayment = await prisma.upiPayment.findFirst({
    where: { businessId: business.id }
  });

  if (!upiPayment) {
    upiPayment = await prisma.upiPayment.create({
      data: {
        userId: merchantUser.id,
        businessId: business.id,
        agentId: agent ? agent.id : undefined,
        agentCode: agent ? agent.agentCode : AGENT_CODE,
        planType: "NEGOTIATED_DEAL",
        amount: NEGOTIATED_PRICE,
        utrNumber: `DEAL-${Date.now().toString().slice(-8)}`,
        customerPhone: MERCHANT_PHONE,
        status: "APPROVED",
        notes: `Offline deal by Agent ${AGENT_CODE} (${agent ? agent.name : "Smiling Star"}). Negotiated: ₹${NEGOTIATED_PRICE}. Business: City Grafix, Seven Roads, Kadapa.`,
      },
    });
    console.log("✅ Created payment record (APPROVED):", upiPayment.id);
  } else {
    console.log("ℹ️  Payment record already exists:", upiPayment.id);
  }

  console.log("\n════════════════════════════════════════════════════════════");
  console.log("🎉 City Grafix successfully onboarded into ReviewSmart AI!");
  console.log("════════════════════════════════════════════════════════════");
  console.log(`📱 Merchant Phone (Login ID): ${MERCHANT_PHONE}`);
  console.log(`🔑 Merchant 4-digit PIN:     ${RAW_PIN}`);
  console.log(`🔗 Review Page URL:          https://reviewsmart.online/r/${SLUG}`);
  console.log(`📍 Google Maps Review URL:   ${GOOGLE_REVIEW_URL}`);
  console.log(`💰 Deal Status:              ₹${NEGOTIATED_PRICE} (APPROVED)`);
  console.log(`👤 Assigned Agent:           ${AGENT_CODE} (${agent ? agent.name : "Smiling Star"})`);
  console.log(`🏷️  Active Tag Chips:        ${TAG_CHIPS}`);
  console.log("════════════════════════════════════════════════════════════\n");
}

main()
  .catch((err) => { console.error("❌ Fatal error:", err); process.exit(1); })
  .finally(() => prisma.$disconnect());
