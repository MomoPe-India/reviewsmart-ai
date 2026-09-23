"use client";

import React, { useState, useEffect, useRef } from "react";
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
  MessageSquare,
  HelpCircle,
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

export default function CreateCardPage() {
  const [businessName, setBusinessName] = useState("My Sweet Bakery");
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryPreset>(INDUSTRY_PRESETS[0]);
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [tagline, setTagline] = useState("Share your visit & get instant AI review drafts!");
  const [tags, setTags] = useState(INDUSTRY_PRESETS[0].tags.split(","));
  const [selectedTags, setSelectedTags] = useState<string[]>([tags[0], tags[1]]);
  const [headline, setHeadline] = useState("Scan to Review Us on Google");
  const [subtitle, setSubtitle] = useState("Tap your phone or scan camera");

  // Preview interactive state
  const [activeTab, setActiveTab] = useState<"card" | "stand">("stand");
  const [rating, setRating] = useState<number>(5);
  const [mockAiReview, setMockAiReview] = useState(INDUSTRY_PRESETS[0].sampleReview);
  const [copiedReview, setCopiedReview] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [standFormat, setStandFormat] = useState<"stand" | "tent" | "nfc">("stand");

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
    const dummyUrl = typeof window !== "undefined"
      ? `${window.location.origin}/r/${businessName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "my-business"}`
      : "https://reviewsmart-ai-44ep.vercel.app/r/demo";

    QRCode.toDataURL(dummyUrl, {
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
        particleCount: 80,
        spread: 70,
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

      {/* Main Builder Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner / Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl no-print">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-[11px] font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Instant Free Card Studio &bull; No Login Required
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Create Your Smart Review Card in 30 Seconds
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-xl">
              Type your business name below. See your live AI review gateway and 4"x6" countertop stand update in real time!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setClaimModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-400/20 transition flex items-center gap-2 group whitespace-nowrap"
            >
              <span>Save &amp; Claim My Card</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 2-Column Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Controls (Hidden on Print) */}
          <div className="lg:col-span-5 space-y-4 no-print">
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

              {/* Google Review Link */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Google Review URL (Optional - add now or later)
                </label>
                <input
                  type="url"
                  value={googleReviewUrl}
                  onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  placeholder="https://g.page/r/... or Maps review link"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                />
              </div>
            </div>

            {/* Step 2: Branding & Appearance */}
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
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md mb-2"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {businessName.slice(0, 2).toUpperCase() || "RS"}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{businessName}</h3>
                  <p className="text-xs text-slate-500">{tagline}</p>

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

      {/* Claim & Activate Modal (No Password Required!) */}
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

                {/* Plan Highlights */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>1 Month Pass: ₹299</span>
                    <span className="text-emerald-600">Lifetime Pass: ₹999</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    ✓ Instant AI Funnel &bull; Negative Review Shield &bull; Stand PDF &bull; Direct UPI
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
