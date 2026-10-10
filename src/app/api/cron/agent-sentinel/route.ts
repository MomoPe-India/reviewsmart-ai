import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * ReviewSmart Cloud Agentic AI Sentinel
 * 
 * An autonomous cloud worker designed to monitor, audit, and orchestrate platform
 * operations 24/7 without human intervention.
 * 
 * Scheduled via:
 * - Vercel Cron Jobs (vercel.json)
 * - Google Cloud Scheduler (HTTP trigger to Cloud Run / Next.js)
 * - GitHub Actions Cron Schedule
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const secretKey = req.nextUrl.searchParams.get("key");
    const expectedSecret = process.env.CRON_SECRET || "reviewsmart_agent_cron_default";

    // Validate security token if CRON_SECRET is configured
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${expectedSecret}` && secretKey !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized Agent Trigger" }, { status: 401 });
    }

    const now = new Date();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

    // ── 1. Kuber Sentinel: Financial & Payment Health ──────────────────────────
    const [pendingPayments, stalePayments, approved24h, totalRevAgg] = await Promise.all([
      prisma.upiPayment.findMany({
        where: { status: "PENDING" },
        select: { id: true, amount: true, utrNumber: true, createdAt: true, customerPhone: true, planType: true },
      }),
      prisma.upiPayment.findMany({
        where: { status: "PENDING", createdAt: { lte: twelveHoursAgo } },
        select: { id: true, amount: true, utrNumber: true, createdAt: true },
      }),
      prisma.upiPayment.aggregate({
        where: { status: "APPROVED", createdAt: { gte: twentyFourHoursAgo } },
        _sum: { amount: true, commission: true },
        _count: true,
      }),
      prisma.upiPayment.aggregate({
        where: { status: "APPROVED" },
        _sum: { amount: true, commission: true },
      }),
    ]);

    // ── 2. Prachar Sentinel: GMB Fulfillment Pipeline Health ───────────────────
    const [gmbSubmitted, gmbInProgress, gmbPendingVerification, gmbLiveCount] = await Promise.all([
      prisma.business.count({ where: { gmbStatus: "DETAILS_SUBMITTED" } }),
      prisma.business.count({ where: { gmbStatus: "IN_PROGRESS" } }),
      prisma.business.count({ where: { gmbStatus: "VERIFICATION_PENDING" } }),
      prisma.business.count({ where: { gmbStatus: "VERIFIED_LIVE" } }),
    ]);

    // ── 3. Nazar Sentinel: Merchant Network & QR Traffic Health ────────────────
    const [totalMerchants, activeLiveCards, events24h, negativeFeedbacks24h] = await Promise.all([
      prisma.user.count({ where: { role: "BUSINESS_OWNER" } }),
      prisma.business.count({ where: { isPaid: true } }),
      prisma.reviewAnalytics.count({
        where: { createdAt: { gte: twentyFourHoursAgo } },
      }),
      prisma.privateFeedback.count({
        where: { createdAt: { gte: twentyFourHoursAgo } },
      }),
    ]);

    // ── 4. Agentic Decision & Recommendation Synthesis ─────────────────────────
    const actionRequired: string[] = [];

    if (stalePayments.length > 0) {
      actionRequired.push(
        `⚠️ ${stalePayments.length} pending UPI payment(s) older than 12 hours require admin verification.`
      );
    }

    const gmbBacklog = gmbSubmitted + gmbInProgress + gmbPendingVerification;
    if (gmbBacklog > 0) {
      actionRequired.push(
        `📍 ${gmbBacklog} merchant GMB profile(s) in fulfillment pipeline (${gmbSubmitted} new, ${gmbInProgress} in SEO prep, ${gmbPendingVerification} awaiting Google verification code).`
      );
    }

    if (negativeFeedbacks24h > 0) {
      actionRequired.push(
        `🛡️ ${negativeFeedbacks24h} customer private feedback event(s) intercepted in last 24h by the Negative Review Shield.`
      );
    }

    const executiveDigest = {
      timestamp: now.toISOString(),
      agentStatus: "HEALTHY",
      platformPulse: {
        totalMerchants,
        activeLiveCards,
        twentyFourHourScans: events24h,
        revenue24h: approved24h._sum.amount || 0,
        dealsClosed24h: approved24h._count || 0,
        lifetimePlatformRevenue: totalRevAgg._sum.amount || 0,
        totalCommissionsGenerated: totalRevAgg._sum.commission || 0,
      },
      gmbPipeline: {
        submitted: gmbSubmitted,
        inProgress: gmbInProgress,
        verificationPending: gmbPendingVerification,
        verifiedLive: gmbLiveCount,
      },
      pendingReviews: {
        pendingUpiCount: pendingPayments.length,
        staleUpiCount: stalePayments.length,
      },
      actionRequired,
      suggestedWhatsAppBrief: `📊 *ReviewSmart AI Daily Operations Pulse* (${now.toLocaleDateString("en-IN")})
• Active Live Stores: ${activeLiveCards}
• 24h Customer Scans: ${events24h}
• 24h Revenue: ₹${(approved24h._sum.amount || 0).toLocaleString("en-IN")}
• Pending UPIs: ${pendingPayments.length}
• GMB Queue: ${gmbBacklog} merchants in progress
${actionRequired.length > 0 ? `\n⚠️ *Alerts*:\n${actionRequired.join("\n")}` : "\n✅ All operations running smoothly at 100% capacity."}`,
    };

    return NextResponse.json({
      success: true,
      digest: executiveDigest,
    });
  } catch (error: any) {
    console.error("Cloud Agent Sentinel execution failed:", error);
    return NextResponse.json(
      { error: "Agent Sentinel Execution Error", details: error?.message },
      { status: 500 }
    );
  }
}
