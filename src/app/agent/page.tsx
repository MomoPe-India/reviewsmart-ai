"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Search,
  MapPin,
  CheckCircle2,
  DollarSign,
  QrCode,
  Smartphone,
  Store,
  Lock,
  ArrowRight,
  ShieldCheck,
  Share2,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  LogOut,
  UserCheck,
  Star,
} from "lucide-react";
import QRCode from "qrcode";

interface GoogleSearchResult {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
  reviewCount?: number;
  reviewUrl?: string;
  logoUrl?: string;
}

interface AgentSession {
  id: string;
  name: string | null;
  agentCode: string | null;
  role: string;
}

export default function AgentPosPage() {
  const router = useRouter();
  const [agent, setAgent] = useState<AgentSession | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Search Step
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GoogleSearchResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<GoogleSearchResult | null>(null);

  // Form Details
  const [merchantPhone, setMerchantPhone] = useState("");
  const [merchantPin, setMerchantPin] = useState("1234");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");

  // Pricing & Deal
  const [negotiatedPrice, setNegotiatedPrice] = useState<number>(1499);
  const [utrNumber, setUtrNumber] = useState("");
  const [isSubmittingDeal, setIsSubmittingDeal] = useState(false);
  const [dealError, setDealError] = useState("");

  // Deal Success
  const [createdDeal, setCreatedDeal] = useState<any | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Verify Agent Session
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (!data.user || (data.user.role !== "MARKETING_AGENT" && data.user.role !== "SUPER_ADMIN")) {
          router.push("/login");
        } else {
          setAgent(data.user);
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setAuthLoading(false));
  }, [router]);

  // Google Search Handler
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `/api/business/search-google?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      if (res.ok && data.results) {
        setSearchResults(data.results);
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectBusiness = (b: GoogleSearchResult) => {
    setSelectedPlace(b);
    setSearchResults([]);
    setSearchQuery(b.name);
  };

  // Generate UPI QR when deal is created
  useEffect(() => {
    if (createdDeal?.upiDeepLink) {
      QRCode.toDataURL(createdDeal.upiDeepLink, {
        width: 600,
        margin: 2,
        color: { dark: "#0f172a", light: "#ffffff" },
      }).then(setQrDataUrl);
    }
  }, [createdDeal]);

  // Submit Deal
  const handleRegisterDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlace) {
      setDealError("Please search and select the merchant's Google business first.");
      return;
    }
    if (!merchantPhone || merchantPhone.length < 10) {
      setDealError("Please enter a valid 10-digit mobile number for the merchant.");
      return;
    }
    if (negotiatedPrice < 499) {
      setDealError("Minimum authorized price floor is ₹499.");
      return;
    }

    setDealError("");
    setIsSubmittingDeal(true);

    try {
      const res = await fetch("/api/agent/create-deal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantName: selectedPlace.name,
          merchantPhone: merchantPhone.trim(),
          merchantPin: merchantPin.trim() || "1234",
          googlePlaceId: selectedPlace.placeId,
          googleAddress: selectedPlace.address,
          googleReviewUrl:
            selectedPlace.reviewUrl ||
            `https://search.google.com/local/writereview?placeid=${selectedPlace.placeId}`,
          logoUrl: selectedPlace.logoUrl,
          whatsapp: whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}` : null,
          instagram: instagram ? `https://instagram.com/${instagram.replace("@", "")}` : null,
          negotiatedPrice,
          utrNumber: utrNumber.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setDealError(data.error || "Failed to register deal.");
        setIsSubmittingDeal(false);
        return;
      }

      setCreatedDeal(data.deal);
    } catch {
      setDealError("Network error while submitting deal. Please try again.");
    } finally {
      setIsSubmittingDeal(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Mobile Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
            POS
          </div>
          <div>
            <h1 className="text-xs font-black text-white flex items-center gap-1.5">
              <span>Agent Closer</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                {agent?.agentCode || "MKT-REP"}
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 truncate max-w-[160px]">
              {agent?.name || "Field Sales Rep"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      <main className="max-w-md mx-auto px-4 py-5 space-y-5">
        {/* SUCCESS VIEW: Deal Closed & Dynamic UPI QR */}
        {createdDeal ? (
          <div className="bg-slate-900 rounded-3xl p-5 border border-emerald-500/40 shadow-2xl space-y-4 animate-fadeIn">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-base font-black text-white">Deal Successfully Created!</h2>
              <p className="text-xs text-slate-400">
                Merchant account provisioned under your agent code.
              </p>
            </div>

            {/* Merchant Credentials Card */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                🔑 Merchant Login Credentials:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">User ID (Mobile):</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {createdDeal.merchantUserId}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Security PIN:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {createdDeal.merchantPin}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-300">
                <span className="text-slate-400">Store:</span> <strong>{createdDeal.businessName}</strong>
              </div>
            </div>

            {/* Dynamic UPI Payment Card */}
            <div className="p-5 rounded-2xl bg-white text-slate-900 text-center space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b pb-2 text-xs">
                <span className="font-semibold text-slate-500">Negotiated Total:</span>
                <span className="text-base font-black text-slate-900">
                  ₹{createdDeal.negotiatedAmount}
                </span>
              </div>

              {/* Dynamic QR */}
              <div className="flex flex-col items-center justify-center py-1">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="UPI QR"
                    className="w-48 h-48 rounded-xl border-2 border-slate-100 shadow-sm"
                  />
                ) : (
                  <div className="w-48 h-48 bg-slate-100 animate-pulse rounded-xl" />
                )}
                <span className="text-[11px] font-bold text-slate-600 mt-2">
                  Scan with PhonePe, GPay, or Paytm
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Direct to: {createdDeal.upiId}
                </span>
              </div>

              <div className="pt-2 border-t text-[10px] text-slate-500">
                Ref Note: <code className="bg-slate-100 px-1 py-0.5 rounded">{createdDeal.upiNote}</code>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const msg = `Hi! Welcome to ReviewSmart AI 😊\n\nHere are your store credentials:\n📱 Login Link: https://reviewsmart-ai.com/login\n👤 User ID: ${createdDeal.merchantUserId}\n🔑 PIN: ${createdDeal.merchantPin}\n\nLive Review URL: https://reviewsmart-ai.com/r/${createdDeal.businessSlug}`;
                  window.open(
                    `https://wa.me/91${createdDeal.merchantUserId}?text=${encodeURIComponent(msg)}`,
                    "_blank"
                  );
                }}
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <Share2 className="w-4 h-4" />
                Share Credentials via WhatsApp to Merchant
              </button>

              <button
                type="button"
                onClick={() => {
                  setCreatedDeal(null);
                  setSelectedPlace(null);
                  setSearchQuery("");
                  setMerchantPhone("");
                  setUtrNumber("");
                }}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs text-center transition"
              >
                + Close Another Deal
              </button>
            </div>
          </div>
        ) : (
          /* FORM VIEW: 10-Second Demo & Onboarding */
          <form onSubmit={handleRegisterDeal} className="space-y-4">
            {dealError && (
              <div className="p-3.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold">
                {dealError}
              </div>
            )}

            {/* STEP 1: Search & Demo Generator */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Store className="w-4 h-4 text-indigo-400" />
                Step 1: Search Merchant's Google Business
              </label>

              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
                    placeholder="Type restaurant / salon name..."
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex-shrink-0 disabled:opacity-50"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
                </button>
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="space-y-1.5 pt-1 max-h-48 overflow-y-auto">
                  {searchResults.map((r) => (
                    <button
                      key={r.placeId}
                      type="button"
                      onClick={() => handleSelectBusiness(r)}
                      className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-indigo-950/40 border border-slate-700 text-left transition flex items-center gap-2.5"
                    >
                      <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">{r.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{r.address}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Business Preview Badge */}
              {selectedPlace && (
                <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white overflow-hidden flex-shrink-0">
                      {selectedPlace.logoUrl ? (
                        <img
                          src={selectedPlace.logoUrl}
                          alt={selectedPlace.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        selectedPlace.name.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">
                        {selectedPlace.name}
                      </div>
                      <div className="text-[10px] text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>Google 5.0 Demo Ready</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Selected
                  </span>
                </div>
              )}
            </div>

            {/* STEP 2: Merchant Contact & Login PIN */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                Step 2: Merchant Mobile &amp; Login PIN
              </label>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                    Mobile Number (User ID)
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={merchantPhone}
                    onChange={(e) => setMerchantPhone(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="9876543210"
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                    4-Digit Login PIN
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={merchantPin}
                    onChange={(e) => setMerchantPin(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="1234"
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* STEP 3: Negotiated Amount & Deal Submission */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Step 3: Agreed Negotiated Amount
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Min floor: ₹499</span>
              </label>

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {[999, 1499, 1999, 2499].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setNegotiatedPrice(amt)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      negotiatedPrice === amt
                        ? "bg-indigo-600 text-white border-indigo-500"
                        : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              {/* Custom Negotiated Amount Input */}
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  Custom Final Price (₹)
                </label>
                <input
                  type="number"
                  min={499}
                  required
                  value={negotiatedPrice}
                  onChange={(e) => setNegotiatedPrice(Number(e.target.value))}
                  className="w-full text-sm font-bold p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              {/* Optional UTR Reference Number */}
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  12-Digit UPI UTR Ref No. (Optional or enter after payment)
                </label>
                <input
                  type="text"
                  maxLength={12}
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 423456789012"
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Deal Submission Button */}
            <button
              type="submit"
              disabled={isSubmittingDeal}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-950 transition disabled:opacity-50"
            >
              {isSubmittingDeal ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Generate Dynamic UPI QR &amp; Close Deal
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
