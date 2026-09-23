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

  // Parse tag chips
  const tagsList = (business.tagChips || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

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

  const handleCopyAndRedirect = async () => {
    const selected = reviewOptions.find((r) => r.id === selectedOptionId) || reviewOptions[0];
    const textToCopy = selected ? selected.text : "Great experience! Highly recommended.";

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Clipboard copy error:", err);
    }

    // Track redirect
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

    // Open Google Review Link
    const googleUrl =
      business.googleReviewUrl ||
      (business.googlePlaceId
        ? `https://search.google.com/local/writereview?placeid=${business.googlePlaceId}`
        : `https://www.google.com/search?q=${encodeURIComponent(business.name + " reviews")}`);

    setTimeout(() => {
      window.open(googleUrl, "_blank", "noopener,noreferrer");
    }, 450);
  };

  const isPositive = rating >= business.minRatingForGoogle;
  const isNegative = rating > 0 && rating < business.minRatingForGoogle;

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 pb-12 transition-all">
      {/* Business Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-2"
          style={{ backgroundColor: business.primaryColor || "#4f46e5" }}
        />

        {/* Logo */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-50 to-slate-100 border border-slate-200 flex items-center justify-center p-2 shadow-inner mb-3 overflow-hidden">
          {business.logoUrl ? (
            <img
              src={business.logoUrl}
              alt={business.name}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <span className="text-2xl font-black text-indigo-600">
              {business.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        {/* Name & Tagline */}
        <div className="flex items-center gap-1.5 justify-center">
          <h1 className="text-xl font-bold text-slate-900">{business.name}</h1>
          <ShieldCheck className="w-5 h-5 text-indigo-500 fill-indigo-50" />
        </div>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          {business.tagline || "Thank you for visiting! We appreciate your support."}
        </p>

        {/* Social / Direct Links - Strictly WhatsApp, Instagram & Website (Only highlighted if updated) */}
        {(() => {
          // Format WhatsApp URL
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

          // Format Instagram URL
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

          // Format Website URL
          let formattedWebsite: string | null = null;
          if (business.website && business.website.trim()) {
            const val = business.website.trim();
            formattedWebsite = val.startsWith("http://") || val.startsWith("https://") ? val : `https://${val}`;
          }

          const hasSocial = Boolean(formattedWhatsApp || formattedInstagram || formattedWebsite);
          if (!hasSocial) return null;

          return (
            <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-slate-100 w-full animate-fadeIn">
              {formattedWhatsApp && (
                <a
                  href={formattedWhatsApp}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Chat on WhatsApp"
                  title="Chat on WhatsApp"
                  className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md shadow-emerald-200 hover:bg-[#20ba59] hover:scale-110 active:scale-95 transition-all"
                >
                  <MessageSquare className="w-5 h-5 fill-white/20" />
                </a>
              )}
              {formattedInstagram && (
                <a
                  href={formattedInstagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Follow on Instagram"
                  title="Follow on Instagram"
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-md shadow-pink-200 hover:opacity-90 hover:scale-110 active:scale-95 transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {formattedWebsite && (
                <a
                  href={formattedWebsite}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Visit Website"
                  title="Visit Website"
                  className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>
          );
        })()}
      </div>

      {/* Main Experience Flow */}
      <div className="mt-4 flex-1 flex flex-col justify-start">
        {/* Star Rating Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center">
          <h2 className="text-base font-semibold text-slate-800">
            How was your experience today?
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tap a star to rate your visit
          </p>

          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none transform transition active:scale-90 hover:scale-110"
              >
                <Star
                  className={`w-9 h-9 transition-colors ${
                    (hoverRating || rating) >= star
                      ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                      : "text-slate-200"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <div className="mt-2 text-xs font-medium text-slate-600 animate-fadeIn">
              {rating === 5 && "⭐ Exceptional! Thank you so much!"}
              {rating === 4 && "⭐ Great visit! Glad you enjoyed it."}
              {rating === 3 && "Average. Tell us how we can improve."}
              {rating === 2 && "Disappointing. We'd love to make it right."}
              {rating === 1 && "Very poor. Management wants to hear from you."}
            </div>
          )}
        </div>

        {/* 1-3 Stars: Negative Review Shield */}
        {isNegative && (
          <div className="mt-4 bg-white rounded-3xl p-6 shadow-sm border border-amber-100 transition-all">
            {feedbackSubmitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Feedback Received
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Thank you for letting us know. Your note has been delivered straight
                  to management so we can review and resolve this right away.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-medium mb-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Direct Message to Management
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    What can we do to make this right?
                  </h3>
                  <p className="text-xs text-slate-400">
                    Your feedback goes directly to our team, not to public Google.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    What went wrong? *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={feedbackComments}
                    onChange={(e) => setFeedbackComments(e.target.value)}
                    placeholder="Tell us about the issue or what we could have done better..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Your Name (optional)
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Alex"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Phone or Email (optional)
                    </label>
                    <input
                      type="text"
                      value={customerContact}
                      onChange={(e) => setCustomerContact(e.target.value)}
                      placeholder="To follow up with you"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={feedbackSubmitting || !feedbackComments.trim()}
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
                >
                  {feedbackSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Private Feedback to Owner
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* 4-5 Stars: AI Review Assistant Flow */}
        {isPositive && (
          <div className="mt-4 bg-white rounded-3xl p-6 shadow-sm border border-indigo-50 space-y-4">
            {/* Tag chips */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">
                  What did you like? (Tap to select)
                </span>
                <span className="text-[11px] text-indigo-600 font-medium">
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
                      className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium ${
                        active
                          ? "bg-indigo-600 text-white shadow-sm scale-105"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                placeholder="Any specific shout-out? (Optional)"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Regenerate Trigger */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => triggerAiGeneration()}
                disabled={isGenerating}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
              >
                {isGenerating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                Regenerate suggestions
              </button>
            </div>

            {/* AI Generated Review Cards */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-slate-700 block">
                Choose a ready-to-post review:
              </span>

              {isGenerating ? (
                <div className="p-6 text-center space-y-2 bg-slate-50 rounded-2xl border border-slate-100">
                  <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
                  <p className="text-xs text-slate-500">
                    Crafting personalized 5-star review options...
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
                          ? "border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500/20"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "border-indigo-600 bg-indigo-600 text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <span className="text-xs font-bold text-slate-800">
                            {opt.headline}
                          </span>
                        </div>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                          {opt.tone}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 pl-5 leading-relaxed">
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
              onClick={handleCopyAndRedirect}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-200 transition transform active:scale-98"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied! Opening Google...
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy & Post on Google Reviews
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-400">
              ⚡ Copies the review text to your clipboard &amp; opens Google directly.
            </p>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-8 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
        Powered by <span className="font-semibold text-slate-600">ReviewSmart AI</span>
        <Heart className="w-3 h-3 text-red-400 fill-red-400" />
      </div>
    </div>
  );
}
