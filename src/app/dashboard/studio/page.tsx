import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/utils";
import PrintStudioClient from "@/components/studio/PrintStudioClient";
import {
  Printer,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Store,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Settings,
} from "lucide-react";

export default async function StudioPage({
  searchParams,
}: {
  searchParams?: { branchId?: string };
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const business = searchParams?.branchId
    ? await prisma.business.findFirst({
        where: { id: searchParams.branchId, userId: user.id },
      })
    : await prisma.business.findFirst({
        where: { userId: user.id },
      });

  if (!business) {
    redirect("/dashboard/settings");
  }

  const appUrl = getAppUrl();
  const reviewUrl = `${appUrl}/r/${business.slug}`;
  const isOnlineCustomer = business.customerType === "ONLINE";

  // If customer is an ONLINE digital card user, show the Physical Standee Upgrade Showcase
  if (isOnlineCustomer) {
    const waText = encodeURIComponent(
      `Hi MomoPe, I am using the Digital SmartReview Card for "${business.name}" (Slug: ${business.slug}). I want to upgrade and order a physical 4"x6" acrylic countertop standee & NFC kit for my counter.`
    );
    const waOrderLink = `https://wa.me/918639831132?text=${waText}`;

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header Breadcrumb / Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold mb-2">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>Digital Review Card Customer</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Physical Counter Standee Upgrade 🖨️
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Your account currently includes the online digital SmartReview AI Card. Need a physical acrylic standee for your store counter?
            </p>
          </div>

          <Link
            href="/dashboard/settings"
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            Customise Digital Card
          </Link>
        </div>

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Copy */}
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-extrabold text-[11px] border border-amber-400/30">
                ⭐ Premium Offline Kit
              </span>
              <h2 className="text-2xl font-black text-white leading-tight">
                Turn Walk-In Footfall into 5-Star Google Reviews
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Upgrade to our offline merchant package to receive custom-crafted physical hardware shipped directly to your counter.
              </p>

              <div className="space-y-2.5 pt-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-200">
                    <strong>4&quot;×6&quot; (A6) Portrait Acrylic Standee</strong>: Heavy crystal acrylic with vibrant UV back-print of your business logo and colors.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-200">
                    <strong>Tap-to-Review NFC Chip</strong>: Customers tap their smartphone directly on the standee to launch your review card instantly.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-200">
                    <strong>Counter QR Code Sticker</strong>: Weatherproof matte decal for your billing desk or dining tables.
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={waOrderLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition transform active:scale-98"
                >
                  {/* WhatsApp SVG Icon */}
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.288.043.088.072.19.014.305-.058.115-.087.187-.173.289l-.26.309c-.087.086-.18.18-.077.355.101.174.452.744.97 1.206.666.593 1.228.777 1.401.864.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z" />
                  </svg>
                  <span>Order Physical Standee on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <Link
                  href="/dashboard/settings"
                  className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs text-center border border-white/10 transition"
                >
                  Continue with Digital Card
                </Link>
              </div>
            </div>

            {/* Right Visual Graphic */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-3xl border border-white/10 text-center">
              <div className="w-32 h-44 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-400/50 shadow-2xl p-3 flex flex-col items-center justify-between text-center relative overflow-hidden mb-3">
                <div className="w-full flex items-center justify-between">
                  <span className="text-[8px] font-black text-amber-400">SMARTREVIEW</span>
                  <span className="text-[8px] text-slate-400">NFC TAP</span>
                </div>
                <div className="w-16 h-16 rounded-xl bg-white p-1 flex items-center justify-center shadow-md">
                  <QrCode className="w-full h-full text-slate-950" />
                </div>
                <div className="w-full">
                  <p className="text-[9px] font-black text-white truncate">{business.name}</p>
                  <p className="text-[7px] text-amber-300">Tap or Scan to Review</p>
                </div>
              </div>
              <p className="text-xs font-bold text-white">4&quot;×6&quot; Portrait Acrylic Stand</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                UV High Gloss • Embedded NFC • Scratch Proof
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Store className="w-4 h-4 text-indigo-600" />
            Digital Card vs. Physical Standee Package
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Your Current Plan</span>
                <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-indigo-900">Digital SmartReview Card</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Ideal for online consultation, WhatsApp billing, Instagram bio link, and post-service SMS follow-ups.
              </p>
              <ul className="text-xs space-y-1 text-slate-600 pt-2">
                <li>✓ Branded `/r/${business.slug}` live link</li>
                <li>✓ AI 5-Star Review Generator</li>
                <li>✓ Negative Feedback Intercept Shield</li>
                <li>✓ Instant WhatsApp Contact Integration</li>
                <li>✕ Physical Standee Hardware</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900">Available Upgrade</span>
                <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  Recommended for Shops
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">Physical Counter Standee Kit</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Designed for retail counters, dental clinics, salons, cafes, and restaurant billing desks.
              </p>
              <ul className="text-xs space-y-1 text-slate-700 pt-2">
                <li>✓ Everything in Digital Card</li>
                <li>✓ 4&quot;×6&quot; Portrait Acrylic Standee</li>
                <li>✓ Embedded Tap-to-Review NFC Chip</li>
                <li>✓ Counter QR Code Decals</li>
                <li>✓ Fast Doorstep Courier Delivery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For OFFLINE merchants: Render standard PrintStudioClient
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 no-print">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Print &amp; Standee Studio 🖨️
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Design, preview and export your print-ready 4&quot;×6&quot; (A6) portrait acrylic countertop standee and NFC decals.
          </p>
        </div>
      </div>

      <PrintStudioClient business={business} reviewUrl={reviewUrl} />
    </div>
  );
}
