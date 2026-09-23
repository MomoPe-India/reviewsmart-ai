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
} from "lucide-react";
import QRCode from "qrcode";

interface BillingClientProps {
  business: any;
  subscription: any;
  settings: any;
  recentPayments: any[];
}

export default function BillingClient({
  business,
  subscription,
  settings,
  recentPayments: initialPayments,
}: BillingClientProps) {
  const [selectedPlan, setSelectedPlan] = useState<"MONTHLY_299" | "LIFETIME_999">("MONTHLY_299");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Form
  const [utrNumber, setUtrNumber] = useState("");
  const [customerPhone, setCustomerPhone] = useState(business?.phone || "");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [payments, setPayments] = useState(initialPayments);

  const upiId = settings?.upiId || "momopedeals@oksbi";
  const upiPayee = settings?.upiPayeeName || "Damerla Mohan";
  const digitalPrice = settings?.digitalPrice || 299;
  const physicalPrice = settings?.physicalPrice || 999;

  const currentAmount = selectedPlan === "MONTHLY_299" ? digitalPrice : physicalPrice;
  const transactionNote = `ReviewPass-${business?.slug || "Activation"}`;

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
    await navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) return;

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/payments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planType: selectedPlan,
          amount: currentAmount,
          utrNumber: utrNumber.trim(),
          customerPhone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to submit payment details");
      } else {
        setSuccessMsg("Payment submitted successfully! Your account will be activated shortly.");
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Plan Selection & Dynamic UPI Payment */}
      <div className="lg:col-span-7 space-y-6">
        {/* Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => setSelectedPlan("MONTHLY_299")}
            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
              selectedPlan === "MONTHLY_299"
                ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">1 Month Pass</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                Monthly Digital
              </span>
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-3xl font-black text-slate-900">₹{digitalPrice}</span>
              <span className="text-sm text-slate-400 line-through">₹599</span>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                Save ₹300
              </span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 mt-3 pt-3 border-t border-slate-200/60">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                Live Smart Funnel &amp; AI Generator
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                Negative Review Shield (1-3★ filter)
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                Print-Ready Stand &amp; NFC Studio (PDF/SVG)
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                Instant Digital Activation
              </li>
            </ul>
          </div>

          <div
            onClick={() => setSelectedPlan("LIFETIME_999")}
            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all relative ${
              selectedPlan === "LIFETIME_999"
                ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Special Offer • Save 50%
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">1 Year / Lifetime Pass</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                One-Time Payment
              </span>
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-3xl font-black text-slate-900">₹{physicalPrice}</span>
              <span className="text-sm text-slate-400 line-through">₹1,999</span>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded uppercase">
                Save ₹1,000!
              </span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 mt-3 pt-3 border-t border-slate-200/60">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <strong>1 Year / Lifetime Full Access</strong>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                Everything in 1 Month Pass included
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                Priority Gemini AI Generation Speed
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                Zero Monthly Renewal Hassle
              </li>
            </ul>
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
                      ₹{p.amount} • {p.planType === "LIFETIME_999" ? "1 Year / Lifetime Pass" : "1 Month Pass"}
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
  );
}
