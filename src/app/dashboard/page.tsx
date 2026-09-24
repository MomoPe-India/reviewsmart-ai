import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateQrDataUrl } from "@/lib/qr";
import { getAppUrl } from "@/lib/utils";
import DashboardClientView from "@/components/dashboard/DashboardClientView";

export default async function DashboardOverviewPage({
  searchParams,
}: {
  searchParams?: { branchId?: string };
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  let business: any = null;
  try {
    business = searchParams?.branchId
      ? await prisma.business.findFirst({
          where: { id: searchParams.branchId, userId: user.id },
          include: {
            feedbacks: {
              orderBy: { createdAt: "desc" },
              take: 5,
            },
            analytics: {
              orderBy: { createdAt: "desc" },
              take: 20,
            },
          },
        })
      : await prisma.business.findFirst({
          where: { userId: user.id },
          include: {
            feedbacks: {
              orderBy: { createdAt: "desc" },
              take: 5,
            },
            analytics: {
              orderBy: { createdAt: "desc" },
              take: 20,
            },
          },
        });
  } catch (err) {
    console.error("DashboardOverviewPage business fetch error:", err);
  }

  if (!business) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center">
        <h2 className="text-base font-bold text-slate-800">No Business Profile Found</h2>
        <p className="text-xs text-slate-500 mt-1">Please configure your first business profile in settings.</p>
        <Link
          href="/dashboard/settings"
          className="inline-block mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Setup Profile
        </Link>
      </div>
    );
  }

  // Calculate Metrics
  const totalViews = await prisma.reviewAnalytics.count({
    where: { businessId: business.id, eventType: "PAGE_VIEW" },
  });

  const aiGenerations = await prisma.reviewAnalytics.count({
    where: { businessId: business.id, eventType: "AI_GENERATED" },
  });

  const shieldSaves = await prisma.privateFeedback.count({
    where: { businessId: business.id },
  });

  const googleRedirects = await prisma.reviewAnalytics.count({
    where: { businessId: business.id, eventType: "GOOGLE_REDIRECT" },
  });

  // QR Code URL & Review Page URL
  const appUrl = getAppUrl();
  const reviewUrl = `${appUrl}/r/${business.slug}`;
  const qrDataUrl = await generateQrDataUrl(reviewUrl, {
    width: 320,
    color: { dark: business.primaryColor || "#000000", light: "#ffffff" },
  });

  // Pre-formatted WhatsApp Activation Link with full merchant identity
  const merchantPhone =
    user.phone ||
    user.userIdTag ||
    business.whatsapp ||
    business.phone ||
    "Not specified";
  const merchantOwnerName = user.name || "Business Owner";
  const channelBadge =
    business.customerType === "ONLINE" ? "Online Customer" : "Offline Merchant";

  const waActivationText = encodeURIComponent(
    `Hi ReviewSmart AI Support, I am requesting activation for my ReviewSmart AI Card.\n\n` +
      `🏪 Store Name: ${business.name}\n` +
      `👤 Owner: ${merchantOwnerName}\n` +
      `📱 Merchant Mobile / User ID: ${merchantPhone}\n` +
      `🔗 Review Link: https://reviewsmart.in/r/${business.slug}\n` +
      `💼 Channel: ${channelBadge}\n\n` +
      `Payment Pending: This review card is not yet active. Please verify my payment and activate it.`
  );
  const waActivationUrl = `https://wa.me/918639831132?text=${waActivationText}`;

  return (
    <DashboardClientView
      user={{
        name: user.name ?? null,
        phone: user.phone ?? null,
        userIdTag: user.userIdTag ?? null,
        customerType: business.customerType ?? "ONLINE",
      }}
      business={{
        id: business.id,
        name: business.name,
        slug: business.slug,
        category: business.category,
        tagline: business.tagline,
        logoUrl: business.logoUrl,
        primaryColor: business.primaryColor,
        googleAddress: business.googleAddress,
        googleReviewUrl: business.googleReviewUrl,
        minRatingForGoogle: business.minRatingForGoogle,
        customerType: business.customerType,
        isPaid: business.isPaid,
        feedbacks: business.feedbacks,
      }}
      metrics={{
        totalViews,
        aiGenerations,
        shieldSaves,
        googleRedirects,
      }}
      reviewUrl={reviewUrl}
      qrDataUrl={qrDataUrl}
      waActivationUrl={waActivationUrl}
    />
  );
}
