import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Users,
  Store,
  CreditCard,
  Sparkles,
  ArrowUpRight,
  Plus,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const totalUsers = await prisma.user.count({
    where: { role: "BUSINESS_OWNER" },
  });

  const totalBusinesses = await prisma.business.count();

  const totalActiveSubscriptions = await prisma.userSubscription.count({
    where: { status: "ACTIVE" },
  });

  const plans = await prisma.subscriptionPlan.findMany({
    include: {
      subscriptions: {
        where: { status: "ACTIVE" },
      },
    },
  });

  // Calculate approximate MRR
  let mrr = 0;
  for (const plan of plans) {
    mrr += plan.price * plan.subscriptions.length;
  }

  const recentUsers = await prisma.user.findMany({
    where: { role: "BUSINESS_OWNER" },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      businesses: true,
      subscription: {
        include: { plan: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">
            Reseller Platform Overview 💼
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor client accounts, subscription revenue, and review card volume.
          </p>
        </div>

        <Link
          href="/admin/plans"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          Create New Plan
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Client Businesses</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{totalBusinesses}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active review card storefronts</p>
        </div>

        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Merchants</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{totalUsers}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Registered customer accounts</p>
        </div>

        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Subscriptions</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-400">
              {totalActiveSubscriptions}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Paying subscriber base</p>
        </div>

        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Estimated MRR</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-amber-400">
              ${mrr.toFixed(2)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Monthly recurring subscription revenue</p>
        </div>
      </div>

      {/* Recent Merchant Registrations */}
      <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            Recent Client Signups
          </h2>
          <Link
            href="/admin/businesses"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            View All Clients
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="pb-3 font-semibold">Client / Business</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Subscription Plan</th>
                <th className="pb-3 font-semibold">Joined Date</th>
                <th className="pb-3 font-semibold text-right">Review Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {recentUsers.map((u) => {
                const b = u.businesses[0];
                return (
                  <tr key={u.id} className="hover:bg-slate-700/30 transition">
                    <td className="py-3 font-bold text-white">
                      {b?.name || "No Business Setup"}
                    </td>
                    <td className="py-3 text-slate-300">{u.email}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {u.subscription?.plan?.name || "Free Trial"}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      {b ? (
                        <a
                          href={`/r/${b.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                        >
                          /{b.slug}
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
