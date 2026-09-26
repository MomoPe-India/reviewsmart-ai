"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  X,
  Maximize2,
  Minimize2,
  Bot,
  User,
  ArrowRight,
  ExternalLink,
  Check,
  Copy,
  ChevronRight,
  Trash2,
  Command,
  TrendingUp,
  Store,
  IndianRupee,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface ActionBadge {
  label: string;
  type: "success" | "info" | "warning";
}

interface DiffItem {
  field: string;
  before?: any;
  after?: any;
}

interface QuickLink {
  label: string;
  url: string;
  external?: boolean;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  intent?: string;
  actionBadges?: ActionBadge[];
  diff?: DiffItem[];
  quickLinks?: QuickLink[];
  entity?: any;
  success?: boolean;
}

const QUICK_PROMPTS = [
  { label: "📊 Revenue & Deals Stats", prompt: "Show me today's revenue, active merchants, and pending deals summary." },
  { label: "➕ Onboard Merchant", prompt: "Onboard new merchant Sri Krishna Sweets under agent MKT-01 with phone 9876543210 and deal amount 1999" },
  { label: "✅ Approve Pending Deal", prompt: "Approve the pending deal for Anand Fashion Studio and lift watermark." },
  { label: "💰 Update Deal Amount", prompt: "Update Sri Guru Fashions deal amount to 2999." },
  { label: "🔍 Search Merchant", prompt: "Show profile, agent, and review link for Anand Fashion Studio." },
  { label: "⚙️ Platform UPI Settings", prompt: "Show current platform UPI ID and support WhatsApp details." },
];

