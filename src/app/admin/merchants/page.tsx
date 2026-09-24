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
  Edit3,
  MessageSquare,
  AlertTriangle,
  X,
  Save,
  MapPin,
} from "lucide-react";

interface BusinessItem {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  category?: string | null;
  logoUrl?: string | null;
  primaryColor?: string;
  googleReviewUrl?: string | null;
  googlePlaceId?: string | null;
  googleAddress?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  minRatingForGoogle?: number;
  isPaid: boolean;
  customerType: string;
}

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
  businesses: BusinessItem[];
}

export default function AdminMerchantsPage() {
  const [merchants, setMerchants] = useState<MerchantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"ALL" | "ONLINE" | "OFFLINE">("ALL");

  // Create Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createBusinessName, setCreateBusinessName] = useState("");
  const [createCategory, setCreateCategory] = useState("");
  const [createType, setCreateType] = useState<"ONLINE" | "OFFLINE">("ONLINE");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createdResult, setCreatedResult] = useState<{
    pin: string;
    userId: string;
    name: string;
    phone: string;
    slug?: string;
  } | null>(null);

  // Edit Modal state
  const [editingMerchant, setEditingMerchant] = useState<MerchantItem | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    customerType: "ONLINE",
    isActive: true,
    businessId: "",
    businessName: "",
    slug: "",
    category: "",
    tagline: "",
    googleReviewUrl: "",
    googleAddress: "",
    whatsapp: "",
    website: "",
    minRatingForGoogle: 4,
    isPaid: true,
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete Modal state
  const [deletingMerchant, setDeletingMerchant] = useState<MerchantItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // PIN Reset notification state
  const [actionResult, setActionResult] = useState<{
    pin: string;
    phone: string;
    name: string;
    slug?: string;
    message: string;
  } | null>(null);

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPinId, setShowPinId] = useState<string | null>(null);

  const fetchMerchants = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/merchants");
      const data = await res.json();
      if (res.ok && data.merchants) setMerchants(data.merchants);
    } catch (e) {
      console.error("Fetch merchants error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMerchants();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const filter = params.get("filter") || params.get("type");
      if (filter && (filter === "ONLINE" || filter === "OFFLINE" || filter === "ALL")) {
        setFilterType(filter as any);
      }
    }
  }, [fetchMerchants]);

  // Create Merchant
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      const res = await fetch("/api/admin/merchants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createName,
          phone: createPhone,
          businessName: createBusinessName || createName,
          category: createCategory,
          customerType: createType,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Failed to create merchant.");
        return;
      }
      setCreatedResult({
        pin: data.pin,
        userId: data.merchant.userIdTag || data.phone,
        name: createName,
        phone: data.phone,
        slug: data.slug,
      });
      setCreateName("");
      setCreatePhone("");
      setCreateBusinessName("");
      setCreateCategory("");
      fetchMerchants();
    } catch {
      setCreateError("Network error. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (m: MerchantItem) => {
    const b = m.businesses[0] || {};
    setEditingMerchant(m);
    setEditError("");
    setEditForm({
      name: m.name || "",
      phone: m.phone || "",
      customerType: m.customerType || "ONLINE",
      isActive: m.isActive,
      businessId: b.id || "",
      businessName: b.name || m.name || "",
      slug: b.slug || "",
      category: b.category || "",
      tagline: b.tagline || "",
      googleReviewUrl: b.googleReviewUrl || "",
      googleAddress: b.googleAddress || "",
      whatsapp: b.whatsapp || m.phone || "",
      website: b.website || "",
      minRatingForGoogle: b.minRatingForGoogle ?? 4,
      isPaid: b.isPaid ?? true,
    });
  };

  // Save Edit Merchant
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMerchant) return;
    setSavingEdit(true);
    setEditError("");

    try {
      const res = await fetch("/api/admin/merchants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantId: editingMerchant.id,
          ...editForm,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || "Failed to update merchant.");
        return;
      }

      // Update in local state immediately
      setMerchants((prev) =>
        prev.map((m) =>
          m.id === editingMerchant.id
            ? {
                ...m,
                name: editForm.name,
                phone: editForm.phone,
                userIdTag: editForm.phone,
                customerType: editForm.customerType,
                isActive: editForm.isActive,
                businesses: m.businesses.map((b) =>
                  b.id === editForm.businessId
                    ? {
                        ...b,
                        name: editForm.businessName,
                        slug: editForm.slug,
                        category: editForm.category,
                        tagline: editForm.tagline,
                        googleReviewUrl: editForm.googleReviewUrl,
                        googleAddress: editForm.googleAddress,
                        whatsapp: editForm.whatsapp,
                        website: editForm.website,
                        minRatingForGoogle: editForm.minRatingForGoogle,
                        isPaid: editForm.isPaid,
                        customerType: editForm.customerType,
                      }
                    : b
                ),
              }
            : m
        )
      );

      setEditingMerchant(null);
    } catch {
      setEditError("Failed to update merchant. Check your connection.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete Merchant
  const handleConfirmDelete = async () => {
    if (!deletingMerchant) return;
    setDeleting(true);

    try {
      const res = await fetch("/api/admin/merchants", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchantId: deletingMerchant.id }),
      });

      if (res.ok) {
        setMerchants((prev) => prev.filter((m) => m.id !== deletingMerchant.id));
        setDeletingMerchant(null);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete merchant.");
      }
    } catch {
      alert("Network error while deleting merchant.");
    } finally {
      setDeleting(false);
    }
  };

  // Toggle active or Reset PIN
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
        if (action === "reset_pin") {
          setActionResult({
            pin: data.newPin,
            phone: data.phone,
            name: data.name,
            slug: data.slug,
            message: data.message,
          });
        }
        fetchMerchants();
      }
    } catch {
      console.error("Action failed");
    } finally {
      setProcessingId(null);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Construct WhatsApp Share URL
  const buildWhatsAppShareUrl = (name: string, phone: string, pin: string, slug?: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = `Hello ${name}! 👋\nWelcome to ReviewSmart AI!\n\nHere are your store login credentials:\n📱 Login: https://reviewsmart-ai.com/login\n👤 User ID (Mobile): ${cleanPhone}\n🔑 4-Digit Security PIN: ${pin}${slug ? `\n\n🌟 Your Review Card: https://reviewsmart-ai.com/r/${slug}` : ""}\n\nLog in to customize your digital review card and protect your store ratings.`;
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
  };

  const filteredMerchants = merchants.filter((m) => {
    if (filterType === "ONLINE") return m.customerType === "ONLINE";
    if (filterType === "OFFLINE") return m.customerType === "OFFLINE";
    return true;
  });

  const onlineCount = merchants.filter((m) => m.customerType === "ONLINE").length;
  const offlineCount = merchants.filter((m) => m.customerType === "OFFLINE").length;

  return (
    <div className="space-y-6">
      {/* ─── PAGE HEADER ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Merchant Accounts &amp; PIN Control ({merchants.length})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create online customers, reset PINs, edit store details, and share credentials directly via WhatsApp.
          </p>
        </div>
        <button
          onClick={() => {
            setShowCreateModal(true);
            setCreatedResult(null);
            setCreateError("");
          }}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-950 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Merchant</span>
        </button>
      </div>

      {/* ─── RESET PIN SUCCESS BANNER WITH 1-CLICK WHATSAPP ─────────────────── */}
      {actionResult && (
        <div className="p-4 rounded-3xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-200 text-xs shadow-xl animate-fadeIn space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-white text-sm">
                  PIN Reset Successfully for {actionResult.name}!
                </span>
                <p className="text-[11px] text-amber-300">
                  New 4-digit PIN generated. Share this immediately with the merchant.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActionResult(null)}
              className="text-amber-400 hover:text-white font-bold p-1"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-700/80">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">User ID (Mobile):</span>
              <span className="font-mono font-bold text-white text-sm">{actionResult.phone}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">New 4-Digit PIN:</span>
              <span className="font-mono font-black text-amber-400 text-base tracking-widest">
                {actionResult.pin}
              </span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => copyToClipboard(actionResult.pin, "banner-pin")}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 border border-slate-700 transition"
              >
                {copiedId === "banner-pin" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === "banner-pin" ? "Copied!" : "Copy PIN"}</span>
              </button>

              <a
                href={buildWhatsAppShareUrl(actionResult.name, actionResult.phone, actionResult.pin, actionResult.slug)}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Share via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ─── CHANNEL FILTER TABS ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setFilterType("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            filterType === "ALL"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          All ({merchants.length})
        </button>
        <button
          onClick={() => setFilterType("ONLINE")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filterType === "ONLINE"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Online ({onlineCount})</span>
        </button>
        <button
          onClick={() => setFilterType("OFFLINE")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            filterType === "OFFLINE"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Offline ({offlineCount})</span>
        </button>
      </div>

      {/* ─── MERCHANTS LIST ───────────────────────────────────────────────── */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 space-y-2">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-400" />
          <p className="text-xs">Loading merchants from database...</p>
        </div>
      ) : filteredMerchants.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-2">
          <Users className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 font-semibold">No merchants found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMerchants.map((m) => {
            const biz = m.businesses[0];
            const isOnline = m.customerType === "ONLINE";
            const isSuspended = !m.isActive;

            return (
              <div
                key={m.id}
                className={`p-5 rounded-3xl border transition-all ${
                  isSuspended
                    ? "bg-slate-900/60 border-red-500/30 opacity-70"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xl"
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-white text-sm truncate">{m.name}</h3>
                      {isOnline ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                          <Globe className="w-2.5 h-2.5" /> Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                          <UserCheck className="w-2.5 h-2.5" /> Offline
                        </span>
                      )}
                      {isSuspended ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold">
                          Suspended
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    {biz && (
                      <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="font-semibold text-white truncate">{biz.name}</span>
                        {biz.isPaid ? (
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded">
                            ✓ Live Card
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded">
                            ⏳ Unpaid
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions dropdown or quick buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(m)}
                      title="Edit Merchant & Store Details"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingMerchant(m)}
                      title="Delete Merchant"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 mb-3.5">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-semibold">User ID (Mobile):</span>
                    <span className="font-mono font-bold text-white text-xs">{m.phone || m.userIdTag}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-semibold">Total Payments:</span>
                    <span className="font-bold text-emerald-400 text-xs">₹{m.totalPaid.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Review Link */}
                {biz && (
                  <div className="flex items-center justify-between text-xs mb-3.5 px-1">
                    <a
                      href={`/r/${biz.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono text-[11px] truncate max-w-[220px]"
                    >
                      <span>/r/{biz.slug}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                    {biz.googleAddress && (
                      <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                        📍 {biz.googleAddress}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800 text-xs">
                  {/* WhatsApp Share Button */}
                  <a
                    href={buildWhatsAppShareUrl(m.name || "Partner", m.phone || "", "[Your 4-Digit PIN]", biz?.slug)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold text-[11px] flex items-center gap-1.5 transition"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>

                  <div className="flex items-center gap-1.5">
                    {/* Reset PIN Button */}
                    <button
                      disabled={processingId === m.id}
                      onClick={() => handleAction(m.id, "reset_pin")}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[11px] flex items-center gap-1 border border-slate-700 transition disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${processingId === m.id ? "animate-spin" : ""}`} />
                      <span>Reset PIN</span>
                    </button>

                    {/* Toggle Active Button */}
                    <button
                      disabled={processingId === m.id}
                      onClick={() => handleAction(m.id, "toggle_active")}
                      className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition disabled:opacity-50 ${
                        m.isActive
                          ? "bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-slate-700"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white"
                      }`}
                    >
                      {m.isActive ? "Suspend" : "Activate"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── CREATE MERCHANT MODAL ────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Add New Merchant Account
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {createdResult ? (
              /* Success View: Show PIN & 1-Click WhatsApp Share */
              <div className="space-y-4 py-2 text-center animate-fadeIn">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Merchant Account Created!</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Share the 4-digit PIN with the merchant right now.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border-2 border-amber-400/60 text-left space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">User ID (Mobile):</span>
                    <span className="font-mono font-bold text-white text-sm">{createdResult.userId}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Security PIN:</span>
                    <span className="font-mono font-black text-amber-400 text-lg tracking-widest">
                      {createdResult.pin}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 text-left">
                  ⚠️ <strong>Important:</strong> The 4-digit PIN is shown only once. Share it with the customer immediately.
                </div>

                {/* 1-Click WhatsApp Share Button */}
                <a
                  href={buildWhatsAppShareUrl(
                    createdResult.name,
                    createdResult.phone,
                    createdResult.pin,
                    createdResult.slug
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Credentials via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  Done / Close
                </button>
              </div>
            ) : (
              /* Input Form */
              <form onSubmit={handleCreate} className="space-y-3.5">
                {createError && (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs">
                    {createError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Customer / Merchant Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    10-Digit Mobile Number (User ID) *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="9876543210"
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Store / Business Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={createBusinessName}
                    onChange={(e) => setCreateBusinessName(e.target.value)}
                    placeholder="e.g. Sharma Dental Clinic"
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category (Optional)
                  </label>
                  <input
                    type="text"
                    value={createCategory}
                    onChange={(e) => setCreateCategory(e.target.value)}
                    placeholder="e.g. Clinic, Restaurant, Salon, IT"
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Customer Channel *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCreateType("ONLINE")}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                        createType === "ONLINE"
                          ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Online Lead</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateType("OFFLINE")}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                        createType === "OFFLINE"
                          ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Offline Store</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition disabled:opacity-50"
                  >
                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    <span>Create Merchant &amp; Generate PIN</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─── EDIT MERCHANT MODAL ──────────────────────────────────────────── */}
      {editingMerchant && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                Edit Merchant &amp; Store Details
              </h2>
              <button
                onClick={() => setEditingMerchant(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {editError && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs">
                  {editError}
                </div>
              )}

              {/* Merchant Credentials */}
              <div className="space-y-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  👤 Merchant Account
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Merchant Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      10-Digit Phone (User ID) *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value.replace(/[^0-9]/g, "") })
                      }
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Channel
                    </label>
                    <select
                      value={editForm.customerType}
                      onChange={(e) => setEditForm({ ...editForm, customerType: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="ONLINE">ONLINE (Digital Only)</option>
                      <option value="OFFLINE">OFFLINE (Physical Standee)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Account Status
                    </label>
                    <select
                      value={editForm.isActive ? "ACTIVE" : "SUSPENDED"}
                      onChange={(e) =>
                        setEditForm({ ...editForm, isActive: e.target.value === "ACTIVE" })
                      }
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="SUSPENDED">SUSPENDED</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Store & Review Card Details */}
              {editForm.businessId && (
                <div className="space-y-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    🏢 Store Review Card (/r/{editForm.slug})
                  </span>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={editForm.businessName}
                      onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        placeholder="e.g. Restaurant, Dental Clinic"
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Review Card Status
                      </label>
                      <select
                        value={editForm.isPaid ? "LIVE" : "PENDING"}
                        onChange={(e) =>
                          setEditForm({ ...editForm, isPaid: e.target.value === "LIVE" })
                        }
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="LIVE">LIVE (Verified &amp; Paid)</option>
                        <option value="PENDING">PENDING (Unpaid Watermark)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Tagline / Subheading
                    </label>
                    <input
                      type="text"
                      value={editForm.tagline}
                      onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                      placeholder="e.g. Best multi-cuisine restaurant in Kadapa"
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Address (Shown on Review Card)
                    </label>
                    <input
                      type="text"
                      value={editForm.googleAddress}
                      onChange={(e) => setEditForm({ ...editForm, googleAddress: e.target.value })}
                      placeholder="e.g. Kadapa, Andhra Pradesh"
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Google Review Direct Target URL
                    </label>
                    <input
                      type="url"
                      value={editForm.googleReviewUrl}
                      onChange={(e) => setEditForm({ ...editForm, googleReviewUrl: e.target.value })}
                      placeholder="https://search.google.com/local/writereview?placeid=..."
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        WhatsApp Contact
                      </label>
                      <input
                        type="text"
                        value={editForm.whatsapp}
                        onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                        placeholder="8639831132"
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Website (Optional)
                      </label>
                      <input
                        type="text"
                        value={editForm.website}
                        onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                        placeholder="https://example.com"
                        className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMerchant(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition disabled:opacity-50"
                >
                  {savingEdit ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRMATION MODAL ────────────────────────────────────── */}
      {deletingMerchant && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">Delete Merchant Account?</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <strong className="text-white">{deletingMerchant.name}</strong>?
                This will delete their user account, store review card, and all recorded customer feedbacks.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingMerchant(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition disabled:opacity-50"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
