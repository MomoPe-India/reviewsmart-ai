/**
 * One-shot onboarding seed: VR GOLD - KADAPA under agent MKT-01 (Madhu Mohan)
 * Activated immediately with ₹3000
 * Run: node scripts/create-merchant-vrgold.mjs
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ── Config ──────────────────────────────────────────────────────────────────
const MERCHANT_NAME    = "VR GOLD - KADAPA";
const MERCHANT_PHONE   = "8978973576";
const RAW_PIN          = "8978";         // 4-digit PIN for merchant login
const AGENT_CODE       = "MKT-01";       // Madhu Mohan
const NEGOTIATED_PRICE = 3000;
const PRIMARY_COLOR    = "#d97706";      // Premium Gold Accent
const SLUG             = "vrgold";
const WEBSITE          = "https://www.vrgold.co/";
const INSTAGRAM        = "https://www.instagram.com/vrgoldbuyers2026/";
const WHATSAPP         = "918978973576";
const LOGO_URL         = "/images/vr-gold-logo.png";
const GOOGLE_SHARE_URL = "https://share.google/0O9MGGGeBpWUVTnZH";
const ADDRESS          = "Kadapa, Andhra Pradesh 516001";
const TAG_CHIPS        = "Sell Gold for Cash,Old Gold Evaluation,Gold Purity Testing,Gold Valuation,Pledged Gold Assistance,Transparent Gold Pricing,Quick Instant Payment,Doorstep Gold Evaluation,Release Pledged Gold,Safe & Confidential";
const KEYWORDS         = "sell gold for cash, old gold evaluation, gold purity testing, gold valuation, pledged gold assistance, transparent gold pricing, quick instant payment, doorstep gold evaluation, release pledged gold, instant bank transfer, gold buyers kadapa, attica gold model";
const CATEGORY         = "Gold Buying & Pledged Gold Services";
const TAGLINE          = "Sell Gold for Cash · Old Gold Evaluation & Purity Testing · Pledged Gold Assistance · Instant Payment";

async function main() {
  console.log("\n🚀 Onboarding & Activating Merchant: VR GOLD - KADAPA under MKT-01\n");

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
        website: WEBSITE,
        instagram: INSTAGRAM,
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
        website: WEBSITE,
        instagram: INSTAGRAM,
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
        notes: `Direct activation by Agent ${AGENT_CODE} (${agent.name}). Amount: ₹${NEGOTIATED_PRICE}. Business: VR GOLD - KADAPA.`,
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
        notes: `Activated by Agent ${AGENT_CODE} (${agent.name}). Amount: ₹${NEGOTIATED_PRICE}. Business: VR GOLD - KADAPA.`,
      }
    });
    console.log("ℹ️  Updated payment record (APPROVED):", upiPayment.id);
  }

  console.log("\n════════════════════════════════════════════════════════════");
  console.log("🎉 VR GOLD - KADAPA successfully onboarded and activated!");
  console.log("════════════════════════════════════════════════════════════");
  console.log(`📱 Merchant Phone (Login ID): ${MERCHANT_PHONE}`);
  console.log(`🔑 Merchant 4-digit PIN:     ${RAW_PIN}`);
  console.log(`🔗 Review Page URL:          https://reviewsmart.online/r/${SLUG}`);
  console.log(`📍 Google Share URL:         ${GOOGLE_SHARE_URL}`);
  console.log(`💰 Deal Status:              ₹${NEGOTIATED_PRICE} (APPROVED & ACTIVE)`);
  console.log(`👤 Assigned Agent:           ${AGENT_CODE} (${agent.name})`);
  console.log(`🖼️  Logo URL:                 ${LOGO_URL}`);
  console.log(`🌐 Website:                  ${WEBSITE}`);
  console.log(`📸 Instagram:                ${INSTAGRAM}`);
  console.log(`💬 WhatsApp:                 +${WHATSAPP}`);
  console.log(`🏷️  Active Tag Chips:        ${TAG_CHIPS}`);
  console.log("════════════════════════════════════════════════════════════\n");
}

main()
  .catch((err) => { console.error("❌ Fatal error:", err); process.exit(1); })
  .finally(() => prisma.$disconnect());
