import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Eye,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Star,
  Copy,
  ArrowUpRight,
  Printer,
  MessageSquare,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { generateQrDataUrl } from "@/lib/qr";

export default async function DashboardOverviewPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const business = await prisma.business.findFirst({
    where: { userId: user.id },
    include: {
      feedbacks: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      analytics: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!business) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center">
        <h2 className="text-base font-bold text-slate-800">No Business Profile Found</h2>
        <p className="text-xs text-slate-500 mt-1">Please configure your first business profile in settings.</p>
        <Link
          href="/dashboard/settings"
          className="inline-block mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Setup Profile
        </Link>
      </div>
    );
  }

  const subscription = await prisma.userSubscription.findUnique({
    where: { userId: user.id },
    include: { plan: true },
  });

  // Calculate Metrics
  const totalViews = await prisma.reviewAnalytics.count({
    where: { businessId: business.id, eventType: "PAGE_VIEW" },
  });

  const aiGenerations = await prisma.reviewAnalytics.count({
    where: { businessId: business.id, eventType: "AI_GENERATED" },
  });

  const shieldSaves = await prisma.privateFeedback.count({
    where: { businessId: business.id },
  });

  const googleRedirects = await prisma.reviewAnalytics.count({
    where: { businessId: business.id, eventType: "GOOGLE_REDIRECT" },
  });

  // Quick QR data URL
  const appUrl = getAppUrl();
  const reviewUrl = `${appUrl}/r/${business.slug}`;
  const qrDataUrl = await generateQrDataUrl(reviewUrl, {
    width: 320,
    color: { dark: business.primaryColor || "#000000", light: "#ffffff" },
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-700/50 border border-indigo-400/20 text-indigo-200 text-xs font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              AI Review Generator Active
            </div>
            <h1 className="text-xl font-black tracking-tight">
              Welcome back, {user.name || "Partner"}! 👋
            </h1>
            <p className="text-xs text-indigo-200 mt-1 max-w-lg">
              Your smart NFC/QR review funnel for{" "}
              <span className="font-semibold text-white">{business.name}</span> is live.
              Ratings below {business.minRatingForGoogle} stars are filtered privately.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/studio"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold flex items-center gap-2 transition"
            >
              <Printer className="w-4 h-4" />
              Print Acrylic Stands
            </Link>
            <a
              href={reviewUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition"
            >
              <span>Test Live Card</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Decorative ambient background */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scans */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Scans &amp; Views</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{totalViews}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Visitors via NFC &amp; QR code</p>
        </div>

        {/* AI Generations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">AI Reviews Drafted</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{aiGenerations}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">5-star AI variations generated</p>
        </div>

        {/* Negative Shield Saves */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Shield Saves (1-3★)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-amber-600">{shieldSaves}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Negative reviews kept off Google</p>
        </div>

        {/* Google Redirects */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Google Redirects</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-600">{googleRedirects}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Customers prompted to post</p>
        </div>
      </div>

      {/* Main Split: QR Quick Card & Negative Shield Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick QR Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Your Smart Review Card</h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Active
              </span>
            </div>

            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
              <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200">
                <img
                  src={qrDataUrl}
                  alt="Review QR Code"
                  className="w-44 h-44 object-contain"
                />
              </div>
              <span className="text-xs font-semibold text-slate-700 mt-3">
                Scan or Tap Phone to Review
              </span>
              <span className="text-[11px] text-slate-400">/{business.slug}</span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600">
                Direct Review Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={reviewUrl}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 truncate"
                />
                <a
                  href={reviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title="Open Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/dashboard/studio"
              className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Printer className="w-4 h-4" />
              Open Acrylic Stand Print Studio
            </Link>
          </div>
        </div>

        {/* Private Feedback Shield Alerts */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Negative Review Shield Inbox
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Complaints captured privately before reaching Google
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/feedback"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
              >
                View All ({shieldSaves})
              </Link>
            </div>

            {business.feedbacks.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs">No negative feedback captured yet. All clear!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {business.feedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                          {fb.rating} ★
                        </span>
                        <span className="text-xs font-semibold text-slate-800">
                          {fb.customerName || "Anonymous Customer"}
                        </span>
                        {(fb.customerEmail || fb.customerPhone) && (
                          <span className="text-[10px] text-slate-400">
                            • {fb.customerEmail || fb.customerPhone}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 italic">
                      "{fb.comments}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Membership tier summary */}
          {subscription && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span className="text-slate-600">
                  Plan:{" "}
                  <strong className="text-slate-900 font-bold">
                    {subscription.plan.name}
                  </strong>
                </span>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">
                Active through {new Date(subscription.endDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
