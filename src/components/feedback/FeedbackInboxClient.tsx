"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

interface FeedbackItem {
  id: string;
  rating: number;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  comments: string;
  status: string;
  createdAt: Date | string;
}

export default function FeedbackInboxClient({
  feedbacks: initialFeedbacks,
}: {
  feedbacks: FeedbackItem[];
}) {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(initialFeedbacks);
  const [filter, setFilter] = useState<"ALL" | "NEW" | "RESOLVED">("ALL");

  const filtered = feedbacks.filter((f) => {
    if (filter === "NEW") return f.status === "NEW";
    if (filter === "RESOLVED") return f.status === "RESOLVED";
    return true;
  });

  const toggleResolved = (id: string) => {
    setFeedbacks((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status: f.status === "RESOLVED" ? "NEW" : "RESOLVED" }
          : f
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            filter === "ALL"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          All Items ({feedbacks.length})
        </button>

        <button
          onClick={() => setFilter("NEW")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            filter === "NEW"
              ? "bg-amber-500 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Needs Follow-up ({feedbacks.filter((f) => f.status === "NEW").length})
        </button>

        <button
          onClick={() => setFilter("RESOLVED")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            filter === "RESOLVED"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Resolved ({feedbacks.filter((f) => f.status === "RESOLVED").length})
        </button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200/70 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Feedback Here</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When a customer taps 1, 2, or 3 stars on your review card, their complaint will be saved here so you can reach out privately.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isResolved = item.status === "RESOLVED";
            return (
              <div
                key={item.id}
                className={`bg-white p-5 rounded-3xl border transition-all ${
                  isResolved
                    ? "border-slate-200/60 bg-slate-50/50 opacity-75"
                    : "border-amber-200 shadow-sm"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg">
                      {item.rating} ★
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {item.customerName || "Anonymous Customer"}
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleResolved(item.id)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition ${
                        isResolved
                          ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                      }`}
                    >
                      {isResolved ? (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          Mark Unresolved
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark Resolved
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Complaint comments */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 mb-3 text-xs text-slate-700 leading-relaxed">
                  "{item.comments}"
                </div>

                {/* Contact Actions */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  {item.customerPhone && (
                    <>
                      <a
                        href={`https://wa.me/91${item.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Hi ${item.customerName || "there"}, thank you for visiting our store. We received your feedback note and would love to understand how we can make things right!`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        WhatsApp
                      </a>
                      <a
                        href={`tel:${item.customerPhone}`}
                        className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50 px-3 py-1.5 rounded-xl transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call {item.customerPhone}
                      </a>
                    </>
                  )}

                  {item.customerEmail && (
                    <a
                      href={`mailto:${item.customerEmail}?subject=Regarding%20your%20visit`}
                      className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50 px-3 py-1.5 rounded-xl transition"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Email {item.customerEmail}
                    </a>
                  )}

                  {!item.customerPhone && !item.customerEmail && (
                    <span className="text-[11px] text-slate-400 italic">
                      Customer chose not to leave contact information.
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
