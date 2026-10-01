/**
 * One-shot onboarding seed: Sushma's Fashion & Beauty - Kadapa under agent MKT-01 (Madhu Mohan)
 * Activated immediately with ₹3000
 * Run: node scripts/create-merchant-sushmas.mjs
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ── Config ──────────────────────────────────────────────────────────────────
const MERCHANT_NAME    = "Sushma's Fashion & Beauty - Kadapa";
const MERCHANT_PHONE   = "9494516002";
const RAW_PIN          = "5160";         // 4-digit PIN for merchant login
const AGENT_CODE       = "MKT-01";       // Madhu Mohan
const NEGOTIATED_PRICE = 3000;
const PRIMARY_COLOR    = "#db2777";      // Rose / Deep Pink
const SLUG             = "sushmas-fashion-beauty";
const WHATSAPP         = "919494516002";
const LOGO_URL         = "/images/sushmas-fashion-beauty-logo.svg";
const GOOGLE_SHARE_URL = "https://share.google/rokQHtto5beNwTjwV";
const ADDRESS          = "Viswandhapuram, Kadapa, Andhra Pradesh 516002";
const TAG_CHIPS        = "Ladies-Only Salon,Bridal Makeup & Grooming,Advanced Hair Cuts & Styling,Hair Spa & Treatments,Facials & Skin Care,Body Spa & Relaxation,Beautician Course & Training,Fashion Designing Academy,Clean & Hygienic Ambiance,Professional Ladies Staff";
const KEYWORDS         = "ladies beauty salon kadapa, bridal makeup kadapa, beautician course kadapa, fashion designing academy kadapa, hair spa kadapa, body spa kadapa, ladies salon viswandhapuram, sussma fashion beauty, bridal makeover, advanced haircuts ladies";
const CATEGORY         = "Ladies Beauty Salon & Academy";
const TAGLINE          = "Ladies-Only Beauty Salon & Fashion Academy · Bridal Makeup · Hair & Body Spa · Professional Beautician Training · Viswandhapuram, Kadapa";

async function main() {
  console.log("\n🚀 Onboarding & Activating Merchant: Sushma's Fashion & Beauty - Kadapa under MKT-01\n");

  // 1. Find agent MKT-01
  const agent = await prisma.user.findFirst({ where: { agentCode: AGENT_CODE } });
  if (!agent) {
    throw new Error(`❌ Agent ${AGENT_CODE} not found in database.`);
  }
  console.log("👤 Agent found:", agent.name, `(${agent.agentCode})`);

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
        referredBy: agent.id,
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
        referredBy: agent.id,
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
        logoUrl: LOGO_URL,
        googleReviewUrl: GOOGLE_SHARE_URL,
        googleAddress: ADDRESS,
        phone: MERCHANT_PHONE,
        whatsapp: WHATSAPP,
        tagChips: TAG_CHIPS,
        keywords: KEYWORDS,
        minRatingForGoogle: 4,
        reviewPromptTone: "friendly",
        qrMode: "SMART_HUB",
        packageTier: "EXECUTIVE_STANDEE",
        isPaid: true, // Immediately activated!
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
        logoUrl: LOGO_URL,
        googleReviewUrl: GOOGLE_SHARE_URL,
        googleAddress: ADDRESS,
        phone: MERCHANT_PHONE,
        whatsapp: WHATSAPP,
        tagChips: TAG_CHIPS,
        keywords: KEYWORDS,
        isPaid: true, // Immediately activated!
      },
    });
    console.log("ℹ️  Updated business:", business.id, "| Slug:", SLUG);
  }

  // 5. Create or update UPI payment record (APPROVED with ₹3000)
  let upiPayment = await prisma.upiPayment.findFirst({
    where: { businessId: business.id }
  });

  if (!upiPayment) {
    upiPayment = await prisma.upiPayment.create({
      data: {
        userId: merchantUser.id,
        businessId: business.id,
        agentId: agent.id,
        agentCode: agent.agentCode,
        planType: "NEGOTIATED_DEAL",
        amount: NEGOTIATED_PRICE,
        utrNumber: `DEAL-${Date.now().toString().slice(-8)}`,
        customerPhone: MERCHANT_PHONE,
        status: "APPROVED",
        notes: `Direct activation by Agent ${AGENT_CODE} (${agent.name}). Amount: ₹${NEGOTIATED_PRICE}. Business: ${MERCHANT_NAME}.`,
      },
    });
    console.log("✅ Created payment record (APPROVED):", upiPayment.id);
  } else {
    upiPayment = await prisma.upiPayment.update({
      where: { id: upiPayment.id },
      data: {
        amount: NEGOTIATED_PRICE,
        status: "APPROVED",
        agentId: agent.id,
        agentCode: agent.agentCode,
        notes: `Activated by Agent ${AGENT_CODE} (${agent.name}). Amount: ₹${NEGOTIATED_PRICE}. Business: ${MERCHANT_NAME}.`,
      }
    });
    console.log("ℹ️  Updated payment record (APPROVED):", upiPayment.id);
  }

  console.log("\n════════════════════════════════════════════════════════════");
  console.log(`🎉 ${MERCHANT_NAME} successfully onboarded and activated!`);
  console.log("════════════════════════════════════════════════════════════");
  console.log(`📱 Merchant Phone (Login ID): ${MERCHANT_PHONE}`);
  console.log(`🔑 Merchant 4-digit PIN:     ${RAW_PIN}`);
  console.log(`🔗 Review Page URL:          https://www.reviewsmart.online/r/${SLUG}`);
  console.log(`📍 Google Share URL:         ${GOOGLE_SHARE_URL}`);
  console.log(`💰 Deal Status:              ₹${NEGOTIATED_PRICE} (APPROVED & ACTIVE)`);
  console.log(`👤 Assigned Agent:           ${AGENT_CODE} (${agent.name})`);
  console.log(`🖼️  Logo URL:                 ${LOGO_URL}`);
  console.log(`💬 WhatsApp:                 +${WHATSAPP}`);
  console.log(`🏷️  Active Tag Chips:        ${TAG_CHIPS}`);
  console.log("════════════════════════════════════════════════════════════\n");
}

main()
  .catch((err) => { console.error("❌ Fatal error:", err); process.exit(1); })
  .finally(() => prisma.$disconnect());
