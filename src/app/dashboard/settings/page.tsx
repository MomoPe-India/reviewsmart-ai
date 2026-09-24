import React from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SettingsClient from "@/components/settings/SettingsClient";
import { Sparkles, Globe, ShieldCheck } from "lucide-react";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: { branchId?: string };
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

  const isOnline = business?.customerType === "ONLINE";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                isOnline
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}
            >
              {isOnline ? "💻 Online Digital Card" : "🤝 Offline Merchant"}
            </span>
            {business && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  business.isPaid
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {business.isPaid ? "✓ Live & Active" : "⏳ Payment Pending (Watermark Active)"}
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isOnline ? "Customise Your Digital SmartReview AI Card ✨" : "Card & AI SEO Settings ⚙️"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time interactive editor with live phone preview. Any edits you make here will be reflected instantly on your customer card.
          </p>
        </div>
      </div>

      {business ? (
        <SettingsClient business={business} />
      ) : (
        <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center">
          <p className="text-xs text-slate-500">No business profile found to configure.</p>
        </div>
      )}
    </div>
  );
}
