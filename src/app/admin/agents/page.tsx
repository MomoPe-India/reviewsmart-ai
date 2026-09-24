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
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AgentItem {
  id: string;
  name: string;
  phone: string | null;
  agentCode: string | null;
  isActive: boolean;
  dealsClosed: number;
  totalRevenue: number;
  commissionEarned: number;
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRankIcon(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

function pinCodeValidation(pin: string): string | null {
  if (!/^\d{4}$/.test(pin)) return "PIN must be exactly 4 digits (0–9).";
  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<AgentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Create modal
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agentCode, setAgentCode] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [createdAgentMsg, setCreatedAgentMsg] = useState("");

  // Per-agent action states
  const [actionLoading, setActionLoading] = useState<Record<string, string>>({});
  const [resetPinResults, setResetPinResults] = useState<Record<string, string>>({});

  // ── Fetch agents ────────────────────────────────────────────────────────────
  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/agents");
      const data = await res.json();
      if (res.ok && data.agents) {
        setAgents(data.agents);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // ── Create agent ────────────────────────────────────────────────────────────
  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    const pinError = pinCodeValidation(pin);
    if (pinError) {
      setModalError(pinError);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, agentCode, pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        setModalError(data.error || "Failed to create agent");
        setSubmitting(false);
        return;
      }

      setCreatedAgentMsg(
        `✅ Agent ${agentCode} created successfully! PIN: ${pin} — Share this PIN securely and only once.`
      );
      setName("");
      setPhone("");
      setAgentCode("");
      setPin("");
      fetchAgents();
      setTimeout(() => {
        setShowModal(false);
        setCreatedAgentMsg("");
      }, 3500);
    } catch {
      setModalError("Network error while creating agent.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Reset PIN ───────────────────────────────────────────────────────────────
  const handleResetPin = async (agentId: string) => {
    setActionLoading((prev) => ({ ...prev, [agentId]: "reset_pin" }));
    setResetPinResults((prev) => ({ ...prev, [agentId]: "" }));
    try {
      const res = await fetch("/api/admin/agents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, action: "reset_pin" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset PIN");

      const newPin: string = data.newPin ?? data.pin ?? "????";
      setResetPinResults((prev) => ({ ...prev, [agentId]: newPin }));
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

  // ── Toggle active ───────────────────────────────────────────────────────────
  const handleToggleActive = async (agentId: string) => {
    setActionLoading((prev) => ({ ...prev, [agentId]: "toggle_active" }));
    try {
      const res = await fetch("/api/admin/agents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, action: "toggle_active" }),
      });
      if (!res.ok) {
        const data = await res.json();
        console.error(data.error);
        return;
      }
      fetchAgents();
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

  // ── Sorted leaderboard (agents with >0 deals) ────────────────────────────────
  const leaderboard = [...agents]
    .filter((a) => a.dealsClosed > 0)
    .sort((a, b) => b.totalRevenue - a.totalRevenue);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-violet-400" />
            Marketing Agents
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 font-bold border border-violet-500/30">
              {agents.length} enrolled
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your field sales team — assign IDs, reset PINs, and track commissions.
          </p>
        </div>

        <button
          onClick={() => {
            setShowModal(true);
            setModalError("");
            setCreatedAgentMsg("");
          }}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Agent
        </button>
      </div>

      {/* ── Commission note banner ── */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
        <IndianRupee className="w-4 h-4 flex-shrink-0" />
        <span>
          <strong>Commission Policy:</strong> Agents earn{" "}
          <span className="font-black text-emerald-200">40% commission</span> on each
          verified &amp; approved sale.
        </span>
      </div>

      {/* ── Leaderboard ── */}
      {leaderboard.length > 0 && (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Agent Leaderboard
            <span className="text-[10px] text-slate-400 font-normal">
              (ranked by revenue)
            </span>
          </h2>
          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((agt, idx) => {
              const rank = idx + 1;
              const pct =
                leaderboard[0].totalRevenue > 0
                  ? (agt.totalRevenue / leaderboard[0].totalRevenue) * 100
                  : 0;
              return (
                <div key={agt.id} className="flex items-center gap-3">
                  <span className="text-sm w-8 text-center font-black">
                    {getRankIcon(rank)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-white truncate">
                        {agt.name}
                      </span>
                      <span className="text-xs font-black text-emerald-400 ml-2 flex-shrink-0">
                        ₹{agt.totalRevenue.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          rank === 1
                            ? "bg-amber-400"
                            : rank === 2
                            ? "bg-slate-300"
                            : rank === 3
                            ? "bg-orange-400"
                            : "bg-violet-400"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 w-16 text-right flex-shrink-0">
                    {agt.dealsClosed} deals
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
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 mt-2">Loading agents…</p>
        </div>
      ) : agents.length === 0 ? (
        <div className="p-10 rounded-3xl bg-slate-800/50 border border-slate-700 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Marketing Agents Enrolled Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Add your on-the-ground reps so they can log in via the Agent POS with their
            Agent Code &amp; 4-digit PIN.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold"
          >
            Create First Agent
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agt) => {
            const isLoadingAction = !!actionLoading[agt.id];
            const currentAction = actionLoading[agt.id];
            const newPinResult = resetPinResults[agt.id];

            return (
              <div
                key={agt.id}
                className={`bg-slate-800 p-5 rounded-3xl border shadow-sm flex flex-col justify-between space-y-4 transition ${
                  agt.isActive ? "border-slate-700" : "border-red-500/30"
                }`}
              >
                {/* ── Card Header ── */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-[11px] border flex-shrink-0 ${
                        agt.isActive
                          ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
                      }`}
                    >
                      {agt.agentCode ?? "AGT"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">{agt.name}</h3>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Smartphone className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        <span className="truncate">{agt.phone ?? "No phone"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Active / Suspended badge */}
                  {agt.isActive ? (
                    <span className="flex-shrink-0 text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      ● Active
                    </span>
                  ) : (
                    <span className="flex-shrink-0 text-[10px] font-bold text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full border border-red-500/30">
                      ✕ Suspended
                    </span>
                  )}
                </div>

                {/* ── Stats ── */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-700/60">
                  <div className="p-2 rounded-xl bg-slate-900/60">
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      Deals Closed
                    </span>
                    <span className="text-sm font-black text-white">
                      {agt.dealsClosed}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/60">
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      Revenue
                    </span>
                    <span className="text-sm font-black text-emerald-400">
                      ₹{agt.totalRevenue.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/60">
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      Commission
                    </span>
                    <span className="text-sm font-black text-amber-400">
                      ₹{agt.commissionEarned.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* ── New PIN reveal box ── */}
                {newPinResult && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="text-[11px] text-amber-300 font-bold">
                        New PIN — show once &amp; share securely
                      </span>
                    </div>
                    <div className="text-2xl font-black text-amber-300 tracking-[0.5rem] text-center py-1">
                      {newPinResult}
                    </div>
                    <p className="text-[10px] text-amber-400/70 text-center">
                      This PIN will not be shown again after you leave this page.
                    </p>
                  </div>
                )}

                {/* ── Actions ── */}
                <div className="flex items-center gap-2 pt-1">
                  {/* Reset PIN */}
                  <button
                    onClick={() => handleResetPin(agt.id)}
                    disabled={isLoadingAction}
                    className="flex-1 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                  >
                    {currentAction === "reset_pin" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <KeyRound className="w-3.5 h-3.5" />
                    )}
                    Reset PIN
                  </button>

                  {/* Suspend / Activate */}
                  <button
                    onClick={() => handleToggleActive(agt.id)}
                    disabled={isLoadingAction}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition disabled:opacity-50 ${
                      agt.isActive
                        ? "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
                        : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
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

      {/* ── CREATE AGENT MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-violet-400" />
                Add New Marketing Agent
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setModalError("");
                  setCreatedAgentMsg("");
                }}
                className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Commission note */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
              <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
              Agents earn <strong className="mx-0.5">40% commission</strong> on each
              verified sale.
            </div>

            {/* Error / Success */}
            {modalError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {modalError}
              </div>
            )}
            {createdAgentMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                {createdAgentMsg}
              </div>
            )}

            <form onSubmit={handleCreateAgent} className="space-y-3">
              {/* Agent Name */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Agent Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-slate-500"
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
                    value={agentCode}
                    onChange={(e) => setAgentCode(e.target.value.toUpperCase())}
                    placeholder="MKT-01"
                    pattern="MKT-\d+"
                    title="Format: MKT-XX (e.g. MKT-01)"
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-slate-500 font-bold"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">Format: MKT-XX</p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    4-Digit PIN <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPin ? "text" : "password"}
                      required
                      maxLength={4}
                      minLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="••••"
                      className="w-full text-xs p-2.5 pr-8 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin((p) => !p)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      tabIndex={-1}
                    >
                      {showPin ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Digits only</p>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Mobile Number{" "}
                  <span className="text-slate-500">(optional)</span>
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="9876543210"
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-slate-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setModalError("");
                    setCreatedAgentMsg("");
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Register Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
