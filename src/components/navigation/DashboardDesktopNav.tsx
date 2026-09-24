"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Printer,
  Sparkles,
  Inbox,
  Store,
} from "lucide-react";

interface DashboardDesktopNavProps {
  isOffline: boolean;
  outletCount: number;
}

export default function DashboardDesktopNav({
  isOffline,
  outletCount,
}: DashboardDesktopNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: isOffline ? "Customise Review Card" : "Card & AI SEO Settings",
      href: "/dashboard/settings",
      icon: Settings,
      active: pathname.startsWith("/dashboard/settings"),
    },
    {
      label: isOffline ? "Standee Studio" : "Standee Studio (Offline Kit)",
      href: "/dashboard/studio",
      icon: Printer,
      active: pathname.startsWith("/dashboard/studio"),
    },
    {
      label: "AI Reply Assistant",
      href: "/dashboard/assistant",
      icon: Sparkles,
      active: pathname.startsWith("/dashboard/assistant"),
    },
    {
      label: "Feedback Shield Inbox",
      href: "/dashboard/feedback",
      icon: Inbox,
      active: pathname.startsWith("/dashboard/feedback"),
    },
    {
      label: "My Outlets",
      href: "/dashboard/branches",
      icon: Store,
      active: pathname.startsWith("/dashboard/branches"),
      badge: outletCount,
    },
  ];

  return (
    <nav className="hidden lg:block bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-sm space-y-1 text-xs font-medium">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.active;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 ${
              isActive
                ? "bg-indigo-600/20 text-white font-bold border border-indigo-500/30 shadow-sm shadow-indigo-950/40"
                : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? "text-indigo-400" : "text-slate-500"
                }`}
              />
              <span className="truncate">{item.label}</span>
            </div>

            {item.badge !== undefined && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border shrink-0 ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
