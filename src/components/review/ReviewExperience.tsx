"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Star,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Send,
  Globe,
  Instagram,
  ShieldCheck,
  Heart,
  Loader2,
  X,
  Award,
  Phone,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Edit3,
} from "lucide-react";
import { detectIndustry } from "@/lib/industry";
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
}

interface ReviewOption {
  id: number;
  headline: string;
  text: string;
  tone: string;
}

export default function ReviewExperience({ business }: { business: BusinessData }) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  // Private direct feedback state
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [feedbackComments, setFeedbackComments] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Positive / AI review state
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reviewOptions, setReviewOptions] = useState<ReviewOption[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<number>(1);
  const [editableDraftText, setEditableDraftText] = useState<string>("");
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [copied, setCopied] = useState(false);

  // Celebration Modal state
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [modalCopiedText, setModalCopiedText] = useState("");
  const [modalReCopied, setModalReCopied] = useState(false);

  const googleLinkRef = useRef<HTMLAnchorElement>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [modalCountdown, setModalCountdown] = useState<number>(0);
  const reviewSectionRef = useRef<HTMLDivElement>(null);

  // Detect Industry Intelligence
  const industry = detectIndustry(business.name, business.category || "", business.tagline || "");

  // Parse tag chips
  const rawTags = (business.tagChips || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const isGenericRestaurantChips =
    rawTags.length >= 4 &&
    rawTags.includes("Clean Ambiance") &&
    rawTags.includes("Friendly Staff") &&
    industry.type !== "RESTAURANT_FOOD";

  const tagsList =
    rawTags.length > 0 && !isGenericRestaurantChips ? rawTags : industry.tags;

  const [isMobile, setIsMobile] = useState(true);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    setIsMobile(/Mobi|Android|iPhone|iPad|iPod/i.test(ua));
    const appleDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(appleDevice);
  }, []);

  // Resolved Direct GMB Review URL
  const getResolvedGoogleUrl = () => {
    const placeId =
      business.slug === "momo-it-technologies"
        ? "ChIJd5iV_xdzszsR_OIKD3ympJo"
        : (business.googlePlaceId || "").trim();
    const rawUrl = (business.googleReviewUrl || "").trim();

    if (placeId) {
      return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
    }

    if (rawUrl) {
      const match = rawUrl.match(/[?&]place(?:_)?id=([^&#]+)/i);
      if (match && match[1]) {
        return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(match[1])}`;
      }
      return rawUrl;
    }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name)}`;
  };

  const getMapsAppUrl = () => {
    if (business.slug === "momo-it-technologies") {
      return "https://share.google/TZztrbNbTy89hTgkp";
    }
    const placeId = (business.googlePlaceId || "").trim();
    if (placeId) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name)}&query_place_id=${encodeURIComponent(placeId)}`;
    }
    return (business.googleReviewUrl || "").trim() || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name)}`;
  };

  const googleUrl = getResolvedGoogleUrl();
  const mapsAppUrl = getMapsAppUrl();

  // Track page view once
  useEffect(() => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: business.slug,
        businessId: business.id,
        eventType: "PAGE_VIEW",
        deviceType: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
      }),
    }).catch(() => {});
  }, [business.id, business.slug]);

  // Helper to build instant local drafts without waiting
  const buildInstantDrafts = (tags: string[] = selectedTags, note: string = customNote): ReviewOption[] => {
    const joinedTags = tags.length > 0 ? tags.join(", ") : "";
    const drafts = industry.reviewDrafts;
    return [
      {
        id: 1,
        headline: drafts.direct.headline,
        text: drafts.direct.text(business.name, joinedTags, note),
        tone: "Quick & Direct",
      },
      {
        id: 2,
        headline: drafts.detailed.headline,
        text: drafts.detailed.text(business.name, joinedTags, note),
        tone: "Detailed & Helpful",
      },
      {
        id: 3,
        headline: drafts.enthusiastic.headline,
        text: drafts.enthusiastic.text(business.name, joinedTags, note),
        tone: "Warm Recommendation",
      },
    ];
  };

  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleRatingClick = async (star: number) => {
    setRating(star);

    // For 4 or 5 stars, instantly initialize and copy the draft
    if (star >= 4) {
      const currentDrafts = reviewOptions.length > 0 ? reviewOptions : buildInstantDrafts([]);
      const activeDraft = currentDrafts.find((r) => r.id === selectedOptionId) || currentDrafts[0];
      if (activeDraft) {
        setEditableDraftText(activeDraft.text);
        await copyToClipboard(activeDraft.text);
      }
      if (reviewOptions.length === 0) {
        setReviewOptions(currentDrafts);
        setSelectedOptionId(1);
      }
      setTimeout(() => {
        reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: business.slug,
        businessId: business.id,
        eventType: "STAR_SELECTED",
        rating: star,
      }),
    }).catch(() => {});
  };

  const toggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    const updated = buildInstantDrafts(next, customNote);
    const activeDraft = updated.find((r) => r.id === selectedOptionId) || updated[0];
    if (activeDraft) {
      setEditableDraftText(activeDraft.text);
      copyToClipboard(activeDraft.text);
    }
    setSelectedTags(next);
    setReviewOptions(updated);
  };

  const handleNoteChange = (note: string) => {
    setCustomNote(note);
    const updated = buildInstantDrafts(selectedTags, note);
    const activeDraft = updated.find((r) => r.id === selectedOptionId) || updated[0];
    if (activeDraft) {
      setEditableDraftText(activeDraft.text);
    }
    setReviewOptions(updated);
  };

  const handleSelectOption = (opt: ReviewOption) => {
    setSelectedOptionId(opt.id);
    setEditableDraftText(opt.text);
    copyToClipboard(opt.text);
  };

  // AI regeneration from server with fallback
  const triggerAiGeneration = async () => {
    setIsGenerating(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    try {
      const res = await fetch("/api/ai/generate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          businessName: business.name,
          category: business.category || industry.label,
          tagline: business.tagline,
          keywords: business.keywords,
          selectedTags,
          customNote,
          rating,
          tone: business.reviewPromptTone || "friendly",
        }),
      });

      clearTimeout(timeoutId);
      const data = await res.json();
      if (res.ok && data.reviews && data.reviews.length > 0) {
        setReviewOptions(data.reviews);
        setSelectedOptionId(data.reviews[0].id || 1);
        setEditableDraftText(data.reviews[0].text);
        await copyToClipboard(data.reviews[0].text);
      } else {
        const fallback = buildInstantDrafts(selectedTags, customNote);
        setReviewOptions(fallback);
        setEditableDraftText(fallback[0].text);
      }
    } catch {
      clearTimeout(timeoutId);
      const fallback = buildInstantDrafts(selectedTags, customNote);
      setReviewOptions(fallback);
      setEditableDraftText(fallback[0].text);
    } finally {
      clearTimeout(timeoutId);
      setIsGenerating(false);
    }
  };

  // Submit Private Direct Feedback
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComments.trim()) return;

    setFeedbackSubmitting(true);
    try {
      const res = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          rating,
          comments: feedbackComments,
          customerName: customerName || null,
          customerContact: customerContact || null,
        }),
      });

      if (res.ok) {
        setFeedbackSubmitted(true);
      } else {
        alert("Failed to submit message. Please try again.");
      }
    } catch {
      alert("A network error occurred. Please try again.");
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // Trigger Wow Modal, Copy to Clipboard, & Auto-Redirect to Google
  const handleOpenCopyModal = async (customText?: string, optId?: number) => {
    const selected = reviewOptions.find((r) => r.id === (optId ?? selectedOptionId)) || reviewOptions[0];
    const textToCopy =
      customText || editableDraftText || (selected ? selected.text : "Great experience at " + business.name + "! Highly recommended.");

    // Native clipboard write FIRST before state updates (iOS requirement)
    await copyToClipboard(textToCopy);

    if (optId !== undefined) {
      setSelectedOptionId(optId);
    }
    setModalCopiedText(textToCopy);
    setShowCopyModal(true);
    setCopied(true);
    setIsRedirecting(true);
    setTimeout(() => setCopied(false), 3000);

    // Celebratory Confetti
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#4f46e5", "#10b981", "#3b82f6", "#ec4899"],
      });
    } catch {}

    // Track Google redirect
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        slug: business.slug,
        businessId: business.id,
        eventType: "GOOGLE_REDIRECT",
        rating: rating || 5,
      }),
    }).catch(() => {});

    // START 3-2-1 COUNTDOWN
    if (countdownRef.current) clearTimeout(countdownRef.current);
    setModalCountdown(3);
    countdownRef.current = setTimeout(() => {
      setModalCountdown(2);
      countdownRef.current = setTimeout(() => {
        setModalCountdown(1);
        countdownRef.current = setTimeout(() => {
          setModalCountdown(0);
          googleLinkRef.current?.click();
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleCopyAndRedirect = async (targetUrl: string) => {
    if (countdownRef.current) clearTimeout(countdownRef.current);
    setIsRedirecting(true);
    await copyToClipboard(modalCopiedText);

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        slug: business.slug,
        businessId: business.id,
        eventType: "GOOGLE_REDIRECT",
        rating: rating || 5,
      }),
    }).catch(() => {});

    window.open(targetUrl, '_self');
  };

  const handleCloseCopyModal = () => {
    if (countdownRef.current) clearTimeout(countdownRef.current);
    setIsRedirecting(false);
    setModalCountdown(0);
    setShowCopyModal(false);
  };

  const handleReCopyInModal = async () => {
    if (countdownRef.current) clearTimeout(countdownRef.current);
    setIsRedirecting(false);
    await copyToClipboard(modalCopiedText);
    setModalReCopied(true);
    setTimeout(() => setModalReCopied(false), 2000);
  };

  const isPositive = rating >= 4;
  const isNeedsImprovement = rating > 0 && rating < 4;

  const getWhatsAppUrl = () => {
    if (!business.whatsapp) return null;
    const digits = business.whatsapp.replace(/\D/g, "");
    if (!digits) return null;
    const fullNumber = digits.length === 10 ? `91${digits}` : digits;
    return `https://wa.me/${fullNumber}?text=${encodeURIComponent(`Hi ${business.name}, I visited your store today!`)}`;
  };

  const getPhoneUrl = () => {
    if (!business.phone) return null;
    const clean = business.phone.replace(/[^0-9+]/g, "");
    return clean ? `tel:${clean}` : null;
  };

  const whatsappUrl = getWhatsAppUrl();
  const phoneUrl = getPhoneUrl();

  return (
    <div className="w-full max-w-lg mx-auto min-h-screen sm:min-h-0 text-slate-100 flex flex-col justify-between p-3.5 sm:p-6 pb-16 transition-all relative">
      {/* Ambient Top Glow */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ backgroundColor: business.primaryColor || "#4f46e5" }}
      />

      <div className="space-y-4 sm:space-y-5 relative z-10">
        {/* ─── STORE PROFILE CARD ───────────────────────────────────────────── */}
        <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl text-center">
          <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-3">
            <div
              className="w-full h-full rounded-2xl bg-white border-2 flex items-center justify-center p-2 overflow-hidden shadow-lg"
              style={{ borderColor: business.primaryColor || "#4f46e5" }}
            >
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span
                  className="text-2xl sm:text-3xl font-black"
                  style={{ color: business.primaryColor || "#4f46e5" }}
                >
                  {business.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1 rounded-full shadow border-2 border-slate-900">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {business.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-sm mx-auto font-medium leading-relaxed">
            {business.tagline || "Review our service & share your honest experience!"}
          </p>

          {/* Address & Category Pill */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5">
            {business.category && (
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {business.category}
              </span>
            )}
            {business.googleAddress && (
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/60 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate max-w-[200px]">{business.googleAddress}</span>
              </span>
            )}
          </div>

          {/* Quick Contact Buttons */}
          {(whatsappUrl || phoneUrl || business.website || business.instagram) && (
            <div className="flex items-center justify-center gap-2 mt-4 pt-3.5 border-t border-slate-800">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}
              {phoneUrl && (
                <a
                  href={phoneUrl}
                  className="px-3 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-400 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Store</span>
                </a>
              )}
              {business.website && (
                <a
                  href={business.website.startsWith("http") ? business.website : `https://${business.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Website</span>
                </a>
              )}
              {business.instagram && (
                <a
                  href={`https://instagram.com/${business.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-400 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* ─── STAR RATING SECTION ──────────────────────────────────────────── */}
        <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl text-center space-y-3">
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
            How was your visit today?
          </h2>
          <p className="text-xs text-slate-400">
            Tap the stars to rate your experience
          </p>

          <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none transform transition-transform active:scale-90 hover:scale-125"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`w-10 h-10 sm:w-11 sm:h-11 transition-all ${
                    (hoverRating || rating) >= star
                      ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_14px_rgba(251,191,36,0.7)] scale-105"
                      : "text-slate-700 hover:text-slate-500"
                  }`}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <div className="pt-1 text-xs font-bold animate-fadeIn">
              {rating === 5 && (
                <span className="text-amber-300 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
                  🌟 Exceptional! Tap below to post on Google in 1 tap
                </span>
              )}
              {rating === 4 && (
                <span className="text-amber-300 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
                  ⭐ Great experience! Help us spread the word on Google
                </span>
              )}
              {rating <= 3 && (
                <span className="text-amber-300 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
                  🤝 We value your honesty! Send a direct note or review on Google
                </span>
              )}
            </div>
          )}
        </div>

        {/* ─── 1-3 STARS: TRANSPARENT RESOLUTION (100% GOOGLE POLICY COMPLIANT) ─ */}
        {isNeedsImprovement && (
          <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-amber-500/30 shadow-2xl animate-fadeIn space-y-4">
            {feedbackSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/40">
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Message Delivered Directly to Store Management
                </h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Thank you for your honesty. Your note has been securely forwarded to management so we can address this directly with you.
                </p>
                <div className="pt-3 flex flex-col sm:flex-row gap-2 justify-center">
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat with Manager on WhatsApp
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleOpenCopyModal(feedbackComments)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition"
                  >
                    <span>Also Share on Google</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    Direct Feedback Resolution
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    How can we make things right for you?
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    We take every customer seriously. You can message the store owner directly, or continue to leave your public review on Google.
                  </p>
                </div>

                {/* Direct to Owner Form */}
                <form onSubmit={handleFeedbackSubmit} className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Send a private note to store management:
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={feedbackComments}
                      onChange={(e) => setFeedbackComments(e.target.value)}
                      placeholder="Tell the owner what happened so they can help resolve this..."
                      className="w-full text-xs p-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your Name (optional)"
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
                    />
                    <input
                      type="text"
                      value={customerContact}
                      onChange={(e) => setCustomerContact(e.target.value)}
                      placeholder="Mobile / Email (for callback)"
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={feedbackSubmitting || !feedbackComments.trim()}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
                  >
                    {feedbackSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Send Note to Store Management
                      </>
                    )}
                  </button>
                </form>

                {/* Google Policy Non-Gated Public Option */}
                <div className="pt-2 text-center border-t border-slate-800">
                  <p className="text-[11px] text-slate-400 mb-2">
                    Prefer to post your review publicly on Google?
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenCopyModal(feedbackComments || `Review for ${business.name}`)}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>Continue Directly to Google Review</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── 4-5 STARS: AI-ASSISTED REVIEW COMPOSER ──────────────────────── */}
        {isPositive && (
          <div ref={reviewSectionRef} className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-amber-400/30 shadow-2xl animate-fadeIn space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    Smart AI Review Assistant
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Authentic review suggestions you can edit or customize
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={triggerAiGeneration}
                disabled={isGenerating}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Regenerate with AI</span>
              </button>
            </div>

            {/* Compliment Tags */}
            <div>
              <span className="text-[11px] font-bold text-slate-300 block mb-2">
                What did you like most? (Tap chips to update review)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {tagsList.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-all font-semibold flex items-center gap-1 ${
                        active
                          ? "bg-amber-400 text-slate-950 shadow-md scale-105"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                      }`}
                    >
                      <span>{active ? "✓" : "+"}</span>
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Specific Note */}
            <div>
              <input
                type="text"
                value={customNote}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder={industry.placeholder}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Review Draft Choices */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[11px] font-bold text-slate-300 block">
                Choose a style or customize below:
              </span>

              {isGenerating ? (
                <div className="p-8 text-center space-y-2 bg-slate-800/80 rounded-2xl border border-slate-700">
                  <Loader2 className="w-6 h-6 text-amber-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-300 font-medium">
                    Gemini AI is crafting authentic review variations...
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1.5">
                  {reviewOptions.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(opt)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? "border-amber-400 bg-amber-400/15 text-white font-bold shadow"
                            : "border-slate-800 bg-slate-800/50 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <span className="text-[10px] block truncate">{opt.tone}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Interactive Editable Review Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-400/40 space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  Your Review Draft (Tap to edit or add details)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {editableDraftText.length} chars
                </span>
              </div>

              <textarea
                rows={4}
                value={editableDraftText}
                onChange={(e) => setEditableDraftText(e.target.value)}
                placeholder="Type or edit your review here..."
                className="w-full text-xs p-3 rounded-xl bg-slate-900 border border-slate-700 text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-400 font-sans"
              />

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Ready to copy
                </span>
                <span>You can edit this anytime before posting</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleOpenCopyModal(editableDraftText)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-amber-950/60 transition transform active:scale-98 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Review &amp; Post on Google</span>
                <ExternalLink className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center text-slate-400 font-medium mt-2">
                ⚡ 1 Tap automatically copies your review &amp; opens Google review composer!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden anchor for programmatic navigation */}
      <a
        ref={googleLinkRef}
        href={googleUrl}
        className="sr-only"
        aria-hidden
        tabIndex={-1}
      >
        Open Google
      </a>

      {/* ─── FOOTER BRANDING ──────────────────────────────────────────────── */}
      <div className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-1 relative z-10">
        Powered by <span className="font-bold text-slate-300">ReviewSmart AI</span>
        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
      </div>

      {/* ─── CELEBRATION MODAL ────────────────────────────────────────────── */}
      {showCopyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-400/70 rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl relative text-center">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseCopyModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Celebration Icon */}
            <div className="w-16 h-16 rounded-full bg-amber-400/15 border-2 border-amber-400 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-400/20">
              <Sparkles className="w-8 h-8 animate-bounce" />
            </div>

            <h3 className="text-xl font-black text-white tracking-tight">
              Review Copied! 🎉
            </h3>
            <p className="text-xs text-emerald-400 font-bold mt-0.5 flex items-center justify-center gap-1.5">
              {isRedirecting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Opening Google Review Page Automatically...</span>
                </>
              ) : (
                <span>Ready to Paste on Google!</span>
              )}
            </p>

            {/* Copied Review Snippet Box */}
            <div
              onClick={handleReCopyInModal}
              className="my-4 p-3.5 rounded-2xl bg-slate-950/90 border border-slate-700 hover:border-amber-400/50 text-left relative cursor-pointer transition active:scale-98"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                  ★★★★★ {rating >= 4 ? "5-Star" : "Your"} Review Draft
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReCopyInModal();
                  }}
                  className="text-[10px] font-bold text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-md"
                >
                  {modalReCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Re-Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic max-h-32 overflow-y-auto select-all">
                &ldquo;{modalCopiedText}&rdquo;
              </p>
            </div>

            {/* 3-Step Clear Action Instructions */}
            <div className="space-y-2 text-left bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60 mb-5">
              <div className="flex items-start gap-2.5 text-xs">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px] border border-emerald-500/30">
                  ✓
                </div>
                <p className="text-slate-200">
                  <strong className="text-white">Review copied</strong> to your clipboard automatically ✅
                </p>
              </div>
              <div className="flex items-start gap-2.5 text-xs">
                <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </div>
                <p className="text-slate-200">
                  Tap the button below &darr; &rarr; <strong className="text-white">Google review page opens</strong>
                </p>
              </div>
              <div className="flex items-start gap-2.5 text-xs">
                <div className="w-5 h-5 rounded-full bg-indigo-500 text-white font-black flex items-center justify-center shrink-0 text-[11px]">
                  3
                </div>
                <div className="space-y-2 flex-1">
                  <p className="text-slate-200 font-semibold">
                    In Google: select <strong className="text-amber-300">&#x2B50;&#x2B50;&#x2B50;&#x2B50;&#x2B50;</strong> &rarr; tap <strong className="text-amber-300">Post</strong>
                  </p>
                  <div className="w-full bg-gradient-to-r from-amber-500/20 to-amber-400/10 border-2 border-amber-400/60 rounded-xl px-3 py-2.5 flex items-start gap-2">
                    <span className="text-xl leading-none shrink-0">📋</span>
                    <div>
                      <p className="text-xs font-black text-amber-300 leading-snug">
                        {isIOS ? "📱 iPhone:" : "📱 Android:"} Tap inside the review text box &rarr; {isIOS ? "tap \"Paste\" on the popup" : "long-press → tap \"Paste\""}
                      </p>
                      <p className="text-[11px] text-white/80 font-bold mt-0.5">
                        ✨ Your review fills in instantly!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main CTA */}
            <a
              href={googleUrl}
              onClick={async (e) => {
                e.preventDefault();
                if (countdownRef.current) clearTimeout(countdownRef.current);
                await copyToClipboard(modalCopiedText);
                window.open(googleUrl, '_self');
              }}
              className="w-full py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl transition transform active:scale-98 cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.665-5.2 3.665-9.12z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.43 7.37 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.28 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
              </svg>
              <span>
                {modalCountdown > 0
                  ? `Opening Google in ${modalCountdown}...`
                  : 'Tap Here → Open Google & Paste Review'}
              </span>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </a>

            {/* Google Maps App Option */}
            {mapsAppUrl && (
              <button
                type="button"
                onClick={() => handleCopyAndRedirect(mapsAppUrl)}
                className="w-full mt-2.5 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold transition flex items-center justify-center gap-1"
              >
                <span>Or open in Google Maps App &rarr;</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCloseCopyModal}
              className="mt-3 text-xs text-slate-400 hover:text-slate-200 transition font-medium"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
