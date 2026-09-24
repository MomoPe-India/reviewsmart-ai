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
        <Link
          href="/admin/payments?status=APPROVED"
          className="bg-slate-800 hover:bg-slate-750 p-5 rounded-2xl border border-slate-700 hover:border-emerald-500/50 shadow-sm transition-all group block cursor-pointer"
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
            <span>Sum of all approved payments</span>
            <span className="text-emerald-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              View →
            </span>
          </div>
        </Link>

        {/* Total Deals */}
        <Link
          href="/admin/payments"
          className="bg-slate-800 hover:bg-slate-750 p-5 rounded-2xl border border-slate-700 hover:border-indigo-500/50 shadow-sm transition-all group block cursor-pointer"
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
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{totalDeals}</span>
          </div>
          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
            <span>All-time UPI payment transactions</span>
            <span className="text-indigo-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              View →
            </span>
          </div>
        </Link>

        {/* Total Merchants */}
        <Link
          href="/admin/merchants"
          className="bg-slate-800 hover:bg-slate-750 p-5 rounded-2xl border border-slate-700 hover:border-blue-500/50 shadow-sm transition-all group block cursor-pointer"
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
            <span>Registered business owner accounts</span>
            <span className="text-blue-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Manage →
            </span>
          </div>
        </Link>

        {/* Total Agents */}
        <Link
          href="/admin/agents"
          className="bg-slate-800 hover:bg-slate-750 p-5 rounded-2xl border border-slate-700 hover:border-violet-500/50 shadow-sm transition-all group block cursor-pointer"
          title="Click to manage field marketing agents"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
              Total Agents
            </span>
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserCheck className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400 transition-colors" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{totalAgents}</span>
          </div>
          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
            <span>Active marketing agents on field</span>
            <span className="text-violet-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Manage →
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

      {/* Recent Payments Table */}
      <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            Recent Payments &amp; Deals
          </h2>
          <Link
            href="/admin/payments"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {recentPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
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
                        <Link
                          href="/admin/businesses"
                          className="hover:text-indigo-400 transition inline-flex items-center gap-1"
                          title="Click to view businesses directory"
                        >
                          <span>{businessName}</span>
                        </Link>
                      </td>
                      <td className="py-3 font-mono">
                        {agentCode !== "—" ? (
                          <Link
                            href={`/admin/agents?search=${agentCode}`}
                            className="text-slate-300 hover:text-amber-400 transition font-bold underline decoration-slate-600 underline-offset-2"
                            title={`Filter agents for ${agentCode}`}
                          >
                            {agentCode}
                          </Link>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="py-3 font-bold text-emerald-400 whitespace-nowrap">
                        <Link
                          href="/admin/payments"
                          className="hover:underline decoration-emerald-500/50"
                          title="Click to view payment"
                        >
                          ₹{pmt.amount.toLocaleString("en-IN")}
                        </Link>
                      </td>
                      <td className="py-3">
                        <Link
                          href={isOnline ? "/admin/payments?channel=ONLINE" : "/admin/payments?channel=OFFLINE"}
                          title={`Filter ${isOnline ? "Online" : "Offline"} payments`}
                          className="inline-block"
                        >
                          {isOnline ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 transition">
                              💻 Online
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30 transition">
                              🤝 Offline
                            </span>
                          )}
                        </Link>
                      </td>
                      <td className="py-3">
                        <Link
                          href={`/admin/payments?status=${status}`}
                          title={`Filter ${status} payments`}
                          className="inline-block"
                        >
                          {status === "APPROVED" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition">
                              ✓ Approved
                            </span>
                          )}
                          {status === "PENDING" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition">
                              ⏳ Pending
                            </span>
                          )}
                          {status === "REJECTED" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition">
                              ✕ Rejected
                            </span>
                          )}
                          {status !== "APPROVED" && status !== "PENDING" && status !== "REJECTED" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-600/50 text-slate-300 border border-slate-600">
                              {status}
                            </span>
                          )}
                        </Link>
                      </td>
                      <td className="py-3 text-slate-400 whitespace-nowrap">
                        {formatDate(pmt.createdAt)}
                      </td>
                      <td className="py-3 text-right whitespace-nowrap">
                        {status === "PENDING" ? (
                          <Link
                            href="/admin/payments?status=PENDING"
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold inline-flex items-center gap-1 transition shadow-sm"
                            title="Verify and approve payment"
                          >
                            <span>Verify</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        ) : (
                          <Link
                            href="/admin/payments"
                            className="px-2.5 py-1 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-[10px] font-bold inline-flex items-center gap-1 transition"
                            title="View deal record"
                          >
                            <span>View</span>
                            <ArrowUpRight className="w-3 h-3" />
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
      </div>
    </div>
  );
}
