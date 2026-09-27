"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Star,
  Shield,
  Smartphone,
  QrCode,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Zap,
  Store,
  Users,
  ChevronRight,
  Play,
  Globe,
  Lock,
  BarChart2,
  Package,
  Truck,
  Flame,
  Award,
  CreditCard,
  Camera,
  Shirt,
  UtensilsCrossed,
  Laptop,
  Check,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import BrandLogo, { BrandIcon } from "@/components/brand/BrandLogo";

// Live demo presets based on real onboarded merchants
const DEMO_MERCHANTS = [
  {
    id: "fashion",
    name: "Sri Guru Fashions",
    category: "Clothing Store",
    location: "Bhagya Nagar, Kadapa",
    icon: Shirt,
    color: "#4f46e5",
    logo: "/images/sri-guru-fashions-logo.png",
    slug: "sri-guru-fashions-393a",
    chips: ["Exclusive Menswear", "Latest Trends", "Quality Fabric", "Reasonable Prices", "Friendly Staff"],
    aiDraft:
      "Sri Guru Fashions has the best menswear collection in Kadapa! Found stylish shirts, trousers, and festive menswear at great prices. The fabric quality is top-notch and staff is very polite. Highly recommended!",
    author: "Karthik R.",
  },
  {
    id: "food",
    name: "Vijaya's Yummy Food",
    category: "Restaurant & Cloud Kitchen",
    location: "Kadapa & Bangalore",
    icon: UtensilsCrossed,
    color: "#ea580c",
    logo: null,
    slug: "vijayas-yummy-food-0900",
    chips: ["Delicious Taste", "Fast Service", "Clean Kitchen", "Polite Staff", "Value for Money"],
    aiDraft:
      "Delicious food with exceptional flavor and authentic home-style taste at Vijaya's Yummy Food! Fast delivery, hygienic packing, and wonderful hospitality. 5 stars!",
    author: "Kiran R.",
  },
  {
    id: "studio",
    name: "Anand Fashion Studio",
    category: "Photography & Gift Shop",
    location: "Kadapa, Andhra Pradesh",
    icon: Camera,
    color: "#db2777",
    logo: null,
    slug: "anand-fashion-studio-bf84",
    chips: ["Creative Photos", "High Quality Prints", "Quick Delivery", "Polite Staff", "Best Gift Items"],
    aiDraft:
      "Best photography studio and personalized gift shop in Kadapa! The portraits came out stunning and their framing quality is top-notch. Truly memorable service!",
    author: "Suresh V.",
  },
  {
    id: "tech",
    name: "Momo IT Technologies",
    category: "Software & IT Solutions",
    location: "Krishnapuram, Kadapa",
    icon: Laptop,
    color: "#0284c7",
    logo: "/images/momo-it-logo.png",
    slug: "momo-it-technologies",
    chips: ["Fast Delivery", "Professional Team", "Cutting Edge AI", "Great Support", "Reliable"],
    aiDraft:
      "Exceptional software development and AI engineering services. Momo IT delivered our custom app ahead of schedule with flawless quality and excellent ongoing support!",
    author: "Rajesh G.",
  },
];

