"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  IndianRupee,
  Building2,
} from "lucide-react";

export default function AdminMobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      label: "Merchants",
      href: "/admin/merchants",
      icon: Users,
      active: pathname.startsWith("/admin/merchants"),
    },
    {
      label: "Agents",
      href: "/admin/agents",
      icon: UserCheck,
      active: pathname.startsWith("/admin/agents"),
    },
    {
      label: "Payments",
      href: "/admin/payments",
      icon: IndianRupee,
      active: pathname.startsWith("/admin/payments"),
    },
    {
      label: "Businesses",
      href: "/admin/businesses",
      icon: Building2,
      active: pathname.startsWith("/admin/businesses"),
    },
  ];

  const [pendingCount, setPendingCount] = React.useState(0);

  React.useEffect(() => {
    fetch('/api/admin/payments?status=PENDING')
      .then(res => res.json())
      .then(data => {
        if (data.payments) setPendingCount(data.payments.length);
      })
      .catch(() => {});
  }, []);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 no-print select-none">
      <div className="bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800 px-2 pt-2 pb-[max(env(safe-area-inset-bottom),10px)] shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            const isPayments = item.href === "/admin/payments";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 py-1.5 px-1 flex flex-col items-center justify-center transition-all duration-200 active:scale-90 relative ${
                  isActive
                    ? "text-indigo-400 font-black"
                    : "text-slate-400 hover:text-slate-200 font-medium"
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive
                        ? "scale-110 text-indigo-400 drop-shadow-[0_2px_8px_rgba(99,102,241,0.6)]"
                        : ""
                    }`}
                  />
                  {isPayments && pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse border border-slate-900" />
                  )}
                </div>
                <span
                  className={`text-[9px] tracking-tight mt-1 transition-colors ${
                    isActive ? "text-indigo-300 font-extrabold" : "text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-[max(env(safe-area-inset-bottom),10px)] left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
