"use client";

import React, { useState, useEffect } from "react";
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
  ChevronRight,
  Share2,
} from "lucide-react";

interface BusinessData {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  logoUrl: string | null;
  primaryColor: string;
  googleReviewUrl: string | null;
  googlePlaceId: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  website: string | null;
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

  // Negative shield state
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [feedbackComments, setFeedbackComments] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Positive flow state
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reviewOptions, setReviewOptions] = useState<ReviewOption[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  // Wow Pop-up Modal state
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [modalCopiedText, setModalCopiedText] = useState("");
  const [modalReCopied, setModalReCopied] = useState(false);

  // Parse tag chips
  const tagsList = (business.tagChips || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // Resolved Google URL
  const googleUrl =
    business.googleReviewUrl ||
    (business.googlePlaceId
      ? `https://search.google.com/local/writereview?placeid=${business.googlePlaceId}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name)}`);

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

  const handleRatingClick = async (star: number) => {
    setRating(star);

    // Track rating selection
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

    // If 4 or 5 stars, auto-generate initial suggestions if none exist
    if (star >= business.minRatingForGoogle && reviewOptions.length === 0) {
      triggerAiGeneration([]);
    }
  };

  const toggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(next);
    triggerAiGeneration(next);
  };

  const triggerAiGeneration = async (tagsToUse: string[] = selectedTags) => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          slug: business.slug,
          businessName: business.name,
          selectedTags: tagsToUse,
          customNote,
        }),
      });
      const data = await res.json();
      if (data.reviews && data.reviews.length > 0) {
        setReviewOptions(data.reviews);
        setSelectedOptionId(data.reviews[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

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
          slug: business.slug,
          rating,
          customerName,
          customerEmail: customerContact.includes("@") ? customerContact : undefined,
          customerPhone: !customerContact.includes("@") ? customerContact : undefined,
          comments: feedbackComments,
        }),
      });

      if (res.ok) {
        setFeedbackSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // Trigger Wow Modal & Copy
  const handleOpenCopyModal = async (customText?: string) => {
    const selected = reviewOptions.find((r) => r.id === selectedOptionId) || reviewOptions[0];
    const textToCopy =
      customText || (selected ? selected.text : "Great experience at " + business.name + "! Highly recommended.");

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Clipboard copy error:", err);
    }

    setModalCopiedText(textToCopy);
    setShowCopyModal(true);

    // Celebratory Confetti!
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#4f46e5", "#10b981", "#ef4444", "#3b82f6"],
      });
    } catch {}
  };

  const handleReCopyInModal = async () => {
    try {
      await navigator.clipboard.writeText(modalCopiedText);
      setModalReCopied(true);
      setTimeout(() => setModalReCopied(false), 2000);
    } catch (err) {
      console.error("Re-copy error:", err);
    }
  };

  const isPositive = rating >= business.minRatingForGoogle;
  const isNegative = rating > 0 && rating < business.minRatingForGoogle;

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 pb-12 transition-all relative overflow-hidden">
      {/* Ambient Brand Background Glow */}
      <div
        className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ backgroundColor: business.primaryColor || "#f59e0b" }}
      />
      <div className="absolute top-1/2 -right-32 w-72 h-72 rounded-full blur-3xl opacity-20 bg-amber-500 pointer-events-none" />

      {/* Business Header Card */}
      <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-700/80 flex flex-col items-center text-center relative overflow-hidden z-10">
        {/* Top Gold Accent Bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: business.primaryColor || "#f59e0b" }}
        />

        {/* Verified Google Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-bold tracking-wider uppercase mb-3">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Verified Google Partner Merchant</span>
        </div>

        {/* Logo */}
        <div className="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-amber-400/40 flex items-center justify-center p-2 shadow-xl mb-3 overflow-hidden">
          {business.logoUrl ? (
            <img
              src={business.logoUrl}
              alt={business.name}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <span className="text-2xl font-black text-amber-400">
              {business.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        {/* Name & Tagline */}
        <div className="flex items-center gap-1.5 justify-center">
          <h1 className="text-xl font-black text-white tracking-tight">{business.name}</h1>
          <ShieldCheck className="w-5 h-5 text-amber-400 fill-amber-400/20" />
        </div>
        <p className="text-xs text-slate-300 mt-1 max-w-xs font-medium">
          {business.tagline || "Thank you for visiting! We value your feedback."}
        </p>

        {/* Social / Direct Links */}
        {(() => {
          let formattedWhatsApp: string | null = null;
          if (business.whatsapp && business.whatsapp.trim()) {
            const val = business.whatsapp.trim();
            if (val.startsWith("http://") || val.startsWith("https://")) {
              formattedWhatsApp = val;
            } else {
              const digits = val.replace(/\D/g, "");
              if (digits) {
                const waNum = digits.length === 10 ? `91${digits}` : digits;
                formattedWhatsApp = `https://wa.me/${waNum}`;
              }
            }
          }

          let formattedInstagram: string | null = null;
          if (business.instagram && business.instagram.trim()) {
            const val = business.instagram.trim();
            if (val.startsWith("http://") || val.startsWith("https://")) {
              formattedInstagram = val;
            } else {
              const handle = val.replace(/^@/, "").trim();
              if (handle) {
                formattedInstagram = `https://instagram.com/${handle}`;
              }
            }
          }

          let formattedWebsite: string | null = null;
          if (business.website && business.website.trim()) {
            const val = business.website.trim();
            formattedWebsite = val.startsWith("http://") || val.startsWith("https://") ? val : `https://${val}`;
          }

          const hasSocial = Boolean(formattedWhatsApp || formattedInstagram || formattedWebsite);
          if (!hasSocial) return null;

          return (
            <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-slate-700/60 w-full">
              {formattedWhatsApp && (
                <a
                  href={formattedWhatsApp}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Chat on WhatsApp"
                  title="Chat on WhatsApp"
                  className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-emerald-950/50 hover:scale-110 active:scale-95 transition-all"
                >
                  <MessageSquare className="w-4 h-4 fill-white/20" />
                </a>
              )}
              {formattedInstagram && (
                <a
                  href={formattedInstagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Follow on Instagram"
                  title="Follow on Instagram"
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-lg shadow-pink-950/50 hover:scale-110 active:scale-95 transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {formattedWebsite && (
                <a
                  href={formattedWebsite}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Visit Website"
                  title="Visit Website"
                  className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-950/50 hover:scale-110 active:scale-95 transition-all"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          );
        })()}
      </div>

      {/* Main Experience Flow */}
      <div className="mt-4 flex-1 flex flex-col justify-start z-10">
        {/* Star Rating Section */}
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-slate-700/80 text-center">
          <h2 className="text-base font-bold text-white tracking-tight">
            How was your visit today?
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tap a star to rate your experience
          </p>

          <div className="flex items-center justify-center gap-2.5 mt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none transform transition active:scale-90 hover:scale-125"
              >
                <Star
                  className={`w-10 h-10 transition-all ${
                    (hoverRating || rating) >= star
                      ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                      : "text-slate-600"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <div className="mt-3 text-xs font-bold text-amber-300 animate-fadeIn">
              {rating === 5 && "🌟 Exceptional! Thank you for the 5-star love!"}
              {rating === 4 && "⭐ Great visit! Glad you enjoyed your time with us."}
              {rating === 3 && "Average. Tell our manager how we can improve."}
              {rating === 2 && "Disappointing. Please let our store manager make it right."}
              {rating === 1 && "Very poor. Management is ready to hear your complaint."}
            </div>
          )}
        </div>

        {/* 1-3 Stars: Negative Review Shield */}
        {isNegative && (
          <div className="mt-4 bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-amber-500/30 transition-all">
            {feedbackSubmitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/40">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Message Sent to Store Manager
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                  Thank you for letting us know. Your note has been delivered privately
                  to our store manager so we can fix this immediately.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 text-xs font-bold mb-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Private Resolution Shield
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    What can we do to make this right?
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Your note goes directly to our management, not to public Google.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    What went wrong? *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={feedbackComments}
                    onChange={(e) => setFeedbackComments(e.target.value)}
                    placeholder="Tell us about the issue so our manager can assist you..."
                    className="w-full text-xs p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Your Name (optional)
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Alex"
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone Number (optional)
                    </label>
                    <input
                      type="text"
                      value={customerContact}
                      onChange={(e) => setCustomerContact(e.target.value)}
                      placeholder="To follow up with you"
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={feedbackSubmitting || !feedbackComments.trim()}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 transition disabled:opacity-50"
                >
                  {feedbackSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Private Note to Manager
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* 4-5 Stars: AI Review Assistant Flow */}
        {isPositive && (
          <div className="mt-4 bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-amber-400/20 space-y-4">
            {/* Tag chips */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  What did you love? (Tap to include)
                </span>
                <span className="text-[11px] text-amber-400 font-bold">
                  {selectedTags.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tagsList.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-all font-semibold ${
                        active
                          ? "bg-amber-400 text-slate-950 shadow-md scale-105"
                          : "bg-slate-700/70 text-slate-300 hover:bg-slate-700 border border-slate-600"
                      }`}
                    >
                      {active ? "✓ " : "+ "}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Note */}
            <div>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Mention specific dishes or staff name (optional)..."
                className="w-full text-xs p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Regenerate Trigger */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => triggerAiGeneration()}
                disabled={isGenerating}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
              >
                {isGenerating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                Generate fresh drafts ✨
              </button>
            </div>

            {/* AI Generated Review Cards */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-200 block">
                Select your preferred 5-star review:
              </span>

              {isGenerating ? (
                <div className="p-6 text-center space-y-2 bg-slate-900/80 rounded-2xl border border-slate-700">
                  <Loader2 className="w-6 h-6 text-amber-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-300 font-medium">
                    AI is writing personalized 5-star drafts...
                  </p>
                </div>
              ) : (
                reviewOptions.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedOptionId(opt.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-950/40 ring-1 ring-amber-400"
                          : "border-slate-700 bg-slate-900/70 hover:border-slate-600 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "border-amber-400 bg-amber-400 text-slate-950"
                                : "border-slate-500 bg-slate-800"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-black text-white">
                            {opt.headline}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                          {opt.tone}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 pl-6 leading-relaxed font-normal">
                        "{opt.text}"
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => handleOpenCopyModal()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-amber-950/60 transition transform active:scale-98"
            >
              <Copy className="w-4 h-4" />
              <span>Copy &amp; Post on Google Reviews</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-center text-slate-400 font-medium">
              ⚡ Copies your chosen review and opens Google in 1 tap!
            </p>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-8 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1 z-10">
        Powered by <span className="font-bold text-slate-300">ReviewSmart AI</span>
        <Heart className="w-3 h-3 text-red-500 fill-red-500" />
      </div>

      {/* WOW POP-UP MODAL: Review Copied & Open Google */}
      {showCopyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-400/60 rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl relative text-center">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowCopyModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Celebration Icon */}
            <div className="w-16 h-16 rounded-full bg-amber-400/10 border-2 border-amber-400 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-400/20">
              <Sparkles className="w-8 h-8 animate-bounce" />
            </div>

            <h3 className="text-xl font-black text-white tracking-tight">
              Review Copied! 🎉
            </h3>
            <p className="text-xs text-amber-300 font-semibold mt-1">
              Step 1 of 2 Complete!
            </p>

            {/* Copied Quote Box */}
            <div className="my-4 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-700 text-left relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                  ★★★★★ 5-Star Draft
                </span>
                <button
                  type="button"
                  onClick={handleReCopyInModal}
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
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "{modalCopiedText}"
              </p>
            </div>

            {/* 2-Step Action Instructions */}
            <div className="space-y-2 text-left bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 mb-5">
              <div className="flex items-start gap-2 text-xs">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px] border border-emerald-500/30">
                  ✓
                </div>
                <p className="text-slate-200">
                  <strong className="text-white">Review is copied</strong> to your clipboard.
                </p>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  2
                </div>
                <p className="text-slate-200">
                  Tap below $\rightarrow$ Google opens $\rightarrow$ simply <strong className="text-amber-300">Paste &amp; Post</strong>!
                </p>
              </div>
            </div>

            {/* Big Unblockable Direct Google Button */}
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                fetch("/api/analytics/track", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    slug: business.slug,
                    businessId: business.id,
                    eventType: "GOOGLE_REDIRECT",
                    rating: 5,
                  }),
                }).catch(() => {});
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:opacity-95 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-950/60 transition transform active:scale-98"
            >
              {/* Google G Logo */}
              <svg className="w-5 h-5 bg-white p-0.5 rounded-full flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.665-5.2 3.665-9.12z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.43 7.37 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.28 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
              </svg>
              <span>Open Google Maps &amp; Paste Review</span>
              <ExternalLink className="w-4 h-4 opacity-90" />
            </a>

            <button
              type="button"
              onClick={() => setShowCopyModal(false)}
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
