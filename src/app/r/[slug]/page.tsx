import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReviewExperience from "@/components/review/ReviewExperience";
import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";

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

export default async function PublicReviewPage({
  params,
}: {
  params: { slug: string };
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
      isPaid: true,
    },
  });

  if (!business) {
    notFound();
  }

  // Show payment watermark for unpaid businesses (except the demo slug)
  const showWatermark =
    business.isPaid === false && business.slug !== "momo-it-technologies";

  return (
    <main className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-0 sm:py-8 sm:px-4 selection:bg-amber-500 selection:text-slate-950 relative">
      {/* Review card — blurred when unpaid */}
      <div className={showWatermark ? "w-full blur-sm brightness-50 pointer-events-none select-none" : "w-full"}>
        <ReviewExperience business={business} />
      </div>

      {/* Payment Pending Watermark Overlay */}
      {showWatermark && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />

          {/* Overlay card */}
          <div className="relative z-10 w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/60 text-center flex flex-col items-center gap-4">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-1">
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
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Payment Pending
              </h2>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                This review card is not yet active.{" "}
                <br className="hidden sm:block" />
                Contact MomoPe support to activate it.
              </p>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/918639831132"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-900/40 transition-all duration-200 mt-1"
            >
              <MessageCircle className="w-4 h-4" />
              Contact MomoPe on WhatsApp
            </a>

            {/* Badge */}
            <p className="text-[11px] text-slate-600 font-medium mt-1">
              Powered by ReviewSmart AI · MomoPe India
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
