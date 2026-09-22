"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Star,
  MessageSquare,
  Loader2,
  ArrowRight,
  Send,
} from "lucide-react";

interface BusinessData {
  id: string;
  name: string;
}

export default function ReviewReplyClient({
  business,
}: {
  business: BusinessData;
}) {
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          reviewerName,
          rating,
          reviewText,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setGeneratedReply(data.reply);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedReply) return;
    await navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          Review Received on Google
        </h2>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Name (optional)
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Jessica Miller"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Rating
              </label>
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 transition ${
                        rating >= s
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">
                  {rating} / 5
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Paste Customer Review Text *
            </label>
            <textarea
              required
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Paste the review that the customer posted on your Google Business Profile..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !reviewText.trim()}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-100 transition disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Draft Professional Owner Reply
              </>
            )}
          </button>
        </form>
      </div>

      {/* Output / Generated Reply */}
      <div className="bg-gradient-to-br from-indigo-50/50 to-white p-6 rounded-3xl border border-indigo-100 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              AI Owner Reply Draft
            </h2>
            {generatedReply && (
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-100/60 px-2 py-0.5 rounded-full">
                Ready to Copy
              </span>
            )}
          </div>

          {generatedReply ? (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-indigo-100/80 shadow-inner text-xs text-slate-800 leading-relaxed font-normal">
                "{generatedReply}"
              </div>

              <p className="text-[11px] text-slate-500">
                You can copy this text and paste it directly into your Google Business Profile reply box. Replying promptly improves your local ranking and shows potential customers that you care!
              </p>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-center text-slate-400 p-6">
              <Sparkles className="w-8 h-8 text-indigo-300 mb-2" />
              <p className="text-xs">
                Paste a review on the left and hit "Draft Professional Owner Reply" to generate an empathetic response.
              </p>
            </div>
          )}
        </div>

        {generatedReply && (
          <div className="mt-6 pt-4 border-t border-indigo-100">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Reply to Clipboard
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
