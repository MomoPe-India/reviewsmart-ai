import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import {
  LayoutDashboard,
  Printer,
  Inbox,
  Sparkles,
  Settings,
  Store,
} from "lucide-react";

import BranchSwitcher from "@/components/dashboard/BranchSwitcher";
import DashboardDesktopNav from "@/components/navigation/DashboardDesktopNav";
import MobileAppBottomNav from "@/components/navigation/MobileAppBottomNav";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  let businesses: any[] = [];
  try {
    businesses = await prisma.business.findMany({
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
  } catch (err) {
    console.error("DashboardLayout businesses fetch error:", err);
  }

  const isOffline = businesses[0]?.customerType === "OFFLINE";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pb-20 lg:pb-0">
      <Navbar variant="dark" />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar (Desktop) */}
          <aside className="lg:col-span-1 space-y-4 no-print">
            {/* Interactive Multi-Branch Switcher */}
            <BranchSwitcher
              branches={businesses}
              activeBranchId={businesses[0]?.id || ""}
            />

            {/* Desktop Navigation Menu (with live active link highlighting) */}
            <DashboardDesktopNav
              isOffline={isOffline}
              outletCount={businesses.length}
            />
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
