import React from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BillingClient from "@/components/billing/BillingClient";

export default async function BillingPage({
  searchParams,
}: {
  searchParams?: { branchId?: string; plan?: string };
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

  const subscription = await prisma.userSubscription.findUnique({
    where: { userId: user.id },
    include: { plan: true },
  });

  const settings = await prisma.platformSetting.findUnique({
    where: { id: "default" },
  });

  const recentPayments = await prisma.upiPayment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Card Activation &amp; Direct UPI Billing 🇮🇳
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Pay directly via Google Pay, PhonePe, or Paytm with zero gateway fees.
        </p>
      </div>

      <BillingClient
        business={business}
        subscription={subscription}
        settings={settings}
        recentPayments={recentPayments}
        initialPlan={searchParams?.plan === "ADDON_BRANCH" ? "ADDON_BRANCH" : "MONTHLY_299"}
      />
    </div>
  );
}
