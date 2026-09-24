import React from "react";
import { prisma } from "@/lib/prisma";
import { Store, ArrowUpRight, ShieldCheck, Globe, UserCheck, CheckCircle2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBusinessesPage() {
  let businesses: any[] = [];
  try {
    businesses = await prisma.business.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { email: true, name: true, phone: true, userIdTag: true },
        },
        feedbacks: {
          select: { id: true },
        },
        analytics: {
          select: { id: true },
        },
      },
    });
  } catch (err) {
    console.error("AdminBusinessesPage fetch error:", err);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <Store className="w-5 h-5 text-indigo-400" />
          Client Businesses &amp; Cards ({businesses.length})
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Directory of all live store review pages, client owners, channel source, and traffic activity.
        </p>
      </div>

      <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase tracking-wider bg-slate-800/80 border-b border-slate-700">
              <tr>
                <th className="py-3 px-4 font-semibold">Business</th>
                <th className="py-3 px-4 font-semibold">Channel</th>
                <th className="py-3 px-4 font-semibold">Owner</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Shield Intercepts</th>
                <th className="py-3 px-4 font-semibold">Created</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {businesses.map((b) => (
                <tr key={b.id} className="hover:bg-slate-700/30 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: b.primaryColor || "#4f46e5" }}
                      />
                      <span>{b.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      /r/{b.slug}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {b.customerType === "ONLINE" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                        <Globe className="w-2.5 h-2.5" /> Online
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                        <UserCheck className="w-2.5 h-2.5" /> Offline
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div className="font-semibold text-white">{b.user.name || "Owner"}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {b.user.phone || b.user.userIdTag || b.user.email}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {b.isPaid ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                        <Clock className="w-3 h-3" /> Pending Payment
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                      {b.feedbacks.length} filtered
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`/r/${b.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-semibold transition border border-indigo-500/30"
                      >
                        Visit Card
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                      <a
                        href="/admin/merchants"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition"
                      >
                        Manage
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
