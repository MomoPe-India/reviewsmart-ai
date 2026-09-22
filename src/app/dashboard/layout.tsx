import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import {
  LayoutDashboard,
  QrCode,
  Printer,
  Inbox,
  Sparkles,
  Settings,
  ExternalLink,
  Store,
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const business = await prisma.business.findFirst({
    where: { userId: user.id },
    select: { id: true, name: true, slug: true, logoUrl: true, primaryColor: true },
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Store Profile Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden flex-shrink-0">
                  {business?.logoUrl ? (
                    <img
                      src={business.logoUrl}
                      alt={business.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Store className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xs font-bold text-slate-900 truncate">
                    {business?.name || "My Business"}
                  </h2>
                  <p className="text-[11px] text-slate-400 truncate">
                    /{business?.slug || "portal"}
                  </p>
                </div>
              </div>

              {business && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <a
                    href={`/r/${business.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-1.5 px-2.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-[11px] font-semibold flex items-center justify-between transition"
                  >
                    <span>View Live Card</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Navigation Menu */}
            <nav className="bg-white p-2 rounded-2xl border border-slate-200/70 shadow-sm space-y-1 text-xs font-medium">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                Overview
              </Link>
              <Link
                href="/dashboard/studio"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                Print &amp; NFC Studio
              </Link>
              <Link
                href="/dashboard/feedback"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <Inbox className="w-4 h-4 text-slate-400" />
                Feedback Shield Inbox
              </Link>
              <Link
                href="/dashboard/assistant"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                AI Reply Assistant
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Card &amp; SEO Settings
              </Link>
              <Link
                href="/dashboard/billing"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-emerald-600 font-bold transition border-t border-slate-100 mt-1 pt-2"
              >
                <span className="w-4 h-4 text-emerald-600 flex items-center justify-center font-bold">₹</span>
                UPI Activation &amp; Plans
              </Link>
            </nav>
          </aside>

          {/* Main Dashboard Content */}
          <main className="lg:col-span-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
