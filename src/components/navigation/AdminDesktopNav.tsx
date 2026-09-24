"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  IndianRupee,
} from "lucide-react";

export default function AdminDesktopNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Platform Overview",
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
      label: "Marketing Agents",
      href: "/admin/agents",
      icon: UserCheck,
      active: pathname.startsWith("/admin/agents"),
    },
    {
      label: "Businesses",
      href: "/admin/businesses",
      icon: Building2,
      active: pathname.startsWith("/admin/businesses"),
    },
  ];

  const isPaymentsActive = pathname.startsWith("/admin/payments");

  return (
    <nav className="bg-slate-800 p-2 rounded-2xl border border-slate-700 shadow-sm space-y-1 text-xs font-medium">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.active;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150 ${
              isActive
                ? "bg-indigo-600/25 text-white font-bold border border-indigo-500/35 shadow-sm shadow-black/30"
                : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Icon
              className={`w-4 h-4 shrink-0 transition-colors ${
                isActive ? "text-indigo-400" : "text-slate-400"
              }`}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}

      <div className="pt-1 mt-1 border-t border-slate-700">
        <Link
          href="/admin/payments"
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all duration-150 ${
            isPaymentsActive
              ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-black/30"
              : "text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
          }`}
        >
          <IndianRupee className="w-4 h-4 shrink-0" />
          <span>Payments &amp; Deals</span>
        </Link>
      </div>
    </nav>
  );
}
