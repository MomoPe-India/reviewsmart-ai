"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Star,
  Sparkles,
  MessageCircle,
  ExternalLink,
  Phone,
  Instagram,
  Globe,
  UtensilsCrossed,
  CreditCard,
  MapPin,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  QrCode,
  X,
  Share2,
} from "lucide-react";
import ReviewExperience from "./ReviewExperience";
import { copyToClipboard } from "@/lib/clipboard";

interface BusinessData {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  logoUrl: string | null;
  primaryColor: string;
  googleReviewUrl: string | null;
  googlePlaceId: string | null;
  googleAddress?: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  website: string | null;
  category?: string | null;
  minRatingForGoogle: number;
  tagChips: string;
  keywords: string;
  reviewPromptTone: string;
  qrMode?: string | null;
  menuUrl?: string | null;
  customUpiId?: string | null;
}

export default function SmartHubExperience({
  business,
  staff,
}: {
  business: BusinessData;
  staff?: string | null;
}) {
  const [showReviewBooster, setShowReviewBooster] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Clean WhatsApp number
  const rawWa = business.whatsapp || business.phone || "";
  const cleanWaNumber = rawWa.replace(/[^0-9]/g, "");
  const waFullNumber = cleanWaNumber.startsWith("91")
    ? cleanWaNumber
    : cleanWaNumber.length === 10
    ? `91${cleanWaNumber}`
    : cleanWaNumber;
  const waText = encodeURIComponent(
    `Hello ${business.name}, I found your Smart Hub through your counter QR code! I have an enquiry.`
  );
  const waUrl = waFullNumber ? `https://wa.me/${waFullNumber}?text=${waText}` : null;

  // Clean Instagram URL
  let instaUrl = business.instagram || null;
  if (instaUrl && !instaUrl.startsWith("http")) {
    const handle = instaUrl.replace("@", "").trim();
    instaUrl = `https://instagram.com/${handle}`;
  }

  // Clean Website URL
  let siteUrl = business.website || null;
  if (siteUrl && !siteUrl.startsWith("http")) {
    siteUrl = `https://${siteUrl}`;
  }

  // UPI target
  const upiVpa = business.customUpiId || (business.phone ? `${business.phone.replace(/[^0-9]/g, "")}@upi` : null);
  const upiIntentUrl = upiVpa
    ? `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=${encodeURIComponent(business.name)}&cu=INR`
    : null;

  const handleCopyUpi = () => {
    if (!upiVpa) return;
    copyToClipboard(upiVpa);
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const handleShareHub = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: business.name,
          text: `Check out ${business.name}'s official digital card`,
          url,
        });
      } catch {
        // Fallback to copy
        copyToClipboard(url);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      }
    } else {
      copyToClipboard(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 sm:py-6 flex flex-col items-center">
      {/* ─── HUB HEADER CARD ─────────────────────────────────────────────────── */}
      <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
        {/* Ambient Top Glow */}
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: business.primaryColor || "#6366f1" }}
        />

        {/* Share Button (Top Right) */}
        <button
          onClick={handleShareHub}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
          title="Share Hub"
        >
          {linkCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
        </button>

        {/* Logo Container with Adaptive Display */}
        <div className="relative mb-3.5 mt-1">
          {business.logoUrl ? (
            <div className="w-20 h-20 rounded-2xl bg-white border-2 border-white/90 p-2 shadow-2xl flex items-center justify-center overflow-hidden">
              <img
                src={business.logoUrl}
                alt={business.name}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-xl border-2 border-white/20"
              style={{ backgroundColor: business.primaryColor || "#6366f1" }}
            >
              {business.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-slate-950 rounded-full shadow-md">
            <ShieldCheck className="w-3.5 h-3.5 fill-slate-950 text-amber-500" />
          </div>
        </div>

        {/* Business Name */}
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center justify-center gap-1.5 flex-wrap">
          <span>{business.name}</span>
        </h1>

        {/* Tagline */}
        {business.tagline && (
          <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed font-medium">
            {business.tagline}
          </p>
        )}

        {/* Badges / Location */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
          {business.category && (
            <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
              {business.category}
            </span>
          )}
          <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            Verified Smart Hub
          </span>
        </div>

        {business.googleAddress && (
          <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-center gap-1 max-w-xs truncate">
            <MapPin className="w-3 h-3 text-red-400 shrink-0" />
            <span className="truncate">{business.googleAddress}</span>
          </p>
        )}
      </div>

      {/* ─── PRIMARY HERO ACTION: GOOGLE AI REVIEW BOOSTER ───────────────────── */}
      <div className="w-full mt-4">
        <div
          className={`w-full rounded-3xl transition-all duration-300 relative overflow-hidden border ${
            showReviewBooster
              ? "bg-slate-900 border-amber-500/40 shadow-2xl shadow-amber-500/10 p-4"
              : "bg-gradient-to-r from-amber-500/20 via-slate-900 to-indigo-500/20 border-amber-500/30 hover:border-amber-400/60 shadow-xl p-4 cursor-pointer transform active:scale-99"
          }`}
          onClick={() => {
            if (!showReviewBooster) setShowReviewBooster(true);
          }}
        >
          {/* Animated top shimmer badge */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
              <Star className="w-3 h-3 fill-slate-950" />
              <span>Google Maps Official Review</span>
            </div>
            <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              Gemini AI Assisted
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="text-left">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                <span>Leave a 5-Star Review</span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Takes only 10 seconds. AI crafts your review instantly with 1-tap copy!
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowReviewBooster(!showReviewBooster);
              }}
              className="w-10 h-10 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 transition"
              aria-label="Toggle Review Experience"
            >
              {showReviewBooster ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Embedded Full Review Experience */}
          {showReviewBooster && (
            <div className="mt-4 pt-4 border-t border-white/10 animate-fadeIn">
              <ReviewExperience business={business} staff={staff} />
            </div>
          )}
        </div>
      </div>

      {/* ─── QUICK ACTION BUTTONS GRID ───────────────────────────────────────── */}
      <div className="w-full mt-3.5 space-y-2.5">
        {/* 1. WhatsApp Instant Chat / Orders */}
        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-emerald-500/30 hover:border-emerald-500/60 shadow-lg flex items-center justify-between gap-3 transition group transform active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 group-hover:scale-105 transition">
                <MessageCircle className="w-5 h-5 fill-emerald-500/20" />
              </div>
              <div className="text-left">
                <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition block">
                  Chat on WhatsApp
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Instant enquiries, orders &amp; support
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition shrink-0" />
          </a>
        )}

        {/* 2. Digital Menu / Catalog Link (if configured) */}
        {business.menuUrl && (
          <a
            href={business.menuUrl.startsWith("http") ? business.menuUrl : `https://${business.menuUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-orange-500/30 hover:border-orange-500/60 shadow-lg flex items-center justify-between gap-3 transition group transform active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30 group-hover:scale-105 transition">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-sm font-bold text-white group-hover:text-orange-300 transition block">
                  View Digital Menu / Catalog
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Browse products, items &amp; price list
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-orange-400 transition shrink-0" />
          </a>
        )}

        {/* 3. Direct UPI Payment (PhonePe, GPay, Paytm) */}
        {upiVpa && (
          <button
            type="button"
            onClick={() => setShowUpiModal(true)}
            className="w-full p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-indigo-500/30 hover:border-indigo-500/60 shadow-lg flex items-center justify-between gap-3 transition group transform active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30 group-hover:scale-105 transition">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition block">
                  Pay via UPI / GPay / PhonePe
                </span>
                <span className="text-[11px] text-slate-400 block">
                  0% transaction fee • Instant counter payment
                </span>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold">
              Pay ₹
            </div>
          </button>
        )}

        {/* 4. Instagram Profile */}
        {instaUrl && (
          <a
            href={instaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-pink-500/30 hover:border-pink-500/60 shadow-lg flex items-center justify-between gap-3 transition group transform active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 border border-pink-500/30 group-hover:scale-105 transition">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-sm font-bold text-white group-hover:text-pink-300 transition block">
                  Follow on Instagram
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Latest updates, reels &amp; new arrivals
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-pink-400 transition shrink-0" />
          </a>
        )}

        {/* 5. Official Website */}
        {siteUrl && (
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-teal-500/30 hover:border-teal-500/60 shadow-lg flex items-center justify-between gap-3 transition group transform active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30 group-hover:scale-105 transition">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-sm font-bold text-white group-hover:text-teal-300 transition block">
                  Visit Official Website
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Explore full catalog &amp; services
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-teal-400 transition shrink-0" />
          </a>
        )}

        {/* 6. Direct Phone Call */}
        {business.phone && (
          <a
            href={`tel:${business.phone}`}
            className="w-full p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700 hover:border-slate-500 shadow-lg flex items-center justify-between gap-3 transition group transform active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 border border-slate-700 group-hover:scale-105 transition">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-sm font-bold text-white group-hover:text-slate-200 transition block">
                  Call {business.phone}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Direct phone connection
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition shrink-0" />
          </a>
        )}
      </div>

      {/* ─── UPI PAYMENT MODAL ──────────────────────────────────────────────── */}
      {showUpiModal && upiVpa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setShowUpiModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3 border border-indigo-500/30">
              <CreditCard className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-white">Pay {business.name}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Scan or tap below to pay using any UPI app (GPay, PhonePe, Paytm)
            </p>

            {/* UPI ID Pill */}
            <div className="mt-4 p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
              <div className="text-left min-w-0">
                <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
                  UPI VPA ID
                </span>
                <span className="text-xs font-mono font-bold text-indigo-300 truncate block">
                  {upiVpa}
                </span>
              </div>
              <button
                onClick={handleCopyUpi}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 shrink-0 transition"
              >
                {upiCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{upiCopied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Direct Pay with UPI App */}
            {upiIntentUrl && (
              <a
                href={upiIntentUrl}
                className="w-full mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition transform active:scale-98"
              >
                <CreditCard className="w-4 h-4" />
                <span>Open in Any UPI App</span>
              </a>
            )}

            <button
              onClick={() => setShowUpiModal(false)}
              className="mt-3 text-xs text-slate-500 hover:text-slate-300 font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ─── FOOTER WITH ZERO ADS GUARANTEE ─────────────────────────────────── */}
      <footer className="w-full mt-8 pt-4 border-t border-white/5 text-center flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Ad-Free • Zero Distractions • Verified Card</span>
        </div>
        <p className="text-[11px] text-slate-500 font-medium">
          Powered by ReviewSmart AI · Smart Business Hub
        </p>
      </footer>
    </div>
  );
}
