"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Sparkles,
  Inbox,
  Store,
} from "lucide-react";

export default function MobileAppBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Customise Card",
      href: "/dashboard/settings",
      icon: Settings,
      active: pathname.startsWith("/dashboard/settings"),
    },
    {
      label: "AI Assist",
      href: "/dashboard/assistant",
      icon: Sparkles,
      active: pathname.startsWith("/dashboard/assistant"),
    },
    {
      label: "Review Shield",
      href: "/dashboard/feedback",
      icon: Inbox,
      active: pathname.startsWith("/dashboard/feedback"),
    },
    {
      label: "Outlets",
      href: "/dashboard/branches",
      icon: Store,
      active: pathname.startsWith("/dashboard/branches"),
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 no-print select-none">
      {/* Native App Frosted Glass Container with Safe Insets */}
      <div className="bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 px-2 pt-2 pb-[max(env(safe-area-inset-bottom),10px)] shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "text-indigo-400 bg-white/10 font-black shadow-inner"
                    : "text-slate-400 hover:text-slate-200 font-medium"
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? "scale-110 text-indigo-400 drop-shadow-[0_2px_8px_rgba(99,102,241,0.5)]" : ""
                    }`}
                  />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  )}
                </div>
                <span
                  className={`text-[9px] tracking-tight mt-0.5 transition-colors ${
                    isActive ? "text-indigo-300 font-extrabold" : "text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
