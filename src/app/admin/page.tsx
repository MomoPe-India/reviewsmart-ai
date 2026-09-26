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
  Plus,
  ShieldCheck,
  Award
} from "lucide-react";
import AdminComposerTriggerButton from "@/components/admin/AdminComposerTriggerButton";

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
  let todayRevenue = 0;
  let agentLeaderboard: any[] = [];

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

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
      todayRevenueResult,
      leaderboardData
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
      prisma.upiPayment.aggregate({
        where: { status: "APPROVED", createdAt: { gte: todayStart } },
        _sum: { amount: true },
      }),
      prisma.upiPayment.groupBy({
        by: ['agentCode'],
        where: { agentCode: { not: null }, status: 'APPROVED' },
        _sum: { amount: true },
        _count: { id: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 5,
      })
    ]);

    revenue = totalRevenueResult._sum.amount ?? 0;
    totalDeals = dealsCount;
    pendingDeals = pendingCount;
    totalMerchants = merchantsCount;
    totalAgents = agentsCount;
    onlineDeals = onlineCount;
    offlineDeals = offlineCount;
    recentPayments = payments;
    todayRevenue = todayRevenueResult._sum.amount ?? 0;
    agentLeaderboard = leaderboardData;
  } catch (err) {
    console.error("AdminOverviewPage data fetch error:", err);
  }

  const conversionRate = totalMerchants > 0 ? ((totalDeals / totalMerchants) * 100).toFixed(0) : "0";

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
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin/merchants"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1.5 shadow-sm border border-slate-700 transition"
        >
          <Plus className="w-3.5 h-3.5 text-blue-400" />
          Add Merchant
        </Link>
        <Link
          href="/admin/agents"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1.5 shadow-sm border border-slate-700 transition"
        >
          <UserCheck className="w-3.5 h-3.5 text-violet-400" />
          Create Agent
        </Link>
        <Link
          href="/admin/payments?status=PENDING"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1.5 shadow-sm border border-slate-700 transition"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          Verify Payments
        </Link>
      </div>

      {/* Antigravity AI Command Composer Hero Banner */}
      <AdminComposerTriggerButton />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Link
          href="/admin/payments?status=APPROVED"
          className="bg-gradient-to-br from-slate-800 to-slate-800/60 hover:bg-slate-750 p-5 rounded-2xl border-y border-r border-slate-700 border-l-[3px] border-l-emerald-500 shadow-sm transition-all group block cursor-pointer"
          title="Click to view all approved revenue and payments"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
              Total Revenue
            </span>
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <IndianRupee className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-400">
              ₹{revenue.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
            <span>All-time approved</span>
            <span className="text-emerald-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              View →
            </span>
          </div>
        </Link>

        {/* Total Deals */}
        <Link
          href="/admin/payments"
          className="bg-gradient-to-br from-slate-800 to-slate-800/60 hover:bg-slate-750 p-5 rounded-2xl border-y border-r border-slate-700 border-l-[3px] border-l-indigo-500 shadow-sm transition-all group block cursor-pointer relative"
          title="Click to view all deal transactions"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
              Total Deals
            </span>
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Receipt className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-2xl font-black text-white">{totalDeals}</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
              {conversionRate}% Conv.
            </span>
          </div>
          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
            <span>UPI payment transactions</span>
            <span className="text-indigo-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              View →
            </span>
          </div>
        </Link>

        {/* Total Merchants */}
        <Link
          href="/admin/merchants"
          className="bg-gradient-to-br from-slate-800 to-slate-800/60 hover:bg-slate-750 p-5 rounded-2xl border-y border-r border-slate-700 border-l-[3px] border-l-blue-500 shadow-sm transition-all group block cursor-pointer"
          title="Click to manage merchant accounts"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
              Total Merchants
            </span>
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{totalMerchants}</span>
          </div>
          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
            <span>Registered businesses</span>
            <span className="text-blue-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Manage →
            </span>
          </div>
        </Link>

        {/* Today's Revenue */}
        <Link
          href="/admin/payments?status=APPROVED"
          className="bg-gradient-to-br from-slate-800 to-slate-800/60 hover:bg-slate-750 p-5 rounded-2xl border-y border-r border-slate-700 border-l-[3px] border-l-emerald-400 shadow-sm transition-all group block cursor-pointer"
          title="Click to view today's revenue"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
              Today's Revenue
            </span>
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-300 transition-colors" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-300">
              ₹{todayRevenue.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
            <span>Since midnight</span>
            <span className="text-emerald-300 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              View →
            </span>
          </div>
        </Link>
      </div>

      {/* Deal Channel Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Online Deals */}
        <Link
          href="/admin/payments?channel=ONLINE"
          className="bg-slate-800 hover:bg-slate-750 p-4 rounded-2xl border border-slate-700 hover:border-sky-500/50 flex items-center justify-between gap-4 transition-all group cursor-pointer"
          title="Click to view online self-serve deals"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider group-hover:text-slate-300 transition-colors">
                Online Deals
              </p>
              <p className="text-xl font-black text-sky-400">{onlineDeals}</p>
              <p className="text-[10px] text-slate-500">ONLINE_DIRECT channel</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
        </Link>

        {/* Offline Deals */}
        <Link
          href="/admin/payments?channel=OFFLINE"
          className="bg-slate-800 hover:bg-slate-750 p-4 rounded-2xl border border-slate-700 hover:border-orange-500/50 flex items-center justify-between gap-4 transition-all group cursor-pointer"
          title="Click to view offline field agent deals"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <WifiOff className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider group-hover:text-slate-300 transition-colors">
                Offline Deals
              </p>
              <p className="text-xl font-black text-orange-400">{offlineDeals}</p>
              <p className="text-[10px] text-slate-500">NEGOTIATED_DEAL channel</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-orange-400 transition-colors" />
        </Link>

        {/* Pending Deals */}
        <Link
          href="/admin/payments?status=PENDING"
          className="bg-slate-800 hover:bg-slate-750 p-4 rounded-2xl border border-amber-500/30 hover:border-amber-400 flex items-center justify-between gap-4 transition-all group cursor-pointer shadow-sm shadow-amber-950/20"
          title="Click to review and approve pending payments"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider group-hover:text-slate-300 transition-colors">
                Pending Review
              </p>
              <p className="text-xl font-black text-amber-400">{pendingDeals}</p>
              <p className="text-[10px] text-amber-300/80">Awaiting approval</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Payments Table */}
        <div className="lg:col-span-2 bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              Recent Payments &amp; Deals
            </h2>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-700">
                <tr>
                  <th className="pb-3 font-semibold">Business</th>
                  <th className="pb-3 font-semibold">Agent Code</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
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
                    const agentCode = pmt.agentCode ?? "—";
                    const status = pmt.status as string;

                    return (
                      <tr key={pmt.id} className="hover:bg-slate-700/50 transition">
                        <td className="py-3 font-bold text-white whitespace-nowrap">
                          {businessName}
                        </td>
                        <td className="py-3 font-mono text-slate-300">
                          {agentCode}
                        </td>
                        <td className="py-3 font-bold text-emerald-400 whitespace-nowrap">
                          ₹{pmt.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3">
                          {status === "APPROVED" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Approved
                            </span>
                          )}
                          {status === "PENDING" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Pending
                            </span>
                          )}
                          {status === "REJECTED" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-slate-400 whitespace-nowrap">
                          {formatDate(pmt.createdAt)}
                        </td>
                        <td className="py-3 text-right whitespace-nowrap">
                          {status === "PENDING" ? (
                            <Link
                              href="/admin/payments?status=PENDING"
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold inline-flex items-center gap-1 transition shadow-sm"
                            >
                              Verify
                            </Link>
                          ) : (
                            <Link
                              href="/admin/payments"
                              className="px-2.5 py-1 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-[10px] font-bold inline-flex items-center gap-1 transition"
                            >
                              View
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-end">
            <Link
              href="/admin/payments"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 group"
            >
              <span>View All →</span>
            </Link>
          </div>
        </div>

        {/* Live Agent Leaderboard */}
        <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Live Agent Leaderboard
            </h2>
          </div>
          <div className="space-y-4">
            {agentLeaderboard.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No active agent sales yet.
              </div>
            ) : (
              agentLeaderboard.map((agt, idx) => {
                const rank = idx + 1;
                let rankBadge = `${rank}️⃣`;
                if (rank === 1) rankBadge = "🥇";
                if (rank === 2) rankBadge = "🥈";
                if (rank === 3) rankBadge = "🥉";

                return (
                  <div key={agt.agentCode} className="flex items-center justify-between p-3 rounded-2xl bg-slate-700/30 border border-slate-700/50 hover:bg-slate-700/50 transition">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{rankBadge}</span>
                      <div>
                        <div className="text-sm font-bold text-white font-mono">{agt.agentCode}</div>
                        <div className="text-[10px] text-slate-400">{agt._count.id} Deals</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-emerald-400">
                        ₹{(agt._sum.amount ?? 0).toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-slate-500">Revenue</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
