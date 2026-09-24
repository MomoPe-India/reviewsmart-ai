"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Store,
  Globe,
  Sparkles,
  ShieldCheck,
  Camera,
  Check,
  AlertCircle,
  Save,
  Loader2,
  Search,
  ExternalLink,
  Lock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit3,
  Smartphone,
  RefreshCw,
  X,
  MapPin,
  Star,
  Copy,
  Heart,
  Tag,
} from "lucide-react";

interface BusinessData {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  category: string | null;
  customerType: string;
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
  isPaid: boolean;
}

interface GoogleSearchResult {
  name: string;
  branchName: string;
  address: string;
  category: string;
  googleReviewUrl: string;
  rating?: number;
  reviewCount?: string;
  suggestedTags?: string[];
  logoUrl?: string | null;
}

export default function SettingsClient({ business }: { business: BusinessData }) {
  const router = useRouter();

  // Active tab on mobile devices ("form" vs "preview")
  const [activeMobileTab, setActiveMobileTab] = useState<"form" | "preview">("form");

  // Form State
  const [form, setForm] = useState({
    name: business.name || "",
    slug: business.slug || "",
    tagline: business.tagline || "",
    category: business.category || "Local Business",
    logoUrl: business.logoUrl || "",
    primaryColor: business.primaryColor || "#4f46e5",
    googlePlaceId: business.googlePlaceId || "",
    googleReviewUrl: business.googleReviewUrl || "",
    googleAddress: business.googleAddress || "",
    phone: business.phone || "",
    whatsapp: business.whatsapp || "",
    instagram: business.instagram || "",
    facebook: business.facebook || "",
    website: business.website || "",
    minRatingForGoogle: business.minRatingForGoogle ?? 4,
    keywords: business.keywords || "",
    tagChips: business.tagChips || "Friendly Staff,Fast Service,Great Quality,Fair Pricing,Clean Ambiance",
    reviewPromptTone: business.reviewPromptTone || "friendly",
  });

  // State for Google Places Typeahead Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GoogleSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [googleProfileSelected, setGoogleProfileSelected] = useState<string | null>(
    business.googleAddress || (business.googleReviewUrl ? "Existing Google Link Configured" : null)
  );

  // Preview interactive state
  const [previewRating, setPreviewRating] = useState<number>(5);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [previewCopied, setPreviewCopied] = useState(false);

  // Saving states
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Close typeahead dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update selected chips when tagChips changes
  useEffect(() => {
    const chips = form.tagChips.split(",").map((c) => c.trim()).filter(Boolean);
    if (chips.length > 0 && selectedChips.length === 0) {
      setSelectedChips(chips.slice(0, 2));
    }
  }, [form.tagChips]);

  // Handle Google Typeahead Search
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (!val || val.trim().length < 2) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setIsDropdownOpen(true);

    searchDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/business/search-google?query=${encodeURIComponent(val.trim())}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.results)) {
          setSearchResults(data.results);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Google search error:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  };

  const handleSelectGoogleProfile = (profile: GoogleSearchResult) => {
    setForm((prev) => ({
      ...prev,
      name: prev.name.trim() === "" || prev.name.startsWith("New Store") ? profile.name : prev.name,
      googleReviewUrl: profile.googleReviewUrl,
      googleAddress: profile.address,
      category: profile.category || prev.category,
      tagChips: profile.suggestedTags && profile.suggestedTags.length > 0
        ? profile.suggestedTags.join(",")
        : prev.tagChips,
    }));

    setGoogleProfileSelected(`${profile.name} • ${profile.address}`);
    setIsDropdownOpen(false);
    setSearchQuery("");
  };

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

  const handleChipToggle = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
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

  // Simulated AI Review Draft text based on selected chips
  const simulatedChipsString =
    selectedChips.length > 0 ? selectedChips.join(", ") : "Outstanding service and quality";
  const simulatedDraft = `Absolutely top-notch experience at ${form.name || "this store"}! Really impressed with their ${simulatedChipsString.toLowerCase()}. Professional team and highly recommended to everyone in the area.`;

  const isOnline = business.customerType === "ONLINE";
  const chipsList = form.tagChips.split(",").map((s) => s.trim()).filter(Boolean);

  const merchantPhone = business.whatsapp || business.phone || "Not specified";
  const channelBadge =
    business.customerType === "ONLINE" ? "Online Customer" : "Offline Merchant";

  const waSupportText = encodeURIComponent(
    `Hi MomoPe Support, I am requesting activation for my SmartReview AI Card.\n\n` +
      `🏪 Store Name: ${form.name || business.name}\n` +
      `📱 Merchant Mobile / User ID: ${merchantPhone}\n` +
      `🔗 Review Link: https://reviewsmart.in/r/${form.slug || business.slug}\n` +
      `💼 Channel: ${channelBadge}\n\n` +
      `Payment Pending: This review card is not yet active. Please verify my payment and activate it.`
  );
  const waSupportLink = `https://wa.me/918639831132?text=${waSupportText}`;

  return (
    <div className="space-y-6">
      {/* ─── MOBILE TAB SWITCHER (Sticky on Mobile screens) ──────────────────── */}
      <div className="lg:hidden sticky top-2 z-40 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-xl flex items-center justify-between gap-1">
        <button
          type="button"
          onClick={() => setActiveMobileTab("form")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeMobileTab === "form"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/50"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Card Settings</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveMobileTab("preview")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeMobileTab === "preview"
              ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Live Phone Preview</span>
          {!business.isPaid && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Main Grid: Controls on Left, Sticky Phone Mockup on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ─── LEFT COLUMN: CUSTOMIZATION CONTROLS ───────────────────────────── */}
        <div
          className={`lg:col-span-7 space-y-6 ${
            activeMobileTab === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          {success && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Settings saved successfully! Changes are live on your review card.</span>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Google Business Profile & Review Link Typeahead */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    Google Maps Business Profile Link
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Search your business name to automatically link your Google Reviews page &amp; verified address.
                  </p>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Instant Auto-Fill
                </span>
              </div>

              {/* Typeahead Search Input */}
              <div ref={searchContainerRef} className="relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {isSearching ? (
                      <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => {
                      if (searchResults.length > 0) setIsDropdownOpen(true);
                    }}
                    placeholder="Search Google profile (e.g. Momo IT Technologies or Royal Bakery)..."
                    className="w-full text-xs pl-9 pr-8 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50/70"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                        setIsDropdownOpen(false);
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Dropdown Results */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800 animate-fadeIn">
                    <div className="px-3 py-2 bg-slate-950/80 text-[11px] font-bold text-slate-400 flex items-center justify-between">
                      <span>{isSearching ? "Searching Google Maps..." : `Google Maps Results (${searchResults.length})`}</span>
                      <span className="text-[10px] text-amber-400 font-normal">Tap to auto-fill</span>
                    </div>

                    {isSearching && searchResults.length === 0 && (
                      <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        <span>Searching Google Maps live profiles...</span>
                      </div>
                    )}

                    {!isSearching && searchResults.length === 0 && searchQuery.length >= 2 && (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No exact match found on Google Maps. Try adding city or neighborhood name.
                      </div>
                    )}

                    {searchResults.map((r, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectGoogleProfile(r)}
                        className="w-full p-3 text-left hover:bg-slate-800/80 flex items-start gap-3 transition group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-400/20">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-white group-hover:text-amber-300 truncate">
                              {r.name}
                            </span>
                            {r.rating && (
                              <span className="text-[10px] font-bold text-amber-400 shrink-0 flex items-center gap-0.5">
                                ★ {r.rating}
                              </span>
                            )}
                          </div>
                          {r.branchName && (
                            <span className="text-[10px] font-semibold text-indigo-400 block truncate">
                              {r.branchName}
                            </span>
                          )}
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{r.address}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Connected Google Profile Notification Card */}
              {googleProfileSelected && (
                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-900 block">Google Review Link Connected</span>
                      <p className="text-[11px] text-emerald-700 truncate max-w-sm sm:max-w-md mt-0.5">
                        {form.googleAddress || form.googleReviewUrl || "Verified profile active"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowManualUrl(!showManualUrl)}
                    className="text-[11px] font-bold text-indigo-600 hover:underline shrink-0"
                  >
                    {showManualUrl ? "Hide URL" : "Edit URL"}
                  </button>
                </div>
              )}

              {/* Manual URL Override */}
              {(showManualUrl || !form.googleReviewUrl) && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Direct Google Review URL (Write Review dialog)
                    </label>
                    <input
                      type="url"
                      name="googleReviewUrl"
                      value={form.googleReviewUrl}
                      onChange={handleChange}
                      placeholder="https://search.google.com/local/writereview?placeid=ChIJ..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Verified Street Address
                    </label>
                    <input
                      type="text"
                      name="googleAddress"
                      value={form.googleAddress}
                      onChange={handleChange}
                      placeholder="e.g. Krishnapuram, Kadapa, Andhra Pradesh"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Brand & Card Basics */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Store className="w-4 h-4 text-indigo-600" />
                Store Identity &amp; Branding
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. IT Solutions, Dental Clinic, Cafe"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
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
                    placeholder="e.g. Leading Cloud, Web & Mobile Development"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              {/* Logo & Accent Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Store Logo / Photo
                    </label>
                    <label className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
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
                          No logo uploaded. Tap &apos;Upload Logo&apos; to pick an image or photo.
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
                    <div className="space-y-0.5">
                      <span className="text-xs font-mono uppercase font-bold text-slate-800">
                        {form.primaryColor}
                      </span>
                      <p className="text-[10px] text-slate-400">Used for glowing card highlights &amp; headers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. AI Compliment Chips & SEO Keywords */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                AI Compliment Chips &amp; SEO Keywords
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Interactive Compliment Chips (comma separated)
                </label>
                <input
                  type="text"
                  name="tagChips"
                  value={form.tagChips}
                  onChange={handleChange}
                  placeholder="Expert Developers, Prompt Tech Support, Clean UI/UX Design, Timely Delivery"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Customers tap these chips on their phone to automatically weave them into their 5-star review drafts.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Local SEO Keywords (comma separated)
                </label>
                <textarea
                  rows={2}
                  name="keywords"
                  value={form.keywords}
                  onChange={handleChange}
                  placeholder="best tech team kadapa, custom mobile app development, top software company"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Gemini AI seamlessly injects these high-intent local phrases to boost your Google Maps search rank.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    AI Review Prompt Tone
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Google Review Routing Threshold
                  </label>
                  <select
                    name="minRatingForGoogle"
                    value={form.minRatingForGoogle}
                    onChange={handleChange}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-semibold"
                  >
                    <option value={4}>4 Stars (Recommended: 1-3 go to Private Shield)</option>
                    <option value={5}>5 Stars Only (1-4 go to Private Shield)</option>
                    <option value={3}>3 Stars (1-2 go to Private Shield)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Direct Contact & Social Links */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Store className="w-4 h-4 text-indigo-600" />
                  Direct Contact &amp; Social Links
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Action icons will appear in your card footer. Leave blank to hide.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp (Number or URL)
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="e.g. 8639831132 or https://wa.me/918639831132"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instagram (@handle or URL)
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={form.instagram}
                    onChange={handleChange}
                    placeholder="e.g. @momo_it_technologies"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
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
                  placeholder="https://momope.com"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            {/* Submit Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setActiveMobileTab("preview")}
                className="lg:hidden px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Card</span>
              </button>

              <button
                type="submit"
                disabled={saving}
                className="ml-auto px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-indigo-200 transition transform active:scale-98 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Card Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ─── RIGHT COLUMN: INTERACTIVE SMARTPHONE MOCKUP ───────────────────── */}
        <div
          className={`lg:col-span-5 lg:sticky lg:top-6 space-y-3 ${
            activeMobileTab === "form" ? "hidden lg:block" : "block"
          }`}
        >
          {/* Header Title with Status */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-black text-slate-900 tracking-tight">
                Live Interactive Card Preview
              </span>
            </div>
            <a
              href={`/r/${form.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>Open Public Page</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Watermark Banner for Payment Status */}
          {!business.isPaid ? (
            <div className="bg-amber-500/15 border border-amber-500/30 text-amber-900 p-3 rounded-2xl text-[11px] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-amber-950 block">
                    Preview Mode (Watermark Active)
                  </span>
                  <p className="text-[10px] text-amber-800 leading-snug">
                    Watermark will be automatically removed once your payment is verified by MomoPe.
                  </p>
                </div>
              </div>
              <a
                href={waSupportLink}
                target="_blank"
                rel="noreferrer"
                className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[10px] flex items-center gap-1 shrink-0 transition"
              >
                <span>Activate on WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-2xl text-[11px] font-bold shadow-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified Store • Card is Live with Zero Watermark</span>
            </div>
          )}

          {/* Phone Frame Device Mockup */}
          <div className="relative mx-auto max-w-[340px] sm:max-w-[360px] bg-slate-950 rounded-[44px] p-3.5 border-[8px] border-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] select-none">
            {/* Top Dynamic Island / Speaker Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950 mr-2" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            </div>

            {/* Inner Phone Screen Content */}
            <div className="bg-slate-950 rounded-[34px] overflow-hidden text-white relative min-h-[560px] flex flex-col justify-between p-4 pt-8">
              {/* Optional Subtle Watermark Overlay Stamp if Unpaid */}
              {!business.isPaid && (
                <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center overflow-hidden">
                  <div className="rotate-[-32deg] select-none text-center">
                    <span className="text-[19px] font-black tracking-widest text-amber-400/20 uppercase border-2 border-dashed border-amber-400/25 px-4 py-2 rounded-2xl block">
                      SAMPLE PREVIEW • WATERMARK ACTIVE
                    </span>
                    <span className="text-[10px] text-amber-400/25 font-bold uppercase tracking-wider block mt-1">
                      Removed After MomoPe Approval
                    </span>
                  </div>
                </div>
              )}

              {/* Status Bar */}
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-3 px-1">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-2 bg-slate-400 rounded-xs inline-block" />
                  <span className="w-2 h-2 rounded-full border border-slate-400 inline-block" />
                  <span className="text-[9px]">5G</span>
                </div>
              </div>

              {/* Business Header Card */}
              <div className="text-center relative z-10 space-y-2">
                {/* Store Avatar / Logo */}
                <div className="relative inline-block mx-auto">
                  <div
                    className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-700 flex items-center justify-center overflow-hidden mx-auto shadow-lg"
                    style={{ borderColor: form.primaryColor }}
                  >
                    {form.logoUrl ? (
                      <img
                        src={form.logoUrl}
                        alt={form.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className="text-lg font-black"
                        style={{ color: form.primaryColor }}
                      >
                        {form.name.slice(0, 2).toUpperCase() || "RS"}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-black text-white tracking-tight leading-tight">
                    {form.name || "Your Business Name"}
                  </h3>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-400 border border-slate-700 mt-1">
                    {form.category || "Local Business"}
                  </span>
                  <p className="text-[11px] text-slate-300 italic mt-1 leading-snug">
                    &ldquo;{form.tagline || "Review our service & share your experience!"}&rdquo;
                  </p>
                </div>

                {/* Google Verified Rating Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                  <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.665-5.2 3.665-9.12z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.43 7.37 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.28 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                  </svg>
                  <span className="font-bold text-amber-400">5.0 ★</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300 truncate max-w-[140px]">
                    {form.googleAddress || "Verified Google Profile"}
                  </span>
                </div>
              </div>

              {/* Interactive Star Selector */}
              <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 text-center my-3 relative z-10">
                <p className="text-[10px] text-slate-400 font-bold mb-1.5">
                  Tap stars to test simulated visitor experience:
                </p>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setPreviewRating(star)}
                      className={`text-xl transition transform active:scale-125 ${
                        star <= previewRating ? "text-amber-400 scale-110" : "text-slate-600"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Rating Simulation */}
              <div className="relative z-10 flex-1 flex flex-col justify-between">
                {previewRating >= Number(form.minRatingForGoogle) ? (
                  /* 4-5 Stars: AI Positive Review Flow */
                  <div className="space-y-2.5">
                    {/* Interactive Tag Chips */}
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5 text-amber-400" />
                        <span>Tap chips to customize review:</span>
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {chipsList.map((chip, idx) => {
                          const isSelected = selectedChips.includes(chip);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleChipToggle(chip)}
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition ${
                                isSelected
                                  ? "bg-amber-400 text-slate-950 border-amber-400"
                                  : "bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500"
                              }`}
                            >
                              {chip}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* AI Generated Review Snippet */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-bold text-amber-400 flex items-center gap-0.5">
                          ★★★★★ AI Draft
                        </span>
                        <span className="text-[8px] text-slate-400">1-Tap Ready</span>
                      </div>
                      <p className="text-[10px] text-slate-200 leading-snug italic line-clamp-3">
                        &ldquo;{simulatedDraft}&rdquo;
                      </p>
                    </div>

                    {/* Google Action Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewCopied(true);
                        setTimeout(() => setPreviewCopied(false), 2000);
                      }}
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-98"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.665-5.2 3.665-9.12z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.43 7.37 24 12 24z" />
                        <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.28 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                      </svg>
                      <span>{previewCopied ? "✓ Review Copied!" : "Open Google & Paste Review"}</span>
                    </button>
                  </div>
                ) : (
                  /* 1-3 Stars: Negative Review Intercept Shield */
                  <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-left space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Review Shield Active</span>
                    </div>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      Ratings below {form.minRatingForGoogle} stars are intercepted privately to prevent public 1-star Google damage.
                    </p>
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400">
                      Private message forwarded directly to your management desk &amp; WhatsApp.
                    </div>
                  </div>
                )}

                {/* Direct Contact Bar */}
                <div className="pt-3 border-t border-slate-800/80 mt-2 flex items-center justify-center gap-3 text-[10px]">
                  {form.whatsapp && (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      WhatsApp ✓
                    </span>
                  )}
                  {form.instagram && (
                    <span className="text-pink-400 font-bold flex items-center gap-1">
                      Instagram ✓
                    </span>
                  )}
                  {form.website && (
                    <span className="text-indigo-400 font-bold flex items-center gap-1">
                      Website ✓
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Home Indicator */}
              <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
