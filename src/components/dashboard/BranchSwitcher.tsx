"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Store,
  ChevronDown,
  Check,
  ExternalLink,
} from "lucide-react";

interface Branch {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  primaryColor: string;
  googleAddress: string | null;
}

export default function BranchSwitcher({
  branches,
  activeBranchId,
}: {
  branches: Branch[];
  activeBranchId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeBranch =
    branches.find((b) => b.id === activeBranchId) || branches[0] || null;

  const handleSwitchBranch = (branchId: string) => {
    setDropdownOpen(false);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("branchId", branchId);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      {/* Current Business Selector Trigger */}
      <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded-md border border-indigo-500/20 flex items-center gap-1">
            <Store className="w-3 h-3 text-indigo-400" />
            Active Business
          </span>
          {activeBranch?.slug && (
            <a
              href={`/r/${activeBranch.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-bold text-slate-400 hover:text-indigo-300 flex items-center gap-0.5 transition"
              title="Open public review card"
            >
              <span>View Card</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>

        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between text-left p-1 rounded-xl hover:bg-slate-800 transition"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold overflow-hidden flex-shrink-0">
              {activeBranch?.logoUrl ? (
                <img
                  src={activeBranch.logoUrl}
                  alt={activeBranch.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs">
                  {activeBranch?.name.slice(0, 2).toUpperCase() || "RS"}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-bold text-white truncate">
                {activeBranch?.name || "My Business"}
              </h3>
              <p className="text-[10px] text-slate-500 truncate">
                {activeBranch?.googleAddress || (activeBranch ? `/r/${activeBranch.slug}` : "")}
              </p>
            </div>
          </div>
          {branches.length > 1 && (
            <ChevronDown
              className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${
                dropdownOpen ? "rotate-180 text-indigo-400" : ""
              }`}
            />
          )}
        </button>

        {/* Dropdown Menu (if multiple businesses exist) */}
        {dropdownOpen && branches.length > 1 && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-slate-900 rounded-2xl shadow-2xl shadow-black/50 border border-slate-800 p-2 space-y-1 animate-fadeIn">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Your Business Profiles
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
              {branches.map((b, idx) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleSwitchBranch(b.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
                    b.id === activeBranch?.id
                      ? "bg-indigo-500/15 text-white font-bold border border-indigo-500/20"
                      : "hover:bg-slate-800 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate">{b.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {b.googleAddress || `/r/${b.slug}`}
                      </div>
                    </div>
                  </div>
                  {b.id === activeBranch?.id && (
                    <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
