import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Sparkles,
  ShieldCheck,
  Star,
  Printer,
  Copy,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Radio,
  BarChart3,
  MessageSquare,
  Building,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Next-Gen AI Reputation Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Collect More <span className="text-indigo-600">5-Star Google Reviews</span> with AI &amp; NFC Cards
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Eliminate customer writer's block with instant AI-drafted reviews, protect your Google rating with an automated negative review shield, and design stunning acrylic countertop stands.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/create"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2 group"
                >
                  Create Your Smart Card (No Login Needed)
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/r/food-bites"
                  target="_blank"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm shadow-sm transition flex items-center justify-center gap-2"
                >
                  <span>Experience Live Customer Demo</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Social Proof */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 font-medium">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span>Over 10,000+ local businesses collecting reviews effortlessly</span>
              </div>
            </div>

            {/* Right Hero Interactive Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80 relative transform hover:scale-[1.01] transition-transform duration-300">
                {/* Floating Badge */}
                <div className="absolute -top-3.5 -right-3.5 px-3.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-md flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Negative Shield Active
                </div>

                {/* Card Header */}
                <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl shadow-inner mb-2">
                    FB
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Food Bites Cafe</h3>
                  <p className="text-xs text-slate-500">Tap a star to rate your visit</p>

                  <div className="flex items-center gap-1.5 mt-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-6 h-6 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Simulated AI suggestions */}
                <div className="mt-4 space-y-2.5">
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    ✨ AI-Generated Review Drafts:
                  </span>
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-slate-700">
                    <span className="font-bold text-indigo-900 block mb-0.5">
                      "Outstanding Experience!"
                    </span>
                    "The fresh sourdough and friendly staff made our brunch unforgettable. Highly recommend!"
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                    <span className="font-bold text-slate-800 block mb-0.5">
                      "Consistently 5 Stars"
                    </span>
                    "Always prompt service and cozy atmosphere. A must-visit downtown!"
                  </div>

                  <div className="pt-2">
                    <div className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100">
                      <Copy className="w-3.5 h-3.5" />
                      1-Click Copy &amp; Open Google
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-indigo-100/60 rounded-full blur-3xl pointer-events-none -z-10" />
      </section>

      {/* Feature Pillars */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Complete Feature Arsenal
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Everything Needed to Dominate Local Google Rankings
            </p>
            <p className="text-sm text-slate-600">
              Engineered to convert everyday in-store customers into verified 5-star Google reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-md shadow-indigo-200">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Gemini AI Review Generator
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customers choose simple tags like "friendly staff" or "fast service". Gemini AI crafts three authentic, keyword-rich review options in under a second.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-amber-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-6 shadow-md shadow-amber-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Negative Review Shield
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If a customer selects 1, 2, or 3 stars, they are automatically diverted to a private feedback form. Management receives the complaint directly before it ever hits Google.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-md shadow-indigo-200">
                <Printer className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Acrylic Stand &amp; NFC Studio
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Design countertop acrylic stands, table tents, and wallet NFC smart cards. Export vector SVGs, high-res PNGs, and print-ready templates ready for production.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-6 shadow-md shadow-purple-200">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                AI Review Reply Assistant
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Quickly draft warm, professional owner replies to any review on Google My Business. Boost customer retention and Google search algorithmic favor.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-md shadow-blue-200">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                NFC &amp; QR Dual Technology
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customers can tap their iPhone or Android device directly against your physical smart card, or scan the high-contrast QR code with their camera. Zero apps needed!
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6 shadow-md shadow-slate-300">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                White-Label Reseller Panel
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Run this software as your own digital agency business. Create custom subscription tiers, manage merchant clients, and sell physical NFC review cards with 90%+ margins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Walkthrough */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              The 3-Step Review Funnel
            </h2>
            <p className="text-3xl font-black text-slate-900 tracking-tight">
              From Countertop Tap to Google Review in 15 Seconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm relative">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center mb-4">
                1
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Tap or Scan at the Counter
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customer taps their phone on the acrylic stand or scans the QR code. Your branded mobile review card opens immediately with zero app installs required.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm relative">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center mb-4">
                2
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Smart Sentiment Routing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If the experience was poor (1–3 stars), it triggers a private feedback form. If positive (4–5 stars), Gemini AI drafts 3 custom reviews based on selected tags.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm relative">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center mb-4">
                3
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                1-Click Copy &amp; Post
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                With a single tap, the selected review text is copied to clipboard and Google opens directly. The customer pastes, taps submit, and you gain a glowing 5-star review!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Transparent Pricing
            </h2>
            <p className="text-3xl font-black text-slate-900 tracking-tight">
              Plans for Single Stores and Agency Resellers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 1 Month Plan */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
                  Monthly Trial Pass
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-4">1 Month Pass</h3>
                <p className="text-xs text-slate-500 mt-1">Perfect for trying out and boosting local reviews fast</p>
                <div className="flex items-baseline gap-1 my-6">
                  <span className="text-4xl font-black text-slate-900">₹299</span>
                  <span className="text-xs text-slate-500">/ 30 days access</span>
                </div>
                <div className="space-y-3 border-t border-slate-200/70 pt-6 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Live Smart Review Funnel &amp; QR Page</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Gemini AI Review Generator (3 Options)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Negative Review Shield (1-3★ filtered privately)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Print Studio (PDF/SVG Stand &amp; NFC Card Downloads)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>100% Instant Digital Activation (0% Gateway Fees)</span>
                  </div>
                </div>
              </div>
              <Link
                href="/create"
                className="mt-8 w-full py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs text-center transition shadow-sm"
              >
                Create &amp; Get 1 Month Pass for ₹299
              </Link>
            </div>

            {/* 1 Year / Lifetime Pass */}
            <div className="bg-indigo-950 text-white rounded-3xl p-8 border border-indigo-700 shadow-xl shadow-indigo-950/20 flex flex-col justify-between relative transform md:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-md">
                🔥 Best Value • Most Popular
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full">
                  1 Year / Lifetime Pass
                </span>
                <h3 className="text-xl font-bold text-white mt-4">1 Year / Lifetime Pass</h3>
                <p className="text-xs text-indigo-200 mt-1">Unlimited reviews with zero monthly renewal hassle</p>
                <div className="flex items-baseline gap-1 my-6">
                  <span className="text-4xl font-black text-white">₹999</span>
                  <span className="text-xs text-indigo-300">one-time payment</span>
                </div>
                <div className="space-y-3 border-t border-indigo-800/80 pt-6 text-xs text-indigo-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>Full 1 Year / Lifetime Uninterrupted Access</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Everything in 1 Month Pass included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Unlimited Gemini AI Review Generations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Print Studio: Export unlimited Countertop Stands &amp; NFC Cards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>AI Review Reply Assistant for Google My Business</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Direct UPI Payment via GPay / PhonePe / Paytm</span>
                  </div>
                </div>
              </div>
              <Link
                href="/create"
                className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs text-center shadow-lg shadow-emerald-950/30 transition"
              >
                Create &amp; Get 1 Year / Lifetime Pass for ₹999
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>ReviewSmart AI</span>
          </div>
          <div>
            Built with Next.js 14, Tailwind CSS, Prisma ORM, and Google Gemini AI.
          </div>
          <div>
            &copy; {new Date().getFullYear()} ReviewSmart AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
