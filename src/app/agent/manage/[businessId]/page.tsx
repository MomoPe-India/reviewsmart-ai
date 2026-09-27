"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Store,
  Printer,
  Settings,
  Send,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Save,
  Loader2,
  Phone,
  MessageCircle,
  Globe,
  Instagram,
  MapPin,
  Star,
  RefreshCw,
  Image as ImageIcon,
  Tag,
  CreditCard,
  FileText,
  Clock,
  ShieldCheck,
  Zap,
  X,
  Lock,
  Unlock,
  AlertTriangle,
} from "lucide-react";
import PrintStudioClient from "@/components/studio/PrintStudioClient";
import { copyToClipboard } from "@/lib/clipboard";
import { getAppUrl } from "@/lib/utils";

interface BusinessData {
  id: string;
  userId: string;
  name: string;
  slug: string;
  tagline: string | null;
  category: string | null;
  logoUrl: string | null;
  primaryColor: string;
  googlePlaceId: string | null;
  googleReviewUrl: string | null;
  googleAddress: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  website: string | null;
  minRatingForGoogle: number;
  keywords: string;
  tagChips: string;
  reviewPromptTone: string;
  qrMode?: string | null;
  menuUrl?: string | null;
  customUpiId?: string | null;
  visitingCardBackMode?: string | null;
  visitingCardOwnerName?: string | null;
  visitingCardOwnerTitle?: string | null;
  visitingCardPhone?: string | null;
  visitingCardEmail?: string | null;
  visitingCardAddress?: string | null;
  visitingCardImageUrl?: string | null;
  isPaid: boolean;
  customerType: string;
  demoExpiresAt?: string | null;
  demoActivatedAt?: string | null;
  demoActivatedBy?: string | null;
  demoUsed?: boolean;
  isDemoActive?: boolean;
  user?: {
    id: string;
    name: string | null;
    phone: string | null;
    userIdTag: string | null;
  };
}

interface CurrentUser {
  id: string;
  role: "SUPER_ADMIN" | "MARKETING_AGENT" | "BUSINESS_OWNER";
  name?: string | null;
  agentCode?: string | null;
}