const FEATURES = [
  {
    icon: Sparkles,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
    title: "AI 5-Star Review Generator",
    desc: "Customers get personalized, ready-to-post review drafts in 5 seconds — tailored to your exact store category and customer experience.",
  },
  {
    icon: Shield,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    title: "Negative Feedback Shield",
    desc: "1 to 3 star ratings are intercepted privately to your WhatsApp desk before they reach Google. Protect your public reputation 100%.",
  },
  {
    icon: QrCode,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    title: "Dual NFC Tap + Laser QR Standee",
    desc: "Dual technology on premium matte black acrylic. Customers tap their phone or scan with their camera. Zero app install needed.",
  },
  {
    icon: BarChart2,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    title: "Real-Time Scan Analytics",
    desc: "Track total taps, QR scans, AI reviews drafted, and Google redirects live on your dedicated merchant dashboard.",
  },
  {
    icon: Zap,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    title: "Industry-Specific AI Tags",
    desc: "Smart tags dynamically match your category — clothing boutiques, restaurants, studios, clinics, fitness, and retail shops.",
  },
  {
    icon: Lock,
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
    title: "Frictionless Google Maps Flow",
    desc: "Opens the native Google Maps app directly on customer phones with their active Google account. No browser login walls.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Customer Taps or Scans",
    desc: "Customer taps the acrylic standee with NFC or scans the laser QR. Your branded review card opens instantly.",
    icon: QrCode,
    color: "from-indigo-600 to-indigo-500",
  },
  {
    step: "02",
    title: "AI Writes The 5-Star Review",
    desc: "Customer selects 5 stars and their experience tags. Our AI crafts genuine, high-quality review drafts in seconds.",
    icon: Sparkles,
    color: "from-purple-600 to-purple-500",
  },
  {
    step: "03",
    title: "1-Tap Post on Google Maps",
    desc: "Review is copied to clipboard, Google Maps app opens directly to your store, and the customer simply pastes & posts!",
    icon: Star,
    color: "from-amber-500 to-amber-400",
  },
];

const STATS = [
  { value: "3.5×", label: "More Google reviews every month" },
  { value: "88%", label: "Of customers use AI review drafts" },
  { value: "15s", label: "Average review completion time" },
  { value: "100%", label: "Bad reviews shielded privately" },
];

