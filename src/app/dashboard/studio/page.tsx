import React from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/utils";
import PrintStudioClient from "@/components/studio/PrintStudioClient";

export default async function StudioPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const business = await prisma.business.findFirst({
    where: { userId: user.id },
  });

  if (!business) {
    redirect("/dashboard/settings");
  }

  const appUrl = getAppUrl();
  const reviewUrl = `${appUrl}/r/${business.slug}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Print &amp; NFC Card Studio 🖨️
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Design and export print-ready acrylic countertop stands, table tents, and NFC tags.
          </p>
        </div>
      </div>

      <PrintStudioClient business={business} reviewUrl={reviewUrl} />
    </div>
  );
}