export default function AgentManageMerchantPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = (params?.businessId as string) || "";

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "studio" | "whatsapp">("profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [business, setBusiness] = useState<BusinessData | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    category: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    website: "",
    googleReviewUrl: "",
    googleAddress: "",
    keywords: "",
    tagChips: "",
    reviewPromptTone: "friendly",
    logoUrl: "",
    primaryColor: "#4f46e5",
    qrMode: "SMART_HUB",
    menuUrl: "",
    customUpiId: "",
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Demo Action State
  const [isDemoProcessing, setIsDemoProcessing] = useState(false);
  const [demoBannerMsg, setDemoBannerMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertUtr, setConvertUtr] = useState("");
  const [remainingTimeStr, setRemainingTimeStr] = useState<string>("");

  // WhatsApp Tab State
  const [waRecipient, setWaRecipient] = useState("");
  const [copiedWaMessage, setCopiedWaMessage] = useState(false);

  // Load User Session & Business
  useEffect(() => {
    async function loadData() {
      if (!businessId) return;
      setLoading(true);
      setError(null);

      try {
        // Fetch current user
        const userRes = await fetch("/api/auth/me");
        if (userRes.ok) {
          const uData = await userRes.json();
          setCurrentUser(uData.user || null);
        }

        // Fetch business
        const res = await fetch(`/api/business/${businessId}`);
        const data = await res.json();

        if (!res.ok || !data.business) {
          setError(data.error || "Failed to load merchant business details");
          return;
        }

        const b: BusinessData = data.business;
        setBusiness(b);
        setFormData({
          name: b.name || "",
          tagline: b.tagline || "",
          category: b.category || "",
          phone: b.phone || "",
          whatsapp: b.whatsapp || "",
          instagram: b.instagram || "",
          website: b.website || "",
          googleReviewUrl: b.googleReviewUrl || "",
          googleAddress: b.googleAddress || "",
          keywords: b.keywords || "",
          tagChips: b.tagChips || "",
          reviewPromptTone: b.reviewPromptTone || "friendly",
          logoUrl: b.logoUrl || "",
          primaryColor: b.primaryColor || "#4f46e5",
          qrMode: b.qrMode || "SMART_HUB",
          menuUrl: b.menuUrl || "",
          customUpiId: b.customUpiId || "",
        });

        // Set initial WhatsApp recipient from merchant phone or WhatsApp
        const cleanPhone = (b.whatsapp || b.phone || "").replace(/[^0-9]/g, "");
        setWaRecipient(cleanPhone.length >= 10 ? cleanPhone.slice(-10) : cleanPhone);
      } catch (err: any) {
        setError(err.message || "Network error loading merchant");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [businessId]);

  // Live countdown timer for active demo
  useEffect(() => {
    if (!business?.demoExpiresAt) {
      setRemainingTimeStr("");
      return;
    }

    const targetDate = new Date(business.demoExpiresAt).getTime();

    function updateCountdown() {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        setRemainingTimeStr("Expired");
        if (business && business.isDemoActive) {
          setBusiness((prev) => (prev ? { ...prev, isDemoActive: false } : null));
        }
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setRemainingTimeStr(
        `${hours.toString().padStart(2, "0")}h ${mins.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`
      );
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [business?.demoExpiresAt, business?.isDemoActive]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/business/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || "Failed to update profile");
        return;
      }

      setSaveSuccess(true);
      if (data.business) {
        setBusiness((prev) => (prev ? { ...prev, ...data.business } : data.business));
      }
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setSaveError(err.message || "Failed to save profile changes");
    } finally {
      setSaving(false);
    }
  };

  // Demo Actions: Activate 24h Demo
  const handleActivateDemo = async () => {
    if (!business) return;
    const confirmMsg =
      "Are you sure you want to activate a 24-hour evaluation demo for this merchant? The live Google Review portal and QR scan will be fully operational for 24 hours.";
    if (!window.confirm(confirmMsg)) return;

    setIsDemoProcessing(true);
    setDemoBannerMsg(null);

    try {
      const res = await fetch(`/api/business/${business.id}/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "activate_demo" }),
      });

      const data = await res.json();
      if (!res.ok) {
        setDemoBannerMsg({ type: "error", text: data.error || "Failed to activate demo" });
        return;
      }

      setDemoBannerMsg({ type: "success", text: "24-Hour Evaluation Demo activated successfully!" });
      setBusiness((prev) =>
        prev
          ? {
              ...prev,
              demoExpiresAt: data.business.demoExpiresAt,
              demoActivatedAt: data.business.demoActivatedAt,
              demoUsed: true,
              isDemoActive: true,
            }
          : null
      );
      setTimeout(() => setDemoBannerMsg(null), 5000);
    } catch (err: any) {
      setDemoBannerMsg({ type: "error", text: err.message || "Failed to connect to demo service" });
    } finally {
      setIsDemoProcessing(false);
    }
  };

  // Demo Actions: Cancel Demo Early
  const handleCancelDemo = async () => {
    if (!business) return;
    if (!window.confirm("Cancel this merchant's evaluation demo early and lock the review card?")) return;

    setIsDemoProcessing(true);
    setDemoBannerMsg(null);

    try {
      const res = await fetch(`/api/business/${business.id}/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel_demo" }),
      });

      const data = await res.json();
      if (!res.ok) {
        setDemoBannerMsg({ type: "error", text: data.error || "Failed to cancel demo" });
        return;
      }

      setDemoBannerMsg({ type: "success", text: "Demo canceled. Merchant card has been locked." });
      setBusiness((prev) =>
        prev
          ? {
              ...prev,
              demoExpiresAt: data.business.demoExpiresAt,
              isDemoActive: false,
            }
          : null
      );
      setTimeout(() => setDemoBannerMsg(null), 5000);
    } catch (err: any) {
      setDemoBannerMsg({ type: "error", text: err.message || "Failed to cancel demo" });
    } finally {
      setIsDemoProcessing(false);
    }
  };

  // Demo Actions: Convert to Permanent Active Account
  const handleConvertToPaid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    setIsDemoProcessing(true);
    setDemoBannerMsg(null);

    try {
      const res = await fetch(`/api/business/${business.id}/demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "convert_to_paid",
          utrNumber: convertUtr.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setDemoBannerMsg({ type: "error", text: data.error || "Failed to convert account" });
        return;
      }

      setShowConvertModal(false);
      setConvertUtr("");
      setDemoBannerMsg({
        type: "success",
        text: "Merchant account permanently converted to Active & Verified status!",
      });
      setBusiness((prev) =>
        prev
          ? {
              ...prev,
              isPaid: true,
              demoExpiresAt: null,
              isDemoActive: false,
            }
          : null
      );
      setTimeout(() => setDemoBannerMsg(null), 5000);
    } catch (err: any) {
      setDemoBannerMsg({ type: "error", text: err.message || "Failed to convert account" });
    } finally {
      setIsDemoProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-400 mb-4" />
        <h2 className="text-base font-bold text-slate-200">Loading Merchant Workspace...</h2>
        <p className="text-xs text-slate-400 mt-1">Fetching profile, print studio, and evaluation status.</p>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied or Not Found</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            {error || "This merchant could not be found or you do not have permission to manage this business profile."}
          </p>
          <Link
            href={currentUser?.role === "SUPER_ADMIN" ? "/admin/merchants" : "/agent"}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentUser?.role === "SUPER_ADMIN" ? "Back to Admin Merchants" : "Back to Agent Dashboard"}
          </Link>
        </div>
      </div>
    );
  }

  const appUrl = typeof window !== "undefined" ? window.location.origin : getAppUrl();
  const reviewUrl = `${appUrl}/r/${business.slug}`;

  // WhatsApp Message Generator
  const waMessage = `✨ *Namaste ${formData.name || business.name}!*

Your SmartReview AI Review Kit is ready! 🚀

⭐ *1. Live Review Card (Instant Customer Link):*
${reviewUrl}
*(Share via WhatsApp or display QR on your counter)*

🖨️ *2. Your Print-Ready Display Formats:*
• 4"×6" Countertop Acrylic Standee
• Vertical PVC Pocket/Counter Card
• A4 Wall & Door Printable Poster

🔐 *3. Merchant Login Portal:*
${appUrl}/login
*Mobile:* ${business.phone || waRecipient || "Your registered mobile"}

Need changes, custom colors, or reprints? Contact your ReviewSmart marketing agent anytime!`;

  const waSendUrl = `https://wa.me/91${waRecipient.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(waMessage)}`;

  // Evaluation status flags
  const isPaid = business.isPaid;
  const isDemoActive = Boolean(
    !isPaid &&
      business.demoExpiresAt &&
      new Date(business.demoExpiresAt).getTime() > Date.now()
  );
  const isDemoExpired = Boolean(
    !isPaid &&
      business.demoUsed &&
      business.demoExpiresAt &&
      new Date(business.demoExpiresAt).getTime() <= Date.now()
  );
  const canActivateDemo = !isPaid && (!business.demoUsed || currentUser?.role === "SUPER_ADMIN");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24">
      {/* Super Admin Access Banner (if logged in as admin) */}
      {currentUser?.role === "SUPER_ADMIN" && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 px-4 py-1.5 text-slate-950 text-xs font-black flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>Super Admin Mode: Full profile editing, print studio, and merchant activation rights.</span>
          </div>
          <Link
            href="/admin/merchants"
            className="text-[11px] underline hover:text-white font-extrabold transition"
          >
            ← Back to Admin Console
          </Link>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href={currentUser?.role === "SUPER_ADMIN" ? "/admin/merchants" : "/agent"}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title={currentUser?.role === "SUPER_ADMIN" ? "Return to Admin Console" : "Return to Agent Portal"}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <Store className="w-3.5 h-3.5" />
                {currentUser?.role === "SUPER_ADMIN" ? "Admin Merchant Workspace" : "Agent Merchant Workspace"}
              </span>

              {/* Status Badge */}
              {isPaid ? (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Active &amp; Verified
                </span>
              ) : isDemoActive ? (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 animate-pulse">
                  <Clock className="w-3 h-3 text-cyan-300" />
                  24h Demo Active ({remainingTimeStr})
                </span>
              ) : isDemoExpired ? (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                  Demo Expired
                </span>
              ) : (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  Payment Pending
                </span>
              )}
            </div>

            <h1 className="text-base sm:text-lg font-black text-white truncate max-w-xs sm:max-w-md">
              {business.name}
            </h1>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <a
            href={reviewUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition border border-slate-700"
          >
            <span>Live Card</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          {business.googleReviewUrl && (
            <a
              href={business.googleReviewUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold items-center gap-1.5 transition border border-slate-700"
            >
              <span>Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Banner Messages */}
        {demoBannerMsg && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 border transition ${
              demoBannerMsg.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-300"
            }`}
          >
            {demoBannerMsg.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{demoBannerMsg.text}</span>
          </div>
        )}

        {/* ─── EVALUATION & DEMO ACTIVATION CONTROLLER CARD ──────────────────── */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Status Information */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Merchant Account Activation Status:
                </span>
                <span className="font-mono text-xs text-indigo-400">/r/{business.slug}</span>
              </div>

              {isPaid ? (
                <div>
                  <h3 className="text-lg font-black text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Permanent Active &amp; Verified Account
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    This business has paid in full. The customer review portal, AI drafts, and Google Maps redirects are permanently unlocked.
                  </p>
                </div>
              ) : isDemoActive ? (
                <div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-lg font-black text-cyan-300 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: "12s" }} />
                      24-Hour Live Evaluation Demo Active
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-mono font-black text-xs border border-cyan-800">
                      {remainingTimeStr} left
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    The merchant can now test the live card and collect real 5-star Google reviews on their counter. Card automatically locks when the 24 hours expire.
                  </p>
                </div>
              ) : isDemoExpired ? (
                <div>
                  <h3 className="text-lg font-black text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Evaluation Period Expired (Card Locked)
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    The 24-hour evaluation has finished. The card is currently showing the &quot;Payment Pending&quot; watermark. Collect payment to convert to permanent active status.
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
                    <Lock className="w-5 h-5" /> Ready for Live Evaluation Demonstration
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Provide the merchant with a 24-hour live trial so they can test real customer reviews on their counter before committing to payment.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
              {/* If not paid and demo can be activated */}
              {canActivateDemo && !isDemoActive && (
                <button
                  type="button"
                  disabled={isDemoProcessing}
                  onClick={handleActivateDemo}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition transform active:scale-95 disabled:opacity-50"
                >
                  {isDemoProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 fill-slate-950" />
                  )}
                  <span>Activate 24h Live Demo 🚀</span>
                </button>
              )}

              {/* If demo is active: Cancel button */}
              {isDemoActive && (
                <button
                  type="button"
                  disabled={isDemoProcessing}
                  onClick={handleCancelDemo}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800/60 font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel Demo Early</span>
                </button>
              )}

              {/* Convert to Permanent Button (Available if not already paid) */}
              {!isPaid && (
                <button
                  type="button"
                  onClick={() => setShowConvertModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition transform active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Convert to Permanent (Mark Paid)</span>
                </button>
              )}

              {/* Super Admin Override for Expired Demo */}
              {currentUser?.role === "SUPER_ADMIN" && isDemoExpired && (
                <button
                  type="button"
                  disabled={isDemoProcessing}
                  onClick={handleActivateDemo}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Admin: Grant Another 24h</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>1. Merchant Profile &amp; Branding</span>
          </button>

          <button
            onClick={() => setActiveTab("studio")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "studio"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>2. Design &amp; Print Studio (300 DPI)</span>
          </button>

          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "whatsapp"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Send className="w-4 h-4 text-emerald-400" />
            <span>3. 1-Click WhatsApp Delivery</span>
          </button>
        </div>

        {/* Tab 1: Merchant Profile & Branding */}
        {activeTab === "profile" && (
          <div className="max-w-4xl">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Store className="w-5 h-5 text-indigo-400" />
                    Edit Merchant Details
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Update business information, category, Google Maps links, and logo. All updates reflect instantly on the merchant&apos;s live review card and print kits.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Card Slug:</span>
                  <code className="text-xs bg-slate-950 px-2.5 py-1 rounded-lg text-indigo-300 font-mono border border-slate-800">
                    /r/{business.slug}
                  </code>
                </div>
              </div>

              {saveSuccess && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Merchant details successfully saved and updated across all systems!</span>
                </div>
              )}

              {saveError && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* QR Display Mode Selector */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Counter QR Display Mode (Zero-Reprint Guarantee)
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Configure what customers experience when scanning the printed counter standee or PVC card.
                      </p>
                    </div>
                    <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded">
                      Dynamic Redirect
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div
                      onClick={() => handleInputChange("qrMode", "SMART_HUB")}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                        formData.qrMode === "SMART_HUB"
                          ? "border-amber-500 bg-amber-500/10"
                          : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-white block mb-1">
                          🌟 All-in-One Smart Hub (Recommended)
                        </span>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          Replaces counter clutter: Google Reviews hero + WhatsApp orders + Digital Menu + Direct UPI in 1 hub.
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold mt-2.5 block ${formData.qrMode === "SMART_HUB" ? "text-amber-400" : "text-slate-500"}`}>
                        {formData.qrMode === "SMART_HUB" ? "● Active Mode" : "○ Select"}
                      </span>
                    </div>

                    <div
                      onClick={() => handleInputChange("qrMode", "REVIEW_BOOSTER")}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                        formData.qrMode === "REVIEW_BOOSTER"
                          ? "border-indigo-500 bg-indigo-500/10"
                          : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-white block mb-1">
                          🎯 Direct Review Booster
                        </span>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          Customer scans and lands directly into the Gemini AI Review generator and private shield.
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold mt-2.5 block ${formData.qrMode === "REVIEW_BOOSTER" ? "text-indigo-400" : "text-slate-500"}`}>
                        {formData.qrMode === "REVIEW_BOOSTER" ? "● Active Mode" : "○ Select"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Business Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="e.g. Sri Guru Fashions"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Business Category / Niche
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="e.g. Clothing Store, Dental Clinic, Cafe"
                    />
                  </div>
                </div>

                {/* Tagline */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange("tagline", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                    placeholder="e.g. Premier Clothing Store in Kadapa · Exclusive Menswear"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Appears directly under the store name on both the review page and printable standees.
                  </p>
                </div>

                {/* Logo & Brand Color */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                      Merchant Logo Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.logoUrl}
                      onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="https://.../logo.png (Supports square, wide, transparent PNG/PSD)"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Our new adaptive logo engine preserves natural aspect ratios (wide banners, badges, square logos) without ugly cropping.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Logo Preview
                    </label>
                    <div className="w-full h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden p-2">
                      {formData.logoUrl ? (
                        <img
                          src={formData.logoUrl}
                          alt="Logo Preview"
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="text-[11px] text-slate-600">No Logo Provided</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Google Maps & Review Destination */}
                <div className="space-y-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <h3 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    Google Maps Review Destination
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Direct Google Review URL <span className="text-rose-400">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.googleReviewUrl}
                        onChange={(e) => handleInputChange("googleReviewUrl", e.target.value)}
                        required
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                        placeholder="https://g.page/r/.../review or https://maps.app.goo.gl/..."
                      />
                      {formData.googleReviewUrl && (
                        <a
                          href={formData.googleReviewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition border border-slate-700 shrink-0"
                        >
                          <span>Test</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Physical Store Address
                    </label>
                    <textarea
                      rows={2}
                      value={formData.googleAddress}
                      onChange={(e) => handleInputChange("googleAddress", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="e.g. 42/350-3, beside MJ Kunta Shivalayam Temple, Bhagya Nagar Colony, Kadapa, AP 516001"
                    />
                  </div>
                </div>

                {/* Contact & Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="+91 95536 66836"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="9553666836"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-pink-400" />
                      Instagram Handle
                    </label>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange("instagram", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="@srigurufashions"
                    />
                  </div>
                </div>

                {/* Digital Menu & Custom Counter UPI ID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Digital Menu / Catalog URL
                    </label>
                    <input
                      type="url"
                      value={formData.menuUrl}
                      onChange={(e) => handleInputChange("menuUrl", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                      placeholder="https://drive.google.com/... or online menu link"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Adds a &quot;View Menu&quot; button to the merchant&apos;s Smart Hub.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Merchant Counter UPI ID (0% Fee Direct Payment)
                    </label>
                    <input
                      type="text"
                      value={formData.customUpiId}
                      onChange={(e) => handleInputChange("customUpiId", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="e.g. 9553545324@ybl or store@okhdfcbank"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Enables customers to pay using GPay, PhonePe, or Paytm with 0% fee.
                    </p>
                  </div>
                </div>

                {/* AI Review Keywords & Tags */}
                <div className="space-y-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <h3 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    AI Review Generation Optimization
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      Customer Tag Chips (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tagChips}
                      onChange={(e) => handleInputChange("tagChips", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="Exclusive Menswear, Best Quality Fabrics, Reasonable Pricing, Friendly Staff"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      SEO Keywords for AI Review Engine
                    </label>
                    <input
                      type="text"
                      value={formData.keywords}
                      onChange={(e) => handleInputChange("keywords", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                      placeholder="best clothing store kadapa, wedding suits, shirts, top quality menswear"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Profile &amp; Apply Everywhere</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: Design & Print Studio */}
        {activeTab === "studio" && (
          <div>
            <PrintStudioClient
              business={business}
              reviewUrl={reviewUrl}
              agentMode={true}
              merchantInfo={{
                name: business.user?.name || business.name,
                phone: business.phone || business.whatsapp || undefined,
              }}
            />
          </div>
        )}

        {/* Tab 3: 1-Click WhatsApp Delivery Suite */}
        {activeTab === "whatsapp" && (
          <div className="max-w-3xl">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] border border-emerald-500/30 mb-2 inline-block">
                    ⚡ Agent Field Dispatch
                  </span>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Send className="w-5 h-5 text-emerald-400" />
                    1-Click WhatsApp Review Kit Delivery
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Send the merchant their live review card, print download instructions, and login credentials in 1 click.
                  </p>
                </div>
              </div>

              {/* Recipient Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  Merchant WhatsApp Number (10 digits)
                </label>
                <div className="flex gap-2">
                  <div className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-400 flex items-center">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={waRecipient}
                    onChange={(e) => setWaRecipient(e.target.value.replace(/[^0-9]/g, ""))}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition font-mono font-bold tracking-wider"
                    placeholder="9553666836"
                  />
                </div>
              </div>

              {/* Message Preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Formatted WhatsApp Message Preview
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      copyToClipboard(waMessage);
                      setCopiedWaMessage(true);
                      setTimeout(() => setCopiedWaMessage(false), 2500);
                    }}
                    className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition"
                  >
                    {copiedWaMessage ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {waMessage}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={waSendUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition transform active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Open &amp; Dispatch in WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    copyToClipboard(reviewUrl);
                    alert("Copied live review link to clipboard!");
                  }}
                  className="py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
                >
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Live Link Only</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── MODAL: CONVERT TO PERMANENT ACTIVE ACCOUNT ────────────────────── */}
      {showConvertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-white text-base">Convert to Permanent Account</h3>
              </div>
              <button
                onClick={() => setShowConvertModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Converting <strong>{business.name}</strong> will remove all evaluation time limits and mark this merchant permanently as an active, verified account.
            </p>

            <form onSubmit={handleConvertToPaid} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  UPI Transaction Ref / UTR Number (Optional)
                </label>
                <input
                  type="text"
                  value={convertUtr}
                  onChange={(e) => setConvertUtr(e.target.value)}
                  placeholder="e.g. 423987123456 or CASH-PAID"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Leave blank if cash was collected or paid via direct company account.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowConvertModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isDemoProcessing}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                >
                  {isDemoProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Confirm &amp; Unlock Permanently</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
