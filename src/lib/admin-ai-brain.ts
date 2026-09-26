import { prisma } from "@/lib/prisma";
import { hashPin, hashPassword } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { detectIndustry, INDUSTRY_CONFIGS } from "@/lib/industry";

export interface ComposerExecutionResult {
  success: boolean;
  message: string;
  intent: string;
  entityType?: "merchant" | "payment" | "platform" | "analytics" | "knowledge" | "agent";
  entity?: any;
  diff?: { field: string; before?: any; after?: any }[];
  actionBadges?: { label: string; type: "success" | "info" | "warning" }[];
  quickLinks?: { label: string; url: string; external?: boolean }[];
}

// ─── COMPREHENSIVE PROJECT KNOWLEDGE BASE ────────────────────────────────────
export const PROJECT_KNOWLEDGE = {
  name: "ReviewSmart AI",
  tagline: "Smart Google Review Assistant & Reputation Growth Platform",
  mission:
    "Empowering offline and online local businesses across India to collect authentic, high-quality, 5-star Google reviews seamlessly while remaining 100% compliant with Google's anti-gating policies and FTC guidelines.",
  admin: {
    name: "Damerla Mohan",
    role: "SUPER_ADMIN",
    upiId: "momopedeals@oksbi",
    payeeName: "Damerla Mohan",
    supportWhatsapp: "+918639831132",
    supportEmail: "momopedeals@gmail.com",
  },
  agents: [
    { code: "MKT-01", name: "Madhu Mohan", phone: "9705112592", commission: "40%" },
    { code: "MKT-02", name: "Sarath Kumar", phone: "9182442126", commission: "40%" },
    { code: "MKT-03", name: "Shaik Sameer", phone: "7815851330", commission: "40%" },
    { code: "MKT-04", name: "Smiling Star", phone: "7287867584", commission: "40%" },
  ],
  pricingLadder: [
    { tier: "Starter", price: 999, commission: 400 },
    { tier: "Growth", price: 1499, commission: 600 },
    { tier: "Pro", price: 1999, commission: 800 },
    { tier: "Elite", price: 2499, commission: 1000 },
    { tier: "Custom High-Ticket", price: 2999, commission: 1200 },
  ],
  watermarkPolicy:
    "Merchants marked isPaid = false have a watermark banner on their customer review link. Once their UPI deal is verified and marked APPROVED by Super Admin, isPaid becomes true and the watermark is completely lifted. Momo IT Technologies is permanently exempt from watermarks.",
  compliancePolicy:
    "Strictly Anti-Review Gating: Customers rating 1-3 stars are offered private direct management feedback to resolve issues privately, but are NEVER blocked from posting on Google directly if they choose. Ratings 4-5 stars offer instant domain-tailored review drafts, tap chips, 1-tap clipboard copy, and immediate redirect to the official Google review composer.",
  googleTechnicalReality:
    "Google's web security (Same-Origin Policy) and anti-bot systems prohibit external websites from injecting clicks or auto-typing into google.com. ReviewSmart AI automates 95% of the flow (review generation, clipboard copy, Place ID deep-linking). On Google Maps, existing reviewers see 'Edit Review' mode with past ratings preloaded, while first-time reviewers see a clean composer where they tap 5 stars and paste in 1 tap.",
};

