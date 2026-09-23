import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Store,
  Plus,
  ExternalLink,
  Printer,
  Settings,
  Inbox,
  Sparkles,
  MapPin,
  CheckCircle2,
  Copy,
  ShieldCheck,
} from "lucide-react";
import { getAppUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BranchesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const branches = await prisma.business.findMany({
    where: { userId: user.id },
    include: {
      _count: {
        select: {
          feedbacks: true,
          analytics: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const appUrl = getAppUrl();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
            <Store className="w-3.5 h-3.5" />
            Multi-Branch Management &bull; Unlimited Stores
          </div>
          <h1 className="text-xl font-black tracking-tight">
            Your Business Outlets ({branches.length})
          </h1>
          <p className="text-xs text-slate-300 mt-0.5 max-w-lg">
            Each branch has its own Google Maps review target, standalone QR code, and 4x6 acrylic stand. Add unlimited extra branches for just ₹99 each.
          </p>
        </div>

        <Link
          href="/dashboard/billing?plan=ADDON_BRANCH"
          className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add Extra Branch (₹99)
        </Link>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((b, idx) => {
          const reviewUrl = `${appUrl}/r/${b.slug}`;
          return (
            <div
              key={b.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Branch Top info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-lg overflow-hidden flex-shrink-0">
                      {b.logoUrl ? (
                        <img
                          src={b.logoUrl}
                          alt={b.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        b.name.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-sm font-bold text-slate-900">{b.name}</h2>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[200px]">
                          {b.googleAddress || "Local Store"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex-shrink-0">
                    Active
                  </span>
                </div>

                {/* Review URL Box */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                      Live Customer Review Link:
                    </span>
                    <a
                      href={reviewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono font-semibold text-indigo-600 hover:text-indigo-800 truncate block"
                    >
                      /r/{b.slug}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={reviewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 transition"
                      title="Open Review Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Metrics Pill */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Total Scans</span>
                    <span className="text-xs font-bold text-slate-800">
                      {b._count.analytics} scans
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Shielded Complaints</span>
                    <span className="text-xs font-bold text-slate-800">
                      {b._count.feedbacks} private
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2">
                <Link
                  href={`/dashboard/studio?branchId=${b.id}`}
                  className="py-2 px-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold text-center flex items-center justify-center gap-1 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Stand Studio</span>
                </Link>
                <Link
                  href={`/dashboard/feedback?branchId=${b.id}`}
                  className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold text-center flex items-center justify-center gap-1 transition"
                >
                  <Inbox className="w-3.5 h-3.5" />
                  <span>Feedback</span>
                </Link>
                <Link
                  href={`/dashboard/settings?branchId=${b.id}`}
                  className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold text-center flex items-center justify-center gap-1 transition"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Settings</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
