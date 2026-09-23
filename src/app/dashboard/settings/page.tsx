import React from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SettingsClient from "@/components/settings/SettingsClient";

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Card &amp; AI SEO Settings ⚙️
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Customize your review card branding, negative review filter threshold, and keywords.
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
