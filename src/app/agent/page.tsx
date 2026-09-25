"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Award,
  Radio,
  RefreshCw,
  Eye,
  EyeOff,
  Mic,
} from "lucide-react";
import QRCode from "qrcode";
import { getAppUrl } from "@/lib/utils";

interface GoogleSearchResult {
  placeId?: string;
  googlePlaceId?: string;
  name: string;
  branchName?: string;
  address: string;
  category?: string;
  rating?: number;
  reviewCount?: number | string;
  reviewUrl?: string;
  googleReviewUrl?: string;
  logoUrl?: string | null;
  suggestedTags?: string[];
}

interface AgentSession {
  id: string;
  name: string | null;
  agentCode: string | null;
  role: string;
  agentStats?: {
    dealsClosed: number;
    totalRevenue: number;
    totalCommission: number;
    pendingDeals: number;
  } | null;
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
  const [merchantPin, setMerchantPin] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [customReviewUrl, setCustomReviewUrl] = useState("");

  const handleGenerateNewPin = () => {
    setMerchantPin(Math.floor(1000 + Math.random() * 9000).toString());
  };

  // Pricing & Deal
  const [negotiatedPrice, setNegotiatedPrice] = useState<number>(1499);
  const [utrNumber, setUtrNumber] = useState("");
  const [isSubmittingDeal, setIsSubmittingDeal] = useState(false);
  const [dealError, setDealError] = useState("");

  // Deal Success
  const [createdDeal, setCreatedDeal] = useState<any | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Live Review Pitch Preview
  const [pitchDrafts, setPitchDrafts] = useState<any[]>([]);
  const [loadingPitchDrafts, setLoadingPitchDrafts] = useState(false);
  const [showPitchPreview, setShowPitchPreview] = useState(false);

