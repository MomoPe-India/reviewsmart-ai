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
  ChevronDown,
  ChevronUp,
  Building2,
  Clock,
  BadgeCheck,
  AlertCircle,
  BookOpen,
  HelpCircle,
  X,
  Maximize2,
  Filter,
  Volume2,
  CreditCard,
  Camera,
  Upload,
  Briefcase,
  PhoneCall,
  Image as ImageIcon,
} from "lucide-react";
import { HARDWARE_PACKAGES, PACKAGE_LIST, PackageTierId, getPackageById } from "@/lib/packages";

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

interface MyDeal {
  paymentId: string;
  businessId?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  amount: number;
  agentCommission: number;
  createdAt: string;
  businessName: string;
  businessSlug: string;
  businessCategory: string;
  businessAddress: string;
  businessLogoUrl: string | null;
  isPaid: boolean;
  isDemoActive?: boolean;
  demoExpiresAt?: string | null;
  demoUsed?: boolean;
  googleReviewUrl: string;
  merchantName: string;
  merchantPhone: string;
  merchantUserId: string;
}

const KADAPA_PRESETS = [
  "Sri Guru Fashions Kadapa",
  "Kadapa Clothing Store",
  "Kadapa Restaurant",
  "Kadapa Photo Studio",
  "Kadapa Salon",
];

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

  // Dual-Sided PVC Card Back Customization
  const [visitingCardBackMode, setVisitingCardBackMode] = useState<"BUSINESS_CARD" | "CUSTOM_IMAGE" | "DUAL_UPI">("BUSINESS_CARD");
  const [visitingCardOwnerName, setVisitingCardOwnerName] = useState("");
  const [visitingCardOwnerTitle, setVisitingCardOwnerTitle] = useState("Founder & Proprietor");
  const [visitingCardPhone, setVisitingCardPhone] = useState("");
  const [visitingCardImageUrl, setVisitingCardImageUrl] = useState<string | null>(null);

  const handleVisitingCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setVisitingCardImageUrl(event.target?.result as string);
      setVisitingCardBackMode("CUSTOM_IMAGE");
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateNewPin = () => {
    setMerchantPin(Math.floor(1000 + Math.random() * 9000).toString());
  };

  // Pricing & Hardware Package Deal
  const [selectedPackageTier, setSelectedPackageTier] = useState<PackageTierId>("EXECUTIVE_STANDEE");
  const [negotiatedPrice, setNegotiatedPrice] = useState<number>(HARDWARE_PACKAGES.EXECUTIVE_STANDEE.price);
  const [utrNumber, setUtrNumber] = useState("");
  const [isSubmittingDeal, setIsSubmittingDeal] = useState(false);
  const [dealError, setDealError] = useState("");

  // Deal Success
  const [createdDeal, setCreatedDeal] = useState<any | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals & Enhanced Features
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [showStandeeModal, setShowStandeeModal] = useState(false);

  // My Merchants Portfolio
  const [myDeals, setMyDeals] = useState<MyDeal[]>([]);
  const [isLoadingDeals, setIsLoadingDeals] = useState(false);
  const [showMyDeals, setShowMyDeals] = useState(false);
  const [portfolioFilter, setPortfolioFilter] = useState<"ALL" | "APPROVED" | "DEMO" | "PENDING">("ALL");
  const [portfolioSearch, setPortfolioSearch] = useState("");

  const fetchMyDeals = async () => {
    setIsLoadingDeals(true);
    try {
      const res = await fetch("/api/agent/my-deals");
      if (res.ok) {
        const data = await res.json();
        setMyDeals(data.deals || []);
      }
    } catch (e) {
      console.error("Failed to fetch my deals:", e);
    } finally {
      setIsLoadingDeals(false);
    }
  };

  // Live Review Pitch Preview
  const [pitchDrafts, setPitchDrafts] = useState<any[]>([]);
  const [loadingPitchDrafts, setLoadingPitchDrafts] = useState(false);

  const handleGeneratePitchReviews = async (place: GoogleSearchResult) => {
    setLoadingPitchDrafts(true);
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
          fetchMyDeals(); // Load deal history on mount
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setAuthLoading(false));
  }, [router]);

  const [showEarnings, setShowEarnings] = useState(true);

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
  const handleSearch = async (overrideQuery?: string) => {
    const q = (overrideQuery || searchQuery).trim();
    if (!q || q.length < 2) return;
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    setIsSearching(true);
    setIsDropdownOpen(true);
    try {
      const res = await fetch(
        `/api/business/search-google?query=${encodeURIComponent(q)}`
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
      setNextDealCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
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
    if (negotiatedPrice < 1999) {
      setDealError("Minimum authorized price floor is ₹1,999.");
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
          packageTier: selectedPackageTier,
          negotiatedPrice,
          utrNumber: utrNumber.trim() || undefined,
          visitingCardBackMode,
          visitingCardOwnerName: visitingCardOwnerName.trim() || undefined,
          visitingCardOwnerTitle: visitingCardOwnerTitle.trim() || undefined,
          visitingCardPhone: visitingCardPhone.trim() || undefined,
          visitingCardImageUrl: visitingCardImageUrl || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setDealError(data.error || "Failed to register deal.");
        setIsSubmittingDeal(false);
        return;
      }

      setCreatedDeal(data.deal);
      fetchMyDeals(); // Refresh portfolio after new deal
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
    if (!val) return "";
    const match = val.match(/^(\d{0,4})(\d{0,3})(\d{0,3})$/);
    if (!match) return val;
    return !match[2] ? match[1] : `${match[1]} ${match[2]}` + (match[3] ? ` ${match[3]}` : "");
  };

  // Filter deals
  const filteredDeals = myDeals.filter((d) => {
    if (portfolioFilter === "APPROVED" && d.status !== "APPROVED") return false;
    if (portfolioFilter === "DEMO" && !d.isDemoActive) return false;
    if (portfolioFilter === "PENDING" && d.status !== "PENDING") return false;
    if (portfolioSearch.trim()) {
      const q = portfolioSearch.toLowerCase();
      return (
        d.businessName.toLowerCase().includes(q) ||
        d.merchantPhone.includes(q) ||
        d.merchantUserId.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* ─── TOP MOBILE BAR ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-md">
            POS
          </div>
          <div>
            <h1 className="text-sm font-black text-white flex items-center gap-1.5">
              <span>{agent?.name?.split(" ")[0] || "Agent"}</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                {agent?.agentCode || "MKT-REP"}
              </span>
            </h1>
            <p className="text-[10px] text-slate-400">ReviewSmart Field Closer</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Pitch & Objection Helper Button */}
          <button
            type="button"
            onClick={() => setShowPitchModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Pitch Script</span>
            <span className="sm:hidden">Script</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition shadow-sm"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* ─── AGENT PERFORMANCE & EARNINGS HUD ──────────────────────────── */}
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
                <span className="text-[9px] font-semibold text-slate-400">Commission</span>
                {showEarnings ? (
                  <EyeOff className="w-2.5 h-2.5 text-slate-500 group-hover:text-slate-300" />
                ) : (
                  <Eye className="w-2.5 h-2.5 text-slate-500 group-hover:text-slate-300" />
                )}
              </div>
              {showEarnings ? (
                <span className="text-base font-black text-emerald-400 tracking-wider inline-block">
                  ₹{agent.agentStats.totalCommission.toLocaleString("en-IN")}
                </span>
              ) : (
                <span className="text-base font-black text-emerald-400/50 tracking-wider inline-block">
                  ••••
                </span>
              )}
            </button>
            <div
              className="p-2 rounded-xl bg-slate-950/60 border-b-2 border-amber-500 cursor-pointer"
              onClick={() => {
                setShowMyDeals(true);
                setPortfolioFilter("PENDING");
              }}
              title="Filter pending deals"
            >
              <span className="text-[9px] font-semibold text-slate-400 block">Pending</span>
              <span className="text-base font-black text-amber-400">{agent.agentStats.pendingDeals}</span>
            </div>
          </div>
        ) : null}

        {/* ─── SUCCESS VIEW: DEAL CLOSED & DYNAMIC UPI QR ─────────────────── */}
        {createdDeal ? (
          <div className="bg-slate-900 rounded-3xl p-5 border border-emerald-500/40 shadow-2xl space-y-4 animate-fadeIn">
            <div className="text-center space-y-1">
              <div className="text-4xl mb-1 animate-bounce">🎉</div>
              <h2 className="text-lg font-black text-white">Deal Closed Successfully!</h2>
              <div className="inline-block mt-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                Your Commission: ₹{Math.floor(createdDeal.negotiatedAmount * 0.4).toLocaleString("en-IN")} (40%)
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
                <span className="font-semibold text-slate-500">Agreed Price:</span>
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
                <span className="text-[11px] font-bold text-slate-700 mt-2">
                  Scan with PhonePe, GPay, or Paytm
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Direct to: {createdDeal.upiId}
                </span>
              </div>

              <div className="pt-2 border-t text-[10px] text-slate-500">
                Ref Note: <code className="bg-slate-100 px-1 py-0.5 rounded">{createdDeal.upiNote}</code>
              </div>
            </div>

            {/* Dynamic Hardware Deliverables Handover Checklist */}
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 text-xs text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Package: {createdDeal.packageName || "Executive Kit"}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ₹{createdDeal.negotiatedAmount}
                </span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-300">
                {(createdDeal.hardwareDeliverables || [
                  "1x 4″×6″ Acrylic Counter Standee",
                  "1x Vertical PVC Display Card",
                ]).map((del: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>{del}</span>
                  </div>
                ))}
                <div className="flex items-start gap-1.5 text-slate-400 pt-1 border-t border-slate-700/50">
                  <span className="text-indigo-400 font-bold shrink-0">✓</span>
                  <span>Test customer camera scan live on merchant&apos;s phone</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Link
                href={`/agent/manage/${createdDeal.businessId || createdDeal.businessSlug}`}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition transform active:scale-98"
              >
                <Store className="w-4 h-4" />
                <span>Open Merchant Kit &amp; Print Studio 🎨</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  const base = getAppUrl();
                  const msg = `Hi! Welcome to ReviewSmart AI 😊\n\nHere are your store credentials:\n📱 Login Link: ${base}/login\n👤 User ID: ${createdDeal.merchantUserId}\n🔑 PIN: ${createdDeal.merchantPin}\n\nLive Review URL: ${base}/r/${createdDeal.businessSlug}\n\n⭐ Your customers can scan to give 5-star Google reviews in 15 seconds!`;
                  window.open(
                    `https://wa.me/91${createdDeal.merchantUserId}?text=${encodeURIComponent(msg)}`,
                    "_blank"
                  );
                }}
                className="w-full py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Credentials via WhatsApp</span>
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
                {nextDealCountdown > 0 ? `Closing in ${nextDealCountdown}s...` : "+ Close Another Deal"}
              </button>
            </div>
          </div>
        ) : (
          /* ─── FORM VIEW: 3-STEP DEAL CLOSING FLOW ───────────────────────── */
          <form onSubmit={handleRegisterDeal} className="space-y-4">
            {dealError && (
              <div className="p-3.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold">
                {dealError}
              </div>
            )}

            {/* Progress Step Header */}
            <div className="flex items-center gap-1 mb-2 mt-1">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${
                      step < activeStep
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : step === activeStep
                        ? "bg-indigo-600 border-indigo-500 text-white scale-110 shadow-lg shadow-indigo-500/30"
                        : "bg-slate-800 border-slate-700 text-slate-500"
                    }`}
                  >
                    {step < activeStep ? "✓" : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`flex-1 h-0.5 rounded transition-all ${
                        step < activeStep ? "bg-emerald-500" : "bg-slate-700"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between text-[9px] font-bold text-slate-400 px-1 -mt-1 mb-2">
              <span className={activeStep >= 1 ? "text-indigo-400" : ""}>1. Search Store</span>
              <span className={activeStep >= 2 ? "text-indigo-400 text-center" : "text-center"}>
                2. Merchant Details
              </span>
              <span className={activeStep >= 3 ? "text-emerald-400 text-right" : "text-right"}>
                3. Agreed Price &amp; QR
              </span>
            </div>

            {/* STEP 1: Search & Demo Generator */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3 relative z-30">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-indigo-400" />
                  Step 1: Search Merchant's Google Profile
                  {selectedPlace && <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-in zoom-in" />}
                </label>
                <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                  Live Google Maps
                </span>
              </div>

              {/* Quick Search Chips */}
              <div className="flex flex-wrap gap-1.5">
                {KADAPA_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setSearchQuery(preset);
                      handleSearch(preset);
                    }}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-300 border border-slate-700 transition"
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              <div ref={searchContainerRef} className="relative">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 z-10 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    onFocus={() => {
                      if (searchResults.length > 0) setIsDropdownOpen(true);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
                    placeholder="Type store name or paste Google Maps link..."
                    className="w-full text-xs pl-10 pr-24 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bold"
                  />
                  <div className="absolute right-2 top-2 z-10 flex items-center gap-1">
                    {isSearching ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-300 bg-indigo-950 px-2 py-1 rounded-xl border border-indigo-800 animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
                      </span>
                    ) : searchQuery.length >= 2 ? (
                      <button
                        type="button"
                        onClick={() => handleSearch()}
                        className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition"
                      >
                        Search
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* Floating Autocomplete Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 rounded-2xl border-2 border-indigo-500/40 shadow-2xl z-50 overflow-hidden divide-y divide-slate-800 max-h-[300px] overflow-y-auto">
                    <div className="p-2 bg-slate-800/90 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        {isSearching ? "Searching Google..." : `Matching Stores (${searchResults.length})`}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(false)}
                        className="text-[10px] font-bold text-slate-400 hover:text-white"
                      >
                        Close ✕
                      </button>
                    </div>

                    {searchResults.map((r, idx) => (
                      <div
                        key={r.placeId || idx}
                        onClick={() => handleSelectBusiness(r)}
                        className="p-3 hover:bg-indigo-950/40 cursor-pointer transition flex items-start gap-2.5 group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center text-white font-bold shrink-0 mt-0.5">
                          {r.logoUrl ? (
                            <img src={r.logoUrl} alt={r.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <MapPin className="w-4 h-4 text-indigo-300" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                              {r.name}
                            </span>
                            {r.rating && (
                              <span className="text-[9px] text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                                ★ {r.rating}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">{r.address}</div>
                        </div>

                        <button
                          type="button"
                          className="px-2 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 text-[10px] font-bold group-hover:bg-indigo-600 group-hover:text-white transition shrink-0"
                        >
                          Select ➔
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Business Preview */}
              {selectedPlace && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-white border border-amber-400/80 flex items-center justify-center font-bold text-slate-900 overflow-hidden shrink-0 p-1 shadow-sm">
                        {selectedPlace.logoUrl ? (
                          <img
                            src={selectedPlace.logoUrl}
                            alt={selectedPlace.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-indigo-600 font-black text-sm">
                            {selectedPlace.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {selectedPlace.name}
                        </div>
                        <div className="text-[10px] text-amber-400 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>Google Standee Ready</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Logo quick upload */}
                      <label
                        className="px-2 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition"
                        title="Upload/Snap Store Brand Logo"
                      >
                        <Camera className="w-3 h-3" />
                        <span>{selectedPlace.logoUrl ? "Logo ✓" : "Add Logo"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                alert("Please select an image smaller than 5MB");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                if (typeof ev.target?.result === "string") {
                                  setSelectedPlace((prev) => prev ? { ...prev, logoUrl: ev.target?.result as string } : null);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>

                      {/* Standee Demo Button */}
                      <button
                        type="button"
                        onClick={() => setShowStandeeModal(true)}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center gap-1 transition"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>Show Merchant</span>
                      </button>
                    </div>
                  </div>

                  {/* Pitch Review Drafts generated for merchant */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI Compliments Tailored for Store:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleGeneratePitchReviews(selectedPlace)}
                        className="text-[9px] text-slate-400 hover:text-white flex items-center gap-0.5"
                      >
                        <RefreshCw className="w-2.5 h-2.5" /> Redo
                      </button>
                    </div>

                    {loadingPitchDrafts ? (
                      <div className="py-4 text-center text-xs text-slate-400">
                        <Loader2 className="w-4 h-4 text-amber-400 animate-spin mx-auto mb-1" />
                        Generating store-specific review drafts...
                      </div>
                    ) : pitchDrafts.length > 0 ? (
                      <div className="space-y-1.5">
                        {pitchDrafts.slice(0, 2).map((d, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                            <span className="text-amber-400 font-bold">★ {d.headline}: </span>
                            "{d.text}"
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            {/* STEP 2: Merchant Mobile & PIN */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                Step 2: Merchant Mobile &amp; 4-Digit Login PIN
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
                      <RefreshCw className="w-2.5 h-2.5" /> Roll
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
            </div>

            {/* STEP 2A: Store Brand Logo (Digital Review Card) */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-indigo-400" />
                  Step 2A: Store Brand Logo (Shown on Digital Review Page)
                  {selectedPlace?.logoUrl && <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-in zoom-in" />}
                </label>
                <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  Shown on Customer's Phone
                </span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300 font-semibold">
                    Snap or upload the store's board/visiting card logo:
                  </span>
                  <label className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload / Snap</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert("Please select an image smaller than 5MB");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (typeof ev.target?.result === "string") {
                              setSelectedPlace((prev) => prev ? { ...prev, logoUrl: ev.target?.result as string } : null);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-md p-1.5">
                    {selectedPlace?.logoUrl ? (
                      <img
                        src={selectedPlace.logoUrl}
                        alt="Logo preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-base font-black text-indigo-600">
                        {selectedPlace?.name ? selectedPlace.name.slice(0, 2).toUpperCase() : "RS"}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={selectedPlace?.logoUrl || ""}
                      onChange={(e) => setSelectedPlace((prev) => prev ? { ...prev, logoUrl: e.target.value } : null)}
                      placeholder="Or paste direct image URL (https://...)"
                      className="w-full text-[11px] p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    {selectedPlace?.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setSelectedPlace((prev) => prev ? { ...prev, logoUrl: null } : null)}
                        className="text-[10px] text-red-400 hover:text-red-300 font-semibold"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2B: Dual-Sided PVC Card Back Customization */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  Step 2B: Dual-Sided PVC Card Back Design
                </label>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  Front: Google QR • Back: Store Identity
                </span>
              </div>

              {/* Mode Toggle */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setVisitingCardBackMode("BUSINESS_CARD")}
                  className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                    visitingCardBackMode === "BUSINESS_CARD"
                      ? "border-amber-500 bg-amber-500/15 text-amber-300 font-bold ring-1 ring-amber-400"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 mb-0.5 text-amber-400" />
                  <span className="text-[10px]">Luxury Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisitingCardBackMode("CUSTOM_IMAGE")}
                  className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                    visitingCardBackMode === "CUSTOM_IMAGE"
                      ? "border-amber-500 bg-amber-500/15 text-amber-300 font-bold ring-1 ring-amber-400"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 mb-0.5 text-amber-400" />
                  <span className="text-[10px]">Snap / Upload</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisitingCardBackMode("DUAL_UPI")}
                  className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                    visitingCardBackMode === "DUAL_UPI"
                      ? "border-amber-500 bg-amber-500/15 text-amber-300 font-bold ring-1 ring-amber-400"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5 mb-0.5 text-amber-400" />
                  <span className="text-[10px]">Direct UPI QR</span>
                </button>
              </div>

              {/* Mode 1: Business Card Typography Fields */}
              {visitingCardBackMode === "BUSINESS_CARD" && (
                <div className="space-y-2 p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                        Proprietor / Owner Name
                      </label>
                      <input
                        type="text"
                        value={visitingCardOwnerName}
                        onChange={(e) => setVisitingCardOwnerName(e.target.value)}
                        placeholder="e.g. D. Mohan"
                        className="w-full text-xs p-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                        Designation / Title
                      </label>
                      <input
                        type="text"
                        value={visitingCardOwnerTitle}
                        onChange={(e) => setVisitingCardOwnerTitle(e.target.value)}
                        placeholder="e.g. Managing Director"
                        className="w-full text-xs p-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                      Direct VIP Mobile (Optional override)
                    </label>
                    <input
                      type="tel"
                      value={visitingCardPhone}
                      onChange={(e) => setVisitingCardPhone(e.target.value)}
                      placeholder={merchantPhone ? `Default: ${merchantPhone}` : "10-digit mobile"}
                      className="w-full text-xs p-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Mode 2: Camera / Upload */}
              {visitingCardBackMode === "CUSTOM_IMAGE" && (
                <div className="space-y-2 p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                  <p className="text-[10px] text-slate-400">
                    Snap a photo of the merchant's physical paper visiting card or upload custom back artwork:
                  </p>
                  {visitingCardImageUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-amber-400/40 bg-black/40 p-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={visitingCardImageUrl}
                          alt="Visiting Card"
                          className="w-16 h-10 object-cover rounded-lg border border-white/20"
                        />
                        <div>
                          <div className="text-[11px] font-bold text-white flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Card Attached
                          </div>
                          <div className="text-[9px] text-slate-400">Ready for CR80 PVC printing</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVisitingCardImageUrl(null)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-700 hover:border-amber-400/60 rounded-xl cursor-pointer bg-slate-900/60 transition group">
                      <Camera className="w-6 h-6 text-amber-400 mb-1 group-hover:scale-110 transition" />
                      <span className="text-[11px] font-bold text-slate-200">
                        Take Photo or Select File
                      </span>
                      <span className="text-[9px] text-slate-500">Camera / Gallery / PDF preview</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleVisitingCardUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              )}

              {/* Mode 3: Direct UPI QR Note */}
              {visitingCardBackMode === "DUAL_UPI" && (
                <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-[10px] text-slate-300 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    Back side will render a direct UPI Payment QR code alongside the store name, making this a 2-in-1 <strong>Pay &amp; Review</strong> station.
                  </span>
                </div>
              )}

              {/* Coaching Alert */}
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-200 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Closer Tip:</strong> Tell the merchant — <em>"Sir, this is not just a review card. The flip side is your personal luxury visiting card that you can carry in your wallet or display on your counter!"</em>
                </span>
              </div>
            </div>

            {/* STEP 3: Deliverables Hardware Package & Agreed Price */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Step 3: Hardware Package &amp; Agreed Price
                </label>
                <span className="text-[10px] text-slate-400 font-normal">Min Floor: ₹1,999</span>
              </div>

              {/* Package Tier Selection Cards */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Select Deliverables Hardware Tier:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Starter PVC */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPackageTier("STARTER_PVC");
                      setNegotiatedPrice(HARDWARE_PACKAGES.STARTER_PVC.price);
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      selectedPackageTier === "STARTER_PVC"
                        ? "bg-gradient-to-b from-indigo-950/80 to-slate-900 border-indigo-500 ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/10"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          Entry Tier
                        </span>
                        <span className="text-xs font-black text-white">₹1,999</span>
                      </div>
                      <div className="text-xs font-black text-white">Starter PVC Pack</div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                        1x Vertical PVC Card (CR80) · Best for compact single tills
                      </p>
                    </div>
                  </button>

                  {/* Executive Standee (Best Seller) */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPackageTier("EXECUTIVE_STANDEE");
                      setNegotiatedPrice(HARDWARE_PACKAGES.EXECUTIVE_STANDEE.price);
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between relative ${
                      selectedPackageTier === "EXECUTIVE_STANDEE"
                        ? "bg-gradient-to-b from-amber-950/60 via-slate-900 to-slate-950 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/10"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[8px] font-black uppercase tracking-wider shadow">
                      Best Seller
                    </span>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-bold text-amber-400/90 uppercase tracking-wider">
                          Retail Showpiece
                        </span>
                        <span className="text-xs font-black text-amber-400">₹2,499</span>
                      </div>
                      <div className="text-xs font-black text-white">Executive Standee Kit</div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                        1x 4″×6″ Acrylic Standee + 1x PVC Card + Google G Badge
                      </p>
                    </div>
                  </button>

                  {/* All-in-One Multi-Counter Hub */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPackageTier("ALL_IN_ONE_HUB");
                      setNegotiatedPrice(HARDWARE_PACKAGES.ALL_IN_ONE_HUB.price);
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      selectedPackageTier === "ALL_IN_ONE_HUB"
                        ? "bg-gradient-to-b from-emerald-950/60 via-slate-900 to-slate-950 border-emerald-400 ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/10"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-bold text-emerald-400/90 uppercase tracking-wider">
                          VIP Complete
                        </span>
                        <span className="text-xs font-black text-emerald-400">₹2,999</span>
                      </div>
                      <div className="text-xs font-black text-white">All-in-One Hub</div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                        Standee + 2x PVC Cards + A4 Glass Door Poster + Menu Hub
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Selected Tier Hardware Checklist Display */}
              {(() => {
                const pkg = HARDWARE_PACKAGES[selectedPackageTier];
                return (
                  <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        Deliverables for &ldquo;{pkg.name}&rdquo;:
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Standard: ₹{pkg.price}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-300">
                      {pkg.hardwareDeliverables.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5 flex items-center gap-1">
                      <span className="text-indigo-400 font-bold">💡 Price Defense:</span> If this merchant compares with another shop, note that pricing corresponds to hardware deliverables (PVC card vs Acrylic Standee vs Full Multi-card Kit).
                    </p>
                  </div>
                );
              })()}

              {/* Commission badge */}
              <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                <span className="text-slate-300">Your Agent Cut (40%):</span>
                <span className="font-black text-emerald-400">
                  ₹{Math.floor(negotiatedPrice * 0.4).toLocaleString("en-IN")}
                </span>
              </div>

              {/* Custom Agreed Amount Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                    Agreed Closing Price (₹)
                  </label>
                  <input
                    type="number"
                    min={1999}
                    required
                    value={negotiatedPrice}
                    onChange={(e) => setNegotiatedPrice(Number(e.target.value))}
                    className="w-full text-sm font-bold p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                {/* Optional UTR Ref */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">
                    12-Digit UPI UTR Ref No. (Optional)
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
            </div>

            {/* Deal Submission Button */}
            <button
              type="submit"
              disabled={isSubmittingDeal}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all disabled:opacity-50"
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

        {/* ─── MY MERCHANTS PORTFOLIO PANEL ──────────────────────────────── */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              setShowMyDeals((prev) => !prev);
              if (!showMyDeals && myDeals.length === 0) fetchMyDeals();
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-left">
                <span className="text-xs font-black text-white">My Onboarded Merchants</span>
                <span className="ml-2 text-[10px] font-bold text-indigo-300 bg-indigo-950 px-1.5 py-0.5 rounded-full border border-indigo-800">
                  {myDeals.length}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isLoadingDeals && <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />}
              {showMyDeals ? (
                <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
              )}
            </div>
          </button>

          {/* Expanded Deal Cards */}
          {showMyDeals && (
            <div className="mt-2 space-y-2.5 animate-fadeIn">
              {/* Portfolio Filter & Search */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <div className="flex gap-1 flex-wrap">
                  {(["ALL", "APPROVED", "DEMO", "PENDING"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setPortfolioFilter(tab)}
                      className={`px-3 py-1 rounded-xl text-[10px] font-bold transition ${
                        portfolioFilter === tab
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {tab === "DEMO" ? "🟢 24h Demo" : tab}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Search store name or phone..."
                  value={portfolioSearch}
                  onChange={(e) => setPortfolioSearch(e.target.value)}
                  className="w-full text-[11px] px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {filteredDeals.length === 0 ? (
                <div className="py-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                  No matching merchants found.
                </div>
              ) : (
                filteredDeals.map((deal) => {
                  const base = typeof window !== "undefined" ? window.location.origin : getAppUrl();
                  const credsMsg = `Hi! Welcome to ReviewSmart AI 😊\n\nHere are your store credentials:\n📱 Login: ${base}/login\n👤 User ID: ${deal.merchantUserId}\n\nYour review page: ${base}/r/${deal.businessSlug}\n\n⭐ Share this with your customers to get 5-star reviews instantly!`;

                  return (
                    <div
                      key={deal.paymentId}
                      className={`p-3.5 rounded-2xl border transition ${
                        deal.status === "APPROVED"
                          ? "bg-slate-900 border-emerald-500/25"
                          : deal.status === "REJECTED"
                          ? "bg-slate-900 border-red-500/20"
                          : "bg-slate-900 border-amber-500/25"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                            {deal.businessLogoUrl ? (
                              <img src={deal.businessLogoUrl} alt={deal.businessName} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs font-black text-indigo-300">
                                {deal.businessName.slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-black text-white truncate">{deal.businessName}</div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {deal.businessCategory || "Store"} · {new Date(deal.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                          {deal.isDemoActive ? (
                            <span className="px-2 py-0.5 rounded-lg text-[9px] font-black shrink-0 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              24h Demo Active
                            </span>
                          ) : deal.demoUsed && !deal.isPaid ? (
                            <span className="px-2 py-0.5 rounded-lg text-[9px] font-black shrink-0 bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              Demo Expired
                            </span>
                          ) : null}

                          <span
                            className={`px-2 py-0.5 rounded-lg text-[9px] font-black shrink-0 ${
                              deal.status === "APPROVED"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : deal.status === "REJECTED"
                                ? "bg-red-500/15 text-red-400 border border-red-500/30"
                                : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {deal.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2 text-[10px]">
                        <div className="flex-1 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                          <span className="text-slate-400 block">Amount</span>
                          <span className="font-black text-white">₹{deal.amount.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <span className="text-slate-400 block">Commission</span>
                          <span className="font-black text-emerald-400">
                            ₹{deal.agentCommission.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex-1 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                          <span className="text-slate-400 block">User ID</span>
                          <span className="font-mono font-bold text-white text-[9px]">{deal.merchantUserId}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Link
                          href={`/agent/manage/${deal.businessId || deal.businessSlug}`}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-[11px] font-black flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition transform active:scale-98"
                        >
                          <Store className="w-3.5 h-3.5" />
                          <span>🎨 Manage &amp; Design Kit</span>
                          <ArrowRight className="w-3 h-3 ml-auto opacity-75" />
                        </Link>

                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              window.open(
                                `https://wa.me/91${deal.merchantPhone.replace(/\D/g, "")}?text=${encodeURIComponent(credsMsg)}`,
                                "_blank"
                              )
                            }
                            className="py-1.5 px-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] text-[10px] font-bold flex items-center justify-center gap-1.5 transition"
                          >
                            <Share2 className="w-3 h-3" />
                            Share Creds
                          </button>
                          <a
                            href={`/r/${deal.businessSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] font-bold flex items-center justify-center gap-1.5 transition"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Live Card
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </main>

      {/* ─── SALES PITCH & OBJECTION HANDLER MODAL ───────────────────────── */}
      {showPitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-white text-base">Field Pitch &amp; Scripts</h3>
              </div>
              <button
                onClick={() => setShowPitchModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 30-Sec Pitch Script */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                ⚡ 30-Second Elevator Pitch (Telugu / English):
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                &quot;Sir/Madam, daily 50+ customers walk into your shop, but nobody gives Google reviews. When people search on Maps for stores in Kadapa, your competitor with 4.9★ gets the business. With this Smart QR acrylic standee, customers scan with their phone camera — our AI drafts a 5-star review in 15 seconds. If anyone is unhappy, their message goes privately to your phone instead of damaging your Google score!&quot;
              </p>
            </div>

            {/* Objection Handlers */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Top 3 Merchant Objections:
              </h4>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-xs font-bold text-amber-400 block">
                  1. &quot;I already have a Google QR code paper on counter.&quot;
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  <strong>Say:</strong> &quot;Sir, regular Google QR forces customer to type everything manually. 90% of people close it because they don&apos;t have time. ReviewSmart AI writes the full 5-star review for them in 1 tap!&quot;
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-xs font-bold text-amber-400 block">
                  2. &quot;What if someone writes a negative review?&quot;
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  <strong>Say:</strong> &quot;That is the biggest superpower of ReviewSmart! Any 1, 2, or 3-star rating is intercepted privately to your WhatsApp. Only 4 and 5 stars go to Google. Your public rating stays 100% protected.&quot;
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-xs font-bold text-amber-400 block">
                  3. &quot;Is there any monthly subscription fees?&quot;
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  <strong>Say:</strong> &quot;No monthly headache! It&apos;s a complete 1-year package including physical acrylic standee, vertical PVC card, and high-res print assets delivered for your counter.&quot;
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPitchModal(false)}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Got It, Back to Pitching
            </button>
          </div>
        </div>
      )}

      {/* ─── FULLSCREEN STANDEE DEMO FOR MERCHANT ───────────────────────── */}
      {showStandeeModal && selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded-3xl p-6 border-2 border-amber-400/90 shadow-2xl text-center space-y-3">
            <button
              onClick={() => setShowStandeeModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" /> 5.0 Google Excellence Award
            </div>

            {/* Official Google "G" Uniform Circular Badge */}
            <div className="w-16 h-16 rounded-full border-2 border-amber-400 bg-white flex items-center justify-center p-3.5 mx-auto overflow-hidden shadow-xl ring-4 ring-amber-400/20">
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.665-5.2 3.665-9.12z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.43 7.37 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.28 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
              </svg>
            </div>

            <h3 className="text-base font-black text-white leading-tight">
              {selectedPlace.name}
            </h3>
            <p className="text-[11px] text-slate-400 truncate">{selectedPlace.address}</p>

            <div className="w-44 h-44 bg-white p-3 rounded-2xl mx-auto border-2 border-amber-400 shadow-xl flex items-center justify-center">
              <QrCode className="w-full h-full text-slate-950" />
            </div>

            <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-black">
              <span>★ ★ ★ ★ ★</span>
              <span className="text-white text-[11px] font-semibold ml-1">Scan Camera to Review</span>
            </div>

            <p className="text-[10px] text-slate-400">
              Flipkart 4&quot;×6&quot; (A6) Portrait Acrylic Counter Standee
            </p>

            <button
              onClick={() => setShowStandeeModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
            >
              Close Standee Mode
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
