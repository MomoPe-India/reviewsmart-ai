"use client";

import React, { useState } from "react";
import { Plus, Check, CreditCard, Loader2, Sparkles } from "lucide-react";

interface PlanItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  durationDays: number;
  maxCards: number;
  features: string;
  isActive: boolean;
  _count?: {
    subscriptions: number;
  };
}

export default function AdminPlansClient({ initialPlans }: { initialPlans: PlanItem[] }) {
  const [plans, setPlans] = useState<PlanItem[]>(initialPlans);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: 29,
    currency: "USD",
    durationDays: 30,
    maxCards: 1,
    features: "AI Review Generation, Negative Review Shield, High-Res QR Downloads",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const featuresArray = form.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          features: featuresArray,
        }),
      });

      const data = await res.json();
      if (res.ok && data.plan) {
        setPlans((prev) => [...prev, data.plan]);
        setShowModal(false);
        setForm({
          name: "",
          price: 29,
          currency: "USD",
          durationDays: 30,
          maxCards: 1,
          features: "AI Review Generation, Negative Review Shield, High-Res QR Downloads",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          Add New Subscription Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          let parsedFeatures: string[] = [];
          try {
            parsedFeatures = JSON.parse(p.features);
          } catch {
            parsedFeatures = p.features.split(",");
          }

          return (
            <div
              key={p.id}
              className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-white">{p.name}</h3>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {p._count?.subscriptions || 0} active subscribers
                  </span>
                </div>

                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-3xl font-black text-white">
                    ${p.price.toFixed(0)}
                  </span>
                  <span className="text-xs text-slate-400">
                    / {p.durationDays} days
                  </span>
                </div>

                <div className="text-xs text-indigo-400 font-semibold mb-4">
                  Quota: up to {p.maxCards} Smart Card(s)
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-700/60">
                  {parsedFeatures.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/60 text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Plan ID: {p.id}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to add plan */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">
              Create Subscription Plan
            </h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Plan Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Premium Business"
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={form.durationDays}
                    onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Max Cards Allowed
                </label>
                <input
                  type="number"
                  value={form.maxCards}
                  onChange={(e) => setForm({ ...form, maxCards: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Features (comma separated)
                </label>
                <textarea
                  rows={3}
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
