"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  Loader2,
  ShieldCheck,
  KeyRound,
  Smartphone,
  Eye,
  EyeOff,
  AlertCircle,
  MessageCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"pin" | "admin">("pin");

  // PIN Login State (Merchants & Marketing Agents)
  const [userId, setUserId] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  // Admin Login State (Super Admin)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId.trim(), pin: pin.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed. Please verify your Mobile Number and PIN.");
        setLoading(false);
        return;
      }

      const targetPath =
        data.user?.role === "SUPER_ADMIN"
          ? "/admin"
          : data.user?.role === "MARKETING_AGENT"
          ? "/agent"
          : "/dashboard";
      window.location.href = targetPath;
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid administrator credentials.");
        setLoading(false);
        return;
      }

      window.location.href =
        data.user?.role === "SUPER_ADMIN" ? "/admin" : "/dashboard";
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-700/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 rounded-full bg-violet-800/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-indigo-600/10 blur-2xl" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-500 flex items-center justify-center shadow-2xl shadow-amber-500/30 mb-4 ring-4 ring-white/10">
            <Sparkles className="w-10 h-10 text-white drop-shadow" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            ReviewSmart{" "}
            <span className="text-indigo-400">AI</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            Invite-only merchant platform
          </p>
        </div>

        {/* Glass Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/40">

          {/* Auth Mode Pill Toggle */}
          <div className="bg-white/5 border border-white/8 p-1 rounded-2xl mb-6 flex items-center gap-1">
            <button
              type="button"
              onClick={() => { setAuthMode("pin"); setError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                authMode === "pin"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>User ID &amp; PIN</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthMode("admin"); setError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                authMode === "admin"
                  ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin</span>
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* ── TAB 1: User ID & PIN ── */}
          {authMode === "pin" && (
            <form onSubmit={handlePinSubmit} className="space-y-5">
              {/* Mobile Number Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Your Mobile Number
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    maxLength={10}
                    value={userId}
                    onChange={(e) =>
                      setUserId(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="10-digit mobile number"
                    className="w-full text-sm pl-11 pr-4 py-3.5 rounded-2xl bg-white/8 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium transition"
                  />
                </div>
              </div>

              {/* PIN Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Your 4-Digit PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPin ? "text" : "password"}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    required
                    value={pin}
                    onChange={(e) =>
                      setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="••••"
                    className="w-full text-3xl tracking-[0.6em] pl-11 pr-12 py-3 rounded-2xl bg-white/8 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-black transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  >
                    {showPin ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 active:from-indigo-800 active:to-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-900/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* WhatsApp CTA */}
              <div className="pt-2 text-center">
                <p className="text-xs text-slate-500">
                  Need a SmartReview Card?{" "}
                  <a
                    href="https://wa.me/918639831132"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-bold hover:text-emerald-300 transition inline-flex items-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3" />
                    WhatsApp us
                  </a>
                </p>
              </div>
            </form>
          )}

          {/* ── TAB 2: Super Admin ── */}
          {authMode === "admin" && (
            <form onSubmit={handleAdminSubmit} className="space-y-5">
              {/* Warning Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  Restricted master console. Access is monitored and logged.
                  Authorised personnel only.
                </span>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Super Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@momope.in"
                    className="w-full text-sm pl-11 pr-4 py-3.5 rounded-2xl bg-white/8 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium transition"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Master Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-sm pl-11 pr-4 py-3.5 rounded-2xl bg-white/8 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium transition"
                  />
                </div>
              </div>

              {/* Admin Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 active:from-slate-950 active:to-black border border-white/10 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-black/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Access Super Admin Console
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-[11px] mt-6 font-medium">
          &copy; {new Date().getFullYear()} MomoPe India · Invite-only platform
        </p>
      </div>
    </div>
  );
}
