"use client";

import React from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 antialiased font-sans">
        <div className="max-w-md w-full text-center space-y-6 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-black text-2xl flex items-center justify-center mx-auto">
            !
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black text-white">
              Application Error
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              A critical layout error occurred. You can reload the application or contact support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition"
            >
              Reload Application
            </button>
            <a
              href="https://wa.me/918639831132"
              target="_blank"
              rel="noreferrer"
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