export default function HomePage() {
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);
  const [demoStars, setDemoStars] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [demoGenerated, setDemoGenerated] = useState(true);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [dailyCustomers, setDailyCustomers] = useState(50);

  const activeDemo = DEMO_MERCHANTS[selectedDemoIndex];

  // Auto-cycle demo every 6s if user hasn't interacted
  useEffect(() => {
    const t = setInterval(() => {
      setSelectedDemoIndex((prev) => (prev + 1) % DEMO_MERCHANTS.length);
      setDemoStars(5);
      setDemoGenerated(true);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  // ROI Calculator formula
  const monthlyWalkins = dailyCustomers * 30;
  const estimatedReviewsWithout = Math.max(1, Math.round(monthlyWalkins * 0.005));
  const estimatedReviewsWith = Math.round(monthlyWalkins * 0.1);
  const shieldedComplaints = Math.max(1, Math.round(monthlyWalkins * 0.015));
  const estimatedRevenueGain = Math.round(estimatedReviewsWith * 450);

  const whatsappInquiryUrl =
    "https://wa.me/918639831132?text=" +
    encodeURIComponent("Hi ReviewSmart AI, I want to get a SmartReview Card & Counter Standee for my business.");

  const whatsappAgentJoinUrl =
    "https://wa.me/918639831132?text=" +
    encodeURIComponent("Hi ReviewSmart AI, I want to become an authorized Marketing Agent / Sales Partner in my city.");

  const handleCopyReview = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* ─── NAVBAR ───────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <BrandLogo href="/" size="md" theme="dark" />

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href="#how-it-works"
              className="text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              How It Works
            </a>
            <a
              href="#demo"
              className="text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Live Demo
            </a>
            <a
              href="#showcase"
              className="text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Merchants
            </a>
            <a
              href="#hardware"
              className="text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              NFC Standee
            </a>
            <a
              href="#calculator"
              className="text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              ROI Calculator
            </a>
            <a
              href="#packages"
              className="text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Packages
            </a>
            <Link
              href="/r/sri-guru-fashions-393a"
              target="_blank"
              className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full transition"
            >
              <Play className="w-3 h-3" /> Live Kadapa Card
            </Link>
          </div>

          {/* Action Area: Clear distinction between Buyer CTA and Existing Merchant Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-slate-700/80 hover:bg-slate-900 hover:border-slate-500 transition flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Login</span>
            </Link>

            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-500/30 flex items-center gap-1.5 active:scale-98"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Get Your Standee</span>
              <span className="sm:hidden">Get Standee</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="pt-28 pb-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-72 h-72 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold mb-6">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Rank #1 on Google Maps · Proven in Kadapa, Hyderabad, Bangalore &amp; Beyond
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.15] mb-5">
            Turn Every Walk-in Customer
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
              Into a 5-Star Google Review
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            Customers tap your counter standee or scan the QR code. Our AI drafts the perfect 5-star review in 15 seconds. Bad reviews are intercepted privately to your WhatsApp before they ever touch Google.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-2xl shadow-indigo-600/40 transition active:scale-98"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              Order Standee &amp; Card on WhatsApp
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#demo"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
            >
              <Play className="w-4 h-4 text-emerald-400" />
              Try Live Store Demo
            </a>
          </div>

          {/* Social Proof Strip: Real Stores */}
          <div className="mt-10 p-3 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-300">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Active Merchants:
            </span>
            <span className="font-semibold text-white flex items-center gap-1">
              🛍️ Sri Guru Fashions <span className="text-[10px] text-amber-400">(Kadapa)</span>
            </span>
            <span className="font-semibold text-white flex items-center gap-1">
              🍽️ Vijaya's Yummy Food <span className="text-[10px] text-amber-400">(Kadapa)</span>
            </span>
            <span className="font-semibold text-white flex items-center gap-1">
              📸 Anand Fashion Studio <span className="text-[10px] text-amber-400">(Kadapa)</span>
            </span>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free Doorstep Delivery Across India
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 10-Minute Instant Setup
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Monthly Software Subscriptions
            </span>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="py-8 px-4 sm:px-6 border-y border-white/5 bg-slate-900/40">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-amber-300">
                {s.value}
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── LIVE INTERACTIVE MULTI-INDUSTRY DEMO ───────────────────────────── */}
      <section id="demo" className="py-20 px-4 sm:px-6 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Experience What Your Customers Experience
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Interactive Live Review Experience
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Select your business type below to see how ReviewSmart AI creates the perfect review drafts for your customers in 15 seconds.
            </p>

            {/* Merchant Industry Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {DEMO_MERCHANTS.map((m, idx) => {
                const IconComponent = m.icon;
                const isSelected = selectedDemoIndex === idx;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedDemoIndex(idx);
                      setDemoStars(5);
                      setDemoGenerated(true);
                    }}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-105 border border-indigo-400/50"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{m.name}</span>
                    <span className="text-[10px] opacity-75 hidden sm:inline">({m.category})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            {/* Left: Realistic Smartphone Mockup */}
            <div className="flex justify-center">
              <div className="relative w-80 bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded-[3rem] border-4 border-slate-800 shadow-2xl shadow-indigo-500/10 overflow-hidden p-6">
                {/* Dynamic Island / Speaker */}
                <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-4 border border-slate-800 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-700 mr-2" />
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-900/60" />
                </div>

                {/* Business Profile */}
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-amber-400/60 flex items-center justify-center shadow-lg mb-2 p-1 overflow-hidden">
                    {activeDemo.logo ? (
                      <img
                        src={activeDemo.logo}
                        alt={activeDemo.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-lg font-black text-amber-400">
                        {activeDemo.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-white text-base leading-tight">
                    {activeDemo.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold mt-1">
                    <span>★ 4.9</span>
                    <span className="text-slate-400">· {activeDemo.category}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" /> {activeDemo.location}
                  </p>
                </div>

                {/* Star Rating Selector */}
                <p className="text-[11px] font-bold text-slate-300 text-center mb-2">
                  How was your experience today?
                </p>
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onMouseEnter={() => setHoveredStar(s)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => {
                        setDemoStars(s);
                        setDemoGenerated(s >= 4);
                      }}
                      className="transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-7 h-7 transition ${
                          s <= (hoveredStar || demoStars)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* 1-3 Stars: Negative Shield Intercept */}
                {demoStars > 0 && demoStars < 4 && (
                  <div className="text-center text-xs text-amber-300 p-3.5 bg-amber-950/30 border border-amber-500/30 rounded-2xl mb-3 space-y-1 animate-fadeIn">
                    <div className="font-bold flex items-center justify-center gap-1 text-amber-400">
                      <Shield className="w-4 h-4 text-emerald-400" /> Private Feedback Shield Active
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Grievance is routed privately to store manager's WhatsApp desk. Google Maps remains 100% shielded from public complaints!
                    </p>
                  </div>
                )}

                {/* 4-5 Stars: AI Generated Review Experience */}
                {demoStars >= 4 && (
                  <div className="space-y-3 animate-fadeIn">
                    {/* Tag chips */}
                    <div className="flex flex-wrap gap-1 justify-center">
                      {activeDemo.chips.map((chip) => (
                        <span
                          key={chip}
                          className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700"
                        >
                          ✓ {chip}
                        </span>
                      ))}
                    </div>

                    {/* AI Draft Card */}
                    <div className="bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/40 rounded-2xl p-3.5 shadow-lg space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-indigo-300 font-bold">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Review Draft
                        </span>
                        <span className="text-amber-400">★★★★★</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed italic">
                        "{activeDemo.aiDraft}"
                      </p>

                      <div className="pt-1 flex gap-2">
                        <button
                          onClick={() => handleCopyReview(activeDemo.aiDraft)}
                          className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow transition active:scale-95"
                        >
                          {copiedDraft ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                              <span>Copied to Clipboard!</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Copy &amp; Post Review</span>
                            </>
                          )}
                        </button>

                        <Link
                          href={`/r/${activeDemo.slug}`}
                          target="_blank"
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center justify-center"
                          title="Open full page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-3 text-center">
                  <Link
                    href={`/r/${activeDemo.slug}`}
                    target="_blank"
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4 inline-flex items-center gap-1"
                  >
                    Open Live Review Page for {activeDemo.name} &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Key Benefits Explained */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Zero Effort for Customers
                </span>
                <h3 className="text-2xl font-black text-white leading-tight">
                  Customers Don't Like Typing Reviews. Our AI Does It For Them.
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  When busy shoppers or diners visit your store, they don't have the patience to open Google, write 3 paragraphs, and fix spelling mistakes. With ReviewSmart AI:
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">1. Instant NFC Tap &amp; Laser QR</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Customers tap their phone to your counter acrylic standee or scan with their camera. Works on both iPhone and Android instantly without installing any app.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 text-purple-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">2. Intelligent Category Compliment Chips</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Customers tap 2 or 3 quick chips like "Great Quality" or "Delicious Food". The AI engine crafts an authentic, natural paragraph with local keywords.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">3. 100% Private Complaint Routing</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Unhappy customers rating 1-3 stars are diverted directly to your private WhatsApp feedback desk so you can resolve issues immediately without public rating loss.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  Claim Your Store Standee on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── REAL LOCAL MERCHANTS SHOWCASE (KADAPA SPOTLIGHT) ─────────────── */}
      <section id="showcase" className="py-20 px-4 sm:px-6 bg-slate-900/40 border-y border-white/5 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold mb-3">
              <Award className="w-3.5 h-3.5" /> Real Verified Local Merchants
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Stores Growing with ReviewSmart AI
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              See live Google Review portals currently active for prominent businesses in Kadapa and beyond:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Merchant 1: Sri Guru Fashions */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                    Clothing Store
                  </span>
                  <span className="text-amber-400 text-xs font-bold flex items-center gap-0.5">
                    ★ 4.9
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-3 overflow-hidden">
                  <img src="/images/sri-guru-fashions-logo.png" alt="Sri Guru Fashions" className="w-full h-full object-contain p-1" />
                </div>
                <h4 className="font-black text-white text-sm mb-1 group-hover:text-indigo-300 transition">
                  Sri Guru Fashions
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                  Bhagya Nagar Colony, beside MJ Kunta Shivalayam Temple, Kadapa.
                </p>
              </div>

              <Link
                href="/r/sri-guru-fashions-393a"
                target="_blank"
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>View Live Review Card</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Merchant 2: Vijaya's Yummy Food */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
                    Cloud Kitchen
                  </span>
                  <span className="text-amber-400 text-xs font-bold flex items-center gap-0.5">
                    ★ 5.0
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-center mb-3">
                  <UtensilsCrossed className="w-6 h-6 text-amber-400" />
                </div>
                <h4 className="font-black text-white text-sm mb-1 group-hover:text-amber-300 transition">
                  Vijaya's Yummy Food
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                  Authentic homemade dining &amp; multi-cuisine delights.
                </p>
              </div>

              <Link
                href="/r/vijayas-yummy-food-0900"
                target="_blank"
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>View Live Review Card</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Merchant 3: Anand Fashion Studio */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-pink-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/25">
                    Photography &amp; Gifts
                  </span>
                  <span className="text-amber-400 text-xs font-bold flex items-center gap-0.5">
                    ★ 4.9
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-pink-950/40 border border-pink-500/30 flex items-center justify-center mb-3">
                  <Camera className="w-6 h-6 text-pink-400" />
                </div>
                <h4 className="font-black text-white text-sm mb-1 group-hover:text-pink-300 transition">
                  Anand Fashion Studio
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                  Premium photography, customized gifts &amp; portraits in Kadapa.
                </p>
              </div>

              <Link
                href="/r/anand-fashion-studio-bf84"
                target="_blank"
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>View Live Review Card</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Merchant 4: Momo IT Technologies */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25">
                    Software &amp; IT
                  </span>
                  <span className="text-amber-400 text-xs font-bold flex items-center gap-0.5">
                    ★ 5.0
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-3 overflow-hidden">
                  <img src="/images/momo-it-logo.png" alt="Momo IT Technologies" className="w-full h-full object-contain p-1" />
                </div>
                <h4 className="font-black text-white text-sm mb-1 group-hover:text-blue-300 transition">
                  Momo IT Technologies
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                  Enterprise software, AI systems, and tech training institute.
                </p>
              </div>

              <Link
                href="/r/momo-it-technologies"
                target="_blank"
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>View Live Review Card</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PHYSICAL HARDWARE STANDEE SHOWCASE ───────────────────────────── */}
      <section id="hardware" className="py-20 px-4 sm:px-6 bg-slate-900/60 border-b border-white/5 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Visual Hardware Standee Card Mockup */}
            <div className="relative flex justify-center">
              <div className="w-72 sm:w-80 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6 border-2 border-amber-500/50 shadow-2xl shadow-amber-500/10 text-center relative overflow-hidden">
                {/* Gold corner accent */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-amber-500/20 via-transparent to-transparent pointer-events-none" />

                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 text-amber-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-black tracking-widest text-amber-400 uppercase mb-1">
                  TAP NFC OR SCAN QR
                </div>
                <h3 className="font-black text-white text-base sm:text-lg mb-1">
                  Matte Acrylic Counter Standee
                </h3>
                <p className="text-[11px] text-slate-400 mb-4">
                  High-durability acrylic designed for your reception desk, cash billing counter, or dining tables.
                </p>

                {/* Laser QR Visual */}
                <div className="w-40 h-40 bg-white p-3 rounded-2xl mx-auto mb-4 shadow-xl flex items-center justify-center">
                  <QrCode className="w-full h-full text-slate-950" />
                </div>

                <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-black mb-2">
                  <span>★ ★ ★ ★ ★</span>
                  <span className="text-white text-[11px] font-semibold ml-1">Review Us on Google</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-[10px] text-slate-300 font-medium">
                  Dual-Tech: Tap phone for NFC · Scan for QR
                </div>
              </div>
            </div>

            {/* Standee Specs & Benefits */}
            <div className="space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold">
                <Award className="w-3.5 h-3.5 text-amber-400" /> Counter-Ready Hardware
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Turn Every Cash Counter Visit Into a 5-Star Review Spot
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Our acrylic counter standees remove 100% of the friction while customers wait for their bill or packaging. Just tap or scan!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-indigo-400" />
                    <span>NFC Tap-to-Review</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Built-in NTAG213 high-speed chip. Works instantly with iPhone &amp; Android.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <span>High-Density Laser QR</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Works on all phone cameras. Never scratches or fades.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Waterproof &amp; Spill-Proof</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Stands up to busy restaurant tables, water spills, and salon counters.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-purple-400" />
                    <span>Free Doorstep Courier</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Custom printed with your store name and dispatched straight to your address.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTERACTIVE ROI CALCULATOR ───────────────────────────────────── */}
      <section id="calculator" className="py-20 px-4 sm:px-6 bg-slate-900/40 border-b border-white/5 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold mb-3">
              <TrendingUp className="w-3.5 h-3.5" /> Calculate Your Store Impact
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
              See How Many 5-Star Reviews You Could Collect Each Month
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Adjust the slider based on your average daily walk-in customers:
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
            {/* Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300">Daily Walk-in Customers:</span>
                <span className="text-lg font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl">
                  {dailyCustomers} Customers / Day
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={dailyCustomers}
                onChange={(e) => setDailyCustomers(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                <span>10 (Boutique / Clinic)</span>
                <span>50 (Studio / Retail)</span>
                <span>250+ (Busy Restaurant / Store)</span>
              </div>
            </div>

            {/* Calculated Output Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-bold text-slate-400 mb-1">Traditional Method</div>
                <div className="text-2xl font-black text-slate-500">
                  ~{estimatedReviewsWithout} reviews
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Per month without ReviewSmart</p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/40 border-2 border-indigo-500/40 shadow-lg">
                <div className="text-xs font-bold text-indigo-300 mb-1 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> With ReviewSmart AI
                </div>
                <div className="text-2xl font-black text-amber-400">
                  +{estimatedReviewsWith} Reviews!
                </div>
                <p className="text-[10px] text-emerald-400 font-semibold mt-1">
                  Estimated 5-Star Reviews / Month 🚀
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-bold text-slate-400 mb-1">Negative Feedback Intercepted</div>
                <div className="text-2xl font-black text-emerald-400">
                  {shieldedComplaints} Private Alerts
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Saved from public Google damage</p>
              </div>
            </div>

            {/* Extra Revenue Impact Bar */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-indigo-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <span className="text-xs font-bold text-emerald-300 flex items-center justify-center sm:justify-start gap-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Estimated Local Revenue Growth:
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Higher Google Maps ranking brings new nearby walk-in shoppers every week.
                </p>
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 whitespace-nowrap">
                +₹{estimatedRevenueGain.toLocaleString("en-IN")}/mo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">How It Works in 3 Simple Steps</h2>
            <p className="text-slate-400 text-sm">Your customers do everything in 15 seconds — you just collect 5-star Google reviews.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="relative text-center p-6 rounded-3xl bg-slate-900 border border-white/5">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-xs font-black text-slate-600 mb-2">{step.step}</div>
                <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PACKAGES & PRICING PREVIEW ───────────────────────────────────── */}
      <section id="packages" className="py-20 px-4 sm:px-6 bg-slate-900/40 border-y border-white/5 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold mb-3">
              <Package className="w-3.5 h-3.5 text-amber-400" /> Straightforward Pricing
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Get Started with ReviewSmart AI
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              No complicated contracts. Fast setup in 10 minutes, with free courier delivery to your shop counter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Digital Starter Pack */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  ONLINE &amp; DIGITAL
                </span>
                <h3 className="text-xl font-black text-white mt-1 mb-2">Digital Review Card</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ideal for businesses wanting to share their smart review link via WhatsApp, SMS, or print their own QR cards.
                </p>

                <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Dedicated Branded URL (<code>/r/your-shop</code>)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited AI 5-Star Review Generations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Private Negative Feedback Shield</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Merchant Dashboard &amp; Real-time Scan Analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Print-Ready High-Res Table Tent PDF</span>
                  </div>
                </div>
              </div>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                <MessageCircle className="w-4 h-4" />
                Inquire on WhatsApp
              </a>
            </div>

            {/* Card 2: Physical Acrylic Standee Bundle (Popular) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/60 border-2 border-indigo-500/50 space-y-5 flex flex-col justify-between relative shadow-2xl shadow-indigo-950/50">
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                Most Popular ★
              </div>

              <div>
                <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                  COUNTER HARDWARE BUNDLE
                </span>
                <h3 className="text-xl font-black text-white mt-1 mb-2">Acrylic Standee + NFC</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Complete turnkey solution with premium physical hardware ready for your billing counter or dining tables.
                </p>

                <div className="pt-4 border-t border-indigo-500/20 space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong className="text-white">Premium Matte Black Acrylic Standee</strong> included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong className="text-white">Built-in NFC Chip</strong> (Tap phone to review)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong className="text-white">Laser-printed High-Density QR</strong> with your Logo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Full Digital Card + Unlimited AI Review Engine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong className="text-white">Free Express Courier Delivery</strong> to your shop</span>
                  </div>
                </div>
              </div>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/40 transition active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                Order Standee on WhatsApp
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARKETING AGENT PARTNER OPPORTUNITY CALLOUT ──────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-slate-900 border-b border-white/5">
        <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center md:justify-start gap-1">
              <Briefcase className="w-3.5 h-3.5" /> High-Earning Opportunity
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Become a Marketing Agent in Your City
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Onboard local shops and restaurants in your area. Earn <strong>40% commission</strong> on every verified merchant deal closed via our high-speed mobile POS.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full md:w-auto">
            <a
              href={whatsappAgentJoinUrl}
              target="_blank"
              rel="noreferrer"
              className="py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
            >
              <MessageCircle className="w-4 h-4" />
              Join as Agent
            </a>
            <Link
              href="/login"
              className="py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
            >
              <Lock className="w-4 h-4 text-indigo-400" />
              Agent POS Login
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA SECTION ────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full bg-indigo-600/25 blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <BrandIcon size="xl" className="mx-auto mb-5 drop-shadow-2xl" />
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
            Ready to Collect More 5-Star Reviews Starting Today?
          </h2>
          <p className="text-slate-300 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
            Chat with our team on WhatsApp. We'll set up your digital card in 10 minutes and courier your customized acrylic standee right to your counter.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-2xl shadow-indigo-500/30 transition active:scale-98"
            >
              <MessageCircle className="w-5 h-5 text-emerald-300" />
              Chat on WhatsApp for Instant Setup
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              href="/r/sri-guru-fashions-393a"
              target="_blank"
              className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
            >
              <Play className="w-4 h-4 text-emerald-400" />
              See Sri Guru Fashions Card
            </Link>
          </div>

          {/* Dedicated Subtle Login Link for Registered Merchants */}
          <p className="text-xs text-slate-500">
            Already a registered merchant or agent?{" "}
            <Link
              href="/login"
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 transition inline-flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              Merchant &amp; Agent Login &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 py-8 px-4 sm:px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo href="/" size="sm" theme="dark" />
          <p className="text-xs text-slate-500 text-center">
            &copy; {new Date().getFullYear()} ReviewSmart AI · All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/918639831132"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Support
            </a>
            <Link
              href="/login"
              className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5" /> Merchant Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
