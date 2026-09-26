"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export default function AdminComposerTriggerButton() {
  const triggerOpen = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      })
    );
  };

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/40 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md">
          <Sparkles className="w-5 h-5 text-white animate-spin" style={{ animationDuration: "8s" }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-white">Antigravity AI Command Composer</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Natural-Language Control
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Add merchants, update deals, modify platform settings, and inspect database records directly.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="hidden md:inline-block text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700">
          ⌘K
        </span>
        <button
          type="button"
          onClick={triggerOpen}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition transform active:scale-95 cursor-pointer"
        >
          <span>Launch AI Composer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
