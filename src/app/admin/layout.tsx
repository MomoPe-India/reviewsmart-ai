import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  IndianRupee,
  ArrowLeft,
  Zap,
} from "lucide-react";
import AdminMobileBottomNav from "@/components/navigation/AdminMobileBottomNav";
import BrandLogo from "@/components/brand/BrandLogo";

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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col pb-20 lg:pb-0">
      <Navbar variant="dark" />


      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Admin Sidebar (Desktop only) */}
          <aside className="hidden lg:flex lg:col-span-1 flex-col gap-3 no-print">
            {/* Brand Header */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/80 p-4 rounded-2xl border border-slate-700 shadow-sm">
              <div className="mb-2.5">
                <BrandLogo href="/admin" size="sm" theme="dark" />
              </div>
              <h2 className="text-xs font-bold text-slate-300">Admin Console</h2>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                Manage merchants, agents &amp; platform revenue
              </p>
            </div>

            {/* Navigation */}
            <nav className="bg-slate-800 p-2 rounded-2xl border border-slate-700 shadow-sm space-y-0.5 text-xs font-medium">
              <Link
                href="/admin"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition group"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
                Platform Overview
              </Link>

              <Link
                href="/admin/merchants"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition group"
              >
                <Users className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
                Merchants
              </Link>

              <Link
                href="/admin/agents"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition group"
              >
                <UserCheck className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
                Marketing Agents
              </Link>

              <Link
                href="/admin/businesses"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition group"
              >
                <Building2 className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
                Businesses
              </Link>

              <div className="pt-1 mt-1 border-t border-slate-700">
                <Link
                  href="/admin/payments"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 font-bold transition group"
                >
                  <IndianRupee className="w-4 h-4" />
                  Payments &amp; Deals
                </Link>
              </div>
            </nav>

            {/* Back to Dashboard */}
            <div>
              <Link
                href="/dashboard"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Store Dashboard
              </Link>
            </div>
          </aside>

          {/* Admin Main View */}
          <main className="lg:col-span-4 pb-6">{children}</main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <AdminMobileBottomNav />
    </div>
  );
}
