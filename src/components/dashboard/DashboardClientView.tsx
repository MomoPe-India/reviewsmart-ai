"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Eye,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Star,
  Copy,
  Printer,
  Settings,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Share2,
  Download,
  Store,
  ArrowUpRight,
  Phone,
  Palette,
  QrCode,
  Check,
} from "lucide-react";

interface FeedbackItem {
  id: string;
  rating: number;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  comments: string;
  createdAt: Date | string;
}

interface DashboardClientViewProps {
  user: {
    name?: string | null;
    phone?: string | null;
    userIdTag?: string | null;
    customerType?: string;
  };
  business: {
    id: string;
    name: string;
    slug: string;
    category: string | null;
    tagline: string | null;
    logoUrl: string | null;
    primaryColor: string;
    googleAddress: string | null;
    googleReviewUrl: string | null;
    minRatingForGoogle: number;
    customerType: string;
    isPaid: boolean;
    feedbacks: FeedbackItem[];
  };
  metrics: {
    totalViews: number;
    aiGenerations: number;
    shieldSaves: number;
    googleRedirects: number;
  };
  reviewUrl: string;
  qrDataUrl: string;
  waActivationUrl: string;
}

export default function DashboardClientView({
  user,
  business,
  metrics,
  reviewUrl,
  qrDataUrl,
  waActivationUrl,
}: DashboardClientViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(reviewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi! We would love to get your feedback for ${business.name}. Please take 10 seconds to share your review on Google:\n\n${reviewUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const isOffline = business.customerType === "OFFLINE";
  const merchantId = user.userIdTag || user.phone || "Merchant";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ─── 1. TOP MOBILE-FIRST STORE IDENTITY & STATUS HERO ──────────────── */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Store Info */}
          <div className="flex items-start sm:items-center gap-4">
            {/* Store Avatar */}
            <div
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white border-2 flex items-center justify-center overflow-hidden shrink-0 shadow-lg"
              style={{ borderColor: business.primaryColor || "#4f46e5" }}
            >
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="text-xl sm:text-2xl font-black"
                  style={{ color: business.primaryColor || "#4f46e5" }}
                >
                  {business.name.slice(0, 2).toUpperCase() || "RS"}
                </span>
              )}
            </div>

            {/* Title & Badges */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    isOffline
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                      : "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
                  }`}
                >
                  {isOffline ? "🤝 Offline Merchant" : "💻 Online Digital Card"}
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    business.isPaid
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                      : "bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse"
                  }`}
                >
                  {business.isPaid ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Live &amp; Active</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 text-amber-400" />
                      <span>Payment Pending</span>
                    </>
                  )}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                {business.name}
              </h1>

              <p className="text-xs text-indigo-200/80 truncate max-w-md">
                {business.category || "Local Business"} • {business.googleAddress || "Verified Google Profile"}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <Link
              href="/dashboard/settings"
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Palette className="w-4 h-4 text-indigo-300" />
              <span>Customise</span>
            </Link>

            <a
              href={reviewUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/60 transition"
            >
              <span>Test Card</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* ─── PAYMENT PENDING MOBILE ALERT BANNER ────────────────────────── */}
        {!business.isPaid && (
          <div className="mt-5 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5 font-black" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-black text-amber-300">
                  Payment Pending
                </h4>
                <p className="text-xs text-slate-200 leading-snug">
                  This review card is not yet active. Contact MomoPe support to activate it.
                </p>
                <p className="text-[10px] text-amber-200/70 font-mono pt-0.5">
                  Merchant ID: {merchantId} • Card: /{business.slug}
                </p>
              </div>
            </div>

            <a
              href={waActivationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-black text-xs shadow-lg shadow-emerald-950/40 transition shrink-0 transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Contact MomoPe on WhatsApp</span>
            </a>
          </div>
        )}
      </div>

      {/* ─── 2. MOBILE APP QUICK ACTION TILES ───────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/dashboard/settings"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-indigo-300 transition group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Palette className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
              Customise Card
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Logo, Colors &amp; Tags</p>
          </div>
        </Link>

        <a
          href={reviewUrl}
          target="_blank"
          rel="noreferrer"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-indigo-300 transition group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ExternalLink className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
              View Public Card
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Live Visitor Screen</p>
          </div>
        </a>

        <Link
          href="/dashboard/assistant"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-purple-300 transition group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition">
              AI Reply Assistant
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Auto-Craft Responses</p>
          </div>
        </Link>

        <Link
          href="/dashboard/studio"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-amber-300 transition group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            {isOffline ? <Printer className="w-5 h-5" /> : <Store className="w-5 h-5" />}
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition">
              {isOffline ? "Standee Studio" : "Order Counter Stand"}
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {isOffline ? "Print 4×6 Acrylic" : "Upgrade Hardware"}
            </p>
          </div>
        </Link>
      </div>

      {/* ─── 3. RESPONSIVE KPI STATS GRID ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Scans & Views */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Scans &amp; Views</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {metrics.totalViews}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">NFC taps &amp; QR visitors</p>
        </div>

        {/* AI Reviews Drafted */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">AI Reviews Drafted</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {metrics.aiGenerations}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">5-star AI variations</p>
        </div>

        {/* Negative Shield Saves */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Shield Saves (1-3★)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">
              {metrics.shieldSaves}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Kept off Google Maps</p>
        </div>

        {/* Google Redirects */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Google Redirects</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">
              {metrics.googleRedirects}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Sent directly to Google</p>
        </div>
      </div>

      {/* ─── 4. MAIN SPLIT: QR SHARING HUB & NEGATIVE SHIELD INBOX ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* QR Code & Share Funnel Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Your Smart Review QR</h3>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              1-Tap Share
            </span>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 mb-2">
              <img
                src={qrDataUrl}
                alt="Review QR Code"
                className="w-40 h-40 sm:w-44 sm:h-44 object-contain"
              />
            </div>
            <span className="text-xs font-bold text-slate-800 mt-1">
              Scan or Tap Phone to Review
            </span>
            <span className="text-[11px] text-slate-400 font-mono">/{business.slug}</span>
          </div>

          {/* Link Box & Actions */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-600">
              Direct Review Funnel Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={reviewUrl}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 truncate font-mono"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition shrink-0"
                title="Copy Link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && (
              <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5" /> Link copied to clipboard!
              </p>
            )}
          </div>

          {/* 3 Share Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share WhatsApp</span>
            </button>

            <a
              href={qrDataUrl}
              download={`${business.slug}-review-qr.png`}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download QR</span>
            </a>
          </div>
        </div>

        {/* Negative Feedback Shield Inbox */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
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
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                View All ({metrics.shieldSaves})
              </Link>
            </div>

            {business.feedbacks.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <ShieldCheck className="w-10 h-10 text-slate-200 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">
                  Zero Negative Reviews! All Clear.
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Any customer giving 1 to {business.minRatingForGoogle - 1} stars will be intercepted here instead of on Google Maps.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {business.feedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                          {fb.rating} ★
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {fb.customerName || "Customer"}
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

                    <p className="text-xs text-slate-600 italic bg-white p-2 rounded-xl border border-slate-100">
                      &ldquo;{fb.comments}&rdquo;
                    </p>

                    {fb.customerPhone && (
                      <div className="pt-1 flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/${fb.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${fb.customerName || "valued customer"}, this is management from ${business.name}. We received your feedback and would love to resolve this for you.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp Customer</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Channel & Activation Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">
                Channel: <strong className="text-slate-800">{isOffline ? "🤝 Offline Field Partner" : "💻 Online Digital Card"}</strong>
              </span>
            </div>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full self-start sm:self-auto ${
                business.isPaid
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {business.isPaid ? "✓ Verified & Active" : "⏳ Payment Pending (Watermark Active)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
