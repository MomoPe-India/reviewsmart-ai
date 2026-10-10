"use client";

import React, { useState, useEffect } from "react";
import {
  QrCode,
  Smartphone,
  Copy,
  Check,
  ShieldCheck,
  Send,
  Loader2,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Zap,
  Package,
  Printer,
  CreditCard,
  Building2,
  Award,
} from "lucide-react";
import QRCode from "qrcode";
import { copyToClipboard } from "@/lib/clipboard";
import {
  HARDWARE_PACKAGES,
  PackageTierId,
  getPackageById,
  getPackageByPrice,
} from "@/lib/packages";

type PlanSelection =
  | "ONLINE_LIFETIME"
  | "EXECUTIVE_STANDEE"
  | "STARTER_PVC"
  | "ALL_IN_ONE_HUB";

interface BillingClientProps {
  business: any;
  subscription: any;
  settings: any;
  recentPayments: any[];
  initialPlan?: PlanSelection | string;
}

export default function BillingClient({
  business,
  subscription,
  settings,
  recentPayments: initialPayments,
  initialPlan,
}: BillingClientProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanSelection>(
    initialPlan && initialPlan in HARDWARE_PACKAGES
      ? (initialPlan as PlanSelection)
      : "ONLINE_LIFETIME"
  );
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Form
  const [utrNumber, setUtrNumber] = useState("");
  const [customerPhone, setCustomerPhone] = useState(business?.phone || "");
  const [referralCode, setReferralCode] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [payments, setPayments] = useState(initialPayments);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref") || params.get("agent") || localStorage.getItem("reviewsmart_ref");
      if (ref) {
        const clean = ref.trim().toUpperCase();
        setReferralCode(clean);
        localStorage.setItem("reviewsmart_ref", clean);
      }
    }
  }, []);

  const upiId = settings?.upiId || "momopedeals@oksbi";
  const upiPayee = settings?.upiPayeeName || "Damerla Mohan";
  const addonPrice = 999;

  // Active business package info
  const activePackage = getPackageById(business?.packageTier || "EXECUTIVE_STANDEE");

  const currentAmount =
    selectedPlan === "ONLINE_LIFETIME"
      ? 2999
      : selectedPlan === "STARTER_PVC"
      ? HARDWARE_PACKAGES.STARTER_PVC.price
      : selectedPlan === "EXECUTIVE_STANDEE"
      ? HARDWARE_PACKAGES.EXECUTIVE_STANDEE.price
      : selectedPlan === "ALL_IN_ONE_HUB"
      ? HARDWARE_PACKAGES.ALL_IN_ONE_HUB.price
      : 2999;

  const transactionNote = `ReviewSmart-Lifetime-${business?.slug || "Activation"}`;

  // Standard UPI URI Scheme
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    upiPayee
  )}&am=${currentAmount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

  useEffect(() => {
    QRCode.toDataURL(upiUri, {
      width: 400,
      margin: 2,
      color: {
        dark: "#1e1b4b", // deep indigo
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    }).then(setQrDataUrl);
  }, [upiUri]);

  const handleCopyUpi = async () => {
    await copyToClipboard(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) return;

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const targetTier: PackageTierId =
      selectedPlan === "ONLINE_LIFETIME"
        ? "ONLINE_LIFETIME"
        : selectedPlan === "STARTER_PVC"
        ? "STARTER_PVC"
        : selectedPlan === "ALL_IN_ONE_HUB"
        ? "ALL_IN_ONE_HUB"
        : "EXECUTIVE_STANDEE";

    try {
      const res = await fetch("/api/payments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planType: "ONLINE_DIRECT",
          packageTier: targetTier,
          amount: currentAmount,
          utrNumber: utrNumber.trim(),
          customerPhone,
          agentCode: referralCode ? referralCode.trim().toUpperCase() : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to submit payment details");
      } else {
        setSuccessMsg("Payment submitted successfully! Your account will be verified shortly.");
        setPayments([data.payment, ...payments]);
        setUtrNumber("");
      }
    } catch {
      setErrorMsg("A network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Hardware Deliverables Banner (If store is active) */}
      {business?.isPaid && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/30 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Live &amp; Verified
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {business.name}
                  </span>
                </div>
                <h2 className="text-lg font-black text-white mt-0.5">
                  Current Hardware Plan: {activePackage.name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-800">
                ₹{activePackage.price.toLocaleString("en-IN")} Hardware Tier
              </span>
            </div>
          </div>

          <div className="mt-4">
            <span className="text-xs font-bold text-slate-300 block mb-2">
              📦 Registered Store Hardware Deliverables:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {activePackage.hardwareDeliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Plan Selection & Dynamic UPI Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header */}
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-600" />
              Select Counter Hardware Bundle or Add-on
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pricing corresponds to the physical display hardware &amp; station deliverables for your shop counter.
            </p>
          </div>

          {/* Plan Cards */}
          <div className="space-y-4">
            {/* Primary Hero Plan: Online Lifetime Pass (₹2,999) */}
            <div
              onClick={() => setSelectedPlan("ONLINE_LIFETIME")}
              className={`p-5 sm:p-6 rounded-3xl border-2 cursor-pointer transition-all relative ${
                selectedPlan === "ONLINE_LIFETIME"
                  ? "border-amber-500 bg-gradient-to-br from-amber-50/80 via-white to-indigo-50/40 shadow-xl ring-4 ring-amber-400/20"
                  : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
              }`}
            >
              <div className="absolute -top-3 right-5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                ★ 100% Free For Lifetime • Zero Subscriptions
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Pan-India Online Flagship
                    </span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Lifetime Free Updates Included
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    ReviewSmart AI Lifetime Pass (All India)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                    Pay ₹2,999 once and get complete lifetime access. Zero monthly renewals, zero yearly fees. 🆓 Free Google Business Profile (GMB) creation &amp; verification included if you don&apos;t have one!
                  </p>
                </div>

                <div className="flex items-baseline gap-1.5 shrink-0 sm:text-right">
                  <span className="text-3xl font-black text-slate-900">₹2,999</span>
                  <span className="text-xs text-slate-500 font-bold">one-time / lifetime</span>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-700">
                <div className="flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>1x 4″×6″ Luxury Acrylic Standee</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>1x Dual-Sided PVC NFC Smart Card</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>6 Indian Languages AI Engine</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-emerald-700 font-bold">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Free GMB Setup &amp; Verification</span>
                </div>
              </div>
            </div>

            {/* Other Hardware Kits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Executive Standee */}
              <div
                onClick={() => setSelectedPlan("EXECUTIVE_STANDEE")}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  selectedPlan === "EXECUTIVE_STANDEE"
                    ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                      Standee Kit
                    </span>
                    <Printer className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900">
                    Executive Counter Standee
                  </h4>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="text-lg font-black text-slate-900">₹2,499</span>
                    <span className="text-[10px] text-slate-400 font-semibold">one-time</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    1x 4″×6″ Acrylic Standee + 1x PVC Card
                  </p>
                </div>
              </div>

              {/* Starter PVC */}
              <div
                onClick={() => setSelectedPlan("STARTER_PVC")}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  selectedPlan === "STARTER_PVC"
                    ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                      Card Only
                    </span>
                    <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900">
                    Starter PVC Card Pack
                  </h4>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="text-lg font-black text-slate-900">₹1,999</span>
                    <span className="text-[10px] text-slate-400 font-semibold">one-time</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    1x Dual-Sided PVC Smart NFC Card
                  </p>
                </div>
              </div>

              {/* All-in-One Multi-Counter Hub */}
              <div
                onClick={() => setSelectedPlan("ALL_IN_ONE_HUB")}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  selectedPlan === "ALL_IN_ONE_HUB"
                    ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                      VIP Multi-Station
                    </span>
                    <Award className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900">
                    All-in-One Multi-Counter Hub
                  </h4>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="text-lg font-black text-slate-900">₹2,999</span>
                    <span className="text-[10px] text-slate-400 font-semibold">one-time</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    1x Standee + 2x PVC Cards + 1x A4 Poster
                  </p>
                </div>
              </div>
            </div>
          </div>

        {/* UPI QR & Intent Payment Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-600" />
                Step 1: Scan &amp; Pay via UPI
              </h3>
              <p className="text-xs text-slate-400">
                Amount to Pay: <strong className="text-slate-800">₹{currentAmount}</strong>
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Zero Fees / 100% Secure
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            {/* QR code */}
            <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-200 flex-shrink-0 text-center">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="UPI QR Code" className="w-44 h-44 object-contain" />
              ) : (
                <div className="w-44 h-44 bg-slate-100 animate-pulse rounded-xl" />
              )}
              <span className="text-[10px] font-bold text-slate-500 block mt-1">
                Scan with any UPI App
              </span>
            </div>

            {/* UPI Details & Mobile 1-Tap button */}
            <div className="space-y-3 flex-1 text-center sm:text-left">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Official UPI ID:
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono font-bold text-slate-800 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                    {upiId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedUpi ? "Copied" : "Copy"}
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Payee Name: <strong className="text-slate-700">{upiPayee}</strong>
                </span>
              </div>

              {/* Mobile 1-Tap Trigger (Opens Google Pay / PhonePe / Paytm on mobile) */}
              <div className="pt-2">
                <a
                  href={upiUri}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition"
                >
                  <Smartphone className="w-4 h-4" />
                  Tap to Pay ₹{currentAmount} on Google Pay / PhonePe
                </a>
                <span className="text-[10px] text-slate-400 block text-center mt-1">
                  (Works directly on mobile phones)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Step 2 UTR Submission Form & Payment History */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Send className="w-4 h-4 text-indigo-600" />
            Step 2: Submit UTR for Instant Activation
          </h3>
          <p className="text-xs text-slate-500">
            After paying ₹{currentAmount}, copy the 12-digit UPI Reference / UTR Number from your GPay / PhonePe / Paytm transaction receipt and enter it below.
          </p>

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmitUtr} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                12-Digit UPI Reference / UTR Number *
              </label>
              <input
                type="text"
                required
                maxLength={24}
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 426819283741"
                className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your WhatsApp / Phone Number *
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {referralCode ? (
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-[11px] text-indigo-900 flex items-center justify-between">
                <span className="font-medium">
                  Partner Referral Code: <strong className="font-mono text-indigo-700">{referralCode}</strong>
                </span>
                <span className="text-[10px] bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
                  ✓ Attributed
                </span>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting || !utrNumber.trim()}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-100 transition disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Submit UTR &amp; Activate Access
                </>
              )}
            </button>
          </form>
        </div>

        {/* Payment Submissions List */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Payment Submissions History
          </h3>

          {payments.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center">
              No payment submissions yet.
            </p>
          ) : (
            <div className="space-y-2">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-mono font-bold text-slate-800">
                      UTR: {p.utrNumber}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      ₹{p.amount?.toLocaleString("en-IN")} •{" "}
                      {p.planType === "ADDON_BRANCH"
                        ? "Additional Branch Pass"
                        : p.packageTier
                        ? getPackageById(p.packageTier).name
                        : getPackageByPrice(p.amount).name}
                    </div>
                  </div>
                  <div>
                    {p.status === "APPROVED" ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                        Active &amp; Approved
                      </span>
                    ) : p.status === "REJECTED" ? (
                      <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
                        Rejected
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Verification Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}
