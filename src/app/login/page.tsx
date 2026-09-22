"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Lock, Mail, Loader2, ShieldCheck, Store } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      if (data.user?.role === "SUPER_ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50/30 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="font-black text-2xl tracking-tight text-slate-900">
            Review<span className="text-indigo-600">Smart</span> AI
          </span>
        </Link>
        <h2 className="text-xl font-bold text-slate-800">
          Sign in to your Review Portal
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage your AI cards, feedback shield, and print-ready stands
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@business.com"
                  className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-100 transition disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Helpers */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2 text-center">
              ⚡ 1-Click Quick Demo Access
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("demo@foodbites.com", "demo123")}
                className="p-2.5 rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-100 text-left transition flex items-center gap-2"
              >
                <Store className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-indigo-900">Store Owner</div>
                  <div className="text-[10px] text-indigo-600">demo@foodbites.com</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("admin@reviewsmart.ai", "admin123")}
                className="p-2.5 rounded-xl border border-amber-100 bg-amber-50/50 hover:bg-amber-100 text-left transition flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-amber-900">Platform Admin</div>
                  <div className="text-[10px] text-amber-600">admin@reviewsmart.ai</div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{" "}
            <Link href="/register" className="font-bold text-indigo-600 hover:underline">
              Create one for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
