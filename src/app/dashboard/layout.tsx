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

import BranchSwitcher from "@/components/dashboard/BranchSwitcher";
import MobileAppBottomNav from "@/components/navigation/MobileAppBottomNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const businesses = await prisma.business.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      primaryColor: true,
      googleAddress: true,
      customerType: true,
      isPaid: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const isOffline = businesses[0]?.customerType === "OFFLINE";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 lg:pb-0">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar (Desktop & Mobile Header) */}
          <aside className="lg:col-span-1 space-y-4 no-print">
            {/* Interactive Multi-Branch Switcher */}
            <BranchSwitcher
              branches={businesses}
              activeBranchId={businesses[0]?.id || ""}
            />

            {/* Desktop Navigation Menu (Hidden on Mobile) */}
            <nav className="hidden lg:block bg-white p-2 rounded-2xl border border-slate-200/70 shadow-sm space-y-1 text-xs font-medium">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                Overview
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                {isOffline ? "Customise Review Card" : "Customise Digital Card"}
              </Link>
              <Link
                href="/dashboard/studio"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                {isOffline ? "Standee Studio" : "Standee Studio (Offline Kit)"}
              </Link>
              <Link
                href="/dashboard/assistant"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                AI Reply Assistant
              </Link>
              <Link
                href="/dashboard/feedback"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <Inbox className="w-4 h-4 text-slate-400" />
                Feedback Shield Inbox
              </Link>
              <Link
                href="/dashboard/branches"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <div className="flex items-center gap-2.5">
                  <Store className="w-4 h-4 text-indigo-500" />
                  <span>My Outlets</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                  {businesses.length}
                </span>
              </Link>
            </nav>
          </aside>

          {/* Main Dashboard Content */}
          <main className="lg:col-span-4 pb-12 lg:pb-0">{children}</main>
        </div>
      </div>

      {/* NATIVE APP STYLE MOBILE BOTTOM NAVIGATION BAR */}
      <MobileAppBottomNav />
    </div>
  );
}
