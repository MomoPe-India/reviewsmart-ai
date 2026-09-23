"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Store,
  ChevronDown,
  Plus,
  Check,
  Search,
  Loader2,
  Sparkles,
  ExternalLink,
  MapPin,
  Smartphone,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";

interface Branch {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  primaryColor: string;
  googleAddress: string | null;
}

interface GoogleSearchResult {
  name: string;
  address: string;
  category: string;
  googleReviewUrl: string;
  suggestedTags: string[];
  rating: number;
  logoUrl?: string | null;
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
  const [modalOpen, setModalOpen] = useState(false);

  // New Branch Form state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchingGoogle, setSearchingGoogle] = useState(false);
  const [searchResults, setSearchResults] = useState<GoogleSearchResult[]>([]);
  const [searchError, setSearchError] = useState("");

  const [branchName, setBranchName] = useState("");
  const [googleAddress, setGoogleAddress] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const activeBranch =
    branches.find((b) => b.id === activeBranchId) || branches[0] || null;

  const handleSwitchBranch = (branchId: string) => {
    setDropdownOpen(false);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("branchId", branchId);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchGoogle = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;

    setSearchingGoogle(true);
    setSearchError("");
    try {
      const res = await fetch("/api/business/search-google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.results && data.results.length > 0) {
        setSearchResults(data.results);
      } else {
        setSearchError("No business found. You can enter details manually below.");
      }
    } catch {
      setSearchError("Search failed. Please enter details manually below.");
    } finally {
      setSearchingGoogle(false);
    }
  };

  const handleSelectBusiness = (b: GoogleSearchResult) => {
    setBranchName(b.name);
    setGoogleAddress(b.address);
    setGoogleReviewUrl(b.googleReviewUrl);
    setLogoUrl(b.logoUrl || null);
    setSearchResults([]);
  };

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim()) return;

    setCreating(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/branches/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: branchName.trim(),
          googleAddress: googleAddress.trim() || null,
          googleReviewUrl: googleReviewUrl.trim() || null,
          logoUrl,
          whatsapp: whatsapp.trim() || null,
          instagram: instagram.trim() || null,
          website: website.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to create branch");
        return;
      }

      confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
      setModalOpen(false);
      // Reset form
      setBranchName("");
      setGoogleAddress("");
      setGoogleReviewUrl("");
      setSearchQuery("");

      // Switch to the newly created branch
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("branchId", data.branch.id);
      router.push(`${pathname}?${params.toString()}`);
      router.refresh();
    } catch {
      setErrorMsg("An unexpected network error occurred.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="relative">
      {/* Current Branch Selector Trigger */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 flex items-center gap-1">
            <Store className="w-3 h-3 text-indigo-600" />
            Branch {branches.findIndex((b) => b.id === activeBranch?.id) + 1} of{" "}
            {branches.length}
          </span>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1 transition"
          >
            <Plus className="w-3 h-3" />
            Add (₹99)
          </button>
        </div>

        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between text-left p-1 rounded-xl hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden flex-shrink-0">
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
              <h3 className="text-xs font-bold text-slate-900 truncate">
                {activeBranch?.name || "My Business"}
              </h3>
              <p className="text-[10px] text-slate-400 truncate">
                {activeBranch?.googleAddress || `/${activeBranch?.slug}`}
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${
              dropdownOpen ? "rotate-180 text-indigo-600" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 space-y-1 animate-fadeIn">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Your Managed Outlets &bull; No Limit
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
              {branches.map((b, idx) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleSwitchBranch(b.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
                    b.id === activeBranch?.id
                      ? "bg-indigo-50/80 text-indigo-900 font-bold border border-indigo-100"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate">{b.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {b.googleAddress || `/${b.slug}`}
                      </div>
                    </div>
                  </div>
                  {b.id === activeBranch?.id && (
                    <Check className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  setModalOpen(true);
                }}
                className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition ${
                  branches.length >= 2
                    ? "bg-slate-800 hover:bg-slate-900 text-white"
                    : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                {branches.length >= 2 ? "Add 3+ Branches (Enterprise)" : "Add Extra Branch (Only ₹99)"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add New Branch Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {branches.length >= 2 ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                  <Store className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-black text-slate-900">
                    Maximum Self-Serve Branch Limit (2 Outlets)
                  </h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    You have currently active: <strong>1 Main Store + 1 Extra Branch Pass (₹99)</strong>.
                    <br />
                    We do not encourage self-serve creation of more than 1 extra branch. For chains operating 3 or more locations, we offer custom enterprise chain onboarding with dedicated account managers.
                  </p>
                </div>
                <a
                  href="https://wa.me/919999999999?text=Hi%2C%20I%20want%20to%20add%203%2B%20branches%20for%20my%20business%20on%20ReviewSmart%20AI"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-md transition"
                >
                  <Smartphone className="w-4 h-4" />
                  Contact Us on WhatsApp for 3+ Branches
                </a>
              </div>
            ) : (
              <>
                <div className="text-left space-y-1 mb-5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Additional Location Pass &bull; Only ₹99
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Add 1 Extra Branch Location
                  </h3>
                  <p className="text-xs text-slate-500">
                    Connect your second outlet with its own dedicated Google Maps link, NFC/QR stand, and private manager shield.
                  </p>
                </div>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* 1. Google Search for 2nd Branch */}
            <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <label className="block text-xs font-bold text-slate-800">
                Search Google Maps for this Branch (Fast Auto-Fill)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchGoogle()}
                    placeholder="e.g. Food Bites Koramangala"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleSearchGoogle()}
                  disabled={searchingGoogle || !searchQuery.trim()}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {searchingGoogle ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
                </button>
              </div>

              {searchError && (
                <p className="text-[11px] text-amber-700">{searchError}</p>
              )}

              {/* Search Results list */}
              {searchResults.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {searchResults.map((b, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="font-bold text-slate-900 truncate">{b.name}</div>
                        <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          {b.address}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectBusiness(b)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] border border-emerald-200 transition whitespace-nowrap"
                      >
                        Auto-Fill ✨
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Branch Details Form */}
            <form onSubmit={handleCreateBranch} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Branch Name *
                </label>
                <input
                  type="text"
                  required
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="e.g. Food Bites - Koramangala"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Locality / City Address
                </label>
                <input
                  type="text"
                  value={googleAddress}
                  onChange={(e) => setGoogleAddress(e.target.value)}
                  placeholder="e.g. 5th Block, Koramangala, Bengaluru"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Google Review URL
                </label>
                <input
                  type="url"
                  value={googleReviewUrl}
                  onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  💡 Customers at this branch will be directed to this specific review dialog.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Branch WhatsApp (Optional)
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="9876543210"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instagram Handle (Optional)
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@branch_insta"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
              </div>

              {/* Pricing callout */}
              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">
                    Additional Branch Pass:
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Unlimited branches supported with zero recurring software fees.
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-emerald-700">₹99</span>
                  <span className="text-[10px] text-slate-400 block">one-time pass</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !branchName.trim()}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition disabled:opacity-50"
                >
                  {creating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Branch (₹99)
                    </>
                  )}
                </button>
              </div>
            </form>
            </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
