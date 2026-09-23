"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Sparkles,
  Star,
  Printer,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Store,
  Phone,
  ArrowRight,
  Layers,
  Palette,
  Loader2,
  CheckCircle2,
  Radio,
  Scissors,
  Smartphone,
  Search,
  MapPin,
  Share2,
  Wand2,
  Zap,
} from "lucide-react";
import QRCode from "qrcode";
import confetti from "canvas-confetti";

interface IndustryPreset {
  id: string;
  name: string;
  emoji: string;
  color: string;
  tags: string;
  keywords: string;
  sampleReview: string;
}

const INDUSTRY_PRESETS: IndustryPreset[] = [
  {
    id: "restaurant",
    name: "Cafe & Restaurant",
    emoji: "🍽️",
    color: "#ea580c",
    tags: "Delicious Food,Friendly Staff,Cozy Ambience,Fast Service,Clean Dining",
    keywords: "exceptional flavor, prompt service, great hospitality, highly recommended, fresh ingredients",
    sampleReview: "The food was delicious, and the service was quick and courteous. Great ambiance for family and friends!",
  },
  {
    id: "salon",
    name: "Salon & Spa",
    emoji: "💇",
    color: "#db2777",
    tags: "Expert Stylist,Relaxing Vibe,Clean Equipment,Hygienic,Great Hospitality",
    keywords: "skilled professionals, relaxing massage, top hygiene, excellent haircut, highly recommend",
    sampleReview: "Very professional and friendly staff. The hygiene and ambiance were top-notch. Loved the haircut!",
  },
  {
    id: "clinic",
    name: "Clinic & Dental",
    emoji: "🩺",
    color: "#0284c7",
    tags: "Caring Doctor,Painless Care,Polite Staff,Zero Waiting,Sterile Clinic",
    keywords: "thorough explanation, gentle treatment, modern equipment, trustworthy doctor, great hygiene",
    sampleReview: "Dr. explained everything patiently and the treatment was completely painless. Highly recommended clinic!",
  },
  {
    id: "retail",
    name: "Retail & Supermarket",
    emoji: "🛍️",
    color: "#4f46e5",
    tags: "Great Variety,Affordable Price,Courteous Staff,Fast Billing,Fresh Stock",
    keywords: "best prices in town, wide selection, polite cashiers, convenient parking, high quality",
    sampleReview: "Wide collection of products at reasonable rates. Staff was very helpful during checkout!",
  },
  {
    id: "hotel",
    name: "Hotel & Homestay",
    emoji: "🏨",
    color: "#059669",
    tags: "Clean Rooms,Comfortable Bed,Warm Welcome,Tasty Breakfast,Peaceful Stay",
    keywords: "memorable vacation, spotless bathroom, attentive room service, peaceful location, 5 stars",
    sampleReview: "Rooms were spotless and comfortable. The staff went above and beyond to make our stay delightful.",
  },
  {
    id: "fitness",
    name: "Gym & Fitness",
    emoji: "💪",
    color: "#dc2626",
    tags: "Modern Machines,Supportive Trainers,Good Music,Clean Shower,Energetic Vibe",
    keywords: "knowledgeable coach, motivating atmosphere, well maintained weights, great cardio zone",
    sampleReview: "Top notch gym with certified trainers. The energy and equipment maintenance are outstanding!",
  },
];

interface GoogleSearchResult {
  name: string;
  address: string;
  category: string;
  googleReviewUrl: string;
  suggestedTags: string[];
  rating: number;
  logoUrl?: string | null;
}

