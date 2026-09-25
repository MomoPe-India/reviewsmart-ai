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
} from "lucide-react";
import BrandLogo, { BrandIcon } from "@/components/brand/BrandLogo";

const REVIEW_EXAMPLES = [
  {
    text: "Absolutely love this place! The staff was incredibly welcoming and the service was top-notch. Will definitely be coming back!",
    stars: 5,
    author: "Priya S.",
    business: "Aroma Restaurant",
    tag: "Restaurant",
    color: "#ea580c",
  },
  {
    text: "Best salon experience ever! The stylist knew exactly what I needed. Hygienic, professional, and very affordable.",
    stars: 5,
    author: "Rohit M.",
    business: "Style Studio",
    tag: "Salon",
    color: "#db2777",
  },
  {
    text: "Dr. Sharma is extremely patient and explains every step. The clinic is spotless. Highly recommended for the whole family.",
    stars: 5,
    author: "Anita K.",
    business: "HealthFirst Clinic",
    tag: "Clinic",
    color: "#0284c7",
  },
];

const FEATURES = [
  {
    icon: Sparkles,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
    title: "AI 5-Star Review Generator",
    desc: "Customers get 3 personalized, ready-to-post review drafts in seconds — tailored to your exact business and cuisine/services.",
  },
  {
    icon: Shield,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    title: "Negative Feedback Shield",
    desc: "1 to 3 star ratings are intercepted privately to your WhatsApp desk before they reach Google. Protect your public reputation.",
  },
  {
    icon: QrCode,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    title: "NFC Tap + Laser QR Standee",
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
    desc: "Smart tags dynamically match your category — restaurants, salons, clinics, fitness, garages, and retail stores.",
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
  const [activeReview, setActiveReview] = useState(0);
  const [demoStars, setDemoStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [demoGenerated, setDemoGenerated] = useState(false);
  const [dailyCustomers, setDailyCustomers] = useState(60);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % REVIEW_EXAMPLES.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  // ROI Calculator formula
  const monthlyWalkins = dailyCustomers * 30;
  const estimatedReviewsWithout = Math.max(1, Math.round(monthlyWalkins * 0.005));
  const estimatedReviewsWith = Math.round(monthlyWalkins * 0.1);
  const shieldedComplaints = Math.max(1, Math.round(monthlyWalkins * 0.015));

  const whatsappInquiryUrl =
    "https://wa.me/918639831132?text=" +
    encodeURIComponent("Hi ReviewSmart AI, I want to get a SmartReview Card & Counter Standee for my business.");

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
              href="#comparison"
              className="text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Why ReviewSmart
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
              href="/r/momo-it-technologies"
              target="_blank"
              className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full transition"
            >
              <Play className="w-3 h-3" /> Live Demo
            </Link>
          </div>

          {/* Action Area: Clear distinction between Buyer CTA and Existing Merchant Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-slate-700/80 hover:bg-slate-900 hover:border-slate-500 transition flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Merchant Login</span>
            </Link>

            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-500/30 flex items-center gap-1.5 active:scale-98"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Get Your Card</span>
              <span className="sm:hidden">Get Card</span>
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
            Boost Your Google Rating to 4.9★ · Rank #1 on Local Google Maps
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.15] mb-5">
            Turn Every Walk-in Customer
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
              Into a 5-Star Google Review
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            Customers tap your counter standee or scan the QR code. Our AI drafts the perfect 5-star review in 15 seconds. Bad reviews are intercepted privately before they ever touch Google.
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

            <Link
              href="/r/momo-it-technologies"
              target="_blank"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
            >
              <Play className="w-4 h-4 text-emerald-400" />
              Try Live Demo Card
            </Link>
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
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Monthly Software Subscription
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

      {/* ─── BEFORE VS AFTER: WHY REVIEWSMART AI ───────────────────────────── */}
      <section id="comparison" className="py-16 px-4 sm:px-6 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold mb-3">
              <Flame className="w-3.5 h-3.5" /> Stop Losing Customers to Competitors
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Why 90% of Local Businesses Struggle with Google Reviews
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              See the direct difference between the traditional slow approach and the ReviewSmart AI advantage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Way */}
            <div className="p-6 sm:p-8 rounded-3xl bg-red-950/20 border border-red-500/20 space-y-4">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-wider">
                <XCircle className="w-5 h-5 shrink-0" />
                <span>The Traditional Way (Without ReviewSmart AI)</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-300 pt-2">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Only 1 in 100 satisfied customers bothers to open Google and type a review.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Frustrated customers immediately write damaging 1-star public complaints on Google.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Customers don't know what to write or get lazy and abandon the review mid-way.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Your rating drops below 4.0★ → New walk-in customers choose your competitor instead.</span>
                </li>
              </ul>
            </div>

            {/* The ReviewSmart AI Way */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-emerald-950/30 border border-indigo-500/30 space-y-4 shadow-xl shadow-indigo-950/30">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>The ReviewSmart AI Way (Automated Growth)</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-200 pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Customer simply taps your counter standee or scans QR in 2 seconds.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>AI generates 3 personalized, glowing 5-star review drafts ready to post in 15 seconds.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Negative ratings (1-3 stars) are intercepted privately to your phoneDesk. Zero damage to Google.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Your rating climbs to 4.9★ → Google Maps ranks your shop #1 in local search results!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PHYSICAL HARDWARE STANDEE SHOWCASE ───────────────────────────── */}
      <section id="hardware" className="py-16 px-4 sm:px-6 bg-slate-900/60 border-y border-white/5 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Visual Hardware Standee Card Mockup */}
            <div className="relative flex justify-center">
              <div className="w-72 sm:w-80 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6 border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 text-center relative overflow-hidden">
                {/* Gold corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/20 via-transparent to-transparent pointer-events-none" />

                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 text-amber-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-bold tracking-widest text-amber-400 uppercase mb-1">
                  TAP NFC OR SCAN QR
                </div>
                <h3 className="font-black text-white text-base sm:text-lg mb-1">
                  Premium Counter Standee
                </h3>
                <p className="text-[11px] text-slate-400 mb-5">
                  High-durability acrylic designed for your reception desk or dining tables.
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
                Turn Every Cash Counter Visit Into a High-Converting Review Spot
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Our acrylic counter standees don't just look luxurious — they remove 100% of the friction for customers while they wait for their bill or order.
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
                    Works on all phone cameras. Never fades or scratches.
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
                    <span>Custom Printed &amp; Delivered</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Customized with your business name and logo. Couriered to your doorstep.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LIVE INTERACTIVE DEMO ────────────────────────────────────────── */}
      <section id="demo" className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Try The Customer Experience Right Here 👇
            </h2>
            <p className="text-slate-400 text-sm">This is exactly what your customers see in 2 seconds when they scan your standee.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Phone mockup preview */}
            <div className="flex justify-center">
              <div className="relative w-72 bg-gradient-to-b from-slate-800 to-slate-900 rounded-[2.5rem] border border-white/10 shadow-2xl shadow-indigo-500/10 overflow-hidden p-5">
                <div className="flex justify-between text-[10px] text-slate-500 mb-4 px-1">
                  <span>9:41</span><span>●●●</span>
                </div>

                <div className="flex flex-col items-center text-center mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-emerald-500/40 flex items-center justify-center shadow-lg mb-2 p-1 overflow-hidden">
                    <img
                      src="/images/momo-it-logo.png"
                      alt="Momo IT Technologies"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-black text-white text-sm">Momo IT Technologies</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Kadapa, Andhra Pradesh</p>
                </div>

                <p className="text-[11px] text-slate-400 text-center mb-2">How was your experience?</p>
                <div className="flex justify-center gap-2 mb-5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onMouseEnter={() => setHoveredStar(s)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => { setDemoStars(s); setDemoGenerated(false); }}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 transition ${
                          s <= (hoveredStar || demoStars)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {demoStars >= 4 && !demoGenerated && (
                  <button
                    onClick={() => setDemoGenerated(true)}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 mb-3 shadow-lg"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Generate AI Review Draft
                  </button>
                )}

                {demoStars > 0 && demoStars < 4 && (
                  <div className="text-center text-xs text-amber-300 p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl">
                    <div className="font-bold flex items-center justify-center gap-1 mb-1">
                      <Shield className="w-3.5 h-3.5 text-amber-400" /> Private Feedback Shield
                    </div>
                    Private message forwarded to your phone — never posted to Google!
                  </div>
                )}

                {demoGenerated && (
                  <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-2xl p-3">
                    <p className="text-[10px] text-indigo-300 font-semibold mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Review Draft
                    </p>
                    <p className="text-[11px] text-white leading-relaxed">
                      "Excellent IT solutions and prompt support! The team at Momo IT Technologies is highly professional and delivers quality software on time."
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(
                          "Excellent IT solutions and prompt support! The team at Momo IT Technologies is highly professional and delivers quality software on time."
                        );
                        window.open("/r/momo-it-technologies", "_blank");
                      }}
                      className="mt-2 w-full py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition text-[10px] text-white font-semibold flex items-center justify-center gap-1"
                    >
                      <span>Copy &amp; Open Live Demo &rarr;</span>
                    </button>
                  </div>
                )}

                {demoStars === 0 && (
                  <p className="text-center text-xs text-slate-500 mt-2">👆 Tap a star to test the live flow</p>
                )}
              </div>
            </div>

            {/* Right: Rotating AI reviews */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Genuine AI-Generated Customer Drafts</h3>
              <p className="text-sm text-slate-400">See real review drafts generated for different businesses:</p>

              <div className="space-y-3">
                {REVIEW_EXAMPLES.map((r, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border transition-all duration-500 ${
                      i === activeReview
                        ? "bg-white/5 border-white/15 shadow-lg scale-[1.01]"
                        : "bg-white/2 border-white/5 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: r.color + "33", border: `1px solid ${r.color}66` }}
                      >
                        {r.tag[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">
                            {Array.from({ length: r.stars }).map((_, j) => (
                              <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-500 font-semibold">{r.tag}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{r.text}</p>
                        <p className="text-[10px] text-slate-500 mt-1">— {r.author} · {r.business}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/r/momo-it-technologies"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
              >
                Open Full Screen Live Review Card <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTERACTIVE ROI CALCULATOR ───────────────────────────────────── */}
      <section id="calculator" className="py-16 px-4 sm:px-6 bg-slate-900/40 border-y border-white/5 scroll-mt-16">
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
                <span>100 (Cafe / Salon)</span>
                <span>250+ (Busy Restaurant)</span>
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
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 scroll-mt-16">
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

      {/* ─── FEATURES GRID ────────────────────────────────────────────────── */}
      <section id="features" className="py-16 px-4 sm:px-6 bg-slate-900/40 border-y border-white/5 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Everything Your Store Needs</h2>
            <p className="text-slate-400 text-sm">One smart platform to boost your Google rating, rank higher, and protect your brand.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className={`p-5 rounded-2xl bg-slate-900 border ${f.bg.split(" ")[1]} flex gap-4`}>
                <div className={`w-10 h-10 rounded-xl ${f.bg} border flex items-center justify-center shrink-0`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO IS THIS FOR ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Built for Every Walk-in Business</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Smart review tags and prompts are customised for your exact industry.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { emoji: "🍽️", label: "Restaurants & Cafes" },
              { emoji: "💇", label: "Salons & Spas" },
              { emoji: "🩺", label: "Clinics & Doctors" },
              { emoji: "🛍️", label: "Retail & Boutiques" },
              { emoji: "🏨", label: "Hotels & Stays" },
              { emoji: "🔧", label: "Garages & Car Care" },
              { emoji: "💪", label: "Gyms & Fitness" },
              { emoji: "💻", label: "IT & Tech Services" },
            ].map((b) => (
              <div key={b.label} className="p-4 rounded-2xl bg-slate-900 border border-white/5 text-center">
                <div className="text-2xl mb-2">{b.emoji}</div>
                <p className="text-xs font-semibold text-slate-300 leading-tight">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PACKAGES & PRICING PREVIEW ───────────────────────────────────── */}
      <section id="packages" className="py-16 px-4 sm:px-6 bg-slate-900/40 border-y border-white/5 scroll-mt-16">
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
              href="/r/momo-it-technologies"
              target="_blank"
              className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
            >
              <Play className="w-4 h-4 text-emerald-400" />
              See Live Demo
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
