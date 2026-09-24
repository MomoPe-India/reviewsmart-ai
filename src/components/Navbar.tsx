"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";

interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

interface NavbarProps {
  /** "light" = white frosted glass bar (marketing/public pages)
   *  "dark" = dark slate bar (dashboard/admin) */
  variant?: "light" | "dark";
}

export default function Navbar({ variant = "light" }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = variant === "dark";

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  /* ── Computed class tokens based on variant ── */
  const headerCls = isDark
    ? "sticky top-0 z-40 w-full border-b border-white/8 bg-slate-950/95 backdrop-blur-md no-print"
    : "sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md no-print";

  const navLinkCls = isDark
    ? "text-slate-400 hover:text-white transition"
    : "text-slate-600 hover:text-indigo-600 transition";

  const mobileMenuBg = isDark
    ? "bg-slate-900 border-b border-white/8"
    : "bg-white border-b border-slate-200";

  const mobileMenuLinkCls = isDark
    ? "text-slate-300 py-2"
    : "text-slate-700 py-1";

  return (
    <header className={headerCls}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <BrandLogo href="/" size="md" theme={isDark ? "dark" : "light"} />

        {/* Desktop Links */}
        <nav className={`hidden md:flex items-center gap-6 text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          <Link href="/#features" className={navLinkCls}>
            Features
          </Link>
          <Link href="/#how-it-works" className={navLinkCls}>
            How it Works
          </Link>
          <Link
            href="/r/momo-it-technologies"
            target="_blank"
            className={`flex items-center gap-1 font-semibold text-xs px-2.5 py-1 rounded-full border transition ${
              isDark
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20"
                : "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            Live Demo (Momo IT)
          </Link>
        </nav>

        {/* Right CTA / User State */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === "SUPER_ADMIN" && (
                <Link
                  href="/admin"
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                    isDark
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/25 hover:bg-amber-500/25"
                      : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Owner Panel
                </Link>
              )}
              {user.role === "MARKETING_AGENT" ? (
                <Link
                  href="/agent"
                  className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Agent POS
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Store Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                title="Log Out"
                className={`p-2 rounded-lg transition ${
                  isDark
                    ? "text-slate-500 hover:text-slate-200 hover:bg-slate-800"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={`text-xs font-bold px-3.5 py-2 rounded-xl transition ${
                  isDark
                    ? "text-slate-300 hover:text-white hover:bg-slate-800"
                    : "text-slate-700 hover:text-indigo-600 hover:bg-slate-100"
                }`}
              >
                Sign In
              </Link>
              <a
                href="https://wa.me/918639831132?text=Hi%20ReviewSmart%20AI%2C%20I%20am%20interested%20in%20ReviewSmart%20AI%20for%20my%20business."
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
              >
                Get Started
              </a>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 rounded-lg ${
            isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
          }`}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className={`md:hidden px-4 pt-2 pb-5 space-y-3 shadow-xl ${mobileMenuBg}`}>
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-sm font-medium ${mobileMenuLinkCls}`}
          >
            Features
          </Link>
          <Link
            href="/r/momo-it-technologies"
            target="_blank"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between text-sm font-semibold px-3 py-2 rounded-xl border ${
              isDark
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                : "text-emerald-700 bg-emerald-50 border-emerald-200"
            }`}
          >
            Live Demo (Momo IT)
            <ExternalLink className="w-4 h-4" />
          </Link>
          <div className={`pt-2 border-t flex flex-col gap-2 ${isDark ? "border-white/8" : "border-slate-100"}`}>
            {user ? (
              <>
                {user.role === "SUPER_ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-amber-500 text-white font-semibold text-xs"
                  >
                    Owner Admin Panel
                  </Link>
                )}
                {user.role === "MARKETING_AGENT" ? (
                  <Link
                    href="/agent"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
                  >
                    Agent POS
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
                  >
                    Go to Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2 text-center text-xs font-semibold text-red-400"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full text-center py-2.5 rounded-xl font-bold text-xs border transition ${
                    isDark
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                  }`}
                >
                  Sign In (User ID &amp; PIN)
                </Link>
                <a
                  href="https://wa.me/918639831132?text=Hi%20ReviewSmart%20AI%2C%20I%20am%20interested%20in%20ReviewSmart%20AI%20for%20my%20business."
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md transition"
                >
                  Get Started via WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
