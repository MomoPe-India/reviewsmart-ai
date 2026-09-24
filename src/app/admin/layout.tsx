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
import AdminDesktopNav from "@/components/navigation/AdminDesktopNav";
import BrandLogo from "@/components/brand/BrandLogo";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "SUPER_ADMIN") {
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

            {/* Navigation (with live active link highlighting) */}
            <AdminDesktopNav />

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