  const handleGeneratePitchReviews = async (place: GoogleSearchResult) => {
    setLoadingPitchDrafts(true);
    setShowPitchPreview(true);
    try {
      const res = await fetch("/api/ai/generate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: place.name,
          category: place.category,
          selectedTags: place.suggestedTags || [],
        }),
      });
      const data = await res.json();
      if (data.reviews && data.reviews.length > 0) {
        setPitchDrafts(data.reviews);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPitchDrafts(false);
    }
  };

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

  const [showEarnings, setShowEarnings] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Live Typeahead: Queries Google Maps as agent types
  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (!value || value.trim().length < 2) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      setIsSearching(false);
      return;
    }

    setIsDropdownOpen(true);
    setIsSearching(true);

    searchDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/business/search-google?query=${encodeURIComponent(value.trim())}`
        );
        const data = await res.json();
        if (res.ok && data.results && data.results.length > 0) {
          setSearchResults(data.results);
          setIsDropdownOpen(true);
        } else {
          setSearchResults([]);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);
  };

  // Immediate manual Search Handler
  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    setIsSearching(true);
    setIsDropdownOpen(true);
    try {
      const res = await fetch(
        `/api/business/search-google?query=${encodeURIComponent(searchQuery.trim())}`
      );
      const data = await res.json();
      if (res.ok && data.results) {
        setSearchResults(data.results);
        setIsDropdownOpen(true);
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
    setCustomReviewUrl(b.googleReviewUrl || b.reviewUrl || "");
    setSearchResults([]);
    setIsDropdownOpen(false);
    setSearchQuery(b.name + (b.branchName ? ` - ${b.branchName}` : ""));
    handleGeneratePitchReviews(b);
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

  // Auto-WhatsApp Pre-fill Logic
  useEffect(() => {
    if (merchantPhone.trim().length === 10 && !whatsapp) {
      setWhatsapp(merchantPhone.trim());
    }
  }, [merchantPhone, whatsapp]);

  const [nextDealCountdown, setNextDealCountdown] = useState(30);
  useEffect(() => {
    if (!createdDeal) return;
    setNextDealCountdown(30);
    const interval = setInterval(() => {
      setNextDealCountdown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
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
          googlePlaceId: selectedPlace.placeId || selectedPlace.googlePlaceId || null,
          googleAddress: selectedPlace.address,
          googleReviewUrl:
            customReviewUrl.trim() ||
            (selectedPlace.placeId || selectedPlace.googlePlaceId
              ? `https://search.google.com/local/writereview?placeid=${selectedPlace.placeId || selectedPlace.googlePlaceId}`
              : selectedPlace.reviewUrl ||
                selectedPlace.googleReviewUrl ||
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.name)}`),
          logoUrl: selectedPlace.logoUrl || null,
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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 p-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-2xl">
          <span className="text-2xl font-black text-white">POS</span>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-black text-white">Agent Closer</h2>
          <p className="text-sm text-slate-400">Loading your dashboard...</p>
        </div>
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  const activeStep = createdDeal ? 3 : selectedPlace ? (merchantPhone.length === 10 ? 3 : 2) : 1;

  const formatPhone = (val: string) => {
    if (!val) return '';
    const match = val.match(/^(\d{0,4})(\d{0,3})(\d{0,3})$/);
    if (!match) return val;
    return !match[2] ? match[1] : `${match[1]} ${match[2]}` + (match[3] ? ` ${match[3]}` : '');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Mobile Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-md">
            POS
          </div>
          <div>
            <h1 className="text-sm font-black text-white flex items-center gap-1.5">
              <span>{agent?.name?.split(' ')[0] || "Agent"}</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                {agent?.agentCode || "MKT-REP"}
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 truncate max-w-[160px]">
              Agent Closer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-800/80 border border-slate-700 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[9px] font-black text-slate-300">LIVE</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition shadow-sm"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-5 space-y-5">
        {/* Agent Performance & Earnings Bar */}
        {agent?.agentStats ? (
          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900 rounded-2xl border border-slate-800 text-center shadow-lg">
            <div className="p-2 rounded-xl bg-slate-950/60 border-b-2 border-indigo-500">
              <span className="text-[9px] font-semibold text-slate-400 block">Deals Closed</span>
              <span className="text-base font-black text-white">{agent.agentStats.dealsClosed}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowEarnings(!showEarnings)}
              className="p-2 rounded-xl bg-slate-950/60 hover:bg-slate-950 transition text-center relative group border-b-2 border-emerald-500"
              title={showEarnings ? "Hide Earnings" : "Tap to View Earnings"}
            >
              <div className="flex items-center justify-center gap-1">
                <span className="text-[9px] font-semibold text-slate-400">Earnings</span>
                {showEarnings ? (
                  <EyeOff className="w-2.5 h-2.5 text-slate-500 group-hover:text-slate-300" />
                ) : (
                  <Eye className="w-2.5 h-2.5 text-slate-500 group-hover:text-slate-300" />
                )}
              </div>
              {showEarnings ? (
                <span className="text-base font-black text-emerald-400 tracking-wider inline-block animate-in zoom-in duration-200">
                  ₹{agent.agentStats.totalCommission.toLocaleString("en-IN")}
                </span>
              ) : (
                <span className="text-base font-black text-emerald-400/50 tracking-wider inline-block animate-pulse">
                  ••••
                </span>
              )}
            </button>
            <div className="p-2 rounded-xl bg-slate-950/60 border-b-2 border-amber-500 group cursor-help" title="Pending admin verification — check back soon">
              <span className="text-[9px] font-semibold text-slate-400 block">Pending Verify</span>
              <span className="text-base font-black text-amber-400">{agent.agentStats.pendingDeals}</span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gradient-to-r from-indigo-900/40 to-violet-900/40 rounded-2xl border border-indigo-500/30 text-center shadow-lg">
            <p className="text-sm font-bold text-indigo-200 flex items-center justify-center gap-2">
              <span>🚀</span> Close your first deal below to start earning!
            </p>
          </div>
        )}

        {/* SUCCESS VIEW: Deal Closed & Dynamic UPI QR */}
        {createdDeal ? (
          <div className="bg-slate-900 rounded-3xl p-5 border border-emerald-500/40 shadow-2xl space-y-4 animate-fadeIn">
            <div className="text-center space-y-1">
              <div className="text-4xl mb-2 animate-bounce">🎉</div>
              <h2 className="text-lg font-black text-white">Deal Closed! ₹{createdDeal.negotiatedAmount} Earned!</h2>
              
              <div className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                Your commission: ₹{Math.floor(createdDeal.negotiatedAmount * 0.4).toLocaleString('en-IN')}
              </div>
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
                    {formatPhone(createdDeal.merchantUserId)}
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


            {/* Offline Standee Handover Checklist */}
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5 text-xs text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" /> Offline Physical Asset Handover:
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                ✓ Hand over 1x Flipkart 4"×6" (A6) Portrait Acrylic Standee<br />
                ✓ Apply SmartReview AI NFC / QR Counter Sticker<br />
                ✓ Educate merchant on checking Google reviews
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const base = getAppUrl();
                  const msg = `Hi! Welcome to ReviewSmart AI 😊\n\nHere are your store credentials:\n📱 Login Link: ${base}/login\n👤 User ID: ${createdDeal.merchantUserId}\n🔑 PIN: ${createdDeal.merchantPin}\n\nLive Review URL: ${base}/r/${createdDeal.businessSlug}`;
                  window.open(
                    `https://wa.me/91${createdDeal.merchantUserId}?text=${encodeURIComponent(msg)}`,
                    "_blank"
                  );
                }}
                className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
              >
                <Share2 className="w-5 h-5" />
                Share Credentials via WhatsApp
              </button>

              <button
                type="button"
                disabled={nextDealCountdown > 0}
                onClick={() => {
                  setCreatedDeal(null);
                  setSelectedPlace(null);
                  setSearchQuery("");
                  setMerchantPhone("");
                  setUtrNumber("");
                }}
                className={`w-full py-3 rounded-2xl font-bold text-xs text-center transition ${
                  nextDealCountdown > 0 
                  ? "bg-slate-800/50 text-slate-500 cursor-not-allowed" 
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                }`}
              >
                {nextDealCountdown > 0 ? `Opening next deal in ${nextDealCountdown}s...` : "+ Close Another Deal"}
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

            {/* Progress Bar */}
            <div className="flex items-center gap-1 mb-4 mt-2">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${
                    step < activeStep ? 'bg-emerald-500 border-emerald-500 text-white' :
                    step === activeStep ? 'bg-indigo-600 border-indigo-500 text-white scale-110 shadow-lg shadow-indigo-500/30' :
                    'bg-slate-800 border-slate-700 text-slate-500'
                  }`}>
                    {step < activeStep ? '✓' : step}
                  </div>
                  {step < 3 && <div className={`flex-1 h-0.5 rounded transition-all ${
                    step < activeStep ? 'bg-emerald-500' : 'bg-slate-700'
                  }`} />}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between text-[9px] font-bold text-slate-400 px-1 -mt-2 mb-3">
              <span className={activeStep >= 1 ? 'text-indigo-400' : ''}>Search Business</span>
              <span className={activeStep >= 2 ? 'text-indigo-400 text-center' : 'text-center'}>Merchant Details</span>
              <span className={activeStep >= 3 ? 'text-emerald-400 text-right' : 'text-right'}>Payment & Close</span>
            </div>

            {/* STEP 1: Search & Demo Generator (LIVE TYPEAHEAD AUTOCOMPLETE) */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3 relative z-30">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-indigo-400" />
                  Step 1: Search Merchant's Google Business
                  {selectedPlace && <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-in zoom-in" />}
                </label>
                <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                  Live Typeahead
                </span>
              </div>

              <div ref={searchContainerRef} className="relative">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4 z-10 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    onFocus={() => {
                      if (searchResults.length > 0) setIsDropdownOpen(true);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
                    placeholder="Type store name or paste Google Maps share link (maps.app.goo.gl)..."
                    className="w-full text-sm pl-10 pr-28 py-3.5 rounded-2xl bg-slate-800/90 border-2 border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bold shadow-inner"
                  />
                  <div className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1.5">
                    <button type="button" className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-700 transition" title="Paste Google Maps share link here">
                      <Mic className="w-4 h-4" />
                    </button>
                    {isSearching ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-300 bg-indigo-950 px-2 py-1.5 rounded-xl border border-indigo-800 animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
                        <span>Wait...</span>
                      </span>
                    ) : searchQuery.length >= 2 ? (
                      <button
                        type="button"
                        onClick={handleSearch}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-sm transition"
                      >
                        Search
                      </button>
                    ) : null}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 px-1">
                  <span className="text-amber-400 font-bold">⚡ Pro Tip:</span>
                  Ask merchant to WhatsApp their Google Maps location &mdash; paste the share link (<span className="text-indigo-300 font-mono">maps.app.goo.gl/...</span>) here for 100% instant auto-fill &amp; direct 5-star review modal!
                </p>

                {/* Floating Live Autocomplete Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 rounded-2xl border-2 border-indigo-500/40 shadow-2xl z-50 overflow-hidden divide-y divide-slate-800 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[340px] overflow-y-auto">
                    <div className="p-2 bg-slate-800/90 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        {isSearching ? "Searching Google Maps..." : `Matching Google Stores (${searchResults.length})`}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(false)}
                        className="text-[10px] font-bold text-slate-400 hover:text-white"
                      >
                        Close ✕
                      </button>
                    </div>

                    {isSearching && searchResults.length === 0 && (
                      <div className="p-5 text-center space-y-2">
                        <Loader2 className="w-5 h-5 text-indigo-400 animate-spin mx-auto" />
                        <p className="text-xs font-bold text-slate-200">Finding Google Maps profiles...</p>
                        <p className="text-[10px] text-slate-400">Locating verified branches &amp; addresses</p>
                      </div>
                    )}

                    {searchResults.map((r, idx) => (
                      <div
                        key={r.placeId || idx}
                        onClick={() => handleSelectBusiness(r)}
                        className="p-3 hover:bg-indigo-950/40 cursor-pointer transition flex items-start gap-2.5 group"
                      >
                        {/* Store Icon */}
                        <div className="w-9 h-9 rounded-xl bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center text-white font-bold flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform overflow-hidden">
                          {r.logoUrl ? (
                            <img src={r.logoUrl} alt={r.name} className="w-full h-full object-cover" />
                          ) : (
                            <MapPin className="w-4 h-4 text-indigo-300" />
                          )}
                        </div>

                        {/* Store Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                              {r.name}
                            </span>
                            {r.branchName && (
                              <span className="text-[9px] font-bold text-indigo-300 bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-800">
                                📍 {r.branchName}
                              </span>
                            )}
                            {r.rating && (
                              <span className="text-[9px] text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                                ★ {r.rating} {r.reviewCount && `(${r.reviewCount})`}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">{r.address}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[8px] font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                              {r.category}
                            </span>
                            <span className="text-[8px] font-semibold text-emerald-400 flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Google Verified
                            </span>
                          </div>
                        </div>

                        {/* Select Pill */}
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 text-[10px] font-bold group-hover:bg-indigo-600 group-hover:text-white transition flex-shrink-0 self-center"
                        >
                          Select ➔
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Business Preview Badge */}
              {selectedPlace && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-400 flex items-center justify-center font-bold text-white overflow-hidden flex-shrink-0">
                        {selectedPlace.logoUrl ? (
                          <img
                            src={selectedPlace.logoUrl}
                            alt={selectedPlace.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-amber-400 font-bold">{selectedPlace.name.slice(0, 2).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {selectedPlace.name}
                        </div>
                        <div className="text-[10px] text-amber-400 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>Google 5.0 Live Stand Ready</span>
                        </div>
                      </div>
                    </div>

                    {/* Verified Status Badge */}
                    <div className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1 flex-shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </div>
                  </div>

                  {/* LIVE 4"x6" COUNTERTOP ACRYLIC STAND DEMO ON AGENT'S PHONE */}
                  <div className="p-4 rounded-3xl bg-slate-950 border-2 border-amber-400/80 shadow-2xl relative overflow-hidden text-center select-none">
                    <div className="absolute inset-1.5 rounded-2xl border border-amber-400/40 pointer-events-none" />

                    <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[9px] font-black uppercase tracking-wider mb-2 shadow-sm">
                      <Award className="w-3 h-3" />
                      <span>5.0 Google Excellence Award</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-white flex items-center justify-center p-1 shadow-md mb-1.5 overflow-hidden">
                        {selectedPlace.logoUrl ? (
                          <img
                            src={selectedPlace.logoUrl}
                            alt={selectedPlace.name}
                            className="w-full h-full object-contain rounded-full"
                          />
                        ) : (
                          <span className="text-xs font-black text-amber-600">
                            {selectedPlace.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-black text-white max-w-[240px] truncate">
                        {selectedPlace.name}
                      </h4>
                      <p className="text-[9px] text-slate-400 max-w-[220px] truncate mt-0.5">
                        📍 {selectedPlace.address}
                      </p>
                      
                      {selectedPlace.rating && (
                        <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-200 to-amber-400 text-amber-900 shadow-md border border-amber-100">
                          <Star className="w-3.5 h-3.5 fill-amber-900" />
                          <span className="text-[11px] font-black">{selectedPlace.rating}</span>
                          <span className="text-[9px] font-bold opacity-80">
                            ({selectedPlace.reviewCount} reviews)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* QR Code Inset Box */}
                    <div className="my-2.5 mx-auto w-32 h-32 bg-white rounded-xl border-2 border-amber-400 flex flex-col items-center justify-center shadow-lg relative p-2">
                      <QrCode className="w-24 h-24 text-slate-900" />
                      <div className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[8px] font-black border border-white flex items-center gap-0.5">
                        <Radio className="w-2.5 h-2.5" />
                        <span>NFC TAP</span>
                      </div>
                    </div>

                    <div className="text-[8px] font-bold text-amber-300 py-1 bg-white/5 rounded-lg border border-white/10 mb-1">
                      ① Scan QR &bull; ② Pick AI Compliments &bull; ③ Post in 5 Sec
                    </div>

                    <span className="text-[8px] font-medium text-slate-500 block mb-3">
                      Flipkart 4"×6" (A6) Portrait Acrylic Standee Fit
                    </span>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlace(null);
                        setSearchQuery("");
                      }}
                      className="text-[10px] font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition border border-slate-700"
                    >
                      Change Business
                    </button>
                  </div>

                  {/* LIVE AI REVIEWS PITCH DEMO FOR AGENTS */}
                  <div className="p-4 rounded-3xl bg-slate-900/90 border border-amber-400/40 shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>AI Review Pitch Demo</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                        {selectedPlace.category || "Domain AI"}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300">
                      Show this to the merchant: When their customers scan the QR, ReviewSmart AI generates these tailored 5-star reviews:
                    </p>

                    {/* Compliment Chips */}
                    {selectedPlace.suggestedTags && selectedPlace.suggestedTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {selectedPlace.suggestedTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700"
                          >
                            ✓ {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Review Drafts Cards */}
                    {loadingPitchDrafts ? (
                      <div className="py-6 text-center text-xs text-slate-400 space-y-2">
                        <Loader2 className="w-5 h-5 text-amber-400 animate-spin mx-auto" />
                        <p>Drafting tailored 5-star reviews for {selectedPlace.name}...</p>
                      </div>
                    ) : pitchDrafts.length > 0 ? (
                      <div className="space-y-2 pt-1">
                        {pitchDrafts.map((d) => (
                          <div
                            key={d.id}
                            className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white flex items-center gap-1">
                                <span className="text-amber-400">★</span> {d.headline}
                              </span>
                              <span className="text-[9px] uppercase font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                                {d.tone}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-normal">
                              "{d.text}"
                            </p>
                          </div>
                        ))}
                        <div className="text-center pt-1">
                          <button
                            type="button"
                            onClick={() => handleGeneratePitchReviews(selectedPlace)}
                            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center justify-center gap-1 mx-auto"
                          >
                            <Sparkles className="w-3 h-3" />
                            Regenerate Fresh AI Reviews
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleGeneratePitchReviews(selectedPlace)}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Generate Live AI Reviews for Merchant
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* STEP 2: Merchant Contact & Login PIN */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                Step 2: Merchant Mobile &amp; 4-Digit Random PIN
                {merchantPhone.length === 10 && <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-in zoom-in" />}
              </label>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                    Mobile Number (User ID)
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={12}
                    value={formatPhone(merchantPhone)}
                    onChange={(e) => setMerchantPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                    placeholder="9876 543 210"
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-slate-400 font-semibold">
                      Random PIN
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateNewPin}
                      className="text-[9px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-0.5"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> Roll New
                    </button>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={merchantPin}
                      onChange={(e) => setMerchantPin(e.target.value.replace(/[^0-9]/g, ""))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-text"
                    />
                    <div className="flex gap-1.5 h-[38px]">
                      {[0, 1, 2, 3].map((index) => (
                        <div 
                          key={index} 
                          className="flex-1 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold text-sm pointer-events-none"
                        >
                          {merchantPin[index] || ""}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500">
                🔐 Random 4-digit PIN is auto-generated.
                <br />
                <span className="text-amber-400 font-medium">💡 Tell merchant: This is your 4-digit secret PIN to login to your dashboard</span>
              </p>

              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                  Direct Google Review Link (Optional &mdash; for instant 5-star modal)
                </label>
                <input
                  type="url"
                  value={customReviewUrl}
                  onChange={(e) => setCustomReviewUrl(e.target.value)}
                  onBlur={async () => {
                    const val = customReviewUrl.trim();
                    if (val && (val.includes("maps.app.goo.gl") || val.includes("share.google") || val.includes("g.co/") || val.includes("goo.gl/"))) {
                      try {
                        const res = await fetch(`/api/business/search-google?query=${encodeURIComponent(val)}`);
                        const data = await res.json();
                        if (data.results && data.results[0]?.googleReviewUrl) {
                          setCustomReviewUrl(data.results[0].googleReviewUrl);
                        }
                      } catch (e) {
                        console.error(e);
                      }
                    }
                  }}
                  placeholder="Paste from Google Maps Share or Ask for reviews"
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[9px] text-slate-500 mt-1">
                  💡 Tip: In Google Maps, tap Share &rarr; Copy Link, or use Google Business &ldquo;Ask for reviews&rdquo; link so customers open the 5-star review box directly!
                </p>
              </div>
            </div>

            {/* STEP 3: Negotiated Amount & Deal Submission */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-4">
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
                    className={`py-3 px-1 rounded-xl text-xs font-black border transition-all ${
                      negotiatedPrice === amt
                        ? "bg-indigo-600 text-white border-indigo-500 ring-2 ring-offset-2 ring-offset-slate-900 ring-indigo-500 scale-105 shadow-lg shadow-indigo-500/20"
                        : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              {/* Commission badge */}
              <div className="flex justify-end -mt-1 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  Your commission: ₹{Math.floor(negotiatedPrice * 0.4).toLocaleString('en-IN')} (40%)
                </span>
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

              {/* Package Summary & Merchant Reassurance */}
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> 1-Year Pro Plan Included
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Instant Activation
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Includes 1x Physical Acrylic Standee, NFC chip, custom QR code, AI review response generator, and negative feedback shield.
                </p>
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
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] animate-[shimmer_2s_linear_infinite] hover:from-indigo-500 hover:to-violet-500 active:scale-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.4)] ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-slate-950 transition-all disabled:opacity-50"
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
