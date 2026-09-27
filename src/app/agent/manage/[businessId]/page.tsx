"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Store,
  Printer,
  Settings,
  Send,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Save,
  Loader2,
  Phone,
  MessageCircle,
  Globe,
  Instagram,
  MapPin,
  Star,
  RefreshCw,
  Image as ImageIcon,
  Tag,
  CreditCard,
  FileText,
} from "lucide-react";
import PrintStudioClient from "@/components/studio/PrintStudioClient";
import { copyToClipboard } from "@/lib/clipboard";
import { getAppUrl } from "@/lib/utils";

interface BusinessData {
  id: string;
  userId: string;
  name: string;
  slug: string;
  tagline: string | null;
  category: string | null;
  logoUrl: string | null;
  primaryColor: string;
  googlePlaceId: string | null;
  googleReviewUrl: string | null;
  googleAddress: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  website: string | null;
  minRatingForGoogle: number;
  keywords: string;
  tagChips: string;
  reviewPromptTone: string;
  isPaid: boolean;
  customerType: string;
  user?: {
    name: string | null;
    phone: string | null;
    userIdTag: string | null;
  };
}

export default function AgentManageMerchantPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = (params?.businessId as string) || "";

  const [activeTab, setActiveTab] = useState<"profile" | "studio" | "whatsapp">("profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [business, setBusiness] = useState<BusinessData | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    category: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    website: "",
    googleReviewUrl: "",
    googleAddress: "",
    keywords: "",
    tagChips: "",
    reviewPromptTone: "friendly",
    logoUrl: "",
    primaryColor: "#4f46e5",
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // WhatsApp Tab State
  const [waRecipient, setWaRecipient] = useState("");
  const [copiedWaMessage, setCopiedWaMessage] = useState(false);

  useEffect(() => {
    if (!businessId) return;

    async function loadBusiness() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/business/${businessId}`);
        const data = await res.json();

        if (!res.ok || !data.business) {
          setError(data.error || "Failed to load merchant business details");
          return;
        }

        const b: BusinessData = data.business;
        setBusiness(b);
        setFormData({
          name: b.name || "",
          tagline: b.tagline || "",
          category: b.category || "",
          phone: b.phone || "",
          whatsapp: b.whatsapp || "",
          instagram: b.instagram || "",
          website: b.website || "",
          googleReviewUrl: b.googleReviewUrl || "",
          googleAddress: b.googleAddress || "",
          keywords: b.keywords || "",
          tagChips: b.tagChips || "",
          reviewPromptTone: b.reviewPromptTone || "friendly",
          logoUrl: b.logoUrl || "",
          primaryColor: b.primaryColor || "#4f46e5",
        });

        // Set initial WhatsApp recipient from merchant phone or WhatsApp
        const cleanPhone = (b.whatsapp || b.phone || "").replace(/[^0-9]/g, "");
        setWaRecipient(cleanPhone.length >= 10 ? cleanPhone.slice(-10) : cleanPhone);
      } catch (err: any) {
        setError(err.message || "Network error loading merchant");
      } finally {
        setLoading(false);
      }
    }

    loadBusiness();
  }, [businessId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/business/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || "Failed to update profile");
        return;
      }

      setSaveSuccess(true);
      if (data.business) {
        setBusiness((prev) => (prev ? { ...prev, ...data.business } : data.business));
      }
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setSaveError(err.message || "Failed to save profile changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-400 mb-4" />
        <h2 className="text-base font-bold text-slate-200">Loading Merchant Workspace...</h2>
        <p className="text-xs text-slate-400 mt-1">Fetching business profile, brand assets, and print configurations.</p>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied or Not Found</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            {error || "This merchant could not be found or you do not have permission to manage this business profile."}
          </p>
          <Link
            href="/agent"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Agent Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const appUrl = typeof window !== "undefined" ? window.location.origin : getAppUrl();
  const reviewUrl = `${appUrl}/r/${business.slug}`;

  // WhatsApp Message Generator
  const waMessage = `✨ *Namaste ${formData.name || business.name}!*

Your SmartReview AI Review Kit is ready! 🚀

⭐ *1. Live Review Card (Instant Customer Link):*
${reviewUrl}
*(Share via WhatsApp or display QR on your counter)*

🖨️ *2. Your Print-Ready Display Formats:*
• 4"×6" Countertop Acrylic Standee
• Vertical PVC Pocket/Counter Card
• A4 Wall & Door Printable Poster

🔐 *3. Merchant Login Portal:*
${appUrl}/login
*Mobile:* ${business.phone || waRecipient || "Your registered mobile"}

Need changes, custom colors, or reprints? Contact your ReviewSmart marketing agent anytime!`;

  const waSendUrl = `https://wa.me/91${waRecipient.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/agent"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Return to Agent Portal"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <Store className="w-3.5 h-3.5" /> Agent Merchant Workspace
              </span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  business.isPaid
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                {business.isPaid ? "● Active & Verified" : "⏳ Pending Payment"}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-white truncate max-w-xs sm:max-w-md">
              {business.name}
            </h1>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <a
            href={reviewUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition border border-slate-700"
          >
            <span>Live Card</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          {business.googleReviewUrl && (
            <a
              href={business.googleReviewUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold items-center gap-1.5 transition border border-slate-700"
            >
              <span>Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          )}
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>1. Merchant Profile &amp; Branding</span>
          </button>

          <button
            onClick={() => setActiveTab("studio")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "studio"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>2. Design &amp; Print Studio (300 DPI)</span>
          </button>

          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "whatsapp"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Send className="w-4 h-4 text-emerald-400" />
            <span>3. 1-Click WhatsApp Delivery</span>
          </button>
        </div>

        {/* Tab 1: Merchant Profile & Branding */}
        {activeTab === "profile" && (
          <div className="mt-6 max-w-4xl">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Store className="w-5 h-5 text-indigo-400" />
                    Edit Merchant Details
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Update business information, category, Google Maps links, and logo. All updates reflect instantly on the merchant&apos;s live review card and print kits.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Card Slug:</span>
                  <code className="text-xs bg-slate-950 px-2.5 py-1 rounded-lg text-indigo-300 font-mono border border-slate-800">
                    /r/{business.slug}
                  </code>
                </div>
              </div>

              {saveSuccess && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Merchant details successfully saved and updated across all systems!</span>
                </div>
              )}

              {saveError && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Business Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="e.g. Sri Guru Fashions"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Business Category / Niche
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="e.g. Clothing Store, Dental Clinic, Cafe"
                    />
                  </div>
                </div>

                {/* Tagline */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange("tagline", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                    placeholder="e.g. Premier Clothing Store in Kadapa · Exclusive Menswear"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Appears directly under the store name on both the review page and printable standees.
                  </p>
                </div>

                {/* Logo & Brand Color */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                      Merchant Logo Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.logoUrl}
                      onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="https://.../logo.png (Supports square, wide, transparent PNG/PSD)"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Our new adaptive logo engine preserves natural aspect ratios (wide banners, badges, square logos) without ugly cropping.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Logo Preview
                    </label>
                    <div className="w-full h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden p-2">
                      {formData.logoUrl ? (
                        <img
                          src={formData.logoUrl}
                          alt="Logo Preview"
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="text-[11px] text-slate-600">No Logo Provided</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Google Maps & Review Destination */}
                <div className="space-y-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <h3 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    Google Maps Review Destination
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Direct Google Review URL <span className="text-rose-400">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.googleReviewUrl}
                        onChange={(e) => handleInputChange("googleReviewUrl", e.target.value)}
                        required
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                        placeholder="https://g.page/r/.../review or https://maps.app.goo.gl/..."
                      />
                      {formData.googleReviewUrl && (
                        <a
                          href={formData.googleReviewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition border border-slate-700 shrink-0"
                        >
                          <span>Test</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Physical Store Address
                    </label>
                    <textarea
                      rows={2}
                      value={formData.googleAddress}
                      onChange={(e) => handleInputChange("googleAddress", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="e.g. 42/350-3, beside MJ Kunta Shivalayam Temple, Bhagya Nagar Colony, Kadapa, AP 516001"
                    />
                  </div>
                </div>

                {/* Contact & Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="+91 95536 66836"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="9553666836"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-pink-400" />
                      Instagram Handle
                    </label>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange("instagram", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="@srigurufashions"
                    />
                  </div>
                </div>

                {/* AI Review Keywords & Tags */}
                <div className="space-y-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <h3 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    AI Review Generation Optimization
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      Customer Tag Chips (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tagChips}
                      onChange={(e) => handleInputChange("tagChips", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="Exclusive Menswear, Best Quality Fabrics, Reasonable Pricing, Friendly Staff"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      SEO Keywords for AI Review Engine
                    </label>
                    <input
                      type="text"
                      value={formData.keywords}
                      onChange={(e) => handleInputChange("keywords", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="best clothing store kadapa, wedding suits, shirts, top quality menswear"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Profile &amp; Apply Everywhere</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: Design & Print Studio */}
        {activeTab === "studio" && (
          <div className="mt-6">
            <PrintStudioClient
              business={business}
              reviewUrl={reviewUrl}
              agentMode={true}
              merchantInfo={{
                name: business.user?.name || business.name,
                phone: business.phone || business.whatsapp || undefined,
              }}
            />
          </div>
        )}

        {/* Tab 3: 1-Click WhatsApp Delivery Suite */}
        {activeTab === "whatsapp" && (
          <div className="mt-6 max-w-3xl">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] border border-emerald-500/30 mb-2 inline-block">
                    ⚡ Agent Field Dispatch
                  </span>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Send className="w-5 h-5 text-emerald-400" />
                    1-Click WhatsApp Review Kit Delivery
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Send the merchant their live review card, print download instructions, and login credentials in 1 click.
                  </p>
                </div>
              </div>

              {/* Recipient Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  Merchant WhatsApp Number (10 digits)
                </label>
                <div className="flex gap-2">
                  <div className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-400 flex items-center">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={waRecipient}
                    onChange={(e) => setWaRecipient(e.target.value.replace(/[^0-9]/g, ""))}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition font-mono font-bold tracking-wider"
                    placeholder="9553666836"
                  />
                </div>
              </div>

              {/* Message Preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Formatted WhatsApp Message Preview
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      copyToClipboard(waMessage);
                      setCopiedWaMessage(true);
                      setTimeout(() => setCopiedWaMessage(false), 2500);
                    }}
                    className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition"
                  >
                    {copiedWaMessage ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {waMessage}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={waSendUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition transform active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Open &amp; Dispatch in WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    copyToClipboard(reviewUrl);
                    alert("Copied live review link to clipboard!");
                  }}
                  className="py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
                >
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Live Link Only</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
