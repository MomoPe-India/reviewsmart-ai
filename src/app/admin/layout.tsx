import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import {
  ShieldCheck,
  Users,
  CreditCard,
  Building2,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Admin Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-sm">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-wider">
                  Owner Reseller Mode
                </span>
              </div>
              <h2 className="text-sm font-bold text-white">Platform Control</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Manage clients, plans, and reseller white-label settings
              </p>
            </div>

            <nav className="bg-slate-800 p-2 rounded-2xl border border-slate-700 shadow-sm space-y-1 text-xs font-medium">
              <Link
                href="/admin"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                Reseller Overview
              </Link>
              <Link
                href="/admin/plans"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >
                <CreditCard className="w-4 h-4 text-slate-400" />
                Subscription Plans
              </Link>
              <Link
                href="/admin/businesses"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >
                <Building2 className="w-4 h-4 text-slate-400" />
                Client Businesses
              </Link>
              <Link
                href="/admin/payments"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-emerald-400 hover:bg-slate-700 hover:text-emerald-300 font-bold transition border-t border-slate-700 mt-1 pt-2"
              >
                <span className="w-4 h-4 flex items-center justify-center font-bold">₹</span>
                UPI Payments &amp; Setup
              </Link>
            </nav>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Store Dashboard
              </Link>
            </div>
          </aside>

          {/* Admin Main View */}
          <main className="lg:col-span-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
