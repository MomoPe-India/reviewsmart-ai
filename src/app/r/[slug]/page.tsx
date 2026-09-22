import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReviewExperience from "@/components/review/ReviewExperience";
import type { Metadata } from "next";

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
      phone: true,
      whatsapp: true,
      instagram: true,
      facebook: true,
      website: true,
      minRatingForGoogle: true,
      tagChips: true,
      keywords: true,
      reviewPromptTone: true,
    },
  });

  if (!business) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center sm:py-6">
      <ReviewExperience business={business} />
    </main>
  );
}
