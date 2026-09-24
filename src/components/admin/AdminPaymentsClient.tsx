"use client";

import React, { useState, useEffect } from "react";
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
  IndianRupee,
  UserCheck,
  Globe,
} from "lucide-react";

interface AdminPaymentsProps {
  initialPayments: any[];
  initialSettings: any;
  initialStatus?: string;
  initialChannel?: string;
}

export default function AdminPaymentsClient({
  initialPayments,
  initialSettings,
  initialStatus,
  initialChannel,
}: AdminPaymentsProps) {
  const [payments, setPayments] = useState(initialPayments);
  const [settings, setSettings] = useState(
    initialSettings || {
      upiId: "momopedeals@oksbi",
      upiPayeeName: "Damerla Mohan",
      minNegotiatedPrice: 499,
      commissionRate: 0.40,
    }
  );

  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [approvalMsg, setApprovalMsg] = useState<{ id: string; msg: string; commission?: number } | null>(null);

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
        setSettingsMsg("Settings saved!");
        setTimeout(() => setSettingsMsg(""), 3000);
      }
    } catch {
      alert("Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAction = async (paymentId: string, action: "APPROVE" | "REJECT") => {
    setProcessingId(paymentId);
    setApprovalMsg(null);
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
        setApprovalMsg({ id: paymentId, msg: data.message, commission: data.commission });
      } else {
        alert(data.error || "Action failed");
      }
    } catch {
      alert("Network error");
    } finally {
      setProcessingId(null);
    }
  };

  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED" | "OFFLINE" | "ONLINE">(() => {
    if (initialStatus?.toUpperCase() === "PENDING") return "PENDING";
    if (initialStatus?.toUpperCase() === "APPROVED") return "APPROVED";
    if (initialStatus?.toUpperCase() === "REJECTED") return "REJECTED";
    if (initialChannel?.toUpperCase() === "OFFLINE" || initialChannel === "NEGOTIATED_DEAL") return "OFFLINE";
    if (initialChannel?.toUpperCase() === "ONLINE" || initialChannel === "ONLINE_DIRECT") return "ONLINE";
    return "ALL";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const s = params.get("status")?.toUpperCase();
      const c = params.get("channel")?.toUpperCase();
      if (s === "PENDING") setActiveTab("PENDING");
      else if (s === "APPROVED") setActiveTab("APPROVED");
      else if (s === "REJECTED") setActiveTab("REJECTED");
      else if (c === "OFFLINE" || c === "NEGOTIATED_DEAL") setActiveTab("OFFLINE");
      else if (c === "ONLINE" || c === "ONLINE_DIRECT") setActiveTab("ONLINE");
    }
  }, [initialStatus, initialChannel]);

  const pendingCount = payments.filter((p) => p.status === "PENDING").length;
  const approvedCount = payments.filter((p) => p.status === "APPROVED").length;
  const rejectedCount = payments.filter((p) => p.status === "REJECTED").length;
  const offlineCount = payments.filter((p) => p.planType === "NEGOTIATED_DEAL").length;
  const onlineCount = payments.filter((p) => p.planType === "ONLINE_DIRECT").length;

  const filteredPayments = payments.filter((p) => {
    if (activeTab === "PENDING") return p.status === "PENDING";
    if (activeTab === "APPROVED") return p.status === "APPROVED";
    if (activeTab === "REJECTED") return p.status === "REJECTED";
    if (activeTab === "OFFLINE") return p.planType === "NEGOTIATED_DEAL";
    if (activeTab === "ONLINE") return p.planType === "ONLINE_DIRECT";
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Approval success message */}
      {approvalMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-start justify-between gap-3">
          <div>
            <CheckCircle2 className="w-4 h-4 inline-block mr-1.5" />
            {approvalMsg.msg}
            {approvalMsg.commission && approvalMsg.commission > 0 && (
              <span className="ml-2 font-black text-amber-400">
                Agent Commission: ₹{approvalMsg.commission.toFixed(2)}
              </span>
            )}
          </div>
          <button onClick={() => setApprovalMsg(null)} className="text-emerald-400 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* 1. Platform UPI & Settings */}
      <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            UPI Payment Settings
          </h2>
          {settingsMsg && (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {settingsMsg}
            </span>
          )}
        </div>

        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Receiver UPI ID *</label>
            <input
              type="text" required
              value={settings.upiId}
              onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
              placeholder="e.g. momopedeals@oksbi"
              className="w-full text-xs font-mono p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Payee Display Name *</label>
            <input
              type="text" required
              value={settings.upiPayeeName}
              onChange={(e) => setSettings({ ...settings, upiPayeeName: e.target.value })}
              placeholder="e.g. Damerla Mohan"
              className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Min Deal Floor (₹) — Agent price cannot go below this
            </label>
            <div className="flex gap-2">
              <input
                type="number" min={100}
                value={settings.minNegotiatedPrice || 499}
                onChange={(e) => setSettings({ ...settings, minNegotiatedPrice: Number(e.target.value) })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-bold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit" disabled={savingSettings}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0"
              >
                {savingSettings ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save
              </button>
            </div>
          </div>
        </form>

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
          <span className="font-bold">Agent Commission Rate: 40%</span> — automatically calculated when you approve a deal from a marketing agent.
        </div>
      </div>

      {/* 2. Payments table */}
      <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-700 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Payment Verifications &amp; Deals
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Review and approve merchant UTR submissions to instantly activate accounts.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
            {[
              { id: "ALL", label: "All Deals", count: payments.length },
              { id: "PENDING", label: "Pending", count: pendingCount, highlight: "amber" },
              { id: "APPROVED", label: "Approved", count: approvedCount, highlight: "emerald" },
              { id: "OFFLINE", label: "Offline Deals", count: offlineCount },
              { id: "ONLINE", label: "Online Direct", count: onlineCount },
              { id: "REJECTED", label: "Rejected", count: rejectedCount, highlight: "red" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? "bg-slate-700 text-white shadow-sm border border-slate-600"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/40"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      tab.highlight === "amber" && tab.count > 0
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : tab.highlight === "emerald" && tab.count > 0
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-slate-900 text-slate-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-xs text-slate-400">
              No {activeTab === "ALL" ? "" : activeTab.toLowerCase()} payments found.
            </p>
            {activeTab !== "ALL" && (
              <button
                onClick={() => setActiveTab("ALL")}
                className="text-xs text-emerald-400 hover:underline font-semibold"
              >
                Clear filter to view all
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-700 bg-slate-800/50">
                <tr>
                  <th className="py-3 px-4 font-semibold">Merchant / Business</th>
                  <th className="py-3 px-4 font-semibold">Channel</th>
                  <th className="py-3 px-4 font-semibold">UTR Reference</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Commission</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredPayments.map((p) => {
                  const isPending = p.status === "PENDING";
                  const isApproved = p.status === "APPROVED";
                  const storeName = p.user?.businesses?.[0]?.name || "Unassigned";
                  const storeSlug = p.user?.businesses?.[0]?.slug;
                  const isAgentDeal = p.planType === "NEGOTIATED_DEAL" && p.agentCode;
                  const previewCommission = isAgentDeal
                    ? Math.round(p.amount * (settings.commissionRate || 0.40))
                    : null;

                  return (
                    <tr key={p.id} className={`hover:bg-slate-700/30 transition ${isPending ? "bg-amber-500/5" : ""}`}>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{storeName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.customerPhone || p.user?.email}</div>
                        {storeSlug && (
                          <a href={`/r/${storeSlug}`} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 mt-0.5">
                            /r/{storeSlug} <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isAgentDeal ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                              <UserCheck className="w-2.5 h-2.5" /> Offline
                            </span>
                            <div className="text-[10px] text-slate-500 mt-0.5">Agent: {p.agentCode}</div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                            <Globe className="w-2.5 h-2.5" /> Online
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-300">{p.utrNumber}</td>
                      <td className="py-3 px-4">
                        <span className="font-black text-emerald-400 text-sm">₹{p.amount}</span>
                      </td>
                      <td className="py-3 px-4">
                        {isApproved && p.commission ? (
                          <span className="font-bold text-amber-400 text-xs">₹{p.commission?.toFixed(2)}</span>
                        ) : previewCommission ? (
                          <span className="text-slate-500 text-[10px]">~₹{previewCommission} (on approval)</span>
                        ) : (
                          <span className="text-slate-600 text-[10px]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isApproved ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Live
                          </span>
                        ) : p.status === "REJECTED" ? (
                          <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 font-bold text-[10px] flex items-center gap-1 w-fit">
                            <AlertCircle className="w-3 h-3" /> Rejected
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              disabled={processingId === p.id}
                              onClick={() => handleAction(p.id, "APPROVE")}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition disabled:opacity-50"
                            >
                              {processingId === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                              Approve & Activate
                            </button>
                            <button
                              disabled={processingId === p.id}
                              onClick={() => handleAction(p.id, "REJECT")}
                              className="p-1.5 rounded-lg bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white transition"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">—</span>
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
