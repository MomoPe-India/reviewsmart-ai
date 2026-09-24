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
  MessageCircle,
  Zap,
  Store,
  Users,
  ChevronRight,
  Play,
  Globe,
  Lock,
  BarChart2,
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
    title: "AI Review Generator",
    desc: "Customers get 3 personalized, ready-to-post review drafts in seconds — based on their star rating and your business type.",
  },
  {
    icon: Shield,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    title: "Negative Review Shield",
    desc: "Bad ratings are intercepted privately before they reach Google. You get notified to resolve the issue.",
  },
  {
    icon: QrCode,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    title: "Smart QR / NFC Card",
    desc: "One scan opens your branded AI review page. Works on any smartphone — no app needed.",
  },
  {
    icon: BarChart2,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    title: "Real-Time Analytics",
    desc: "Track scans, AI generations, and Google redirects. See exactly how many reviews you're collecting.",
  },
  {
    icon: Zap,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    title: "Industry-Smart Tags",
    desc: "Auto-detects your business type — restaurant, clinic, salon, garage and more — and customises the review experience.",
  },
  {
    icon: Lock,
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
    title: "Secure & Private",
    desc: "Your customer data is secure. Private feedback never reaches Google — only you see it.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Customer Scans Your QR",
    desc: "They tap your QR standee or NFC card. No app download needed — works instantly on any phone.",
    icon: QrCode,
    color: "from-indigo-600 to-indigo-500",
  },
  {
    step: "02",
    title: "AI Drafts Their Review",
    desc: "They pick a star rating and instantly get 3 AI-crafted review options tailored to your business.",
    icon: Sparkles,
    color: "from-purple-600 to-purple-500",
  },
  {
    step: "03",
    title: "One Tap to Google",
    desc: "They copy the review draft and get redirected straight to your Google review page. Done in 30 seconds.",
    icon: Star,
    color: "from-amber-500 to-amber-400",
  },
];

const STATS = [
  { value: "3×", label: "More reviews per month" },
  { value: "85%", label: "Of customers use AI drafts" },
  { value: "30s", label: "Average review time" },
  { value: "0", label: "Bad reviews reach Google" },
];

export default function HomePage() {
  const [activeReview, setActiveReview] = useState(0);
  const [demoStars, setDemoStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [demoGenerated, setDemoGenerated] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % REVIEW_EXAMPLES.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* ─── NAVBAR ───────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <BrandLogo href="/" size="md" theme="dark" />

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              How it Works
            </a>
            <Link
              href="/r/momo-it-technologies"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full transition"
            >
              <Play className="w-3 h-3" /> Live Demo (Momo IT)
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/918639831132?text=Hi%20MomoPe%2C%20I%20am%20interested%20in%20SmartReview%20AI%20for%20my%20business."
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Get Started
            </a>
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-500/20"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            Trusted by local businesses across India
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight mb-5">
            Turn Every Customer Visit
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Into a 5-Star Google Review
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            SmartReview AI generates personalised Google review drafts for your customers in seconds. 
            One scan. Zero effort. More 5-star reviews — guaranteed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://wa.me/918639831132?text=Hi%20MomoPe%2C%20I%20am%20interested%20in%20SmartReview%20AI%20for%20my%20business."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/30 transition"
            >
              <MessageCircle className="w-4 h-4" />
              Get Your Smart Review Card
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/r/momo-it-technologies"
              target="_blank"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              <Play className="w-4 h-4 text-indigo-400" />
              See Live Demo
            </Link>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Contact us on WhatsApp · We'll set up your card and deliver your standee
          </p>
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="py-8 px-4 sm:px-6 border-y border-white/5 bg-white/2">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── LIVE DEMO INTERACTIVE PREVIEW ───────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Try It Right Here 👇
            </h2>
            <p className="text-slate-400 text-sm">This is exactly what your customers will see when they scan your QR code.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Phone mockup preview */}
            <div className="flex justify-center">
              <div className="relative w-72 bg-gradient-to-b from-slate-800 to-slate-900 rounded-[2.5rem] border border-white/10 shadow-2xl shadow-indigo-500/10 overflow-hidden p-5">
                {/* Status bar */}
                <div className="flex justify-between text-[10px] text-slate-500 mb-4 px-1">
                  <span>9:41</span><span>●●●</span>
                </div>

                {/* Business logo/name */}
                <div className="flex flex-col items-center text-center mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg mb-2">
                    <Store className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-black text-white text-sm">Momo IT Technologies</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Kadapa, Andhra Pradesh</p>
                </div>

                {/* Star picker */}
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

                {/* AI Generate Button */}
                {demoStars >= 4 && !demoGenerated && (
                  <button
                    onClick={() => setDemoGenerated(true)}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 mb-3 shadow-lg"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Generate AI Review Draft
                  </button>
                )}

                {demoStars > 0 && demoStars < 4 && (
                  <div className="text-center text-xs text-slate-400 p-3 bg-slate-800 rounded-xl">
                    We'd love to hear your feedback privately to improve.
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
                  <p className="text-center text-xs text-slate-500 mt-2">👆 Tap a star to try the demo</p>
                )}
              </div>
            </div>

            {/* Right: Rotating AI reviews */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Real AI-Generated Reviews</h3>
              <p className="text-sm text-slate-400">These are actual review drafts our AI generates for different business types:</p>

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
                See our live demo page <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 bg-white/2 border-y border-white/5 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">How It Works</h2>
            <p className="text-slate-400 text-sm">Three simple steps. Your customers do everything — you just collect 5-star reviews.</p>
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
      <section id="features" className="py-16 px-4 sm:px-6 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Everything You Need</h2>
            <p className="text-slate-400 text-sm">One smart tool to boost your Google reviews and protect your reputation.</p>
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

      {/* ─── FOR BUSINESS OWNERS ──────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-white/2 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Who Is This For?</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { emoji: "🍽️", label: "Restaurants & Cafes" },
              { emoji: "💇", label: "Salons & Spas" },
              { emoji: "🩺", label: "Clinics & Hospitals" },
              { emoji: "🛍️", label: "Retail Shops" },
              { emoji: "🏨", label: "Hotels & Stays" },
              { emoji: "🔧", label: "Garages & Service" },
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

      {/* ─── CTA SECTION ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <BrandIcon size="xl" className="mx-auto mb-5 drop-shadow-2xl" />
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
            Ready to Get More 5-Star Reviews?
          </h2>
          <p className="text-slate-400 text-sm mb-8 max-w-lg mx-auto">
            Contact us on WhatsApp. We'll discuss your business requirements, set up your SmartReview AI card, and if you're an offline merchant, deliver your physical QR standee.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/918639831132?text=Hi%20MomoPe%2C%20I%20am%20interested%20in%20SmartReview%20AI%20for%20my%20business."
              target="_blank"
              rel="noreferrer"
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 transition"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us Now
            </a>
            <Link
              href="/login"
              className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              <Lock className="w-4 h-4 text-slate-400" />
              Existing Customer Login
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo href="/" size="sm" theme="dark" />
          <p className="text-xs text-slate-500 text-center">
            &copy; {new Date().getFullYear()} ReviewSmart AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/918639831132"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-500 hover:text-white transition flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Support
            </a>
            <Link href="/login" className="text-xs text-slate-500 hover:text-white transition flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
