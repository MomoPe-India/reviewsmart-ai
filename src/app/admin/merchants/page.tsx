"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Plus,
  Smartphone,
  KeyRound,
  CheckCircle2,
  XCircle,
  Loader2,
  Copy,
  Check,
  Store,
  ExternalLink,
  RefreshCw,
  Trash2,
  Globe,
  UserCheck,
  ShieldAlert,
  Eye,
  EyeOff,
} from "lucide-react";

interface MerchantItem {
  id: string;
  name: string | null;
  phone: string | null;
  userIdTag: string | null;
  customerType: string;
  isActive: boolean;
  createdAt: string;
  totalPaid: number;
  dealCount: number;
  businesses: {
    id: string;
    name: string;
    slug: string;
    isPaid: boolean;
    customerType: string;
  }[];
}

export default function AdminMerchantsPage() {
  const [merchants, setMerchants] = useState<MerchantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"ALL" | "ONLINE" | "OFFLINE">("ALL");

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createType, setCreateType] = useState<"ONLINE" | "OFFLINE">("ONLINE");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createdResult, setCreatedResult] = useState<{ pin: string; userId: string } | null>(null);

  // PIN Reset / Action state
  const [actionMerchantId, setActionMerchantId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"reset_pin" | "toggle_active" | null>(null);
  const [actionResult, setActionResult] = useState<{ pin?: string; message: string } | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPinId, setShowPinId] = useState<string | null>(null);

  const fetchMerchants = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/merchants");
      const data = await res.json();
      if (res.ok && data.merchants) setMerchants(data.merchants);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMerchants(); }, [fetchMerchants]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      const res = await fetch("/api/admin/merchants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: createName, phone: createPhone, customerType: createType }),
      });
      const data = await res.json();
      if (!res.ok) { setCreateError(data.error || "Failed to create merchant."); return; }
      setCreatedResult({ pin: data.pin, userId: data.merchant.userIdTag });
      setCreateName(""); setCreatePhone("");
      fetchMerchants();
    } catch { setCreateError("Network error."); }
    finally { setCreating(false); }
  };

  const handleAction = async (merchantId: string, action: "toggle_active" | "reset_pin") => {
    setProcessingId(merchantId);
    setActionResult(null);
    try {
      const res = await fetch("/api/admin/merchants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchantId, action }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionResult({ pin: data.newPin, message: data.message });
        fetchMerchants();
      }
    } catch { console.error("Action failed"); }
    finally { setProcessingId(null); }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = merchants.filter(m =>
    filterType === "ALL" ? true : m.customerType === filterType
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Merchant Accounts
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-bold">
              {merchants.length}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, manage, enable/disable merchant accounts and reset PINs.
          </p>
        </div>
        <button
          onClick={() => { setShowCreateModal(true); setCreatedResult(null); setCreateError(""); }}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Merchant
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["ALL", "ONLINE", "OFFLINE"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterType === t
              ? "bg-indigo-600 text-white"
              : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
            }`}
          >
            {t === "ONLINE" ? "💻 Online" : t === "OFFLINE" ? "🤝 Offline (Agent)" : "All"}
            {t !== "ALL" && (
              <span className="ml-1.5 opacity-70">
                ({merchants.filter(m => m.customerType === t).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Action Result Banner */}
      {actionResult && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-start justify-between gap-3">
          <div>
            <p>{actionResult.message}</p>
            {actionResult.pin && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-emerald-100">New PIN:</span>
                <span className="font-mono text-lg font-black text-white tracking-widest bg-emerald-600/30 px-3 py-1 rounded-lg">
                  {actionResult.pin}
                </span>
                <button onClick={() => copyToClipboard(actionResult.pin!, "result")} className="text-emerald-400 hover:text-emerald-200">
                  {copiedId === "result" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <span className="text-amber-300">⚠ Share this PIN with the merchant now — it won't be shown again.</span>
              </div>
            )}
          </div>
          <button onClick={() => setActionResult(null)} className="text-emerald-400 hover:text-white text-base font-bold">✕</button>
        </div>
      )}

      {/* Merchants List */}
      {loading ? (
        <div className="p-12 text-center"><Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="p-10 rounded-3xl bg-slate-800/50 border border-slate-700 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Merchant Accounts Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Add merchants after phone discussions. They'll login with their mobile number + PIN.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((m) => {
            const business = m.businesses[0];
            const isProcessing = processingId === m.id;
            return (
              <div
                key={m.id}
                className={`bg-slate-800 rounded-2xl border ${m.isActive ? "border-slate-700" : "border-red-500/40"} p-4 space-y-3 shadow-sm`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${m.customerType === "ONLINE" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"}`}>
                      {m.customerType === "ONLINE" ? <Globe className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">{m.name || "Unknown"}</h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Smartphone className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-400 font-mono">{m.phone || m.userIdTag}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${m.customerType === "ONLINE" ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"}`}>
                      {m.customerType === "ONLINE" ? "💻 Online" : "🤝 Offline"}
                    </span>
                    {!m.isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-0.5">
                        <ShieldAlert className="w-3 h-3" /> Suspended
                      </span>
                    )}
                  </div>
                </div>

                {/* Business info */}
                {business && (
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/50 border border-slate-700/50">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Store className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-xs text-slate-300 font-medium truncate">{business.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${business.isPaid ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                        {business.isPaid ? "✓ Live" : "⏳ Pending"}
                      </span>
                      <a href={`/r/${business.slug}`} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Login ID */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/40 border border-slate-700/50">
                  <span className="text-[11px] text-slate-400">Login User ID:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-indigo-300">{m.userIdTag}</span>
                    <button onClick={() => copyToClipboard(m.userIdTag || "", m.id + "_id")} className="text-slate-500 hover:text-slate-300">
                      {copiedId === m.id + "_id" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleAction(m.id, "reset_pin")}
                    disabled={isProcessing}
                    className="flex-1 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-slate-300 font-semibold flex items-center justify-center gap-1 transition disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    Reset PIN
                  </button>
                  <button
                    onClick={() => handleAction(m.id, "toggle_active")}
                    disabled={isProcessing}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition disabled:opacity-50 ${m.isActive ? "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30" : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"}`}
                  >
                    {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : m.isActive ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {m.isActive ? "Suspend" : "Activate"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                Add New Merchant Account
              </h2>
              <button onClick={() => { setShowCreateModal(false); setCreatedResult(null); }} className="text-slate-400 hover:text-white text-xs font-bold">✕</button>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold">
                {createError}
              </div>
            )}

            {createdResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-sm font-bold text-white">Merchant Account Created!</h3>
                  <p className="text-xs text-slate-400">Share these credentials with the merchant NOW — the PIN won't be shown again.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700">
                    <span className="text-xs text-slate-400">User ID (Mobile):</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-300">{createdResult.userId}</span>
                      <button onClick={() => copyToClipboard(createdResult.userId, "new_id")} className="text-slate-400 hover:text-white">
                        {copiedId === "new_id" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-emerald-500/30">
                    <span className="text-xs text-slate-400">4-Digit PIN:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-2xl font-black text-emerald-400 tracking-widest">{createdResult.pin}</span>
                      <button onClick={() => copyToClipboard(createdResult.pin, "new_pin")} className="text-slate-400 hover:text-white">
                        {copiedId === "new_pin" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-amber-400 text-center">⚠ This PIN is shown only once. Send it to the merchant via WhatsApp immediately.</p>
                <button
                  onClick={() => { setCreatedResult(null); setShowCreateModal(false); }}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Merchant Full Name</label>
                  <input
                    type="text" required value={createName} onChange={(e) => setCreateName(e.target.value)}
                    placeholder="e.g. Ravi Kumar Enterprises"
                    className="w-full text-sm p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Mobile Number (becomes their Login ID)</label>
                  <input
                    type="tel" required maxLength={10} value={createPhone} onChange={(e) => setCreatePhone(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="10-digit mobile number"
                    className="w-full text-sm p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">This becomes their User ID to login at /login</p>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Customer Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["ONLINE", "OFFLINE"] as const).map((t) => (
                      <button
                        key={t} type="button"
                        onClick={() => setCreateType(t)}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition ${createType === t ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400"}`}
                      >
                        {t === "ONLINE" ? "💻 Online (Social media)" : "🤝 Offline (Agent sale)"}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                  🔐 A random 4-digit PIN will be auto-generated and shown <strong>once</strong>. Share it immediately with the merchant.
                </p>
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={creating} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition flex items-center justify-center gap-2 disabled:opacity-50">
                    {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Create Account
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
