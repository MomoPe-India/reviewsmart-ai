import React from "react";
import { prisma } from "@/lib/prisma";
import AdminPlansClient from "@/components/admin/AdminPlansClient";

export const dynamic = "force-dynamic";

export default async function AdminPlansPage() {
  const plans = await prisma.subscriptionPlan.findMany({
    orderBy: { price: "asc" },
    include: {
      _count: {
        select: { subscriptions: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-white tracking-tight">
          Subscription &amp; Pricing Plans 💳
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure tier pricing, card quotas, duration, and feature packages for your merchant clients.
        </p>
      </div>

      <AdminPlansClient initialPlans={plans} />
    </div>
  );
}
