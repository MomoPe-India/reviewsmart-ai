"use client";

import React, { useState } from "react";
import {
  Check,
  X,
  Smartphone,
  Save,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface AdminPaymentsProps {
  initialPayments: any[];
  initialSettings: any;
}

export default function AdminPaymentsClient({
  initialPayments,
  initialSettings,
}: AdminPaymentsProps) {
  const [payments, setPayments] = useState(initialPayments);
  const [settings, setSettings] = useState(
    initialSettings || {
      upiId: "momopedeals@oksbi",
      upiPayeeName: "Damerla Mohan",
      digitalPrice: 299,
      physicalPrice: 999,
    }
  );

  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMsg("");

    try {
      const res = await fetch("/api/platform-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSettingsMsg("UPI Settings updated! Customers will now see this UPI ID.");
        setTimeout(() => setSettingsMsg(""), 3500);
      }
    } catch {
      alert("Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAction = async (paymentId: string, action: "APPROVE" | "REJECT") => {
    setProcessingId(paymentId);
    try {
      const res = await fetch("/api/payments/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, action }),
      });

      const data = await res.json();
      if (res.ok) {
        setPayments((prev) =>
          prev.map((p) =>
            p.id === paymentId
              ? { ...p, status: action === "APPROVE" ? "APPROVED" : "REJECTED" }
              : p
          )
        );
      } else {
        alert(data.error || "Action failed");
      }
    } catch {
      alert("Network error");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. UPI ID & Price Configuration Form */}
      <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            Your Receiving UPI ID &amp; Pricing Setup
          </h2>
          {settingsMsg && (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {settingsMsg}
            </span>
          )}
        </div>

        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Receiver UPI ID (VPA) *
            </label>
            <input
              type="text"
              required
              value={settings.upiId}
              onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
              placeholder="e.g. 9876543210@paytm or name@okaxis"
              className="w-full text-xs font-mono p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Payee Display Name *
            </label>
            <input
              type="text"
              required
              value={settings.upiPayeeName}
              onChange={(e) => setSettings({ ...settings, upiPayeeName: e.target.value })}
              placeholder="e.g. My Agency Pay"
              className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              1 Month Pass Price (₹)
            </label>
            <input
              type="number"
              value={settings.digitalPrice}
              onChange={(e) => setSettings({ ...settings, digitalPrice: Number(e.target.value) })}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              1 Year / Lifetime Pass Price (₹)
            </label>
            <input
              type="number"
              value={settings.physicalPrice}
              onChange={(e) => setSettings({ ...settings, physicalPrice: Number(e.target.value) })}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Agent Min Negotiated Floor (₹)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={100}
                value={settings.minNegotiatedPrice || 499}
                onChange={(e) => setSettings({ ...settings, minNegotiatedPrice: Number(e.target.value) })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <button
                type="submit"
                disabled={savingSettings}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0"
              >
                {savingSettings ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 2. Customer Payment Verifications Table */}
      <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-sm space-y-4 p-6">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          Customer Payment Submissions ({payments.length})
        </h2>

        {payments.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">
            No customer payments submitted yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-700">
                <tr>
                  <th className="pb-3 font-semibold">Store / Client</th>
                  <th className="pb-3 font-semibold">Source / Agent</th>
                  <th className="pb-3 font-semibold">12-Digit UTR Ref</th>
                  <th className="pb-3 font-semibold">Plan &amp; Amount</th>
                  <th className="pb-3 font-semibold">Customer Phone</th>
                  <th className="pb-3 font-semibold">Access Duration</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {payments.map((p) => {
                  const isPending = p.status === "PENDING";
                  const isApproved = p.status === "APPROVED";
                  const storeName = p.user?.businesses[0]?.name || "Unassigned Store";

                  return (
                    <tr key={p.id} className="hover:bg-slate-700/30 transition">
                      <td className="py-3">
                        <div className="font-bold text-white">{storeName}</div>
                        <div className="text-[10px] text-slate-400">{p.user?.email || p.user?.userIdTag}</div>
                      </td>
                      <td className="py-3">
                        {p.agentCode ? (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                            Agt: {p.agentCode}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 text-[10px]">
                            Online Web
                          </span>
                        )}
                      </td>
                      <td className="py-3 font-mono font-bold text-amber-300">
                        {p.utrNumber}
                      </td>
                      <td className="py-3">
                        <span className="font-bold text-emerald-400 text-sm">₹{p.amount}</span>
                        <div className="text-[10px] text-slate-400">
                          {p.planType === "NEGOTIATED_DEAL"
                            ? "Field Negotiated Deal"
                            : p.planType === "LIFETIME_999"
                            ? "1 Year / Lifetime Pass"
                            : p.planType === "ADDON_BRANCH"
                            ? "Extra Branch Pass"
                            : "1 Month Pass"}
                        </div>
                      </td>
                      <td className="py-3 text-slate-300 font-mono">
                        {p.customerPhone || "-"}
                      </td>
                      <td className="py-3">
                        {p.planType === "LIFETIME_999" || p.planType === "NEGOTIATED_DEAL" ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                            365 Days / Lifetime
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                            30 Days Access
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        {isApproved ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                            Approved
                          </span>
                        ) : p.status === "REJECTED" ? (
                          <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 font-bold text-[10px]">
                            Rejected
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                            Needs Approval
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              disabled={processingId === p.id}
                              onClick={() => handleAction(p.id, "APPROVE")}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve &amp; Activate
                            </button>
                            <button
                              disabled={processingId === p.id}
                              onClick={() => handleAction(p.id, "REJECT")}
                              className="p-1.5 rounded-lg bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white transition"
                              title="Reject"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
