import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/utils";
import PrintStudioClient from "@/components/studio/PrintStudioClient";
import {
  Printer,
  Sparkles,
  ExternalLink,
  Truck,
  MessageCircle,
} from "lucide-react";

export default async function StudioPage({
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

  if (!business) {
    redirect("/dashboard/settings");
  }

  const appUrl = getAppUrl();
  const reviewUrl = `${appUrl}/r/${business.slug}`;

  const waCourierText = encodeURIComponent(
    `Hi ReviewSmart AI team! I am using ReviewSmart AI for "${business.name}" (Slug: ${business.slug}). I want to order physical pre-printed acrylic standee units shipped to my shop address.`
  );
  const waCourierLink = `https://wa.me/918639831132?text=${waCourierText}`;

  return (
    <div className="space-y-6">
      {/* Top Banner: Standee Studio Access + Optional Courier Request */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xl no-print">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Full Standee Studio &bull; 300 DPI Vector PDF Generator</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
            Print &amp; Counter Display Studio 🖨️
          </h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Customize, preview, and download print-ready files for your counter. Download vector PDFs to print at any local xerox or photo shop anytime with zero reprint fees!
          </p>
        </div>

        <a
          href={waCourierLink}
          target="_blank"
          rel="noreferrer"
          className="self-start md:self-auto px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition active:scale-95 shrink-0"
        >
          <Truck className="w-4 h-4" />
          <span>Order Physical Acrylic Kit Delivery</span>
        </a>
      </div>

      {/* Main Print Studio Component */}
      <PrintStudioClient business={business} reviewUrl={reviewUrl} />
    </div>
  );
}
