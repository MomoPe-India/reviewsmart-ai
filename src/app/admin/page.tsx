import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  IndianRupee,
  Users,
  UserCheck,
  Receipt,
  Clock,
  Wifi,
  WifiOff,
  ArrowUpRight,
  Building2,
  TrendingUp,
} from "lucide-react";

export const dynamic = "force-dynamic";

function formatDate(date: Date): string {
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default async function AdminOverviewPage() {
  let revenue = 0;
  let totalDeals = 0;
  let pendingDeals = 0;
  let totalMerchants = 0;
  let totalAgents = 0;
  let onlineDeals = 0;
  let offlineDeals = 0;
  let recentPayments: any[] = [];

  try {
    const [
      totalRevenueResult,
      dealsCount,
      pendingCount,
      merchantsCount,
      agentsCount,
      onlineCount,
      offlineCount,
      payments,
    ] = await Promise.all([
      prisma.upiPayment.aggregate({
        where: { status: "APPROVED" },
        _sum: { amount: true },
      }),
      prisma.upiPayment.count(),
      prisma.upiPayment.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { role: "BUSINESS_OWNER" } }),
      prisma.user.count({ where: { role: "MARKETING_AGENT" } }),
      prisma.upiPayment.count({ where: { planType: "ONLINE_DIRECT" } }),
      prisma.upiPayment.count({ where: { planType: "NEGOTIATED_DEAL" } }),
      prisma.upiPayment.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: {
          user: {
            select: {
              name: true,
              businesses: { select: { name: true, slug: true, customerType: true }, take: 1 },
            },
          },
        },
      }),
    ]);

    revenue = totalRevenueResult._sum.amount ?? 0;
    totalDeals = dealsCount;
    pendingDeals = pendingCount;
    totalMerchants = merchantsCount;
    totalAgents = agentsCount;
    onlineDeals = onlineCount;
    offlineDeals = offlineCount;
    recentPayments = payments;
  } catch (err) {
    console.error("AdminOverviewPage data fetch error:", err);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Platform Overview
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Live revenue, deal activity, and merchant metrics across the platform.
          </p>
        </div>

        <Link
          href="/admin/merchants"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition self-start sm:self-auto"
        >
          <Users className="w-4 h-4" />
          Add New Merchant
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-400">
              ₹{revenue.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Sum of all approved payments</p>
        </div>

        {/* Total Deals */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Deals</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{totalDeals}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">All-time UPI payment transactions</p>
        </div>

        {/* Total Merchants */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Merchants</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{totalMerchants}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Registered business owner accounts</p>
        </div>

        {/* Total Agents */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Agents</span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{totalAgents}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active marketing agents on field</p>
        </div>
      </div>

      {/* Deal Channel Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Online Deals */}
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Online Deals</p>
            <p className="text-xl font-black text-sky-400">{onlineDeals}</p>
            <p className="text-[10px] text-slate-500">ONLINE_DIRECT channel</p>
          </div>
        </div>

        {/* Offline Deals */}
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0">
            <WifiOff className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Offline Deals</p>
            <p className="text-xl font-black text-orange-400">{offlineDeals}</p>
            <p className="text-[10px] text-slate-500">NEGOTIATED_DEAL channel</p>
          </div>
        </div>

        {/* Pending Deals */}
        <div className="bg-slate-800 p-4 rounded-2xl border border-amber-500/20 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Pending Review</p>
            <p className="text-xl font-black text-amber-400">{pendingDeals}</p>
            <p className="text-[10px] text-slate-500">Awaiting approval</p>
          </div>
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            Recent Payments &amp; Deals
          </h2>
          <Link
            href="/admin/payments"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
          >
            View All
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="pb-3 font-semibold">Business</th>
                <th className="pb-3 font-semibold">Agent Code</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Channel</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {recentPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No payments recorded yet.
                  </td>
                </tr>
              ) : (
                recentPayments.map((pmt) => {
                  const businessName = pmt.user?.businesses?.[0]?.name ?? "No Business";
                  const agentCode = (pmt as { agentCode?: string | null }).agentCode ?? "—";
                  const isOnline = pmt.planType === "ONLINE_DIRECT";
                  const status = pmt.status as string;

                  return (
                    <tr key={pmt.id} className="hover:bg-slate-700/30 transition">
                      <td className="py-3 font-bold text-white whitespace-nowrap">
                        {businessName}
                      </td>
                      <td className="py-3 text-slate-300 font-mono">
                        {agentCode}
                      </td>
                      <td className="py-3 font-bold text-emerald-400 whitespace-nowrap">
                        ₹{pmt.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3">
                        {isOnline ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            💻 Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                            🤝 Offline
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        {status === "APPROVED" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            ✓ Approved
                          </span>
                        )}
                        {status === "PENDING" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            ⏳ Pending
                          </span>
                        )}
                        {status === "REJECTED" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                            ✕ Rejected
                          </span>
                        )}
                        {status !== "APPROVED" && status !== "PENDING" && status !== "REJECTED" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-600/50 text-slate-300 border border-slate-600">
                            {status}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-slate-400 text-right whitespace-nowrap">
                        {formatDate(pmt.createdAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
