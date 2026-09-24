"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Plus,
  UserCheck,
  Smartphone,
  KeyRound,
  Loader2,
  Trophy,
  IndianRupee,
  ShieldCheck,
  ShieldOff,
  Eye,
  EyeOff,
  AlertTriangle,
  TrendingUp,
  X,
  Edit3,
  Trash2,
  Search,
  MessageCircle,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import { getAppUrl } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AgentItem {
  id: string;
  name: string;
  phone: string | null;
  agentCode: string | null;
  isActive: boolean;
  dealsClosed: number;
  totalRevenue: number;
  totalCommission: number;
  commissionEarned: number;
  pendingDeals: number;
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRankIcon(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<AgentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createAgentCode, setCreateAgentCode] = useState("");
  const [createPin, setCreatePin] = useState("");
  const [showCreatePin, setShowCreatePin] = useState(false);
  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccessMsg, setCreateSuccessMsg] = useState("");

  // Edit Modal State
  const [editingAgent, setEditingAgent] = useState<AgentItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAgentCode, setEditAgentCode] = useState("");
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete Modal State
  const [deletingAgent, setDeletingAgent] = useState<AgentItem | null>(null);
  const [submittingDelete, setSubmittingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Reset PIN State
  const [actionLoading, setActionLoading] = useState<Record<string, string>>({});
  const [resetPinResults, setResetPinResults] = useState<Record<string, { pin: string; phone?: string | null; name: string }>>({});
  const [copiedPinId, setCopiedPinId] = useState<string | null>(null);

  // ── Fetch Agents ────────────────────────────────────────────────────────────
  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/agents");
      const data = await res.json();
      if (res.ok && data.agents) {
        setAgents(data.agents);
      }
    } catch (e) {
      console.error("Failed to fetch agents:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const search = params.get("search") || params.get("code");
      if (search) {
        setSearchQuery(search);
      }
    }
  }, [fetchAgents]);

  // ── Create Agent ────────────────────────────────────────────────────────────
  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");

    const cleanPin = createPin.replace(/[^0-9]/g, "");
    if (cleanPin.length !== 4) {
      setCreateError("PIN must be exactly 4 digits (0-9).");
      return;
    }

    setSubmittingCreate(true);
    try {
      const res = await fetch("/api/admin/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createName.trim(),
          phone: createPhone.trim() || null,
          agentCode: createAgentCode.trim().toUpperCase(),
          pin: cleanPin,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Failed to create agent");
        setSubmittingCreate(false);
        return;
      }

      setCreateSuccessMsg(
        `✅ Agent ${createAgentCode.toUpperCase()} registered! PIN: ${cleanPin}`
      );
      setCreateName("");
      setCreatePhone("");
      setCreateAgentCode("");
      setCreatePin("");
      fetchAgents();

      setTimeout(() => {
        setShowCreateModal(false);
        setCreateSuccessMsg("");
      }, 3000);
    } catch {
      setCreateError("Network error while creating agent.");
    } finally {
      setSubmittingCreate(false);
    }
  };

  // ── Edit Agent ──────────────────────────────────────────────────────────────
  const openEditModal = (agent: AgentItem) => {
    setEditingAgent(agent);
    setEditName(agent.name);
    setEditPhone(agent.phone || "");
    setEditAgentCode(agent.agentCode || "");
    setEditError("");
  };

  const handleEditAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgent) return;
    setEditError("");
    setSubmittingEdit(true);

    try {
      const res = await fetch("/api/admin/agents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: editingAgent.id,
          action: "edit_agent",
          name: editName.trim(),
          phone: editPhone.trim() || null,
          agentCode: editAgentCode.trim().toUpperCase(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || "Failed to update agent");
        return;
      }

      setEditingAgent(null);
      fetchAgents();
    } catch {
      setEditError("Network error while updating agent.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  // ── Delete Agent ────────────────────────────────────────────────────────────
  const handleDeleteAgent = async () => {
    if (!deletingAgent) return;
    setDeleteError("");
    setSubmittingDelete(true);

    try {
      const res = await fetch("/api/admin/agents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: deletingAgent.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || "Failed to delete agent");
        return;
      }

      setDeletingAgent(null);
      fetchAgents();
    } catch {
      setDeleteError("Network error while deleting agent.");
    } finally {
      setSubmittingDelete(false);
    }
  };

  // ── Reset PIN ───────────────────────────────────────────────────────────────
  const handleResetPin = async (agent: AgentItem) => {
    setActionLoading((prev) => ({ ...prev, [agent.id]: "reset_pin" }));
    try {
      const res = await fetch("/api/admin/agents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: agent.id, action: "reset_pin" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset PIN");

      const newPin: string = data.newPin || "????";
      setResetPinResults((prev) => ({
        ...prev,
        [agent.id]: { pin: newPin, phone: agent.phone, name: agent.name },
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading((prev) => {
        const copy = { ...prev };
        delete copy[agent.id];
        return copy;
      });
    }
  };

  // ── Toggle Active / Suspended ───────────────────────────────────────────────
  const handleToggleActive = async (agentId: string) => {
    setActionLoading((prev) => ({ ...prev, [agentId]: "toggle_active" }));
    try {
      const res = await fetch("/api/admin/agents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, action: "toggle_active" }),
      });
      if (res.ok) {
        fetchAgents();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading((prev) => {
        const copy = { ...prev };
        delete copy[agentId];
        return copy;
      });
    }
  };

  // ── Copy PIN Helper ─────────────────────────────────────────────────────────
  const handleCopyPin = (agentId: string, pin: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(pin);
      setCopiedPinId(agentId);
      setTimeout(() => setCopiedPinId(null), 2000);
    }
  };

  // ── Leaderboard & Filtered Agents ───────────────────────────────────────────
  const leaderboard = [...agents]
    .filter((a) => (a.dealsClosed || 0) > 0)
    .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));

  const filteredAgents = agents.filter((agt) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      agt.name.toLowerCase().includes(q) ||
      (agt.agentCode && agt.agentCode.toLowerCase().includes(q)) ||
      (agt.phone && agt.phone.includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            Marketing Agents
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
              {agents.length} enrolled
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage field sales team — edit codes, reset PINs, share on WhatsApp, and track commissions.
          </p>
        </div>

        <button
          onClick={() => {
            setShowCreateModal(true);
            setCreateError("");
            setCreateSuccessMsg("");
          }}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-950/40 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Agent
        </button>
      </div>

      {/* ── Commission Policy Banner ── */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
        <IndianRupee className="w-4 h-4 flex-shrink-0 text-emerald-400" />
        <span>
          <strong>Commission Policy:</strong> Agents earn{" "}
          <span className="font-black text-emerald-200">40% commission</span> on each
          verified and approved offline review card sale.
        </span>
      </div>

      {/* ── Search Bar ── */}
      {agents.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agents by name, agent code (MKT-01), or mobile..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* ── Leaderboard ── */}
      {leaderboard.length > 0 && !searchQuery && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-3 shadow-md">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Top Sales Leaderboard
            <span className="text-[10px] text-slate-400 font-normal">
              (ranked by revenue generated)
            </span>
          </h2>
          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((agt, idx) => {
              const rank = idx + 1;
              const topRevenue = leaderboard[0]?.totalRevenue || 1;
              const pct = Math.min(100, Math.round(((agt.totalRevenue || 0) / topRevenue) * 100));

              return (
                <div key={agt.id} className="flex items-center gap-3">
                  <span className="text-sm w-7 text-center font-black">
                    {getRankIcon(rank)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white truncate">
                        {agt.name}
                        <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
                          ({agt.agentCode})
                        </span>
                      </span>
                      <span className="text-xs font-black text-emerald-400 ml-2 flex-shrink-0">
                        ₹{(agt.totalRevenue || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 w-16 text-right flex-shrink-0 font-medium">
                    {agt.dealsClosed || 0} deals
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Agents Grid ── */}
      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 mt-2">Loading marketing agents…</p>
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="p-10 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">
            {searchQuery ? "No agents matching your search" : "No Marketing Agents Enrolled Yet"}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? "Try adjusting your search query or clear the filter."
              : "Register your field sales reps with an Agent Code & 4-digit PIN so they can use the Agent POS to onboard merchants."}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md"
            >
              Create First Agent
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAgents.map((agt) => {
            const isLoadingAction = !!actionLoading[agt.id];
            const currentAction = actionLoading[agt.id];
            const newPinResult = resetPinResults[agt.id];

            return (
              <div
                key={agt.id}
                className={`bg-slate-900 p-5 rounded-3xl border shadow-sm flex flex-col justify-between space-y-4 transition ${
                  agt.isActive ? "border-slate-800 hover:border-slate-700" : "border-red-500/30 bg-red-950/10"
                }`}
              >
                {/* ── Card Header ── */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs border flex-shrink-0 ${
                        agt.isActive
                          ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
                      }`}
                    >
                      {agt.agentCode ?? "AGT"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">{agt.name}</h3>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Smartphone className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        <span className="truncate">{agt.phone ?? "No mobile"}</span>
                        <span className="text-slate-600">•</span>
                        <span className="font-mono text-[11px] text-indigo-300 font-semibold">{agt.agentCode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Header: Edit & Delete buttons */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => openEditModal(agt)}
                      title="Edit Agent Details"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setDeletingAgent(agt);
                        setDeleteError("");
                      }}
                      title="Delete Agent"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Status Badge Row */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-slate-500">
                    Enrolled: {new Date(agt.createdAt).toLocaleDateString("en-IN")}
                  </span>
                  {agt.isActive ? (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-red-400 bg-red-500/20 px-2.5 py-0.5 rounded-full border border-red-500/30">
                      ✕ Suspended
                    </span>
                  )}
                </div>

                {/* ── Stats ── */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-800">
                  <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      Deals Closed
                    </span>
                    <span className="text-sm font-black text-white">
                      {agt.dealsClosed || 0}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      Revenue
                    </span>
                    <span className="text-sm font-black text-emerald-400">
                      ₹{(agt.totalRevenue || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      Commission
                    </span>
                    <span className="text-sm font-black text-amber-400">
                      ₹{(agt.commissionEarned ?? agt.totalCommission ?? 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* ── New PIN Reveal Box with WhatsApp Share ── */}
                {newPinResult && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span className="text-[11px] text-amber-300 font-bold">
                          New PIN Generated
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-400/80 font-mono font-bold">
                        Single View
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-3 py-1">
                      <div className="text-2xl font-black text-white tracking-[0.5rem] font-mono bg-slate-950/80 px-4 py-1.5 rounded-xl border border-amber-500/40">
                        {newPinResult.pin}
                      </div>
                      <button
                        onClick={() => handleCopyPin(agt.id, newPinResult.pin)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-xs flex items-center gap-1"
                        title="Copy PIN"
                      >
                        {copiedPinId === agt.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* WhatsApp Direct Share Button */}
                    {agt.phone && (
                      <a
                        href={`https://wa.me/91${agt.phone}?text=${encodeURIComponent(
                          `Hi ${agt.name},\n\nYour ReviewSmart AI Marketing Agent PIN has been reset.\n\n👤 Agent Code: ${agt.agentCode}\n🔑 New 4-Digit PIN: ${newPinResult.pin}\n📱 Login: ${getAppUrl()}/login\n\nPlease log in and keep your credentials secure.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Share PIN via WhatsApp
                      </a>
                    )}
                  </div>
                )}

                {/* ── Actions ── */}
                <div className="flex items-center gap-2 pt-1">
                  {/* Reset PIN */}
                  <button
                    onClick={() => handleResetPin(agt)}
                    disabled={isLoadingAction}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition border border-slate-700/80 disabled:opacity-50"
                  >
                    {currentAction === "reset_pin" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    Reset PIN
                  </button>

                  {/* Suspend / Activate */}
                  <button
                    onClick={() => handleToggleActive(agt.id)}
                    disabled={isLoadingAction}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border disabled:opacity-50 ${
                      agt.isActive
                        ? "bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30"
                        : "bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/30"
                    }`}
                  >
                    {currentAction === "toggle_active" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : agt.isActive ? (
                      <>
                        <ShieldOff className="w-3.5 h-3.5" />
                        Suspend
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Activate
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 1. CREATE AGENT MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                Add New Marketing Agent
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateError("");
                  setCreateSuccessMsg("");
                }}
                className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Commission Policy Callout */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
              <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
              Agents earn <strong className="mx-0.5">40% commission</strong> on each verified sale.
            </div>

            {/* Error / Success Alerts */}
            {createError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {createError}
              </div>
            )}
            {createSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                {createSuccessMsg}
              </div>
            )}

            <form onSubmit={handleCreateAgent} className="space-y-3.5">
              {/* Agent Name */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Agent Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full text-xs p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
                />
              </div>

              {/* Agent Code + PIN */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Agent Code <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={createAgentCode}
                    onChange={(e) => setCreateAgentCode(e.target.value.toUpperCase())}
                    placeholder="MKT-01"
                    pattern="MKT-\d+"
                    title="Format: MKT-XX (e.g. MKT-01)"
                    className="w-full text-xs p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500 font-bold"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Format: MKT-XX</p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    4-Digit PIN <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCreatePin ? "text" : "password"}
                      required
                      maxLength={4}
                      minLength={4}
                      inputMode="numeric"
                      value={createPin}
                      onChange={(e) => setCreatePin(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                      placeholder="••••"
                      className="w-full text-xs p-3 pr-8 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCreatePin((p) => !p)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      tabIndex={-1}
                    >
                      {showCreatePin ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">4 numeric digits</p>
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Mobile Number <span className="text-slate-500">(10-digit)</span>
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={createPhone}
                  onChange={(e) => setCreatePhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                  placeholder="9876543210"
                  className="w-full text-xs p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCreate}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 shadow-md shadow-indigo-950/50"
                >
                  {submittingCreate && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Register Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 2. EDIT AGENT MODAL ── */}
      {editingAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                Edit Agent: {editingAgent.name}
              </h2>
              <button
                onClick={() => setEditingAgent(null)}
                className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {editError}
              </div>
            )}

            <form onSubmit={handleEditAgent} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Agent Code (MKT-XX)
                </label>
                <input
                  type="text"
                  required
                  value={editAgentCode}
                  onChange={(e) => setEditAgentCode(e.target.value.toUpperCase())}
                  className="w-full text-xs p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono uppercase font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                  placeholder="9876543210"
                  className="w-full text-xs p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAgent(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 shadow-md"
                >
                  {submittingEdit && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 3. DELETE AGENT CONFIRMATION MODAL ── */}
      {deletingAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Delete Marketing Agent?</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Are you sure you want to permanently remove{" "}
                <span className="text-white font-bold">{deletingAgent.name}</span>{" "}
                (<span className="font-mono text-indigo-400 font-bold">{deletingAgent.agentCode}</span>)?
                They will no longer be able to log in to the Agent POS.
              </p>
            </div>

            {deleteError && (
              <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold">
                {deleteError}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingAgent(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAgent}
                disabled={submittingDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-md shadow-red-950/50"
              >
                {submittingDelete && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Delete Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
