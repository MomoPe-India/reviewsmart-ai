"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  Users,
  Building2,
  Receipt,
  Store,
} from "lucide-react";

export default function AdminMobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Platform",
      href: "/admin",
      icon: ShieldCheck,
      active: pathname === "/admin",
    },
    {
      label: "UPI Deals",
      href: "/admin/payments",
      icon: Receipt,
      active: pathname.startsWith("/admin/payments"),
    },
    {
      label: "Agents",
      href: "/admin/agents",
      icon: Users,
      active: pathname.startsWith("/admin/agents"),
    },
    {
      label: "Stores",
      href: "/admin/businesses",
      icon: Building2,
      active: pathname.startsWith("/admin/businesses"),
    },
    {
      label: "Plans",
      href: "/admin/plans",
      icon: CreditCard,
      active: pathname.startsWith("/admin/plans"),
    },
    {
      label: "Store Mode",
      href: "/dashboard",
      icon: Store,
      active: false,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 no-print select-none">
      <div className="bg-slate-950/95 backdrop-blur-2xl border-t border-amber-500/20 px-2 pt-2 pb-[max(env(safe-area-inset-bottom),10px)] shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
                  isActive
                    ? "text-amber-400 bg-amber-500/10 font-black shadow-inner border border-amber-500/30"
                    : "text-slate-400 hover:text-slate-200 font-medium"
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? "scale-110 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.6)]" : ""
                    }`}
                  />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>
                <span
                  className={`text-[9px] tracking-tight mt-0.5 transition-colors ${
                    isActive ? "text-amber-300 font-extrabold" : "text-slate-400"
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