export default function AdminAiComposer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "👋 Welcome to **Antigravity AI Composer**!\nI can directly add merchants, modify deals, update platform settings, inspect database records, and execute administrative workflows seamlessly.\n\nType any natural request or tap a quick prompt below to begin.",
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keyboard shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch {}
  };

  const handleSend = async (overridePrompt?: string) => {
    const promptToSend = (overridePrompt || input).trim();
    if (!promptToSend || loading) return;

    const userMsgId = Date.now().toString();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: promptToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/ai-composer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptToSend }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.message || "Action processed.",
        timestamp: new Date(),
        intent: data.intent,
        actionBadges: data.actionBadges,
        diff: data.diff,
        quickLinks: data.quickLinks,
        entity: data.entity,
        success: data.success ?? true,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: `⚠️ Execution failed: ${err?.message || "Network error. Please try again."}`,
          timestamp: new Date(),
          success: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearHistory = () => {
    setMessages([
      {
        id: "welcome",
        sender: "ai",
        text: "✨ Session cleared. Ready for your next administrative instruction.",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* ─── FLOATING LAUNCHER BUTTON ─────────────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-bold text-xs shadow-2xl shadow-indigo-950/80 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-indigo-400/30"
          title="Open AI Command Composer (Cmd + K)"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 animate-spin text-amber-300" style={{ animationDuration: "6s" }} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="tracking-wide">AI Composer</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] bg-black/40 text-slate-300 font-mono">
            ⌘K
          </span>
        </button>
      )}

      {/* ─── ANTIGRAVITY COMPOSER MODAL / DRAWER ─────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div
            className={`w-full ${
              isExpanded ? "max-w-5xl h-[92vh]" : "max-w-2xl h-[78vh]"
            } bg-slate-950 border border-indigo-500/40 rounded-3xl shadow-2xl shadow-indigo-950/90 flex flex-col overflow-hidden transition-all duration-300 relative`}
          >
            {/* Top Glowing Header */}
            <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                      Antigravity AI Composer
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Autopilot
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Direct Natural-Language Project &amp; Data Execution
                  </p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1.5 text-slate-400">
                <button
                  onClick={clearHistory}
                  title="Clear Conversation"
                  className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Restore Size" : "Expand Size"}
                  className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition"
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close (Esc)"
                  className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800/80 overflow-x-auto flex items-center gap-2 scrollbar-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Quick Actions:
              </span>
              {QUICK_PROMPTS.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qp.prompt)}
                  disabled={loading}
                  className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-indigo-600 hover:text-white text-slate-300 border border-slate-700/60 transition active:scale-95 disabled:opacity-50"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-sans text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "ai" && (
                    <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2.5`}>
                    {/* Main Bubble */}
                    <div
                      className={`p-3.5 rounded-2xl ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-950/40 rounded-br-sm"
                          : "bg-slate-900 border border-slate-800 text-slate-200 shadow-sm rounded-bl-sm"
                      }`}
                    >
                      {/* Action Badges */}
                      {msg.actionBadges && msg.actionBadges.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                          {msg.actionBadges.map((b, i) => (
                            <span
                              key={i}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                b.type === "success"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : b.type === "warning"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              }`}
                            >
                              {b.label}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Text Body */}
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {msg.text.split("\n").map((line, li) => {
                          // Simple bold replacement
                          const boldParts = line.split(/(\*\*.*?\*\*)/g);
                          return (
                            <p key={li} className={li > 0 ? "mt-1.5" : ""}>
                              {boldParts.map((part, pi) => {
                                if (part.startsWith("**") && part.endsWith("**")) {
                                  return (
                                    <strong key={pi} className="font-bold text-white">
                                      {part.slice(2, -2)}
                                    </strong>
                                  );
                                }
                                return part;
                              })}
                            </p>
                          );
                        })}
                      </div>

                      {/* Visual Diff Card */}
                      {msg.diff && msg.diff.length > 0 && (
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                            Applied Changes (Diff):
                          </div>
                          {msg.diff.map((d, di) => (
                            <div key={di} className="flex items-center justify-between gap-2 border-b border-slate-900 pb-1 last:border-0 last:pb-0">
                              <span className="text-slate-400 font-semibold">{d.field}:</span>
                              <div className="flex items-center gap-1.5 text-right">
                                {d.before !== undefined && (
                                  <>
                                    <span className="text-red-400 line-through opacity-80">{String(d.before)}</span>
                                    <ArrowRight className="w-3 h-3 text-slate-500" />
                                  </>
                                )}
                                <span className="text-emerald-400 font-bold">{String(d.after)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Interactive Quick Links */}
                      {msg.quickLinks && msg.quickLinks.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap gap-2">
                          {msg.quickLinks.map((ql, qi) => (
                            <a
                              key={qi}
                              href={ql.url}
                              target={ql.external ? "_blank" : "_self"}
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 hover:text-white text-[11px] font-bold border border-indigo-500/30 transition"
                            >
                              <span>{ql.label}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    <div
                      className={`text-[10px] text-slate-500 font-mono ${
                        msg.sender === "user" ? "text-right mr-1" : "ml-1"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 items-center text-slate-400 text-xs">
                  <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>Analyzing project structure &amp; applying database updates...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Command Composer Bar */}
            <div className="p-3.5 bg-slate-900/90 border-t border-slate-800">
              <div className="relative flex items-center">
                <textarea
                  ref={textareaRef}
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tell Antigravity AI what to add, modify, or update (e.g. 'Onboard merchant Sri Krishna Sweets under MKT-01 for ₹1999')..."
                  className="w-full resize-none rounded-2xl bg-slate-950 border border-slate-700/80 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 p-3 pr-14 text-xs text-white placeholder-slate-500 font-sans focus:outline-none leading-relaxed"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  className="absolute right-2.5 p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-amber-500 hover:from-indigo-400 hover:to-amber-400 text-white disabled:opacity-40 disabled:cursor-not-allowed transition transform active:scale-95 shadow-md"
                  title="Execute Instruction (Enter)"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                    ↵ Enter to run
                  </span>
                  <span className="hidden sm:inline text-slate-500">
                    Shift + Enter for multi-line
                  </span>
                </div>
                <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
                  ⚡ Auto-Committed to PostgreSQL
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
