import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, hashPin, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { detectIndustry } from "@/lib/industry";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

interface ComposerResponse {
  success: boolean;
  message: string;
  intent: string;
  entityType?: "merchant" | "payment" | "platform" | "analytics" | "general";
  entity?: any;
  diff?: { field: string; before?: any; after?: any }[];
  actionBadges?: { label: string; type: "success" | "info" | "warning" }[];
  quickLinks?: { label: string; url: string; external?: boolean }[];
}

// ─── HELPER: Call Gemini if key available ────────────────────────────────────
async function callGeminiIntent(prompt: string, contextSummary: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = `You are Antigravity Admin AI Copilot for ReviewSmart AI platform.
Analyze the user's administrative request and extract the action to execute.
Current Platform Context:
${contextSummary}

Respond ONLY with valid JSON conforming to this schema:
{
  "action": "CREATE_MERCHANT" | "UPDATE_MERCHANT" | "APPROVE_DEAL" | "UPDATE_PLATFORM" | "QUERY_STATS" | "SEARCH_MERCHANT" | "GENERAL_CHAT",
  "targetName": string | null,
  "targetPhone": string | null,
  "category": string | null,
  "tagline": string | null,
  "agentCode": string | null,
  "amount": number | null,
  "placeId": string | null,
  "upiId": string | null,
  "payeeName": string | null,
  "supportWhatsapp": string | null,
  "tagChips": string | null,
  "isPaid": boolean | null,
  "message": string
}`;

    const res = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `User Prompt: "${prompt}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    if (res.text) {
      return JSON.parse(res.text);
    }
  } catch {
    // If Gemini fails or credits depleted, return null to use rule-engine
    return null;
  }
  return null;
}

// ─── POST /api/admin/ai-composer ──────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 });
    }

    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "A prompt is required." }, { status: 400 });
    }

    const cleanPrompt = prompt.trim();
    const lowerPrompt = cleanPrompt.toLowerCase();

    // 1. Gather context snapshot for AI reasoning
    const [merchantsList, agentsList, setting] = await Promise.all([
      prisma.business.findMany({
        take: 20,
        select: { id: true, name: true, slug: true, category: true, tagline: true, isPaid: true, user: { select: { phone: true, name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.findMany({
        where: { role: "MARKETING_AGENT" },
        select: { id: true, name: true, userIdTag: true, phone: true },
      }),
      prisma.platformSetting.findFirst(),
    ]);

    const contextSummary = `
Known Merchants: ${merchantsList.map((m) => `${m.name} (Phone: ${m.user.phone}, Slug: ${m.slug})`).join(", ")}
Active Agents: ${agentsList.map((a) => `${a.userIdTag}: ${a.name}`).join(", ")}
Platform UPI: ${setting?.upiId} (${setting?.upiPayeeName})
Support WhatsApp: ${setting?.supportWhatsapp}
`;

    // 2. Try Gemini first
    let aiParsed = await callGeminiIntent(cleanPrompt, contextSummary);

    // 3. Deterministic rule-based extraction fallback (Bulletproof resilience)
    if (!aiParsed) {
      aiParsed = fallbackParse(cleanPrompt, merchantsList, agentsList);
    }

    // 4. Execute the identified action
    const result = await executeAction(aiParsed, cleanPrompt, session.id);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("AI Composer Error:", err);
    return NextResponse.json(
      {
        success: false,
        intent: "ERROR",
        message: `Execution failed: ${err?.message || "Internal error occurred"}`,
      },
      { status: 500 }
    );
  }
}

// ─── ACTION EXECUTION ENGINE ──────────────────────────────────────────────────
async function executeAction(plan: any, rawPrompt: string, adminUserId: string): Promise<ComposerResponse> {
  const action = plan.action || "GENERAL_CHAT";

  // ─── ACTION 1: CREATE NEW MERCHANT ───────────────────────────────────────────
  if (action === "CREATE_MERCHANT") {
    const bizName = plan.targetName || "New Merchant";
    const phone = plan.targetPhone ? plan.targetPhone.replace(/[^0-9]/g, "") : `9${Math.floor(100000000 + Math.random() * 900000000)}`;
    const category = plan.category || "Local Business & Services";
    const tagline = plan.tagline || "Thank you for visiting! Share your review.";
    const amount = Number(plan.amount) || 1499;
    const agentCode = plan.agentCode ? plan.agentCode.toUpperCase() : "MKT-01";
    const placeId = plan.placeId || "";

    // Check duplicate
    const existing = await prisma.user.findFirst({
      where: { OR: [{ phone }, { userIdTag: phone }] },
    });
    if (existing) {
      return {
        success: false,
        intent: "CREATE_MERCHANT",
        message: `Cannot create merchant: A user with phone ${phone} already exists.`,
      };
    }

    // Agent lookup
    const agent = await prisma.user.findFirst({
      where: { role: "MARKETING_AGENT", OR: [{ userIdTag: agentCode }, { name: { contains: agentCode, mode: "insensitive" } }] },
    });

    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedPin = await hashPin(randomPin);
    const hashedPassword = await hashPassword(randomPin);

    // Auto-detect industry & tags
    const industry = detectIndustry(bizName, category, tagline);
    const tagChips = plan.tagChips || industry.tags.join(",");

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
            googlePlaceId: placeId,
            googleReviewUrl: placeId ? `https://search.google.com/local/writereview?placeid=${placeId}` : "",
            isPaid: plan.isPaid ?? false,
            phone,
            whatsapp: phone,
            tagChips,
          },
        },
      },
      include: { businesses: true },
    });

    const business = user.businesses[0];

    // Create deal record
    const payment = await prisma.upiPayment.create({
      data: {
        userId: user.id,
        businessId: business.id,
        agentId: agent?.id || null,
        agentCode: agent ? agent.userIdTag : agentCode,
        planType: "NEGOTIATED_DEAL",
        amount,
        utrNumber: `${agentCode}-${Date.now().toString().slice(-6)}`,
        customerPhone: phone,
        status: plan.isPaid ? "APPROVED" : "PENDING",
        commission: plan.isPaid ? amount * 0.4 : null,
        commissionPaid: false,
        notes: `Created via Antigravity AI Composer. Agent: ${agentCode}`,
      },
    });

    return {
      success: true,
      intent: "CREATE_MERCHANT",
      entityType: "merchant",
      message: `🎉 Successfully onboarded merchant **${bizName}** under agent **${agentCode}**! Deal amount: ₹${amount.toLocaleString("en-IN")}.`,
      entity: {
        name: bizName,
        phone,
        pin: randomPin,
        slug,
        category,
        agentCode,
        amount,
        status: payment.status,
      },
      actionBadges: [
        { label: `Merchant Created`, type: "success" },
        { label: `Agent: ${agentCode}`, type: "info" },
        { label: `Status: ${payment.status}`, type: payment.status === "APPROVED" ? "success" : "warning" },
      ],
      quickLinks: [
        { label: "Live Customer Link", url: `/r/${slug}`, external: true },
        { label: "Merchant Dashboard", url: `/login` },
      ],
      diff: [
        { field: "Business Name", after: bizName },
        { field: "Mobile & User ID", after: phone },
        { field: "Initial PIN", after: randomPin },
        { field: "Category", after: category },
        { field: "Assigned Agent", after: agentCode },
        { field: "Deal Amount", after: `₹${amount}` },
      ],
    };
  }

  // ─── ACTION 2: UPDATE MERCHANT DETAILS ───────────────────────────────────────
  if (action === "UPDATE_MERCHANT") {
    let biz = null;

    if (plan.targetName) {
      biz = await prisma.business.findFirst({
        where: { name: { contains: plan.targetName, mode: "insensitive" } },
        include: { user: true },
      });
    }
    if (!biz && plan.targetPhone) {
      const cleanP = plan.targetPhone.replace(/[^0-9]/g, "");
      biz = await prisma.business.findFirst({
        where: { phone: { contains: cleanP } },
        include: { user: true },
      });
    }

    if (!biz) {
      return {
        success: false,
        intent: "UPDATE_MERCHANT",
        message: `Could not locate merchant matching "${plan.targetName || plan.targetPhone}". Please specify exact business name or phone.`,
      };
    }

    const diffs: { field: string; before?: any; after?: any }[] = [];
    const updateData: any = {};

    if (plan.category && plan.category !== biz.category) {
      diffs.push({ field: "Category", before: biz.category, after: plan.category });
      updateData.category = plan.category;
    }
    if (plan.tagline && plan.tagline !== biz.tagline) {
      diffs.push({ field: "Tagline", before: biz.tagline, after: plan.tagline });
      updateData.tagline = plan.tagline;
    }
    if (plan.tagChips && plan.tagChips !== biz.tagChips) {
      diffs.push({ field: "Tag Chips", before: biz.tagChips, after: plan.tagChips });
      updateData.tagChips = plan.tagChips;
    }
    if (plan.placeId && plan.placeId !== biz.googlePlaceId) {
      diffs.push({ field: "Google Place ID", before: biz.googlePlaceId, after: plan.placeId });
      updateData.googlePlaceId = plan.placeId;
      updateData.googleReviewUrl = `https://search.google.com/local/writereview?placeid=${plan.placeId}`;
    }
    if (plan.isPaid !== undefined && plan.isPaid !== null && plan.isPaid !== biz.isPaid) {
      diffs.push({ field: "Paid Watermark Status", before: biz.isPaid ? "PAID" : "UNPAID", after: plan.isPaid ? "PAID" : "UNPAID" });
      updateData.isPaid = plan.isPaid;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.business.update({
        where: { id: biz.id },
        data: updateData,
      });
    }

    // Update phone if provided
    if (plan.targetPhone) {
      const cleanP = plan.targetPhone.replace(/[^0-9]/g, "");
      if (cleanP && cleanP !== biz.user.phone) {
        diffs.push({ field: "Phone Number", before: biz.user.phone, after: cleanP });
        await prisma.user.update({
          where: { id: biz.user.id },
          data: { phone: cleanP, userIdTag: cleanP },
        });
        await prisma.business.update({
          where: { id: biz.id },
          data: { phone: cleanP, whatsapp: cleanP },
        });
      }
    }

    // Update deal amount if specified
    if (plan.amount) {
      const lastPayment = await prisma.upiPayment.findFirst({
        where: { businessId: biz.id },
        orderBy: { createdAt: "desc" },
      });
      if (lastPayment && lastPayment.amount !== plan.amount) {
        diffs.push({ field: "Deal Amount", before: `₹${lastPayment.amount}`, after: `₹${plan.amount}` });
        await prisma.upiPayment.update({
          where: { id: lastPayment.id },
          data: { amount: plan.amount },
        });
      }
    }

    return {
      success: true,
      intent: "UPDATE_MERCHANT",
      entityType: "merchant",
      message: `✅ Updated **${biz.name}** successfully! (${diffs.length} change${diffs.length === 1 ? "" : "s"} applied)`,
      entity: { name: biz.name, slug: biz.slug },
      diff: diffs,
      actionBadges: [{ label: `Updated ${biz.name}`, type: "success" }],
      quickLinks: [{ label: "View Live Review Page", url: `/r/${biz.slug}`, external: true }],
    };
  }

  // ─── ACTION 3: APPROVE DEAL / MARK AS PAID ──────────────────────────────────
  if (action === "APPROVE_DEAL") {
    let biz = null;
    if (plan.targetName) {
      biz = await prisma.business.findFirst({
        where: { name: { contains: plan.targetName, mode: "insensitive" } },
      });
    }

    const payment = await prisma.upiPayment.findFirst({
      where: biz ? { businessId: biz.id, status: "PENDING" } : { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: { user: { include: { businesses: true } } },
    });

    if (!payment) {
      return {
        success: false,
        intent: "APPROVE_DEAL",
        message: `No pending deal found for "${plan.targetName || "any merchant"}".`,
      };
    }

    const businessId = payment.businessId || payment.user.businesses[0]?.id;
    const commission = payment.amount * 0.4;

    await prisma.$transaction([
      prisma.upiPayment.update({
        where: { id: payment.id },
        data: { status: "APPROVED", commission },
      }),
      ...(businessId
        ? [
            prisma.business.update({
              where: { id: businessId },
              data: { isPaid: true },
            }),
          ]
        : []),
    ]);

    const targetBizName = payment.user.businesses[0]?.name || "Merchant";

    return {
      success: true,
      intent: "APPROVE_DEAL",
      entityType: "payment",
      message: `🎉 Deal approved for **${targetBizName}**! Amount: ₹${payment.amount.toLocaleString("en-IN")}. Agent commission of ₹${commission.toLocaleString("en-IN")} credited.`,
      diff: [
        { field: "Payment Status", before: "PENDING", after: "APPROVED" },
        { field: "Watermark Status", before: "Watermarked (UNPAID)", after: "Clean Live (PAID)" },
        { field: "Agent Commission (40%)", after: `₹${commission}` },
      ],
      actionBadges: [
        { label: "Payment Approved", type: "success" },
        { label: `Watermark Removed`, type: "success" },
      ],
    };
  }

  // ─── ACTION 4: UPDATE PLATFORM CONFIG ────────────────────────────────────────
  if (action === "UPDATE_PLATFORM") {
    const setting = await prisma.platformSetting.findFirst();
    const updateData: any = {};
    const diffs: { field: string; before?: any; after?: any }[] = [];

    if (plan.upiId && plan.upiId !== setting?.upiId) {
      diffs.push({ field: "UPI ID", before: setting?.upiId, after: plan.upiId });
      updateData.upiId = plan.upiId;
    }
    if (plan.payeeName && plan.payeeName !== setting?.upiPayeeName) {
      diffs.push({ field: "Payee Name", before: setting?.upiPayeeName, after: plan.payeeName });
      updateData.upiPayeeName = plan.payeeName;
    }
    if (plan.supportWhatsapp && plan.supportWhatsapp !== setting?.supportWhatsapp) {
      diffs.push({ field: "Support WhatsApp", before: setting?.supportWhatsapp, after: plan.supportWhatsapp });
      updateData.supportWhatsapp = plan.supportWhatsapp;
    }

    if (Object.keys(updateData).length === 0) {
      return {
        success: true,
        intent: "UPDATE_PLATFORM",
        message: "No configuration changes detected.",
      };
    }

    await prisma.platformSetting.updateMany({
      data: updateData,
    });

    return {
      success: true,
      intent: "UPDATE_PLATFORM",
      entityType: "platform",
      message: "⚙️ Platform settings updated successfully!",
      diff: diffs,
      actionBadges: [{ label: "Settings Updated", type: "success" }],
    };
  }

  // ─── ACTION 5: QUERY STATS / ANALYTICS ───────────────────────────────────────
  if (action === "QUERY_STATS") {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalRevenue, todayRevenue, totalMerchants, pendingDeals, agentsCount] = await Promise.all([
      prisma.upiPayment.aggregate({ where: { status: "APPROVED" }, _sum: { amount: true } }),
      prisma.upiPayment.aggregate({ where: { status: "APPROVED", createdAt: { gte: todayStart } }, _sum: { amount: true } }),
      prisma.business.count(),
      prisma.upiPayment.findMany({ where: { status: "PENDING" }, include: { user: { include: { businesses: true } } }, take: 5 }),
      prisma.user.count({ where: { role: "MARKETING_AGENT" } }),
    ]);

    const pendingSummary = pendingDeals
      .map((p) => `• **${p.user.businesses[0]?.name || "Merchant"}**: ₹${p.amount} (${p.agentCode || "Direct"})`)
      .join("\n");

    return {
      success: true,
      intent: "QUERY_STATS",
      entityType: "analytics",
      message: `📊 **Platform Overview**:
• **Total Revenue**: ₹${(totalRevenue._sum.amount || 0).toLocaleString("en-IN")}
• **Today's Revenue**: ₹${(todayRevenue._sum.amount || 0).toLocaleString("en-IN")}
• **Active Merchants**: ${totalMerchants}
• **Active Marketing Agents**: ${agentsCount}
• **Pending Deals**: ${pendingDeals.length}

${pendingDeals.length > 0 ? `**Recent Pending Deals:**\n${pendingSummary}` : "✅ No pending deals awaiting approval."}`,
      actionBadges: [
        { label: `Revenue: ₹${totalRevenue._sum.amount || 0}`, type: "success" },
        { label: `Merchants: ${totalMerchants}`, type: "info" },
        { label: `Pending: ${pendingDeals.length}`, type: pendingDeals.length > 0 ? "warning" : "success" },
      ],
    };
  }

  // ─── ACTION 6: SEARCH / INSPECT MERCHANT ─────────────────────────────────────
  if (action === "SEARCH_MERCHANT") {
    const search = plan.targetName || plan.targetPhone || rawPrompt;
    const biz = await prisma.business.findFirst({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
          { phone: { contains: search } },
        ],
      },
      include: {
        user: { select: { phone: true, name: true, createdAt: true } },
      },
    });

    if (!biz) {
      return {
        success: false,
        intent: "SEARCH_MERCHANT",
        message: `No merchant found matching "${search}".`,
      };
    }

    const lastPayment = await prisma.upiPayment.findFirst({
      where: { businessId: biz.id },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      intent: "SEARCH_MERCHANT",
      entityType: "merchant",
      message: `Found profile for **${biz.name}**:
• **Category**: ${biz.category}
• **Tagline**: ${biz.tagline}
• **Phone**: ${biz.phone || biz.user.phone}
• **Status**: ${biz.isPaid ? "✅ Paid (Watermark Disabled)" : "⚠️ Unpaid (Watermarked)"}
• **Deal**: ₹${lastPayment?.amount || 0} (${lastPayment?.status || "NO_DEAL"}) — Agent: ${lastPayment?.agentCode || "None"}`,
      quickLinks: [
        { label: "Open Live Review Page", url: `/r/${biz.slug}`, external: true },
      ],
      actionBadges: [
        { label: biz.isPaid ? "PAID" : "UNPAID", type: biz.isPaid ? "success" : "warning" },
        { label: `Agent: ${lastPayment?.agentCode || "N/A"}`, type: "info" },
      ],
    };
  }

  // Default General Chat
  return {
    success: true,
    intent: "GENERAL_CHAT",
    message: plan.message || `I am ready. Try telling me:
• *"Onboard new merchant Sri Krishna Sweets under MKT-01 with phone 9876543210 and deal amount 1999"*
• *"Update Anand Fashion Studio deal amount to 1999"*
• *"Approve pending deal for Sri Guru Fashions"*
• *"Show platform revenue statistics"*
• *"Change platform UPI ID to new@oksbi"*`,
  };
}

