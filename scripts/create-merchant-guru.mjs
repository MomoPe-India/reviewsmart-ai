/**
 * One-shot seed: Sri Guru Fashions under agent MKT-01, payment PENDING
 * Run: node scripts/create-merchant-guru.mjs
 */
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ── Config ──────────────────────────────────────────────────────────────────
const MERCHANT_NAME   = "Sri Guru Fashions";
const MERCHANT_PHONE  = "9000000001";   // placeholder — update after getting real number
const RAW_PIN         = "7531";         // 4-digit PIN for merchant login
const AGENT_CODE      = "MKT-01";
const NEGOTIATED_PRICE = 999;
const GOOGLE_SHARE_URL = "https://share.google/3vbXjNShBKbWEudd8";
const LOGO_URL        = null; // Will be set from uploaded image separately if needed

// ── Resolve Google Share Link ────────────────────────────────────────────────
async function resolveShareLink(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    const finalUrl = res.url;
    const html = await res.text();

    // Try hex pair approach
    const hexMatch =
      html.match(/(?:%211s|!1s)(0x[0-9a-fA-F]+)(?:%3A|:)(0x[0-9a-fA-F]+)/) ||
      finalUrl.match(/(?:%211s|!1s)(0x[0-9a-fA-F]+)(?:%3A|:)(0x[0-9a-fA-F]+)/);

    if (hexMatch) {
      const h1 = hexMatch[1].replace(/^0x/i, "").padStart(16, "0");
      const h2 = hexMatch[2].replace(/^0x/i, "").padStart(16, "0");
      const b1 = Buffer.from(h1, "hex").reverse();
      const b2 = Buffer.from(h2, "hex").reverse();
      const buf = Buffer.alloc(20);
      buf[0] = 0x0a; buf[1] = 0x12; buf[2] = 0x09;
      b1.copy(buf, 3);
      buf[11] = 0x11;
      b2.copy(buf, 12);
      const placeId = buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      console.log("✅ Resolved Place ID from hex pair:", placeId);
      return { placeId, finalUrl };
    }

    // Try explicit place_id in URL
    const explicit = finalUrl.match(/[?&]place(?:_)?id=(ChIJ[A-Za-z0-9_-]+)/i) ||
                     html.match(/[?&]place(?:_)?id=(ChIJ[A-Za-z0-9_-]+)/i);
    if (explicit) {
      console.log("✅ Resolved explicit Place ID:", explicit[1]);
      return { placeId: explicit[1], finalUrl };
    }

    // Try ChIJ anywhere in page
    const chij = html.match(/ChIJ[A-Za-z0-9_-]{20,}/);
    if (chij) {
      console.log("✅ Resolved Place ID from ChIJ in HTML:", chij[0]);
      return { placeId: chij[0], finalUrl };
    }

    console.warn("⚠️  Could not resolve Place ID — using share URL as fallback");
    return { placeId: null, finalUrl };
  } catch (err) {
    console.error("❌ Error resolving share link:", err.message);
    return { placeId: null, finalUrl: url };
  }
}

async function main() {
  console.log("\n🚀 Creating merchant: Sri Guru Fashions under MKT-01\n");

  // 1. Resolve Place ID
  const { placeId } = await resolveShareLink(GOOGLE_SHARE_URL);
  const googleReviewUrl = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : GOOGLE_SHARE_URL;
  console.log("📍 Google Review URL:", googleReviewUrl);

  // 2. Find agent MKT-01
  const agent = await prisma.user.findFirst({ where: { agentCode: AGENT_CODE } });
  if (!agent) {
    throw new Error(`❌ Agent ${AGENT_CODE} not found in database. Ensure MKT-01 exists first.`);
  }
  console.log("👤 Agent found:", agent.name, `(${agent.agentCode})`);

  // 3. Hash PIN & password
  const hashedPin = await bcrypt.hash(RAW_PIN, 10);
  const hashedPassword = await bcrypt.hash(RAW_PIN, 10);

  // 4. Upsert merchant user
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
    console.log("ℹ️  Merchant user already exists:", merchantUser.id);
  }

  // 5. Generate slug
  const baseSlug = MERCHANT_NAME.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const randomSuffix = crypto.randomBytes(2).toString("hex");
  const uniqueSlug = `${baseSlug}-${randomSuffix}`;

  // 6. Create business
  const business = await prisma.business.create({
    data: {
      userId: merchantUser.id,
      name: MERCHANT_NAME,
      slug: uniqueSlug,
      tagline: "Your style, our passion — premium fashion for every occasion.",
      category: "Fashion & Clothing",
      customerType: "OFFLINE",
      logoUrl: LOGO_URL,
      googlePlaceId: placeId || null,
      googleReviewUrl,
      googleAddress: "Kadapa, Andhra Pradesh",
      phone: MERCHANT_PHONE,
      tagChips: "Quality Clothing,Great Prices,Trusted Store,Best Collection,Friendly Staff",
      keywords: "fashion clothing store kadapa",
      minRatingForGoogle: 4,
      reviewPromptTone: "friendly",
      isPaid: false, // PENDING — admin must approve
    },
  });
  console.log("✅ Created business:", business.id, "| Slug:", uniqueSlug);

  // 7. Create UPI payment record (PENDING)
  const upiPayment = await prisma.upiPayment.create({
    data: {
      userId: merchantUser.id,
      businessId: business.id,
      agentId: agent.id,
      agentCode: AGENT_CODE,
      planType: "NEGOTIATED_DEAL",
      amount: NEGOTIATED_PRICE,
      utrNumber: `PENDING-${Date.now().toString().slice(-8)}`,
      customerPhone: MERCHANT_PHONE,
      status: "PENDING",
      notes: `Offline deal by Agent ${AGENT_CODE}. Negotiated: ₹${NEGOTIATED_PRICE}. Business: Sri Guru Fashions, Kadapa.`,
    },
  });
  console.log("✅ Created payment (PENDING):", upiPayment.id);

  console.log("\n══════════════════════════════════════════════");
  console.log("🎉 Sri Guru Fashions created successfully!");
  console.log("══════════════════════════════════════════════");
  console.log(`📱 Merchant Phone (User ID): ${MERCHANT_PHONE}`);
  console.log(`🔑 Merchant PIN:             ${RAW_PIN}`);
  console.log(`🔗 Review Page:              https://reviewsmart-ai.vercel.app/r/${uniqueSlug}`);
  console.log(`📋 Google Review URL:        ${googleReviewUrl}`);
  console.log(`💰 Payment Amount:           ₹${NEGOTIATED_PRICE} (PENDING)`);
  console.log(`👤 Agent:                    ${AGENT_CODE} (${agent.name})`);
  console.log(`🗂️  Business ID:             ${business.id}`);
  console.log("══════════════════════════════════════════════\n");
}

main()
  .catch((err) => { console.error("❌ Fatal error:", err); process.exit(1); })
  .finally(() => prisma.$disconnect());
