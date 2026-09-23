"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  ShieldCheck,
  UserCheck,
  Smartphone,
  KeyRound,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

interface AgentItem {
  id: string;
  name: string;
  phone: string | null;
  userIdTag: string | null;
  agentCode: string | null;
  dealsClosed: number;
  totalRevenue: number;
  createdAt: string;
}

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<AgentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agentCode, setAgentCode] = useState("");
  const [pin, setPin] = useState("1234");
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [createdAgentMsg, setCreatedAgentMsg] = useState("");

  const fetchAgents = async () => {
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
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
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

      setCreatedAgentMsg(`Agent ${agentCode} created! PIN: ${pin}`);
      setName("");
      setPhone("");
      setAgentCode("");
      setPin("1234");
      fetchAgents();
      setTimeout(() => {
        setShowModal(false);
        setCreatedAgentMsg("");
      }, 2500);
    } catch {
      setModalError("Network error while creating agent");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Field Marketing Agents</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
              {agents.length} Active
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your ground sales team, assign Agent IDs &amp; PINs, and track closed deals.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Field Agent
        </button>
      </div>

      {/* Agents Grid */}
      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
        </div>
      ) : agents.length === 0 ? (
        <div className="p-10 rounded-3xl bg-slate-800/50 border border-slate-700 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Marketing Agents Enrolled Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Add your on-the-ground reps so they can access the mobile Agent POS (`/agent`) with their Agent ID &amp; PIN.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Create First Agent
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agt) => (
            <div
              key={agt.id}
              className="bg-slate-800 p-5 rounded-3xl border border-slate-700 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/30">
                    {agt.agentCode || "AGT"}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{agt.name}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Smartphone className="w-3 h-3 text-slate-500" />
                      <span>{agt.phone || "No phone registered"}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Active POS
                </span>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-700/60">
                <div className="p-2 rounded-xl bg-slate-900/60">
                  <span className="text-[10px] text-slate-400 block font-semibold">Deals Closed</span>
                  <span className="text-sm font-black text-white">{agt.dealsClosed} stores</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60">
                  <span className="text-[10px] text-slate-400 block font-semibold">Collected Revenue</span>
                  <span className="text-sm font-black text-emerald-400">
                    ₹{agt.totalRevenue.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Login Tag */}
              <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-700/50 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Login ID:</span>
                <span className="font-mono font-bold text-indigo-300">
                  {agt.userIdTag || agt.agentCode}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE AGENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                Add New Field Marketing Rep
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold">
                {modalError}
              </div>
            )}

            {createdAgentMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                {createdAgentMsg}
              </div>
            )}

            <form onSubmit={handleCreateAgent} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Agent Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Agent Code (Login ID)
                  </label>
                  <input
                    type="text"
                    required
                    value={agentCode}
                    onChange={(e) => setAgentCode(e.target.value.toUpperCase())}
                    placeholder="MKT-01"
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    4-Digit Secret PIN
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="1234"
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
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