// ─── DETERMINISTIC FALLBACK PARSER ────────────────────────────────────────────
function fallbackParse(prompt: string, merchants: any[], agents: any[]) {
  const p = prompt.toLowerCase();

  // 1. Create Merchant
  if (p.includes("create") || p.includes("add") || p.includes("onboard") || p.includes("new merchant")) {
    const phoneMatch = prompt.match(/\b([6-9]\d{9})\b/);
    const amountMatch = prompt.match(/(?:amount|deal|price|₹|rs\.?)\s*:?\s*(\d{3,5})/i) || prompt.match(/\b(\d{3,5})\b/);
    const agentMatch = prompt.match(/\b(mkt[-_]?\d{1,2})\b/i);

    // Extract name
    let name = "New Merchant";
    const nameMatch = prompt.match(/(?:merchant|business|named?|store)\s+([A-Za-z0-9\s'&]+?)(?:\s+(?:under|with|phone|for|category|deal)|$)/i);
    if (nameMatch && nameMatch[1].trim()) {
      name = nameMatch[1].trim();
    }

    return {
      action: "CREATE_MERCHANT",
      targetName: name,
      targetPhone: phoneMatch ? phoneMatch[1] : null,
      amount: amountMatch ? Number(amountMatch[1]) : 1499,
      agentCode: agentMatch ? agentMatch[1].toUpperCase().replace("_", "-") : "MKT-01",
      category: p.includes("food") ? "Food & Dining" : p.includes("fashion") ? "Fashion & Clothing" : "Local Business & Services",
    };
  }

  // 2. Approve Deal
  if (p.includes("approve") || p.includes("mark paid") || p.includes("verify payment")) {
    const target = merchants.find((m) => p.includes(m.name.toLowerCase()));
    return {
      action: "APPROVE_DEAL",
      targetName: target ? target.name : null,
    };
  }

  // 3. Stats / Analytics
  if (p.includes("stats") || p.includes("revenue") || p.includes("summary") || p.includes("analytics") || p.includes("how much") || p.includes("total")) {
    return { action: "QUERY_STATS" };
  }

  // 4. Update Platform
  if (p.includes("upi") || p.includes("whatsapp") || p.includes("platform setting")) {
    const upiMatch = prompt.match(/([a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64})/);
    return {
      action: "UPDATE_PLATFORM",
      upiId: upiMatch ? upiMatch[1] : null,
    };
  }

  // 5. Update Merchant
  const matchedMerchant = merchants.find((m) => p.includes(m.name.toLowerCase()));
  if (matchedMerchant || p.includes("update") || p.includes("change") || p.includes("set")) {
    const amountMatch = prompt.match(/(?:amount|deal|price|₹|rs\.?)\s*:?\s*(\d{3,5})/i);
    const phoneMatch = prompt.match(/\b([6-9]\d{9})\b/);
    const isPaidMatch = p.includes("mark paid") || p.includes("set paid") ? true : p.includes("mark unpaid") ? false : null;

    return {
      action: "UPDATE_MERCHANT",
      targetName: matchedMerchant ? matchedMerchant.name : null,
      targetPhone: phoneMatch ? phoneMatch[1] : null,
      amount: amountMatch ? Number(amountMatch[1]) : null,
      isPaid: isPaidMatch,
    };
  }

  // 6. Search
  return {
    action: "SEARCH_MERCHANT",
    targetName: prompt.trim(),
  };
}
