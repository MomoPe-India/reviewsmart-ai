import React from "react";
import { prisma } from "@/lib/prisma";
import { Store, ArrowUpRight, ShieldCheck, Mail, Phone, Calendar } from "lucide-react";

export default async function AdminBusinessesPage() {
  const businesses = await prisma.business.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { email: true, name: true },
      },
      feedbacks: {
        select: { id: true },
      },
      analytics: {
        select: { id: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-white tracking-tight">
          Client Businesses &amp; Review Cards ({businesses.length}) 🏢
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Directory of all live store review pages, client owners, and traffic activity.
        </p>
      </div>

      <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase tracking-wider bg-slate-800/80 border-b border-slate-700">
              <tr>
                <th className="py-3 px-4 font-semibold">Business</th>
                <th className="py-3 px-4 font-semibold">Owner</th>
                <th className="py-3 px-4 font-semibold">Slug URL</th>
                <th className="py-3 px-4 font-semibold">Shield Threshold</th>
                <th className="py-3 px-4 font-semibold">Shield Saves</th>
                <th className="py-3 px-4 font-semibold">Created</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {businesses.map((b) => (
                <tr key={b.id} className="hover:bg-slate-700/30 transition">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: b.primaryColor || "#4f46e5" }}
                    />
                    {b.name}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div>{b.user.name || "Owner"}</div>
                    <div className="text-[10px] text-slate-400">{b.user.email}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-indigo-400">
                    /r/{b.slug}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    &ge; {b.minRatingForGoogle} Stars to Google
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                      {b.feedbacks.length} intercepted
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={`/r/${b.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-semibold transition border border-indigo-500/30"
                    >
                      Visit Card
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
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
