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
  Printer,
  FileText,
  Layers,
  Palette,
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
    location: "Kadugodi, Bengaluru",
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
    category: "Photography & Framing Studio",
    location: "Kadapa, Andhra Pradesh",
    icon: Camera,
    color: "#db2777",
    logo: null,
    slug: "anand-fashion-studio-bf84",
    chips: ["Creative Photos", "High Quality Prints", "Quick Delivery", "Polite Staff", "Photo Frames"],
    aiDraft:
      "Best photography and photo framing studio in Kadapa! The portraits came out stunning and their framing quality is top-notch. Truly memorable service!",
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
    title: "Smart QR Standee & PVC Display Cards",
    desc: "3 physical formats: 4\"×6\" Acrylic Standee, Vertical PVC Card, and A4 Wall Poster. Zero app install needed.",
  },
  {
    icon: ShieldCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    title: "100% Ad-Free • Zero Distractions",
    desc: "Zero third-party ads, zero popups, and zero sponsored trackers. A clean, premium experience that honors your brand reputation.",
  },
  {
    icon: Store,
    color: "text-amber-300",
    bg: "bg-amber-500/10 border-amber-500/20",
    title: "All-in-One Smart Business Hub",
    desc: "Replaces counter clutter! Your single QR handles 5-star Google Reviews, WhatsApp chat, digital menu, and instant UPI payments.",
  },
  {
    icon: BarChart2,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    title: "Real-Time Scan Analytics",
    desc: "Track total QR scans, visitors, AI reviews drafted, and Google redirects live on your dedicated merchant dashboard.",
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
    title: "Customer Scans QR Code",
    desc: "Customer points phone camera at counter standee. On older Android phones, simply tap Google Lens on the home search bar — instant scan in 1 second!",
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

const DISPLAY_THEMES = {
  "royal-gold": {
    name: "Royal Gold",
    badge: "bg-amber-400 text-slate-950",
    border: "border-amber-400/80 shadow-amber-400/20",
    cardBg: "from-slate-950 via-slate-900 to-black",
    accent: "text-amber-400",
    accentBg: "bg-amber-400/10 border-amber-400/30",
    gradient: "from-amber-400 to-yellow-500",
    dot: "#f59e0b",
  },
  "emerald-luxe": {
    name: "Emerald Luxe",
    badge: "bg-emerald-400 text-slate-950",
    border: "border-emerald-500/80 shadow-emerald-500/20",
    cardBg: "from-emerald-950 via-slate-950 to-black",
    accent: "text-emerald-400",
    accentBg: "bg-emerald-400/10 border-emerald-400/30",
    gradient: "from-emerald-400 to-teal-500",
    dot: "#10b981",
  },
  "midnight-sapphire": {
    name: "Midnight Sapphire",
    badge: "bg-cyan-400 text-slate-950",
    border: "border-cyan-400/80 shadow-cyan-400/20",
    cardBg: "from-blue-950 via-slate-950 to-black",
    accent: "text-cyan-400",
    accentBg: "bg-cyan-400/10 border-cyan-400/30",
    gradient: "from-cyan-400 to-blue-500",
    dot: "#06b6d4",
  },
  "rose-platinum": {
    name: "Rose Platinum",
    badge: "bg-rose-400 text-slate-950",
    border: "border-rose-400/80 shadow-rose-400/20",
    cardBg: "from-rose-950 via-slate-950 to-black",
    accent: "text-rose-400",
    accentBg: "bg-rose-400/10 border-rose-400/30",
    gradient: "from-rose-400 to-pink-500",
    dot: "#f43f5e",
  },
};

export default function HomePage() {
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);
  const [demoStars, setDemoStars] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [demoGenerated, setDemoGenerated] = useState(true);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [dailyCustomers, setDailyCustomers] = useState(50);
  const [mockupFormat, setMockupFormat] = useState<"stand" | "pvc-vertical" | "poster-a4">("stand");
  const [mockupTheme, setMockupTheme] = useState<"royal-gold" | "emerald-luxe" | "midnight-sapphire" | "rose-platinum">("royal-gold");

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

  const whatsappStarterUrl =
    "https://wa.me/918639831132?text=" +
    encodeURIComponent("Hi ReviewSmart AI, I want to order the Starter PVC Card Pack (₹1,999) for my shop.");

  const whatsappExecutiveUrl =
    "https://wa.me/918639831132?text=" +
    encodeURIComponent("Hi ReviewSmart AI, I want to order the Executive Counter Standee Kit (₹2,499) for my shop.");

  const whatsappAllInOneUrl =
    "https://wa.me/918639831132?text=" +
    encodeURIComponent("Hi ReviewSmart AI, I want to order the All-in-One Multi-Counter Hub (₹2,999) for my business.");

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
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden selection:bg-blue-600 selection:text-white relative">
      {/* ─── FUTURISTIC GOOGLE AMBIENT LIGHT MESH ───────────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-blue-100/50 via-indigo-50/30 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-32 left-10 w-96 h-96 rounded-full bg-blue-400/8 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 right-10 w-96 h-96 rounded-full bg-purple-400/8 blur-3xl pointer-events-none -z-10" />

      {/* ─── NAVBAR ───────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_10px_rgba(0,0,0,0.03)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <BrandLogo href="/" size="md" theme="light" />

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 sm:gap-2">
            <a
              href="#how-it-works"
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100/70 px-3.5 py-1.5 rounded-full transition"
            >
              How It Works
            </a>
            <a
              href="#demo"
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100/70 px-3.5 py-1.5 rounded-full transition"
            >
              Live Demo
            </a>
            <a
              href="#showcase"
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100/70 px-3.5 py-1.5 rounded-full transition"
            >
              Merchants
            </a>
            <a
              href="#hardware"
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100/70 px-3.5 py-1.5 rounded-full transition"
            >
              Display Kits
            </a>
            <a
              href="#calculator"
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100/70 px-3.5 py-1.5 rounded-full transition"
            >
              ROI Calculator
            </a>
            <a
              href="#packages"
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100/70 px-3.5 py-1.5 rounded-full transition"
            >
              Packages
            </a>
            <Link
              href="/r/sri-guru-fashions-393a"
              target="_blank"
              className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full transition"
            >
              <Play className="w-3 h-3" /> Live Kadapa Card
            </Link>
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-full border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Login</span>
            </Link>

            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold transition shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 flex items-center gap-1.5 active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">Get Your Standee</span>
              <span className="sm:hidden">Get Standee</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="pt-28 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/70 text-blue-700 text-xs font-bold mb-6 shadow-sm">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4285F4] animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
            </span>
            <span>Rank #1 on Google Maps · Proven in Kadapa, Hyderabad, Bangalore &amp; All over the world</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.12] mb-5">
            Turn Every Walk-in Customer
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Into a 5-Star Google Review
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            Customers scan your counter standee, vertical PVC card, or wall poster QR code. Our AI drafts the perfect 5-star review in 15 seconds. Bad reviews are intercepted privately to your WhatsApp before they ever touch Google.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              Order Standee &amp; Card on WhatsApp
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#demo"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow transition active:scale-[0.98]"
            >
              <Play className="w-4 h-4 text-blue-600" />
              Try Live Store Demo
            </a>
          </div>

          {/* Social Proof Strip: Real Stores */}
          <div className="mt-10 p-3 sm:p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-700 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Active Merchants:
            </span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              🛍️ Sri Guru Fashions <span className="text-[10px] text-amber-600 font-medium">(Kadapa)</span>
            </span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              🍽️ Vijaya's Yummy Food <span className="text-[10px] text-amber-600 font-medium">(Bengaluru)</span>
            </span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              📸 Anand Fashion Studio <span className="text-[10px] text-amber-600 font-medium">(Kadapa)</span>
            </span>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Ad-Free • Zero Distractions
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free Doorstep Delivery Across India
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 10-Minute Instant Setup
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zero Monthly Software Subscriptions
            </span>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="py-8 px-4 sm:px-6 border-y border-slate-200/70 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/80">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── LIVE INTERACTIVE MULTI-INDUSTRY DEMO ───────────────────────────── */}
      <section id="demo" className="py-20 px-4 sm:px-6 scroll-mt-16 bg-gradient-to-b from-white via-slate-50/50 to-white relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Experience What Your Customers Experience
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              Interactive Live Review Experience
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
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
                    className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-105 border border-blue-500"
                        : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm"
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
              <div className="relative w-80 bg-white rounded-[3rem] border-4 border-slate-200 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1),0_0_35px_rgba(66,133,244,0.08)] overflow-hidden p-6">
                {/* Dynamic Island / Speaker */}
                <div className="w-24 h-4 bg-slate-100 rounded-full mx-auto mb-4 border border-slate-200 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 mr-2" />
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-200" />
                </div>

                {/* Business Profile */}
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-white border-2 border-amber-400 flex items-center justify-center shadow-md mb-2 p-1 overflow-hidden">
                    {activeDemo.logo ? (
                      <img
                        src={activeDemo.logo}
                        alt={activeDemo.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-lg font-black text-amber-500">
                        {activeDemo.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-slate-900 text-base leading-tight">
                    {activeDemo.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold mt-1">
                    <span>★ 4.9</span>
                    <span className="text-slate-500">· {activeDemo.category}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {activeDemo.location}
                  </p>
                </div>

                {/* Star Rating Selector */}
                <p className="text-[11px] font-bold text-slate-700 text-center mb-2">
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
                            : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* 1-3 Stars: Negative Shield Intercept */}
                {demoStars > 0 && demoStars < 4 && (
                  <div className="text-center text-xs text-amber-900 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl mb-3 space-y-1 animate-fadeIn">
                    <div className="font-bold flex items-center justify-center gap-1 text-amber-700">
                      <Shield className="w-4 h-4 text-emerald-600" /> Private Feedback Shield Active
                    </div>
                    <p className="text-[11px] text-amber-800/80">
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
                          className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-blue-700 border border-slate-200"
                        >
                          ✓ {chip}
                        </span>
                      ))}
                    </div>

                    {/* AI Draft Card */}
                    <div className="bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/70 border border-blue-200/80 rounded-2xl p-3.5 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-blue-700 font-bold">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI Review Draft
                        </span>
                        <span className="text-amber-500">★★★★★</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        "{activeDemo.aiDraft}"
                      </p>

                      <div className="pt-1 flex gap-2">
                        <button
                          onClick={() => handleCopyReview(activeDemo.aiDraft)}
                          className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow transition active:scale-95"
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
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition flex items-center justify-center"
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
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4 inline-flex items-center gap-1"
                  >
                    Open Live Review Page for {activeDemo.name} &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Key Benefits Explained */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Zero Effort for Customers
                </span>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">
                  Customers Don't Like Typing Reviews. Our AI Does It For Them.
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  When busy shoppers or diners visit your store, they don't have the patience to open Google, write 3 paragraphs, and fix spelling mistakes. With ReviewSmart AI:
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0 text-blue-600">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-0.5">1. Instant Camera QR Scan</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Customers open their default camera app and scan the high-density QR code on your acrylic standee or vertical PVC card. Opens instantly on all phones without installing any app.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200/60 flex items-center justify-center shrink-0 text-purple-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-0.5">2. Intelligent Category Compliment Chips</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Customers tap 2 or 3 quick chips like "Great Quality" or "Delicious Food". The AI engine crafts an authentic, natural paragraph with local keywords.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0 text-emerald-600">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-0.5">3. 100% Private Complaint Routing</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
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
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition active:scale-95"
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
      <section id="showcase" className="py-20 px-4 sm:px-6 bg-slate-50/70 border-y border-slate-200/70 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold mb-3 shadow-sm">
              <Award className="w-3.5 h-3.5 text-emerald-600" /> Real Verified Local Merchants
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              Stores Growing with ReviewSmart AI
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              See live Google Review portals currently active for prominent businesses in Kadapa and beyond:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Merchant 1: Sri Guru Fashions */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-blue-400/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(66,133,244,0.08)] transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Clothing Store
                  </span>
                  <span className="text-amber-500 text-xs font-bold flex items-center gap-0.5">
                    ★ 4.9
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-3 overflow-hidden shadow-sm">
                  <img src="/images/sri-guru-fashions-logo.png" alt="Sri Guru Fashions" className="w-full h-full object-contain p-1" />
                </div>
                <h4 className="font-black text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition">
                  Sri Guru Fashions
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                  Bhagya Nagar Colony, beside MJ Kunta Shivalayam Temple, Kadapa.
                </p>
              </div>

              <Link
                href="/r/sri-guru-fashions-393a"
                target="_blank"
                className="w-full py-2.5 px-3 rounded-full bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>View Live Review Card</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Merchant 2: Vijaya's Yummy Food */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-amber-400/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(245,158,11,0.08)] transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Cloud Kitchen
                  </span>
                  <span className="text-amber-500 text-xs font-bold flex items-center gap-0.5">
                    ★ 5.0
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-3 shadow-sm">
                  <UtensilsCrossed className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="font-black text-slate-900 text-sm mb-1 group-hover:text-amber-600 transition">
                  Vijaya's Yummy Food
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                  Kadugodi, Bengaluru · Authentic homemade dining &amp; multi-cuisine delights.
                </p>
              </div>

              <Link
                href="/r/vijayas-yummy-food-0900"
                target="_blank"
                className="w-full py-2.5 px-3 rounded-full bg-slate-100 hover:bg-amber-600 text-slate-700 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>View Live Review Card</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Merchant 3: Anand Fashion Studio */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-pink-400/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(236,72,153,0.08)] transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                    Photography &amp; Framing
                  </span>
                  <span className="text-amber-500 text-xs font-bold flex items-center gap-0.5">
                    ★ 4.9
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center mb-3 shadow-sm">
                  <Camera className="w-6 h-6 text-pink-600" />
                </div>
                <h4 className="font-black text-slate-900 text-sm mb-1 group-hover:text-pink-600 transition">
                  Anand Fashion Studio
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                  Premium photography, custom framing &amp; portraits in Kadapa.
                </p>
              </div>

              <Link
                href="/r/anand-fashion-studio-bf84"
                target="_blank"
                className="w-full py-2.5 px-3 rounded-full bg-slate-100 hover:bg-pink-600 text-slate-700 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>View Live Review Card</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Merchant 4: Momo IT Technologies */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-blue-400/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(59,130,246,0.08)] transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Software &amp; IT
                  </span>
                  <span className="text-amber-500 text-xs font-bold flex items-center gap-0.5">
                    ★ 5.0
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-3 overflow-hidden shadow-sm">
                  <img src="/images/momo-it-logo.png" alt="Momo IT Technologies" className="w-full h-full object-contain p-1" />
                </div>
                <h4 className="font-black text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition">
                  Momo IT Technologies
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                  Enterprise software, AI systems, and tech training institute.
                </p>
              </div>

              <Link
                href="/r/momo-it-technologies"
                target="_blank"
                className="w-full py-2.5 px-3 rounded-full bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>View Live Review Card</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PHYSICAL HARDWARE & DISPLAY FORMATS SHOWCASE ───────────────────── */}
      <section id="hardware" className="py-20 px-4 sm:px-6 bg-white border-b border-slate-200/70 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold mb-3 shadow-sm">
              <Printer className="w-3.5 h-3.5 text-blue-600" /> 3 Physical Display Formats · Zero App Required
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              Turn Every Counter, Table &amp; Door Into a 5-Star Review Station
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Every business is different. Choose from 4&quot;×6&quot; Acrylic Standees for counters, Vertical PVC cards for pocket/wallets, and A4 printable posters for walls and entrance doors.
            </p>

            {/* Format Selector Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              <button
                type="button"
                onClick={() => setMockupFormat("stand")}
                className={`px-4 py-2 rounded-full text-xs font-extrabold flex items-center gap-2 transition ${
                  mockupFormat === "stand"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105"
                    : "bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200"
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>4&quot;×6&quot; Acrylic Standee</span>
              </button>

              <button
                type="button"
                onClick={() => setMockupFormat("pvc-vertical")}
                className={`px-4 py-2 rounded-full text-xs font-extrabold flex items-center gap-2 transition ${
                  mockupFormat === "pvc-vertical"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105"
                    : "bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Dual-Sided PVC Card (CR80)</span>
              </button>

              <button
                type="button"
                onClick={() => setMockupFormat("poster-a4")}
                className={`px-4 py-2 rounded-full text-xs font-extrabold flex items-center gap-2 transition ${
                  mockupFormat === "poster-a4"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105"
                    : "bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>A4 Wall &amp; Door Poster</span>
              </button>
            </div>

            {/* Theme Selector Pills */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Palette className="w-3 h-3 text-blue-600" /> Theme:
              </span>
              {(Object.keys(DISPLAY_THEMES) as Array<keyof typeof DISPLAY_THEMES>).map((tKey) => {
                const item = DISPLAY_THEMES[tKey];
                const isActive = mockupTheme === tKey;
                return (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => setMockupTheme(tKey)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.dot }}
                    />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual 3D Realistic Mockup Container */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-100/30 border border-slate-200/80 rounded-3xl p-4 sm:p-6 shadow-sm">
              {(() => {
                const currentTheme = DISPLAY_THEMES[mockupTheme];

                if (mockupFormat === "stand") {
                  return (
                    <div
                      className="relative flex flex-col items-center justify-center p-4 py-8 w-full max-w-sm"
                      style={{ perspective: "1200px" }}
                    >
                      {/* 3D Acrylic Standee Face */}
                      <div
                        className={`relative w-64 sm:w-72 rounded-3xl bg-gradient-to-b ${currentTheme.cardBg} p-5 border-2 ${currentTheme.border} text-center transition-all duration-500 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.95)]`}
                        style={{
                          transform: "rotateY(-7deg) rotateX(4deg)",
                          transformStyle: "preserve-3d",
                        }}
                      >
                        {/* Glossy Reflection Sheen */}
                        <div
                          className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.03) 40%, transparent 60%)",
                          }}
                        />

                        {/* Top Header */}
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                            SMARTREVIEW
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${currentTheme.badge}`}>
                            ★ 5.0 Google
                          </span>
                        </div>

                        {/* Official Google "G" Circular Badge */}
                        <div className="w-14 h-14 rounded-full bg-white border-2 border-amber-400 p-3 mx-auto mb-2 flex items-center justify-center shadow-lg ring-2 ring-amber-400/20">
                          <svg className="w-full h-full" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.665-5.2 3.665-9.12z" />
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.43 7.37 24 12 24z" />
                            <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.28 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                          </svg>
                        </div>

                        <h4 className="text-sm font-black text-white truncate px-2">{activeDemo.name}</h4>
                        <p className="text-[10px] text-slate-400 truncate mb-3">{activeDemo.category} · Kadapa</p>

                        {/* QR Code Container */}
                        <div className="w-36 h-36 bg-white p-2.5 rounded-2xl mx-auto shadow-2xl flex items-center justify-center relative border border-white/20 mb-3">
                          <QrCode className="w-full h-full text-slate-950" />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 border-2 border-white flex items-center justify-center shadow-lg">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-black mb-1">
                          <span>★ ★ ★ ★ ★</span>
                        </div>
                        <p className="text-[11px] font-bold text-white tracking-wide">
                          SCAN TO REVIEW WITH CAMERA
                        </p>
                        <p className="text-[9px] text-slate-400 mt-0.5">
                          Fast Google Maps Redirect · Zero App Install
                        </p>
                      </div>

                      {/* Acrylic Base L-Stand Foot */}
                      <div
                        className="w-56 sm:w-64 h-5 rounded-b-2xl bg-gradient-to-r from-white/25 via-white/40 to-white/20 backdrop-blur-md border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.8)] -mt-2.5"
                        style={{
                          transform: "rotateY(-7deg) rotateX(28deg)",
                        }}
                      />
                      <div className="w-64 sm:w-72 h-4 bg-black/70 blur-xl rounded-full mt-2" />
                    </div>
                  );
                }

                if (mockupFormat === "pvc-vertical") {
                  return (
                    <div
                      className="relative flex flex-col items-center justify-center p-4 py-8 w-full max-w-sm"
                      style={{ perspective: "1200px" }}
                    >
                      {/* Vertical CR80 PVC Card */}
                      <div
                        className={`relative w-56 sm:w-60 rounded-2xl bg-gradient-to-b ${currentTheme.cardBg} p-5 border-2 ${currentTheme.border} text-center transition-all duration-500 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.95)]`}
                        style={{
                          aspectRatio: "54 / 85.6",
                          transform: "rotateY(7deg) rotateX(4deg)",
                          transformStyle: "preserve-3d",
                        }}
                      >
                        {/* Metallic card sheen */}
                        <div
                          className="absolute inset-0 rounded-2xl pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(120deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 30%, transparent 60%)",
                          }}
                        />

                        {/* Card Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                              CR80 PVC
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black ${currentTheme.badge}`}>
                            REVIEW PASS
                          </span>
                        </div>

                        {/* Official Google "G" Circular Badge */}
                        <div className="w-12 h-12 rounded-full bg-white border-2 border-amber-400 p-2.5 mx-auto mb-2 flex items-center justify-center shadow-md ring-2 ring-amber-400/20">
                          <svg className="w-full h-full" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.665-5.2 3.665-9.12z" />
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.43 7.37 24 12 24z" />
                            <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.28 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                          </svg>
                        </div>

                        <h4 className="text-xs font-black text-white truncate px-1">{activeDemo.name}</h4>
                        <p className="text-[9px] text-slate-400 truncate mb-2.5">Official Customer Review Card</p>

                        {/* High Density QR */}
                        <div className="w-28 h-28 bg-white p-2 rounded-xl mx-auto shadow-xl flex items-center justify-center border border-white/20 mb-2.5">
                          <QrCode className="w-full h-full text-slate-950" />
                        </div>

                        <div className="flex items-center justify-center gap-0.5 text-amber-400 text-[10px] font-black mb-1">
                          <span>★ ★ ★ ★ ★</span>
                        </div>
                        <p className="text-[10px] font-black text-white tracking-wider uppercase">
                          POINT CAMERA &amp; REVIEW
                        </p>
                        <p className="text-[8px] text-slate-400 mt-0.5 font-mono">
                          PAN CARD SIZE · 54×85.6 MM
                        </p>
                      </div>

                      <div className="w-52 h-4 bg-black/70 blur-lg rounded-full mt-4" />
                    </div>
                  );
                }

                // A4 Poster
                return (
                  <div
                    className="relative flex flex-col items-center justify-center p-4 py-8 w-full max-w-sm"
                    style={{ perspective: "1200px" }}
                  >
                    {/* A4 Poster in Wall Frame */}
                    <div
                      className={`relative w-64 sm:w-72 rounded-2xl bg-gradient-to-b ${currentTheme.cardBg} p-5 border-4 border-slate-700/80 text-center transition-all duration-500 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] ring-1 ${currentTheme.border}`}
                      style={{
                        aspectRatio: "210 / 297",
                        transform: "rotateY(-4deg) rotateX(2deg)",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {/* Corner screw caps */}
                      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-slate-400 shadow-sm border border-slate-600" />
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-400 shadow-sm border border-slate-600" />
                      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-slate-400 shadow-sm border border-slate-600" />
                      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-slate-400 shadow-sm border border-slate-600" />

                      {/* Header */}
                      <div className="mb-2">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">
                          OFFICIAL CUSTOMER NOTICE
                        </span>
                        <h4 className="text-sm font-black text-white leading-tight">WE VALUE YOUR FEEDBACK</h4>
                      </div>

                      {/* Official Google "G" Circular Badge */}
                      <div className="w-12 h-12 rounded-full bg-white border-2 border-amber-400 p-2.5 mx-auto mb-2 flex items-center justify-center shadow-md ring-2 ring-amber-400/20">
                        <svg className="w-full h-full" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.665-5.2 3.665-9.12z" />
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.43 7.37 24 12 24z" />
                          <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.28 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                        </svg>
                      </div>

                      <div className="text-xs font-black text-white truncate">{activeDemo.name}</div>
                      <div className="flex items-center justify-center gap-1 text-amber-400 text-xs my-1">
                        <span>★ ★ ★ ★ ★</span>
                      </div>

                      {/* Big Poster QR */}
                      <div className="w-32 h-32 bg-white p-2.5 rounded-2xl mx-auto shadow-2xl flex items-center justify-center border border-white/20 my-2">
                        <QrCode className="w-full h-full text-slate-950" />
                      </div>

                      {/* 3 Step Visual Guide */}
                      <div className="grid grid-cols-3 gap-1 pt-1.5 text-[8px] text-slate-300 border-t border-white/10 mt-1">
                        <div className="p-1 rounded bg-white/5">
                          <span className="font-black text-amber-400 block">1. SCAN</span>
                          <span>Camera QR</span>
                        </div>
                        <div className="p-1 rounded bg-white/5">
                          <span className="font-black text-indigo-400 block">2. AI DRAFT</span>
                          <span>1-Tap Words</span>
                        </div>
                        <div className="p-1 rounded bg-white/5">
                          <span className="font-black text-emerald-400 block">3. POST</span>
                          <span>Google Maps</span>
                        </div>
                      </div>

                      <p className="text-[8px] text-slate-500 mt-2 font-mono">
                        A4 PRINTABLE · 210×297 MM · 300 DPI
                      </p>
                    </div>

                    <div className="w-60 h-4 bg-black/70 blur-xl rounded-full mt-3" />
                  </div>
                );
              })()}
            </div>

            {/* Display Format Specs & Details */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                {mockupFormat === "stand"
                  ? "4\"×6\" (A6) Portrait Acrylic Standee"
                  : mockupFormat === "pvc-vertical"
                  ? "Dual-Sided Smart PVC Card (CR80 PAN Size)"
                  : "A4 Printable Wall & Door Poster"}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {mockupFormat === "stand" && "Durable Crystal Acrylic for Your Billing Counter"}
                {mockupFormat === "pvc-vertical" && "Side A: Google Review Station • Side B: Store Business Card"}
                {mockupFormat === "poster-a4" && "Eye-Level High-Visibility Poster for Entrances & Walls"}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                {mockupFormat === "stand" &&
                  "Crafted from premium heavy crystal acrylic with brilliant UV back-printing. Designed to sit elegantly on reception counters, billing desks, and dining tables."}
                {mockupFormat === "pvc-vertical" &&
                  "Standard CR80 PAN card size (54mm × 85.6mm) on thick waterproof PVC plastic. Front side acts as your official Google 5-Star Review Station with dynamic QR & NFC; flip side features your custom luxury store visiting card or direct UPI QR."}
                {mockupFormat === "poster-a4" &&
                  "Full-bleed 210×297mm poster at 300 DPI (2480 × 3508 px). Merchants can download instantly, print at any local xerox or photo shop, and mount on entrance doors, mirrors, or waiting lounges."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition">
                  <div className="font-bold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-blue-600" />
                    <span>Instant Camera Scan</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Works natively on iPhone Camera and Android Google Lens. Zero app download required.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition">
                  <div className="font-bold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-amber-500" />
                    <span>High-Density Dynamic QR</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    High error-correction code with your store logo embedded at the center. Never fails to scan.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition">
                  <div className="font-bold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Waterproof &amp; UV Protected</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Resistant to water splashes, sanitizers, UV sunlight fading, and daily store handling.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition">
                  <div className="font-bold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-purple-600" />
                    <span>Instant PDF &amp; Courier Kit</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Instant 300 DPI vector PDF export in your dashboard + physical standee delivery options.
                  </p>
                </div>
              </div>

              {/* Older Smartphone / Google Lens Guidance Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50 border border-blue-200/80 flex items-start gap-3 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                    📱 Works on 100% of Phones · Older Smartphone? Use Google Lens!
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Zero app download needed! If a customer uses an older smartphone whose default camera doesn&apos;t auto-scan QR codes, they can simply tap the <strong className="text-blue-700">Google Lens camera icon</strong> (built right inside the Google Search widget on every Android phone) or use <strong className="text-emerald-700">Google Pay / PhonePe scanner</strong>. It opens the review funnel in 1 second!
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>Order Custom Store Display Kit on WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTERACTIVE ROI CALCULATOR ───────────────────────────────────── */}
      <section id="calculator" className="py-20 px-4 sm:px-6 bg-slate-50/70 border-b border-slate-200/70 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold mb-3 shadow-sm">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Calculate Your Store Impact
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              See How Many 5-Star Reviews You Could Collect Each Month
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Adjust the slider based on your average daily walk-in customers:
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50">
            {/* Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700">Daily Walk-in Customers:</span>
                <span className="text-lg font-black text-blue-700 bg-blue-50 border border-blue-200 px-3.5 py-1 rounded-xl shadow-sm">
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
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-medium">
                <span>10 (Boutique / Clinic)</span>
                <span>50 (Studio / Retail)</span>
                <span>250+ (Busy Restaurant / Store)</span>
              </div>
            </div>

            {/* Calculated Output Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-bold text-slate-500 mb-1">Traditional Method</div>
                <div className="text-2xl font-black text-slate-400">
                  ~{estimatedReviewsWithout} reviews
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Per month without ReviewSmart</p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/60 border-2 border-blue-400/80 shadow-md">
                <div className="text-xs font-bold text-blue-700 mb-1 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> With ReviewSmart AI
                </div>
                <div className="text-2xl font-black text-blue-600">
                  +{estimatedReviewsWith} Reviews!
                </div>
                <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                  Estimated 5-Star Reviews / Month 🚀
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-bold text-slate-500 mb-1">Negative Feedback Intercepted</div>
                <div className="text-2xl font-black text-emerald-600">
                  {shieldedComplaints} Private Alerts
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Saved from public Google damage</p>
              </div>
            </div>

            {/* Extra Revenue Impact Bar */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/40 to-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <span className="text-xs font-bold text-emerald-800 flex items-center justify-center sm:justify-start gap-1">
                  <TrendingUp className="w-4 h-4 text-emerald-600" /> Estimated Local Revenue Growth:
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Higher Google Maps ranking brings new nearby walk-in shoppers every week.
                </p>
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-700 whitespace-nowrap">
                +₹{estimatedRevenueGain.toLocaleString("en-IN")}/mo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-white scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">How It Works in 3 Simple Steps</h2>
            <p className="text-slate-600 text-sm">Your customers do everything in 15 seconds — you just collect 5-star Google reviews.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="relative text-center p-6 rounded-3xl bg-slate-50/60 border border-slate-200/80 shadow-sm hover:shadow-md transition">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 shadow-md`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-xs font-black text-blue-600 mb-2">{step.step}</div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Quick Compatibility Tip */}
          <div className="mt-8 text-center">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 border border-blue-200 text-xs text-blue-900 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Universal Compatibility: Works with iPhone Camera, Android Camera, or <strong className="text-blue-950 font-bold">Google Lens</strong> on older smartphones.</span>
            </span>
          </div>
        </div>
      </section>

      {/* ─── PACKAGES & PRICING PREVIEW ───────────────────────────────────── */}
      <section id="packages" className="py-20 px-4 sm:px-6 bg-slate-50/70 border-y border-slate-200/70 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold mb-3 shadow-sm">
              <Package className="w-3.5 h-3.5 text-blue-600" /> Transparent Counter Hardware Packages
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              Choose the Right Counter Setup for Your Store
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
              Every package includes our complete Gemini AI 5-Star review engine, WhatsApp negative feedback shield, and 100% ad-free smart hub. Pricing is strictly based on the physical counter display hardware &amp; station deliverables needed for your shop.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: Starter PVC Card Pack */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md space-y-5 flex flex-col justify-between hover:border-slate-300 transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    Compact Entry
                  </span>
                  <CreditCard className="w-4 h-4 text-slate-400" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1 mb-1">Starter PVC Card Pack</h3>
                <div className="flex items-baseline gap-1.5 my-2">
                  <span className="text-3xl font-black text-slate-900">₹1,999</span>
                  <span className="text-xs text-slate-500 font-semibold">one-time payment</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ideal for compact cash counters, tea/coffee desks, small boutique tills, and takeaway counters.
                </p>

                <div className="pt-4 border-t border-slate-200/80 space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">1x Dual-Sided Vertical PVC Smart Card</strong> (Google Review Front + Store Visiting Card Back)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>High-density dynamic QR code (waterproof &amp; scratch-proof)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Gemini AI 5-Star Review Generation Engine</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Private WhatsApp Negative Feedback Shield</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>100% Ad-Free Smart Hub Card with Direct UPI</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Free Courier Delivery</strong> to your shop</span>
                  </div>
                </div>
              </div>

              <a
                href={whatsappStarterUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-98 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Order Starter PVC Kit (₹1,999)
              </a>
            </div>

            {/* Card 2: Executive Counter Standee Kit (Most Popular) */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-blue-500 space-y-5 flex flex-col justify-between relative shadow-xl shadow-blue-500/10 scale-[1.02]">
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                ★ Retail Best Seller
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Executive Kit
                  </span>
                  <Printer className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1 mb-1">Executive Counter Standee Kit</h3>
                <div className="flex items-baseline gap-1.5 my-2">
                  <span className="text-3xl font-black text-slate-900">₹2,499</span>
                  <span className="text-xs text-slate-500 font-semibold">one-time payment</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our flagship package for retail stores, apparel boutiques, restaurants, clinics, and salons.
                </p>

                <div className="pt-4 border-t border-slate-200/80 space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">1x 4″×6″ (A6) Crystal Acrylic L-Standee</strong> (Retail standard)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">1x Dual-Sided Vertical PVC Smart Card</strong> (Google Review + Store Business Card)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Official Google &quot;G&quot; Circular Badge Authentic Brand Styling</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-blue-700">Zero-Reprint Dynamic QR Guarantee</strong> (edit anytime)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Full Digital Card + Unlimited AI Review Engine</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Priority Doorstep Courier Delivery</strong></span>
                  </div>
                </div>
              </div>

              <a
                href={whatsappExecutiveUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                Order Executive Kit (₹2,499)
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Card 3: All-in-One Multi-Counter Hub */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md space-y-5 flex flex-col justify-between hover:border-slate-300 transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                    VIP Complete
                  </span>
                  <Award className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1 mb-1">All-in-One Multi-Counter Hub</h3>
                <div className="flex items-baseline gap-1.5 my-2">
                  <span className="text-3xl font-black text-slate-900">₹2,999</span>
                  <span className="text-xs text-slate-500 font-semibold">one-time payment</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Complete multi-point storefront presentation for multi-counter showrooms, fine dining &amp; studios.
                </p>

                <div className="pt-4 border-t border-slate-200/80 space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">1x 4″×6″ Crystal Acrylic Counter Standee</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">2x Dual-Sided Vertical PVC Smart Cards</strong> (Google Review + Store Business Card)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">1x A4 Framed Glass Door / Wall Poster</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Digital Menu &amp; Product Showcase URL integration</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Staff Attribution QR Badges for team members</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">VIP Dedicated Support &amp; Fast Courier</strong></span>
                  </div>
                </div>
              </div>

              <a
                href={whatsappAllInOneUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-98 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Order All-in-One VIP Hub (₹2,999)
              </a>
            </div>
          </div>

          {/* Hardware Deliverables & Price Defense Note */}
          <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  💡 Transparent Hardware Deliverables · 100% Zero-Reprint Guarantee
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  All packages include our complete Gemini AI review engine, private WhatsApp shield, and zero ads. Package pricing strictly corresponds to physical counter hardware units (PVC Card vs Acrylic Standee vs Multi-Station Kit).
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-xl shadow-sm">
                Starting from ₹1,999
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARKETING AGENT PARTNER OPPORTUNITY CALLOUT ──────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-white border-b border-slate-200/70">
        <div className="max-w-4xl mx-auto p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white border border-indigo-500/25 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center md:justify-start gap-1">
              <Briefcase className="w-3.5 h-3.5" /> High-Earning Opportunity
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Become a Marketing Agent in Your City
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Onboard local shops and restaurants in your area. Earn <strong>30% commission</strong> on every verified merchant deal closed via our high-speed mobile POS.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full md:w-auto">
            <a
              href={whatsappAgentJoinUrl}
              target="_blank"
              rel="noreferrer"
              className="py-3 px-6 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
            >
              <MessageCircle className="w-4 h-4" />
              Join as Agent
            </a>
            <Link
              href="/login"
              className="py-3 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20 transition"
            >
              <Lock className="w-4 h-4 text-blue-400" />
              Agent POS Login
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA SECTION ────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-amber-400/10 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-2xl mx-auto text-center relative z-10 p-8 sm:p-10 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_10px_40px_rgba(66,133,244,0.08)]">
          <BrandIcon size="xl" className="mx-auto mb-5 drop-shadow-lg" />
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight">
            Ready to Collect More 5-Star Reviews Starting Today?
          </h2>
          <p className="text-slate-600 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
            Chat with our team on WhatsApp. We'll set up your digital card in 10 minutes and courier your customized acrylic standee right to your counter.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition active:scale-98"
            >
              <MessageCircle className="w-5 h-5 text-emerald-300" />
              Chat on WhatsApp for Instant Setup
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              href="/r/sri-guru-fashions-393a"
              target="_blank"
              className="px-6 py-4 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              <Play className="w-4 h-4 text-blue-600" />
              See Sri Guru Fashions Card
            </Link>
          </div>

          {/* Dedicated Subtle Login Link for Registered Merchants */}
          <p className="text-xs text-slate-500">
            Already a registered merchant or agent?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-4 transition inline-flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              Merchant &amp; Agent Login &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200/80 py-8 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo href="/" size="sm" theme="light" />
          <p className="text-xs text-slate-500 text-center">
            &copy; {new Date().getFullYear()} ReviewSmart AI · All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/918639831132"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-600 hover:text-blue-600 transition flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Support
            </a>
            <Link
              href="/login"
              className="text-xs text-slate-600 hover:text-blue-600 transition flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5" /> Merchant Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
