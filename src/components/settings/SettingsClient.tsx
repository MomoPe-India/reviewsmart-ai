"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  Store,
  Sparkles,
  ShieldCheck,
  Globe,
  Palette,
  Check,
  AlertCircle,
  ExternalLink,
  Upload,
  Camera,
} from "lucide-react";

interface BusinessData {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  logoUrl: string | null;
  primaryColor: string;
  googlePlaceId: string | null;
  googleReviewUrl: string | null;
  googleAddress: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  website: string | null;
  minRatingForGoogle: number;
  keywords: string;
  tagChips: string;
  reviewPromptTone: string;
}

export default function SettingsClient({ business }: { business: BusinessData }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: business.name || "",
    slug: business.slug || "",
    tagline: business.tagline || "",
    logoUrl: business.logoUrl || "",
    primaryColor: business.primaryColor || "#4f46e5",
    googlePlaceId: business.googlePlaceId || "",
    googleReviewUrl: business.googleReviewUrl || "",
    phone: business.phone || "",
    whatsapp: business.whatsapp || "",
    instagram: business.instagram || "",
    facebook: business.facebook || "",
    website: business.website || "",
    minRatingForGoogle: business.minRatingForGoogle ?? 4,
    keywords: business.keywords || "",
    tagChips: business.tagChips || "",
    reviewPromptTone: business.reviewPromptTone || "friendly",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Please upload an image smaller than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          setForm((prev) => ({ ...prev, logoUrl: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");

    try {
      const res = await fetch(`/api/business/${business.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update business settings");
      } else {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Settings saved successfully! Changes are live on your review card.
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          {error}
        </div>
      )}

      {/* 1. Brand & Card Basics */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Store className="w-4 h-4 text-indigo-600" />
          Card Profile &amp; Branding
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Review Card URL Slug *
            </label>
            <div className="flex items-center">
              <span className="text-xs text-slate-400 bg-slate-50 border border-r-0 border-slate-200 px-2.5 py-2.5 rounded-l-xl font-mono">
                /r/
              </span>
              <input
                type="text"
                required
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="w-full text-xs p-2.5 rounded-r-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tagline / Subheading
          </label>
          <input
            type="text"
            name="tagline"
            value={form.tagline}
            onChange={handleChange}
            placeholder="e.g. Artisanal bakery, organic brunch & handcrafted coffee"
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Business Logo / Avatar
              </label>
              <label className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer">
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Logo / Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                {form.logoUrl ? (
                  <img
                    src={form.logoUrl}
                    alt={form.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-base font-black text-indigo-600">
                    {form.name.slice(0, 2).toUpperCase() || "RS"}
                  </span>
                )}
              </div>
              <div className="text-[11px] leading-snug flex-1">
                {form.logoUrl ? (
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Custom Logo Set
                    </span>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, logoUrl: "" }))}
                      className="text-[10px] text-red-500 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <span className="text-slate-500">
                    No logo set. Tap &apos;Upload Logo / Photo&apos; to add your store logo or snap a store board photo.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="primaryColor"
                value={form.primaryColor}
                onChange={handleChange}
                className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-1"
              />
              <span className="text-xs font-mono uppercase text-slate-600">
                {form.primaryColor}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Google Review Routing & Place Setup */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-600" />
          Google Review Target Link
        </h2>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Google Review Direct Link (or Write Review URL)
          </label>
          <input
            type="url"
            name="googleReviewUrl"
            value={form.googleReviewUrl}
            onChange={handleChange}
            placeholder="https://search.google.com/local/writereview?placeid=ChIJ..."
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            💡 When a customer clicks "Copy &amp; Post on Google", they will be taken straight to this submission dialog.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Google Place ID (optional fallback)
          </label>
          <input
            type="text"
            name="googlePlaceId"
            value={form.googlePlaceId}
            onChange={handleChange}
            placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
          />
        </div>
      </div>

      {/* 3. Negative Review Shield Threshold */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          Negative Review Shield Threshold
        </h2>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Minimum Rating Required to Send Customer to Google:
          </label>
          <select
            name="minRatingForGoogle"
            value={form.minRatingForGoogle}
            onChange={handleChange}
            className="w-full max-w-xs text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-semibold"
          >
            <option value={4}>4 Stars (Recommended: 1-3 stars go to Private Shield)</option>
            <option value={5}>5 Stars Only (1-4 stars go to Private Shield)</option>
            <option value={3}>3 Stars (1-2 stars go to Private Shield)</option>
          </select>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Ratings lower than this threshold will instantly trigger the direct management feedback form, keeping bad ratings off Google.
          </p>
        </div>
      </div>

      {/* 4. AI Prompting, Tone & SEO Keywords */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          AI Review Generation &amp; SEO Keywords
        </h2>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Interactive Customer Tag Chips (comma separated)
          </label>
          <input
            type="text"
            name="tagChips"
            value={form.tagChips}
            onChange={handleChange}
            placeholder="Friendly Staff, Fast Service, Great Quality, Fair Pricing, Clean Ambiance"
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            These are the quick pills customers tap on their phone when leaving a positive review.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Local SEO Keywords to Weave In (comma separated)
          </label>
          <textarea
            rows={2}
            name="keywords"
            value={form.keywords}
            onChange={handleChange}
            placeholder="best brunch downtown, freshly baked sourdough, specialty coffee, friendly staff, cozy ambiance"
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Gemini AI will subtly weave these phrases into the generated 5-star reviews to boost your Google Maps ranking.
          </p>
        </div>

        <div className="max-w-xs">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            AI Review Tone
          </label>
          <select
            name="reviewPromptTone"
            value={form.reviewPromptTone}
            onChange={handleChange}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="friendly">Friendly &amp; Warm</option>
            <option value="enthusiastic">Enthusiastic &amp; Excited</option>
            <option value="professional">Polite &amp; Professional</option>
            <option value="brief">Short &amp; Punchy</option>
          </select>
        </div>
      </div>

      {/* 5. Direct Contact & Social Links (Strictly WhatsApp, Instagram & Website) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-4 h-4 text-indigo-600" />
            Direct Contact &amp; Social Links
          </h2>
          <p className="text-[11px] text-slate-500 mt-1">
            Only links provided below will appear as highlighted action icons on your customer review page. Leave empty to hide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              WhatsApp (Number or Link)
            </label>
            <input
              type="text"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="e.g. 9876543210 or https://wa.me/919876543210"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Direct 1-tap chat button for customers.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Instagram Profile (@handle or URL)
            </label>
            <input
              type="text"
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              placeholder="e.g. @mybusiness or https://instagram.com/mybusiness"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Grows your Instagram following directly from the review page.
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Website URL
          </label>
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="https://mybusiness.com"
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Direct link to your official menu, store, or website.
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-100 transition disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Card &amp; SEO Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
}