export default function CreateCardPage() {
  const [businessName, setBusinessName] = useState("My Sweet Bakery");
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryPreset>(INDUSTRY_PRESETS[0]);
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [tagline, setTagline] = useState("Share your visit & get instant AI review drafts!");
  const [tags, setTags] = useState(INDUSTRY_PRESETS[0].tags.split(","));
  const [selectedTags, setSelectedTags] = useState<string[]>([tags[0], tags[1]]);
  const [headline, setHeadline] = useState("Scan to Review Us on Google");
  const [subtitle, setSubtitle] = useState("Tap your phone or scan with camera");

  // Logo & Direct Contact links (strictly WhatsApp, Instagram, Website)
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");

  // Google Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchingGoogle, setSearchingGoogle] = useState(false);
  const [searchResults, setSearchResults] = useState<GoogleSearchResult[]>([]);
  const [searchError, setSearchError] = useState("");

  // Preview interactive state
  const [activeTab, setActiveTab] = useState<"stand" | "card">("stand");
  const [rating, setRating] = useState<number>(5);
  const [mockAiReview, setMockAiReview] = useState(INDUSTRY_PRESETS[0].sampleReview);
  const [copiedReview, setCopiedReview] = useState(false);
  const [copiedWhatsAppMsg, setCopiedWhatsAppMsg] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  // Claim modal state
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdResult, setCreatedResult] = useState<{
    slug: string;
    reviewUrl: string;
    billingUrl: string;
    dashboardUrl: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle Google Business search
  const handleSearchGoogle = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;

    setSearchingGoogle(true);
    setSearchError("");
    try {
      const res = await fetch("/api/business/search-google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.results && data.results.length > 0) {
        setSearchResults(data.results);
      } else {
        setSearchError("No business found. You can enter your details manually below.");
      }
    } catch {
      setSearchError("Could not search Google. Please enter your name below.");
    } finally {
      setSearchingGoogle(false);
    }
  };

  // 1-Click Auto Fill from Search
  const handleSelectBusiness = (b: GoogleSearchResult) => {
    setBusinessName(b.name);
    setBusinessAddress(b.address);
    setGoogleReviewUrl(b.googleReviewUrl);
    setLogoUrl(b.logoUrl || null);

    if (b.suggestedTags && b.suggestedTags.length > 0) {
      setTags(b.suggestedTags);
      setSelectedTags([b.suggestedTags[0], b.suggestedTags[1]]);
    }

    // Match industry
    const matched = INDUSTRY_PRESETS.find(
      (p) =>
        b.category.toLowerCase().includes(p.name.toLowerCase().split(" ")[0]) ||
        b.name.toLowerCase().includes(p.id)
    );
    if (matched) {
      setSelectedIndustry(matched);
      setPrimaryColor(matched.color);
    }

    setSearchResults([]);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.4 } });
  };

  // Auto generate 1-tap Google Review link
  const handleAutoGenerateLink = () => {
    const query = `${businessName} ${businessAddress}`.trim();
    if (!query) return;
    const directUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    setGoogleReviewUrl(directUrl);
  };

  // Update industry preset
  const handleSelectIndustry = (preset: IndustryPreset) => {
    setSelectedIndustry(preset);
    setPrimaryColor(preset.color);
    const newTags = preset.tags.split(",");
    setTags(newTags);
    setSelectedTags([newTags[0], newTags[1]]);
    setMockAiReview(preset.sampleReview);
  };

  // QR Code live preview update
  useEffect(() => {
    const targetUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/r/${businessName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "my-business"}`
        : "https://reviewsmart-ai-44ep.vercel.app/r/demo";

    QRCode.toDataURL(targetUrl, {
      width: 700,
      margin: 2,
      color: {
        dark: primaryColor,
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    }).then(setQrDataUrl);
  }, [businessName, primaryColor]);

  const toggleTag = (t: string) => {
    if (selectedTags.includes(t)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== t));
    } else {
      setSelectedTags([...selectedTags, t]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadStandPng = async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 4" x 6" at 300 DPI
    canvas.width = 1200;
    canvas.height = 1800;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1200, 1800);

    // Accent bar
    ctx.fillStyle = primaryColor;
    ctx.fillRect(0, 0, 1200, 36);

    // Header pill
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.roundRect(100, 70, 1000, 260, 24);
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Initials badge
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.roundRect(550, 95, 100, 100, 20);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(businessName.slice(0, 2).toUpperCase() || "RS", 600, 145);

    // Business Name
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 48px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(businessName, 600, 245);

    // 5 Stars & Badge
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText("★★★★★", 530, 295);
    ctx.fillStyle = "#475569";
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("5.0 on Google", 630, 295);

    // Center QR
    if (qrDataUrl) {
      const qrImg = new Image();
      await new Promise((resolve) => {
        qrImg.onload = resolve;
        qrImg.src = qrDataUrl;
      });
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(280, 400, 640, 640, 32);
      ctx.fill();
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.drawImage(qrImg, 320, 440, 560, 560);
    }

    // Callouts
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 52px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(headline, 600, 1220);

    ctx.fillStyle = "#64748b";
    ctx.font = "34px sans-serif";
    ctx.fillText(subtitle, 600, 1290);

    ctx.fillStyle = "#e0e7ff";
    ctx.beginPath();
    ctx.roundRect(250, 1370, 700, 100, 50);
    ctx.fill();
    ctx.fillStyle = "#3730a3";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText("📱 Tap phone on card or open camera to scan", 600, 1430);

    ctx.fillStyle = "#4f46e5";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("✨ Powered by AI Google Review Assistant", 600, 1680);

    const link = document.createElement("a");
    link.download = `${businessName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-stand-300dpi.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleClaimCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/card/instant-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          phone,
          email,
          googleReviewUrl,
          primaryColor,
          tagline,
          logoUrl,
          whatsapp,
          instagram,
          website,
          keywords: selectedIndustry.keywords,
          tagChips: tags.join(","),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create card");
        setLoading(false);
        return;
      }

      setCreatedResult(data);
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl no-print">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-[11px] font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              100% Instant Creation &bull; No Sign-In or Password Required
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Create Your Smart Review Card in 30 Seconds
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-xl">
              Search your Google business below or enter your name. We automatically capture your 1-tap review link and generate your stand!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setClaimModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-400/20 transition flex items-center gap-2 group whitespace-nowrap"
            >
              <span>Save &amp; Activate Pass</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 2-Column Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Controls (Hidden on Print) */}
          <div className="lg:col-span-5 space-y-4 no-print">
            {/* GOOGLE BUSINESS SEARCH BOX (NEW HERO FEATURE) */}
            <div className="bg-gradient-to-br from-indigo-50/90 to-purple-50/70 p-5 rounded-3xl border border-indigo-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-indigo-950 flex items-center gap-2">
                  <Search className="w-4 h-4 text-indigo-600" />
                  Auto-Find Your Google Business
                </label>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              </div>

              <p className="text-[11px] text-slate-600">
                Don't know your Google review URL? Just type your shop name &amp; city — we'll grab it automatically!
              </p>

              <form onSubmit={handleSearchGoogle} className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Chai Point Indiranagar Bangalore"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={searchingGoogle}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition flex-shrink-0 disabled:opacity-60"
                >
                  {searchingGoogle ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Search</span>
                      <Search className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {searchError && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  {searchError}
                </p>
              )}

              {/* Search Results Dropdown List */}
              {searchResults.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-indigo-100">
                  <span className="text-[11px] font-bold text-indigo-900 block">
                    Click your business to auto-fill:
                  </span>
                  {searchResults.map((b, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectBusiness(b)}
                      className="p-3 rounded-2xl bg-white border border-indigo-200 hover:border-indigo-500 hover:shadow-md cursor-pointer transition flex items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {b.name}
                          </h4>
                          <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                            ★ {b.rating}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          {b.address}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-[11px] group-hover:bg-indigo-600 group-hover:text-white transition flex-shrink-0"
                      >
                        Auto-Fill ✨
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 1: Business Identity */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Store className="w-4 h-4 text-indigo-600" />
                  1. Business Identity
                </label>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Live Preview
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Royal Biryani &amp; Cafe"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900"
                />
              </div>

              {/* City / Locality Address */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  City / Locality (Optional)
                </label>
                <input
                  type="text"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  placeholder="e.g. Indiranagar, Bengaluru"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                />
              </div>

              {/* Industry Preset Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                  Category (Auto-sets AI tags)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {INDUSTRY_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectIndustry(p)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition flex items-center gap-2 ${
                        selectedIndustry.id === p.id
                          ? "border-indigo-600 bg-indigo-50 text-indigo-900 font-bold"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-base">{p.emoji}</span>
                      <span className="truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Google Review Link + Auto Generate Link */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Google Review URL
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateLink}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-md"
                  >
                    <Wand2 className="w-3 h-3" /> Auto-Create from Name &amp; City
                  </button>
                </div>
                <input
                  type="url"
                  value={googleReviewUrl}
                  onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  placeholder="https://search.google.com/local/writereview?placeid=... or Maps link"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Don't have a direct link? Click "Auto-Create" or search your business above.
                </span>
              </div>
            </div>

            {/* Step 2: Branding & Copy */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-600" />
                2. Brand Color &amp; Copy
              </label>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                  Primary Brand Color
                </label>
                <div className="flex items-center gap-2">
                  {["#4f46e5", "#ea580c", "#059669", "#db2777", "#0284c7", "#0f172a"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setPrimaryColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-7 h-7 rounded-xl transition-transform ${
                        primaryColor === c ? "ring-2 ring-offset-2 ring-indigo-600 scale-110" : "hover:scale-105"
                      }`}
                    />
                  ))}
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5 ml-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Stand Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>

              {/* Tag Chips for AI Reviewer */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                  AI Review Tag Chips (Click to toggle)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTag(t)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                        selectedTags.includes(t)
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Direct Contact & Social Links (Strictly WhatsApp, Instagram, Website) */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-indigo-600" />
                  3. Contact &amp; Social Links (Optional)
                </label>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Highlighted Icons
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Only links you provide will appear as highlighted buttons on your customer review card. Empty links remain hidden.
              </p>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  WhatsApp (Mobile Number or Link)
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. 9876543210 or https://wa.me/919876543210"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Instagram Profile (@handle or URL)
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="e.g. @mybusiness or instagram.com/mybusiness"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. https://mybusiness.com"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                />
              </div>

              {/* Logo auto-sync indicator */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>
                  {logoUrl ? (
                    <strong className="text-emerald-700">✓ Google Maps Logo auto-synced!</strong>
                  ) : (
                    <span><strong>Google Maps Profile Logo:</strong> Auto-fetched on search. If not found, your brand initials badge displays automatically. Zero custom logo upload needed.</span>
                  )}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <button
                type="button"
                onClick={() => setClaimModalOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition"
              >
                <span>Save Permanent Card &amp; Unlock UPI Pass</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Stand Now
                </button>

                <button
                  type="button"
                  onClick={handleDownloadStandPng}
                  className="py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  Download PNG
                </button>
              </div>

              {/* Founder Feature: WhatsApp Customer Invite Generator */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const sampleMsg = `Hi! 😊 Thank you for visiting ${businessName}. Could you please take 10 seconds to share your review on Google? Tap here: ${
                      typeof window !== "undefined"
                        ? `${window.location.origin}/r/${businessName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "portal"}`
                        : ""
                    }`;
                    navigator.clipboard.writeText(sampleMsg);
                    setCopiedWhatsAppMsg(true);
                    setTimeout(() => setCopiedWhatsAppMsg(false), 2500);
                  }}
                  className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  {copiedWhatsAppMsg ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Invite Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copy WhatsApp Review Request Template</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live Previews */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* View Switcher Tabs (Hidden on Print) */}
            <div className="flex items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl mb-5 no-print">
              <button
                type="button"
                onClick={() => setActiveTab("stand")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "stand"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Printer className="w-3.5 h-3.5 text-indigo-600" />
                Physical Acrylic Stand
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("card")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === "card"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                Mobile Review Gateway
              </button>
            </div>

            {/* PREVIEW 1: Physical Acrylic Stand (Sized for print) */}
            {activeTab === "stand" && (
              <div className="w-full flex flex-col items-center justify-center bg-slate-200/50 p-6 sm:p-10 rounded-3xl border border-slate-200 min-h-[580px]">
                <div
                  id="print-target"
                  className="bg-white rounded-3xl p-8 flex flex-col items-center text-center justify-between relative transition-all border border-slate-200"
                  style={{
                    width: "360px",
                    height: "540px",
                    boxShadow: "0 25px 30px -10px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  {/* Top Brand Accent Bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-3 rounded-t-3xl"
                    style={{ backgroundColor: primaryColor }}
                  />

                  {/* Stand Header */}
                  <div className="flex flex-col items-center mt-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md mb-2"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {businessName.slice(0, 2).toUpperCase() || "RS"}
                    </div>
                    <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                      {businessName}
                    </h2>
                    {businessAddress && (
                      <p className="text-[10px] text-slate-400">{businessAddress}</p>
                    )}
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 ml-1">5.0 on Google</span>
                    </div>
                  </div>

                  {/* QR Code Container with High Error Redundancy */}
                  <div className="p-3 bg-white rounded-2xl border-2 border-slate-100 shadow-sm relative my-2">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Review QR Code"
                        className="w-40 h-40 object-contain"
                      />
                    ) : (
                      <div className="w-40 h-40 bg-slate-100 animate-pulse rounded-xl" />
                    )}

                    {/* NFC Indicator */}
                    <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md border-2 border-white">
                      <Radio className="w-4 h-4 text-indigo-400" />
                    </div>
                  </div>

                  {/* Stand Footer */}
                  <div className="space-y-1 pb-1">
                    <h3 className="text-sm font-bold text-slate-800 leading-tight">
                      {headline}
                    </h3>
                    <p className="text-[11px] text-slate-500 max-w-[240px]">
                      {subtitle}
                    </p>
                    <div className="pt-2 text-[10px] font-semibold text-indigo-600 flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      Powered by AI Review Assistant
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-4 no-print text-center">
                  💡 This is what your 4"x6" countertop acrylic stand looks like. Print directly or save as PNG!
                </p>
              </div>
            )}

            {/* PREVIEW 2: Interactive Mobile Funnel */}
            {activeTab === "card" && (
              <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80 relative">
                {/* Floating Negative Shield Badge */}
                <div className="absolute -top-3.5 -right-3.5 px-3.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-md flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Negative Shield Active
                </div>

                {/* Card Header */}
                <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md mb-2 overflow-hidden"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {logoUrl ? (
                      <img src={logoUrl} alt={businessName} className="w-full h-full object-cover" />
                    ) : (
                      businessName.slice(0, 2).toUpperCase() || "RS"
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{businessName}</h3>
                  <p className="text-xs text-slate-500">{tagline}</p>

                  {/* Social Icons Live Preview (Strictly WhatsApp, Instagram, Website) */}
                  {(whatsapp || instagram || website) && (
                    <div className="flex items-center justify-center gap-2 mt-2.5">
                      {whatsapp && (
                        <span className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm text-[10px] font-bold" title="WhatsApp">
                          WA
                        </span>
                      )}
                      {instagram && (
                        <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-sm text-[10px] font-bold" title="Instagram">
                          IG
                        </span>
                      )}
                      {website && (
                        <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm text-[10px] font-bold" title="Website">
                          WEB
                        </span>
                      )}
                    </div>
                  )}

                  {/* Interactive Star Clicker */}
                  <div className="flex items-center gap-2 mt-3 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            s <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1">
                    (Click stars to test customer funnel!)
                  </span>
                </div>

                {/* If 4-5 Stars: 5-Star Funnel with AI Review Drafts */}
                {rating >= 4 ? (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span>✨ AI Generated Draft:</span>
                      <span className="text-emerald-600 font-bold">5-Star Verified</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-slate-700 leading-relaxed">
                      "{mockAiReview}"
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {selectedTags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-700 text-[10px] font-bold"
                        >
                          ✓ {t}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(mockAiReview);
                        setCopiedReview(true);
                        setTimeout(() => setCopiedReview(false), 2000);
                      }}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100 transition"
                    >
                      {copiedReview ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied! Opening Google Reviews...
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          1-Click Copy &amp; Open Google
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  /* If 1-3 Stars: Negative Review Shield */
                  <div className="mt-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2.5">
                    <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      Shield Triggered (Redirected Away From Google)
                    </div>
                    <p className="text-[11px] text-amber-700">
                      Lower ratings are routed to private manager feedback so negative reviews never touch your public Google score!
                    </p>
                    <textarea
                      readOnly
                      rows={2}
                      placeholder="Customer types complaint privately here..."
                      className="w-full text-xs p-2 rounded-xl bg-white border border-amber-200 text-slate-600"
                    />
                    <button
                      type="button"
                      disabled
                      className="w-full py-2 rounded-xl bg-amber-600 text-white font-bold text-xs opacity-90 cursor-default"
                    >
                      Send Private Feedback to Owner
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Claim & Activate Modal (With ₹299 & ₹999 from ₹1,999 Offer Badges!) */}
      {claimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            {!createdResult ? (
              <form onSubmit={handleClaimCard} className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto shadow-inner mb-2">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Save Your Smart Card &amp; Unlock UPI Pass
                  </h3>
                  <p className="text-xs text-slate-500">
                    No password required! Enter your WhatsApp number to lock in your live URL.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp / Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    We'll send your card link &amp; printable PDF directly here.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@business.com"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Strikethrough Pricing Offer Cards */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">1 Month Pass:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 line-through text-[11px]">₹599</span>
                      <span className="font-black text-slate-900">₹299</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-indigo-100">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <span>1 Year / Lifetime:</span>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        50% OFF
                      </span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 line-through text-[11px]">₹1,999</span>
                      <span className="font-black text-emerald-600 text-sm">₹999</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    ✓ Instant AI Funnel &bull; Negative Review Shield &bull; Stand PDF &bull; Direct UPI (0% Fee)
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setClaimModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Activate Card</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Success Screen */
              <div className="text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Your Card is Live! 🎉
                </h3>

                <p className="text-xs text-slate-500">
                  Your smart review gateway is activated. Tap below to test it or complete 1-tap UPI activation.
                </p>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono text-indigo-700 break-all">
                  {typeof window !== "undefined" ? window.location.origin : ""}{createdResult.reviewUrl}
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href={createdResult.billingUrl}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition"
                  >
                    <span>Activate UPI Pass (₹299 / ₹999)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href={createdResult.reviewUrl}
                    target="_blank"
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Open Live Review Card</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={createdResult.dashboardUrl}
                    className="w-full py-2.5 rounded-xl text-indigo-600 hover:bg-indigo-50 font-semibold text-xs transition"
                  >
                    Go to Business Dashboard &amp; Print Studio &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