// ─── MAIN COMMAND DISPATCHER ──────────────────────────────────────────────────
export async function processAdminAiCommand(prompt: string): Promise<ComposerExecutionResult> {
  const p = prompt.trim();
  const lower = p.toLowerCase();

  // Load live DB snapshot
  const [businesses, agents, settings, payments] = await Promise.all([
    prisma.business.findMany({
      include: { user: { select: { id: true, name: true, phone: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { role: "MARKETING_AGENT" },
      select: { id: true, name: true, userIdTag: true, phone: true },
    }),
    prisma.platformSetting.findFirst(),
    prisma.upiPayment.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  // ═════════════════════════════════════════════════════════════════════════════
  // 1. Q&A / KNOWLEDGE & EXPLANATION INTENTS
  // ═════════════════════════════════════════════════════════════════════════════

  // Agent flow explanation
  if (
    (lower.includes("flow") && (lower.includes("agent") || lower.includes("mkt"))) ||
    lower.includes("agent workflow") ||
    lower.includes("agent flow") ||
    lower.includes("how does agent") ||
    lower.includes("how agents sell") ||
    lower.includes("agent process")
  ) {
    const agentCodeMatch = lower.match(/mkt[-_]?0?[1-4]/);
    const agentCode = agentCodeMatch ? agentCodeMatch[0].toUpperCase().replace("_", "-") : "MKT-01";
    const agentObj = agents.find((a) => a.userIdTag?.toUpperCase() === agentCode) || agents[0];

    return {
      success: true,
      intent: "KNOWLEDGE_AGENT_FLOW",
      entityType: "agent",
      message: `### 🎯 Complete Agent Workflow for **${agentCode}** (${agentObj?.name || "Marketing Agent"}):

1. **Merchant Field Visit & Live Demo:**
   * Agent visits merchant offline (Fashion Studio, Food Kitchen, Salon, Clinic, etc.).
   * Opens live demo using Momo IT or Vijaya's Yummy Food: \`reviewsmart-ai.vercel.app/r/momo-it-technologies\`
   * Demonstrates the 1-tap customer review flow.

2. **Closing the Deal & Negotiated Price:**
   * Standard deal options: **₹999 / ₹1,499 / ₹1,999 / ₹2,499 / ₹2,999**.
   * Hard platform floor: **₹499**.
   * **Agent Commission:** **40%** of collected amount (e.g. ₹1,200 commission on a ₹2,999 deal).

3. **Onboarding in POS / Agent Portal:**
   * Agent logs into \`/agent\` or Admin onboards the merchant directly via AI Composer.
   * Enters Business Name, Owner Phone, Category, and Place ID.
   * Auto-generates merchant login credentials (Phone + 4-digit PIN).

4. **Payment Collection & Admin Verification:**
   * Payment collected via Platform UPI: **\`${settings?.upiId || "momopedeals@oksbi"}\`** (${settings?.upiPayeeName || "Damerla Mohan"}).
   * Deal is created in **PENDING** state.
   * Super Admin verifies the UPI reference & approves deal &rarr; **Watermark is removed** & 40% commission is officially credited to ${agentCode}!

5. **Merchant Handover & Standees:**
   * Merchant logs in at \`/login\` with Mobile + PIN.
   * Downloads high-resolution QR standees from Print Studio (\`/dashboard/studio\`).`,
      actionBadges: [
        { label: `Agent: ${agentCode}`, type: "info" },
        { label: `Commission: 40%`, type: "success" },
        { label: `UPI: ${settings?.upiId}`, type: "info" },
      ],
      quickLinks: [
        { label: "Agent Portal", url: "/agent" },
        { label: "Verify Payments", url: "/admin/payments" },
      ],
    };
  }

  // Watermark explanation
  if (lower.includes("watermark") || lower.includes("ispaid") || lower.includes("remove watermark")) {
    return {
      success: true,
      intent: "KNOWLEDGE_WATERMARK",
      entityType: "knowledge",
      message: `### 🛡️ How Watermarks & Paid Status Work in ReviewSmart AI:

• **Unpaid Merchants (\`isPaid = false\`):**
  A semi-transparent badge and banner appears over the customer review page reminding the business owner to complete plan activation.
• **Paid Merchants (\`isPaid = true\`):**
  Clean, professional, 100% white-labeled review experience.
• **How to Lift Watermark:**
  When a merchant's UPI payment is approved by Super Admin, the platform automatically flips \`isPaid = true\` in the database.
• **Exemptions:**
  \`momo-it-technologies\` is permanently exempt from watermarks as our platform flagship demo.`,
      actionBadges: [{ label: "Watermark Policy", type: "info" }],
    };
  }

  // Compliance & Google review policy explanation
  if (
    lower.includes("policy") ||
    lower.includes("policies") ||
    lower.includes("compliance") ||
    lower.includes("gating") ||
    lower.includes("legal") ||
    lower.includes("guidelines")
  ) {
    return {
      success: true,
      intent: "KNOWLEDGE_COMPLIANCE",
      entityType: "knowledge",
      message: `### ⚖️ ReviewSmart AI Policy & Legal Compliance:

1. **Google Anti-Gating Policy Compliance:**
   * Google strictly bans blocking unhappy customers from reviewing.
   * **Our implementation:** Customers rating 1–3 stars are shown a private resolution box to store management, but **ALWAYS** have a visible secondary button: *"Continue Directly to Google Review"*. Customers remain 100% in control.
2. **FTC Genuine Review Compliance:**
   * We do not generate fake reviews or bot submissions.
   * AI drafts simulate authentic, customer-centric feedback grounded exclusively in the business's actual service and the customer's selected highlights.
3. **Google Automation Reality:**
   * Google does not permit third-party websites to inject text or click stars into \`google.com\`.
   * We automate 95%: review composition, industry chips, and 1-tap clipboard copy. First-time reviewers simply tap the 5th star and paste.`,
      actionBadges: [{ label: "100% Google Compliant", type: "success" }],
    };
  }

  // Pricing ladder & commissions explanation
  if (
    lower.includes("pricing") ||
    (lower.includes("price") && !lower.includes("update") && !lower.includes("change")) ||
    lower.includes("commission") ||
    lower.includes("tiers") ||
    lower.includes("packages")
  ) {
    return {
      success: true,
      intent: "KNOWLEDGE_PRICING",
      entityType: "knowledge",
      message: `### 💰 ReviewSmart AI Pricing Ladder & Agent Commissions:

• **Starter Package:** ₹999 &rarr; Agent Commission (40%): **₹400**
• **Growth Package:** ₹1,499 &rarr; Agent Commission (40%): **₹600**
• **Pro Business:** ₹1,999 &rarr; Agent Commission (40%): **₹800**
• **Elite Studio:** ₹2,499 &rarr; Agent Commission (40%): **₹1,000**
• **Custom High-Ticket:** ₹2,999 &rarr; Agent Commission (40%): **₹1,200**

*Hard Floor Minimum Price: ₹499.*
*Agent commissions are automatically credited upon Super Admin verification.*`,
      actionBadges: [{ label: "Commission: 40%", type: "success" }],
    };
  }

  // Customer journey & review link explanation
  if (
    (lower.includes("how") && lower.includes("work")) ||
    lower.includes("customer journey") ||
    lower.includes("review flow") ||
    lower.includes("customer flow")
  ) {
    return {
      success: true,
      intent: "KNOWLEDGE_CUSTOMER_FLOW",
      entityType: "knowledge",
      message: `### 🚀 The 4-Step ReviewSmart Customer Experience:

1. **Scan QR Code / Open Link:** Customer opens merchant's unique link (e.g. \`/r/anand-fashion-studio-bf84\`).
2. **Rating Selection:** Customer taps stars.
   * **4–5 Stars:** Expands the AI assistant, reveals domain-specific tap chips, and loads 3 instant authentic review drafts.
   * **1–3 Stars:** Provides a private message composer to management (with direct Google review link always accessible for compliance).
3. **Customize in 1 Tap:** Customer taps chips (e.g. *"Creative Photography"*, *"Prompt Delivery"*) &rarr; review draft updates instantly.
4. **Copy & Redirect:** Customer taps *"Copy Review & Post on Google"* &rarr; review copies to clipboard &rarr; official Google review dialog opens &rarr; 1 tap paste!`,
      actionBadges: [{ label: "Customer Experience", type: "info" }],
    };
  }

  // Supported industries list
  if (lower.includes("industr") || lower.includes("vertical") || lower.includes("categories")) {
    const list = Object.values(INDUSTRY_CONFIGS)
      .map((c) => `• **${c.label}** (\`${c.type}\`): ${c.tagline}`)
      .join("\n");
    return {
      success: true,
      intent: "KNOWLEDGE_INDUSTRIES",
      entityType: "knowledge",
      message: `### 🏢 Supported Industry Verticals (with Context-Aware AI Chips & Drafts):\n\n${list}`,
      actionBadges: [{ label: "11 Verticals Active", type: "info" }],
    };
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 2. LIST / REPORT INTENTS
  // ═════════════════════════════════════════════════════════════════════════════

  // List all merchants
  if (
    lower.includes("list all merchant") ||
    lower.includes("show all merchant") ||
    lower.includes("all merchants") ||
    lower.includes("how many merchant")
  ) {
    const rows = businesses
      .map(
        (b) =>
          `• **${b.name}** — Phone: \`${b.phone || b.user.phone}\` | Category: *${b.category}* | Status: **${
            b.isPaid ? "✅ Paid" : "⚠️ Unpaid"
          }** | Link: \`/r/${b.slug}\``
      )
      .join("\n");

    return {
      success: true,
      intent: "LIST_MERCHANTS",
      entityType: "merchant",
      message: `### 📋 All Registered Merchants (${businesses.length} Total):\n\n${rows}`,
      actionBadges: [
        { label: `Total Merchants: ${businesses.length}`, type: "info" },
        { label: `Paid: ${businesses.filter((b) => b.isPaid).length}`, type: "success" },
      ],
      quickLinks: [{ label: "Manage Merchants in Admin", url: "/admin/merchants" }],
    };
  }

  // List all agents
  if (
    lower.includes("list agent") ||
    lower.includes("all agents") ||
    lower.includes("agent leaderboard") ||
    lower.includes("marketing agent")
  ) {
    const agentRows = agents
      .map((a) => {
        const deals = payments.filter((p) => p.agentCode === a.userIdTag || p.agentId === a.id);
        const approved = deals.filter((d) => d.status === "APPROVED");
        const totalRev = approved.reduce((sum, d) => sum + d.amount, 0);
        const commission = totalRev * 0.4;
        return `• **${a.userIdTag}** (${a.name}) — Phone: \`${a.phone}\` | Total Deals: **${deals.length}** | Approved Revenue: **₹${totalRev.toLocaleString("en-IN")}** | Commission: **₹${commission.toLocaleString("en-IN")}**`;
      })
      .join("\n");

    return {
      success: true,
      intent: "LIST_AGENTS",
      entityType: "agent",
      message: `### 👥 Marketing Agents Roster & Performance:\n\n${agentRows}`,
      actionBadges: [{ label: `Active Agents: ${agents.length}`, type: "info" }],
      quickLinks: [{ label: "Agents Console", url: "/admin/agents" }],
    };
  }

  // List pending deals
  if (lower.includes("pending deal") || lower.includes("pending payment") || lower.includes("unpaid deal")) {
    const pending = payments.filter((p) => p.status === "PENDING");
    if (pending.length === 0) {
      return {
        success: true,
        intent: "LIST_PENDING",
        entityType: "payment",
        message: "🎉 **No pending deals!** All merchant deals have been verified and approved.",
        actionBadges: [{ label: "0 Pending", type: "success" }],
      };
    }

    const pendingRows = pending
      .map((p) => {
        const biz = businesses.find((b) => b.id === p.businessId || b.userId === p.userId);
        return `• **${biz?.name || "Merchant"}**: Deal of **₹${p.amount.toLocaleString(
          "en-IN"
        )}** — Agent: **${p.agentCode || "Direct"}** | Customer Phone: \`${p.customerPhone || "N/A"}\``;
      })
      .join("\n");

    return {
      success: true,
      intent: "LIST_PENDING",
      entityType: "payment",
      message: `### ⏳ Pending Deals Awaiting Verification (${pending.length} Total):\n\n${pendingRows}\n\n*To approve a deal, tell me: "Approve deal for [Merchant Name]"*`,
      actionBadges: [{ label: `${pending.length} Pending Approval`, type: "warning" }],
      quickLinks: [{ label: "Verify Payments Table", url: "/admin/payments?status=PENDING" }],
    };
  }

  // Analytics & revenue stats
  if (
    lower.includes("revenue") ||
    lower.includes("stats") ||
    lower.includes("analytics") ||
    lower.includes("how much money") ||
    lower.includes("overview")
  ) {
    const approvedPayments = payments.filter((p) => p.status === "APPROVED");
    const totalRev = approvedPayments.reduce((s, p) => s + p.amount, 0);
    const totalCommission = totalRev * 0.4;
    const netRevenue = totalRev - totalCommission;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayApproved = approvedPayments.filter((p) => new Date(p.createdAt) >= todayStart);
    const todayRev = todayApproved.reduce((s, p) => s + p.amount, 0);

    return {
      success: true,
      intent: "QUERY_STATS",
      entityType: "analytics",
      message: `### 📊 Real-Time Platform Revenue & Analytics:

• **Gross Approved Revenue:** ₹${totalRev.toLocaleString("en-IN")}
• **Today's Revenue:** ₹${todayRev.toLocaleString("en-IN")}
• **Agent Commission Payable (40%):** ₹${totalCommission.toLocaleString("en-IN")}
• **Net Platform Margin (60%):** ₹${netRevenue.toLocaleString("en-IN")}
• **Total Merchants Registered:** ${businesses.length}
• **Total Deals Recorded:** ${payments.length} (${approvedPayments.length} Approved, ${
        payments.length - approvedPayments.length
      } Pending)`,
      actionBadges: [
        { label: `Gross: ₹${totalRev.toLocaleString("en-IN")}`, type: "success" },
        { label: `Net: ₹${netRevenue.toLocaleString("en-IN")}`, type: "info" },
        { label: `Merchants: ${businesses.length}`, type: "info" },
      ],
      quickLinks: [{ label: "View Detailed Revenue", url: "/admin" }],
    };
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 3. ACTION INTENT: APPROVE DEAL / MARK AS PAID
  // ═════════════════════════════════════════════════════════════════════════════
  if (
    lower.includes("approve") ||
    lower.includes("mark paid") ||
    lower.includes("verify payment") ||
    lower.includes("accept deal")
  ) {
    // Find target merchant
    const targetBiz = businesses.find((b) => lower.includes(b.name.toLowerCase()) || lower.includes(b.slug.toLowerCase()));
    const targetPayment = payments.find(
      (p) =>
        p.status === "PENDING" &&
        (!targetBiz || p.businessId === targetBiz.id || p.userId === targetBiz.userId)
    );

    if (!targetPayment) {
      return {
        success: false,
        intent: "APPROVE_DEAL",
        message: targetBiz
          ? `No pending deal found for **${targetBiz.name}**. It is already approved or has no deal.`
          : `Please specify the merchant name to approve. (e.g. *"Approve deal for Anand Fashion Studio"*).`,
      };
    }

    const biz = businesses.find((b) => b.id === targetPayment.businessId || b.userId === targetPayment.userId);
    const commission = targetPayment.amount * 0.4;

    await prisma.$transaction([
      prisma.upiPayment.update({
        where: { id: targetPayment.id },
        data: { status: "APPROVED", commission },
      }),
      ...(biz
        ? [
            prisma.business.update({
              where: { id: biz.id },
              data: { isPaid: true },
            }),
          ]
        : []),
    ]);

    return {
      success: true,
      intent: "APPROVE_DEAL",
      entityType: "payment",
      message: `🎉 **Deal Successfully Approved!**
• **Merchant:** ${biz?.name || "Merchant"}
• **Amount Received:** ₹${targetPayment.amount.toLocaleString("en-IN")}
• **Agent Commission Credited (40%):** ₹${commission.toLocaleString("en-IN")} (${targetPayment.agentCode || "Direct"})
• **Watermark Status:** **LIFTED (isPaid = true)**`,
      diff: [
        { field: "Payment Status", before: "PENDING", after: "APPROVED" },
        { field: "Watermark Status", before: "Watermarked (UNPAID)", after: "Clean Live (PAID)" },
        { field: "Agent Commission", after: `₹${commission}` },
      ],
      actionBadges: [
        { label: "Deal Approved", type: "success" },
        { label: "Watermark Removed", type: "success" },
      ],
      quickLinks: biz ? [{ label: "View Live Review Link", url: `/r/${biz.slug}`, external: true }] : [],
    };
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 4. ACTION INTENT: CREATE / ONBOARD NEW MERCHANT
  // ═════════════════════════════════════════════════════════════════════════════
  if (
    lower.includes("create merchant") ||
    lower.includes("onboard merchant") ||
    lower.includes("add merchant") ||
    lower.includes("new merchant") ||
    lower.includes("register merchant")
  ) {
    // Extract phone
    const phoneMatch = p.match(/\b([6-9]\d{9})\b/);
    const phone = phoneMatch ? phoneMatch[1] : `9${Math.floor(100000000 + Math.random() * 900000000)}`;

    // Check duplicate
    const existing = await prisma.user.findFirst({
      where: { OR: [{ phone }, { userIdTag: phone }] },
    });
    if (existing) {
      return {
        success: false,
        intent: "CREATE_MERCHANT",
        message: `A merchant with phone **${phone}** already exists in the system.`,
      };
    }

    // Extract amount
    const amountMatch = p.match(/(?:amount|deal|price|₹|rs\.?)\s*:?\s*(\d{3,5})/i) || p.match(/\b(\d{4,5})\b/);
    const amount = amountMatch ? Number(amountMatch[1]) : 1499;

    // Extract Agent Code
    const agentMatch = p.match(/\b(mkt[-_]?0?[1-4])\b/i);
    const agentCode = agentMatch ? agentMatch[1].toUpperCase().replace("_", "-") : "MKT-01";
    const agentObj = agents.find((a) => a.userIdTag?.toUpperCase() === agentCode) || agents[0];

    // Extract Name
    let bizName = "New Merchant Store";
    const nameMatch = p.match(
      /(?:merchant|business|named?|store)\s+([A-Za-z0-9\s'&]+?)(?:\s+(?:under|with|phone|for|category|deal|amount)|$)/i
    );
    if (nameMatch && nameMatch[1].trim()) {
      bizName = nameMatch[1].trim();
    }

    // Category & Tagline
    let category = "Local Business & Services";
    if (lower.includes("photo") || lower.includes("gift")) category = "Photography Services & Gift Shop";
    else if (lower.includes("food") || lower.includes("kitchen") || lower.includes("bakes") || lower.includes("restaurant"))
      category = "Restaurants, Cafes & Food";
    else if (lower.includes("fashion") || lower.includes("clothing") || lower.includes("textile") || lower.includes("boutique"))
      category = "Fashion & Clothing";
    else if (lower.includes("salon") || lower.includes("beauty") || lower.includes("spa"))
      category = "Salons, Spas & Beauty Parlors";
    else if (lower.includes("clinic") || lower.includes("dental") || lower.includes("doctor"))
      category = "Clinics, Doctors & Dental";

    const tagline = "Thank you for visiting! Share your review.";
    const industry = detectIndustry(bizName, category, tagline);
    const tagChips = industry.tags.join(",");

    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedPin = await hashPin(randomPin);
    const hashedPassword = await hashPassword(randomPin);
    const slug = slugify(bizName) + "-" + phone.slice(-4);

    const user = await prisma.user.create({
      data: {
        name: bizName,
        phone,
        userIdTag: phone,
        email: `${phone}@merchant.reviewsmart.local`,
        password: hashedPassword,
        pinCode: hashedPin,
        role: "BUSINESS_OWNER",
        customerType: "OFFLINE",
        isActive: true,
        businesses: {
          create: {
            name: bizName,
            slug,
            category,
            tagline,
            customerType: "OFFLINE",
            isPaid: false,
            phone,
            whatsapp: phone,
            tagChips,
          },
        },
      },
      include: { businesses: true },
    });

    const business = user.businesses[0];

    const payment = await prisma.upiPayment.create({
      data: {
        userId: user.id,
        businessId: business.id,
        agentId: agentObj?.id || null,
        agentCode: agentObj ? agentObj.userIdTag : agentCode,
        planType: "NEGOTIATED_DEAL",
        amount,
        utrNumber: `${agentCode}-${Date.now().toString().slice(-6)}`,
        customerPhone: phone,
        status: "PENDING",
        commission: null,
        commissionPaid: false,
        notes: `Created via Antigravity AI Composer. Agent: ${agentCode}`,
      },
    });

    return {
      success: true,
      intent: "CREATE_MERCHANT",
      entityType: "merchant",
      message: `🎉 **Successfully Onboarded Merchant:** **${bizName}**!

• **Login Mobile / User ID:** \`${phone}\`
• **Login 4-Digit PIN:** \`${randomPin}\`
• **Assigned Agent:** **${agentCode}** (${agentObj?.name || "Agent"})
• **Category:** *${category}*
• **Deal Amount:** **₹${amount.toLocaleString("en-IN")}** (Status: **PENDING**)
• **Customer Review URL:** \`https://reviewsmart-ai.vercel.app/r/${slug}\``,
      diff: [
        { field: "Business Name", after: bizName },
        { field: "Mobile", after: phone },
        { field: "4-Digit PIN", after: randomPin },
        { field: "Agent", after: agentCode },
        { field: "Deal Amount", after: `₹${amount}` },
        { field: "Status", after: "PENDING" },
      ],
      actionBadges: [
        { label: "Merchant Created", type: "success" },
        { label: `Agent: ${agentCode}`, type: "info" },
        { label: "Status: PENDING", type: "warning" },
      ],
      quickLinks: [
        { label: "Open Customer Review Page", url: `/r/${slug}`, external: true },
        { label: "Login as Merchant", url: "/login" },
      ],
    };
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 5. ACTION INTENT: UPDATE EXISTING MERCHANT
  // ═════════════════════════════════════════════════════════════════════════════
  if (lower.includes("update") || lower.includes("change") || lower.includes("modify") || lower.includes("set")) {
    // Locate target business
    const targetBiz = businesses.find((b) => lower.includes(b.name.toLowerCase()) || lower.includes(b.slug.toLowerCase()));

    if (!targetBiz) {
      // Check platform settings update
      if (lower.includes("upi") || lower.includes("payee") || lower.includes("whatsapp")) {
        const upiMatch = p.match(/([a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64})/);
        const waMatch = p.match(/\+?\d{10,13}/);
        const updateData: any = {};
        const diffs: { field: string; before?: any; after?: any }[] = [];

        if (upiMatch && upiMatch[1] !== settings?.upiId) {
          diffs.push({ field: "UPI ID", before: settings?.upiId, after: upiMatch[1] });
          updateData.upiId = upiMatch[1];
        }
        if (waMatch && waMatch[0] !== settings?.supportWhatsapp) {
          diffs.push({ field: "Support WhatsApp", before: settings?.supportWhatsapp, after: waMatch[0] });
          updateData.supportWhatsapp = waMatch[0];
        }

        if (Object.keys(updateData).length > 0) {
          await prisma.platformSetting.updateMany({ data: updateData });
          return {
            success: true,
            intent: "UPDATE_PLATFORM",
            entityType: "platform",
            message: "⚙️ **Platform Settings Updated Successfully!**",
            diff: diffs,
            actionBadges: [{ label: "Settings Updated", type: "success" }],
          };
        }
      }

      return {
        success: false,
        intent: "UPDATE_MERCHANT",
        message: `Could not identify which merchant to update. Available merchants:\n${businesses
          .map((b) => `• ${b.name}`)
          .join("\n")}`,
      };
    }

    const diffs: { field: string; before?: any; after?: any }[] = [];
    const bizUpdate: any = {};

    // Deal amount update
    const amountMatch = p.match(/(?:amount|deal|price|₹|rs\.?)\s*:?\s*(\d{3,5})/i);
    if (amountMatch) {
      const newAmount = Number(amountMatch[1]);
      const lastPayment = await prisma.upiPayment.findFirst({
        where: { businessId: targetBiz.id },
        orderBy: { createdAt: "desc" },
      });
      if (lastPayment && lastPayment.amount !== newAmount) {
        diffs.push({ field: "Deal Amount", before: `₹${lastPayment.amount}`, after: `₹${newAmount}` });
        await prisma.upiPayment.update({
          where: { id: lastPayment.id },
          data: { amount: newAmount },
        });
      }
    }

    // Phone update
    const phoneMatch = p.match(/\b([6-9]\d{9})\b/);
    if (phoneMatch && phoneMatch[1] !== targetBiz.user.phone) {
      diffs.push({ field: "Phone Number", before: targetBiz.user.phone, after: phoneMatch[1] });
      await prisma.user.update({
        where: { id: targetBiz.user.id },
        data: { phone: phoneMatch[1], userIdTag: phoneMatch[1] },
      });
      bizUpdate.phone = phoneMatch[1];
      bizUpdate.whatsapp = phoneMatch[1];
    }

    // Category update
    if (lower.includes("category")) {
      const catMatch = p.match(/category\s+(?:to\s+)?([A-Za-z0-9\s&,]+?)(?:\s+(?:and|deal|phone|tagline)|$)/i);
      if (catMatch && catMatch[1].trim()) {
        const newCat = catMatch[1].trim();
        diffs.push({ field: "Category", before: targetBiz.category, after: newCat });
        bizUpdate.category = newCat;
      }
    }

    // Tagline update
    if (lower.includes("tagline")) {
      const tagMatch = p.match(/tagline\s+(?:to\s+)?["']?([^"'\n]+?)["']?(?:\s+(?:and|category|deal|phone)|$)/i);
      if (tagMatch && tagMatch[1].trim()) {
        const newTag = tagMatch[1].trim();
        diffs.push({ field: "Tagline", before: targetBiz.tagline, after: newTag });
        bizUpdate.tagline = newTag;
      }
    }

    // Place ID update
    if (lower.includes("place id") || lower.includes("placeid")) {
      const placeMatch = p.match(/(?:place(?:\s*id)?)\s*(?:to\s*|:\s*)?([A-Za-z0-9_\-]{20,40})/i);
      if (placeMatch && placeMatch[1]) {
        diffs.push({ field: "Google Place ID", before: targetBiz.googlePlaceId, after: placeMatch[1] });
        bizUpdate.googlePlaceId = placeMatch[1];
        bizUpdate.googleReviewUrl = `https://search.google.com/local/writereview?placeid=${placeMatch[1]}`;
      }
    }

    if (Object.keys(bizUpdate).length > 0) {
      await prisma.business.update({
        where: { id: targetBiz.id },
        data: bizUpdate,
      });
    }

    if (diffs.length === 0) {
      return {
        success: true,
        intent: "UPDATE_MERCHANT",
        message: `No changes detected for **${targetBiz.name}**. Try specifying what to change (e.g. *"Update ${targetBiz.name} deal amount to 1999"*).`,
      };
    }

    return {
      success: true,
      intent: "UPDATE_MERCHANT",
      entityType: "merchant",
      message: `✅ **Updated ${targetBiz.name} Successfully!** (${diffs.length} change${diffs.length === 1 ? "" : "s"} applied)`,
      diff: diffs,
      actionBadges: [{ label: `Updated ${targetBiz.name}`, type: "success" }],
      quickLinks: [{ label: "View Live Review Page", url: `/r/${targetBiz.slug}`, external: true }],
    };
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 6. SEARCH / INSPECT SPECIFIC MERCHANT
  // ═════════════════════════════════════════════════════════════════════════════
  const foundBiz = businesses.find(
    (b) =>
      lower.includes(b.name.toLowerCase()) ||
      lower.includes(b.slug.toLowerCase()) ||
      (b.phone && lower.includes(b.phone)) ||
      (b.user.phone && lower.includes(b.user.phone))
  );

  if (foundBiz) {
    const lastPayment = payments.find((p) => p.businessId === foundBiz.id || p.userId === foundBiz.userId);
    return {
      success: true,
      intent: "SEARCH_MERCHANT",
      entityType: "merchant",
      message: `### 🏪 Profile for **${foundBiz.name}**:

• **Category:** *${foundBiz.category}*
• **Tagline:** "${foundBiz.tagline}"
• **Owner Mobile:** \`${foundBiz.phone || foundBiz.user.phone}\`
• **Slug:** \`${foundBiz.slug}\`
• **Watermark Status:** **${foundBiz.isPaid ? "✅ Paid (Watermark Lifted)" : "⚠️ Unpaid (Watermarked)"}**
• **Latest Deal:** **₹${lastPayment?.amount || 0}** (Status: **${lastPayment?.status || "NO_DEAL"}**)
• **Assigned Agent:** **${lastPayment?.agentCode || "Direct"}**
• **Place ID:** \`${foundBiz.googlePlaceId || "Not Set"}\``,
      actionBadges: [
        { label: foundBiz.isPaid ? "PAID" : "UNPAID", type: foundBiz.isPaid ? "success" : "warning" },
        { label: `Agent: ${lastPayment?.agentCode || "Direct"}`, type: "info" },
        { label: `Deal: ₹${lastPayment?.amount || 0}`, type: "info" },
      ],
      quickLinks: [
        { label: "Open Live Customer Review Link", url: `/r/${foundBiz.slug}`, external: true },
        { label: "Merchant Dashboard", url: "/login" },
      ],
    };
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 7. DEFAULT INTELLIGENT HELP & REASONING
  // ═════════════════════════════════════════════════════════════════════════════
  return {
    success: true,
    intent: "GENERAL_ASSISTANCE",
    entityType: "knowledge",
    message: `🤖 **Antigravity AI Composer is ready!**
I have complete knowledge of ReviewSmart AI's architecture, merchants, agents, deals, and platform settings.

Here are examples of what you can ask me or tell me to do:

• **Onboard a Merchant:** *"Onboard new merchant Sri Krishna Sweets under MKT-01 with phone 9876543210 and deal amount 1999"*
• **Modify Deal or Details:** *"Update Sri Guru Fashions deal amount to 2999"* or *"Update Anand Fashion Studio phone to 9553545324"*
• **Verify & Approve Deals:** *"Approve pending deal for Anand Fashion Studio"*
• **Workflow Explanations:** *"What is the flow for agent MKT-01?"* or *"How do watermarks work?"* or *"Explain Google review policies"*
• **Reports & Stats:** *"Show me today's revenue and active merchants"* or *"List all merchants"* or *"List marketing agents"*`,
    actionBadges: [{ label: "ReviewSmart AI Autopilot", type: "success" }],
  };
}
