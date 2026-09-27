import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReviewExperience from "@/components/review/ReviewExperience";
import SmartHubExperience from "@/components/review/SmartHubExperience";
import type { Metadata } from "next";
import { MessageCircle, Sparkles, Clock } from "lucide-react";
import { getAppUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const business = await prisma.business.findUnique({
    where: { slug: params.slug },
    select: { name: true, tagline: true, logoUrl: true },
  });

  if (!business) {
    return { title: "Business Not Found" };
  }

  return {
    title: `Review ${business.name} - Official Review Portal`,
    description: business.tagline || `Share your honest feedback for ${business.name}.`,
    openGraph: {
      title: `Review ${business.name}`,
      description: business.tagline || `Share your honest feedback for ${business.name}.`,
      images: business.logoUrl ? [business.logoUrl] : [],
    },
  };
}

function formatRemainingDemoHours(expiresAt: Date): string {
  const diffMs = expiresAt.getTime() - Date.now();
  if (diffMs <= 0) return "Expired";
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${mins}m left`;
  return `${mins}m left`;
}

export default async function PublicReviewPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { staff?: string };
}) {
  const business = await prisma.business.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      name: true,
      slug: true,
      tagline: true,
      logoUrl: true,
      primaryColor: true,
      googleReviewUrl: true,
      googlePlaceId: true,
      googleAddress: true,
      phone: true,
      whatsapp: true,
      instagram: true,
      facebook: true,
      website: true,
      minRatingForGoogle: true,
      category: true,
      tagChips: true,
      keywords: true,
      reviewPromptTone: true,
      qrMode: true,
      menuUrl: true,
      customUpiId: true,
      isPaid: true,
      demoExpiresAt: true,
      demoUsed: true,
      customerType: true,
      user: {
        select: {
          name: true,
          phone: true,
          userIdTag: true,
        },
      },
    },
  });

  if (!business) {
    notFound();
  }

  const now = new Date();
  const isDemoActive =
    business.isPaid === false &&
    Boolean(business.demoExpiresAt && new Date(business.demoExpiresAt) > now);

  const isDemoExpired =
    business.isPaid === false &&
    Boolean(business.demoUsed && business.demoExpiresAt && new Date(business.demoExpiresAt) <= now);

  // Show payment watermark only for unpaid businesses that are NOT in an active demo
  const showWatermark =
    business.isPaid === false &&
    !isDemoActive &&
    business.slug !== "momo-it-technologies";

  const merchantPhone =
    business.user?.phone ||
    business.user?.userIdTag ||
    business.whatsapp ||
    business.phone ||
    "Not specified";
  const merchantOwnerName = business.user?.name || "Business Owner";
  const channelBadge =
    business.customerType === "ONLINE" ? "Online Customer" : "Offline Merchant";

  const appUrl = getAppUrl();
  const waActivationText = encodeURIComponent(
    `Hi ReviewSmart AI Support, I am requesting activation for my ReviewSmart AI Card.\n\n` +
      `🏪 Store Name: ${business.name}\n` +
      `👤 Owner: ${merchantOwnerName}\n` +
      `📱 Merchant Mobile / User ID: ${merchantPhone}\n` +
      `🔗 Review Link: ${appUrl}/r/${business.slug}\n` +
      `💼 Channel: ${channelBadge}\n\n` +
      (isDemoExpired
        ? `Evaluation Period Ended: My 24-hour evaluation has expired. Please verify my payment to unlock permanent active status.`
        : `Payment Pending: This review card is not yet active. Please verify my payment and activate it.`)
  );
  const waActivationUrl = `https://wa.me/918639831132?text=${waActivationText}`;

  return (
    <main className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-0 sm:py-8 sm:px-4 selection:bg-amber-500 selection:text-slate-950 relative">
      {/* 24-Hour Live Evaluation Banner (discreet top pill) */}
      {isDemoActive && business.demoExpiresAt && (
        <div className="w-full max-w-sm px-4 pt-3 pb-1 sm:pt-0 no-print">
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center justify-between shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate">24h Live Evaluation Trial</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-800/80 shrink-0 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {formatRemainingDemoHours(new Date(business.demoExpiresAt))}
            </span>
          </div>
        </div>
      )}

      {/* Review card or Smart Hub — blurred when unpaid and demo not active */}
      <div className={showWatermark ? "w-full blur-sm brightness-50 pointer-events-none select-none" : "w-full"}>
        {business.qrMode === "SMART_HUB" ? (
          <SmartHubExperience business={business} staff={searchParams?.staff || null} />
        ) : (
          <ReviewExperience business={business} staff={searchParams?.staff || null} />
        )}
      </div>

      {/* Payment / Expiry Watermark Overlay */}
      {showWatermark && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-md" />

          {/* Overlay card */}
          <div className="relative z-10 w-full max-w-sm bg-slate-900/90 backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 text-center flex flex-col items-center gap-4">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-1">
              {isDemoExpired ? (
                <Clock className="w-8 h-8 text-amber-400" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8 text-amber-400"
                >
                  <rect x="2" y="5" width="20" height="14" rx="3" />
                  <path d="M2 10h20" />
                </svg>
              )}
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {isDemoExpired ? "Evaluation Period Ended" : "Payment Pending"}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                {isDemoExpired
                  ? "The 24-hour evaluation period for this review card has ended. Complete payment to restore permanent active status."
                  : "This review card is not yet active. Contact ReviewSmart AI support to activate it."}
              </p>
            </div>

            {/* Merchant Details Pill */}
            <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3 text-left space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500 font-medium">Business:</span>
                <span className="font-bold text-white truncate max-w-[170px]">{business.name}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500 font-medium">Merchant ID:</span>
                <span className="font-mono font-bold text-amber-400">{merchantPhone}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500 font-medium">Review Card:</span>
                <span className="font-mono text-[11px] text-slate-400 truncate max-w-[160px]">/r/{business.slug}</span>
              </div>
            </div>

            {/* WhatsApp CTA with complete details */}
            <a
              href={waActivationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-950/50 transition-all duration-200 mt-1 transform active:scale-98"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>
                {isDemoExpired ? "Upgrade & Activate on WhatsApp" : "Contact ReviewSmart AI on WhatsApp"}
              </span>
            </a>

            {/* Badge */}
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Powered by ReviewSmart AI
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
