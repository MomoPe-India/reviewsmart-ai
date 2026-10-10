"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { BrandIcon } from "@/components/brand/BrandLogo";
import { RotateCcw, MessageCircle, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime Application Error:", error);
  }, [error]);

  const supportMsg = encodeURIComponent(
    `Hi ReviewSmart AI Support! I encountered an unexpected error on the website: "${error.message || "Unknown error"}" (Digest: ${error.digest || "N/A"}). Please assist me.`
  );
  const waSupportUrl = `https://wa.me/918639831132?text=${supportMsg}`;

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 text-center relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl" />

      <div className="relative z-10 max-w-md w-full mx-auto space-y-6 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mx-auto">
          <BrandIcon size="lg" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            System Notice
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Something went wrong
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            An unexpected error occurred while loading this page. Don&apos;t worry, your store data and reviews are completely safe.
          </p>
        </div>

        {error.message && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 text-left truncate">
            Error: {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-950 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>

        <div className="pt-2 border-t border-slate-800/80">
          <a
            href={waSupportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Report issue to 24/7 WhatsApp Support</span>
          </a>
        </div>
      </div>
    </div>
  );
}
