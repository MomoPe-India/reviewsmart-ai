"use client";

import React, { useState } from "react";
import {
  Compass,
  Search,
  Sparkles,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Building2,
  TrendingDown,
  Award,
  Loader2,
  Share2,
  ExternalLink,
  Flame,
  ArrowRight,
} from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";

interface Lead {
  name: string;
  locality: string;
  phone: string;
  currentRating: number;
  currentReviews: number;
  competitorName: string;
  competitorReviews: number;
  isHotLead: boolean;
  leadReason: string;
  whatsappPitchTelugu: string;
  whatsappPitchEnglish: string;
}

const POPULAR_CITIES = [
  { id: "Kadapa", label: "Kadapa (కడప)" },
  { id: "Tirupati", label: "Tirupati (తిరుపతి)" },
  { id: "Vijayawada", label: "Vijayawada (విజయవాడ)" },
  { id: "Guntur", label: "Guntur (గుంటూరు)" },
  { id: "Hyderabad", label: "Hyderabad (హైదరాబాద్)" },
  { id: "Kurnool", label: "Kurnool (కర్నూలు)" },
  { id: "Nellore", label: "Nellore (నెల్లూరు)" },
  { id: "Visakhapatnam", label: "Vizag (వైజాగ్)" },
  { id: "Bengaluru", label: "Bengaluru (బెంగళూరు)" },
];

const POPULAR_CATEGORIES = [
  { id: "Dental Clinics & Doctors", label: "🦷 Dental & Clinics" },
  { id: "Restaurants & Biryani Points", label: "🍽️ Restaurants & Cafes" },
  { id: "Hair Salons & Beauty Spas", label: "💇 Salons & Spas" },
  { id: "Clothing & Menswear Stores", label: "👗 Menswear & Fashion" },
  { id: "Bakeries & Sweet Stalls", label: "🍰 Bakeries & Sweets" },
  { id: "Jewellery & Gold Showrooms", label: "💍 Jewellery" },
  { id: "Automobile & Car Care Services", label: "🚗 Car Care & Auto" },
  { id: "Coaching & Tuition Institutes", label: "🎓 Coaching & Tuition" },
];

export default function AdminLeadsPage() {
  const [selectedCity, setSelectedCity] = useState("Kadapa");
  const [selectedCategory, setSelectedCategory] = useState("Dental Clinics & Doctors");
  const [customSearch, setCustomSearch] = useState("");
  const [pitchLang, setPitchLang] = useState<"telugu" | "english">("telugu");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [filterHotOnly, setFilterHotOnly] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/leads/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: selectedCity,
          category: selectedCategory,
          customQuery: customSearch.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to fetch leads");
      } else {
        setLeads(data.leads || []);
      }
    } catch {
      setErrorMsg("Network error while discovering leads");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPitch = async (text: string, idx: number) => {
    await copyToClipboard(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleExportCsv = () => {
    if (leads.length === 0) return;

    const headers = [
      "Business Name",
      "Locality",
      "Phone",
      "Google Rating",
      "Review Count",
      "Top Competitor",
      "Competitor Reviews",
      "Is Hot Lead",
      "Telugu WhatsApp Pitch",
      "English WhatsApp Pitch",
    ];

    const rows = leads.map((l) => [
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.locality.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      l.currentRating,
      l.currentReviews,
      `"${l.competitorName.replace(/"/g, '""')}"`,
      l.competitorReviews,
      l.isHotLead ? "YES" : "NO",
      `"${l.whatsappPitchTelugu.replace(/"/g, '""')}"`,
      `"${l.whatsappPitchEnglish.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ReviewSmart_Leads_${selectedCity}_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayedLeads = filterHotOnly ? leads.filter((l) => l.isHotLead) : leads;
  const hotLeadsCount = leads.filter((l) => l.isHotLead).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            Local Lead Hunter 🎯
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Discover local businesses with low Google reviews in any Indian city. Arm your field agents with pre-built WhatsApp audit pitches!
          </p>
        </div>

        {leads.length > 0 && (
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Export Lead Sheet (CSV)
          </button>
        )}
      </div>

      {/* Search Configuration Card */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        {/* City Pills */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            1. Select Target City:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_CITIES.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => setSelectedCity(city.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedCity === city.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950"
                    : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                {city.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            2. Select Industry Category:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedCategory === cat.id
                    ? "bg-purple-600 text-white shadow-md shadow-purple-950"
                    : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Query & Trigger Form */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="text"
              value={customSearch}
              onChange={(e) => setCustomSearch(e.target.value)}
              placeholder={`Or type custom search (e.g. "Ayurvedic Clinics in ${selectedCity}")`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-950 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Hunting Leads in {selectedCity}...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Find Hot Leads ({selectedCity})</span>
              </>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Leads Results Area */}
      {leads.length > 0 && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">
                Found {leads.length} Prospects in {selectedCity}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-[10px] border border-amber-500/30">
                🔥 {hotLeadsCount} Hot Review Gaps
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Hot Filter Pill */}
              <button
                onClick={() => setFilterHotOnly(!filterHotOnly)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                  filterHotOnly
                    ? "bg-amber-500/30 text-amber-300 border border-amber-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {filterHotOnly ? "✓ Showing Hot Only (< 40 reviews)" : "Show All Prospects"}
              </button>

              {/* Language Pitch Pill Toggle */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPitchLang("telugu")}
                  className={`px-2 py-0.5 rounded text-[10px] font-black transition ${
                    pitchLang === "telugu"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Telugu Pitch
                </button>
                <button
                  type="button"
                  onClick={() => setPitchLang("english")}
                  className={`px-2 py-0.5 rounded text-[10px] font-black transition ${
                    pitchLang === "english"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  English Pitch
                </button>
              </div>
            </div>
          </div>

          {/* Leads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedLeads.map((lead, idx) => {
              const activePitch =
                pitchLang === "telugu"
                  ? lead.whatsappPitchTelugu
                  : lead.whatsappPitchEnglish;
              const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
              const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
              const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(activePitch)}`;

              return (
                <div
                  key={idx}
                  className={`p-5 rounded-3xl bg-slate-900 border transition flex flex-col justify-between ${
                    lead.isHotLead
                      ? "border-amber-500/40 shadow-lg shadow-amber-950/20"
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {lead.isHotLead && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30 mb-1">
                            <Flame className="w-3 h-3 text-amber-400" />
                            Hot Prospect • Review Deficit
                          </span>
                        )}
                        <h3 className="text-base font-black text-white">
                          {lead.name}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>📍 {lead.locality}, {selectedCity}</span>
                        </p>
                      </div>

                      {/* Phone Dial */}
                      <a
                        href={`tel:+91${cleanPhone}`}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition shrink-0"
                        title="Call Merchant"
                      >
                        <Phone className="w-3.5 h-3.5 text-indigo-400" />
                      </a>
                    </div>

                    {/* Stats Comparison */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">
                          Current Google Score:
                        </span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-sm font-black text-amber-400">
                            ★ {lead.currentRating.toFixed(1)}
                          </span>
                          <span className="text-[11px] font-mono text-slate-300">
                            ({lead.currentReviews} reviews)
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block truncate">
                          Competitor: {lead.competitorName}
                        </span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-sm font-black text-emerald-400">
                            {lead.competitorReviews}
                          </span>
                          <span className="text-[10px] text-emerald-500 font-bold">
                            reviews (+{lead.competitorReviews - lead.currentReviews} lead)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Why they need ReviewSmart AI */}
                    <p className="text-[11px] text-slate-300 bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20 leading-relaxed">
                      💡 <strong>Why They Convert:</strong> {lead.leadReason}
                    </p>

                    {/* Pitch Preview Box */}
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] space-y-2">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-bold flex items-center gap-1 text-[10px] uppercase tracking-wider text-slate-400">
                          <MessageCircle className="w-3 h-3 text-emerald-400" />
                          Pre-Built {pitchLang === "telugu" ? "Telugu" : "English"} Pitch
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyPitch(activePitch, idx)}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Pitch</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-slate-300 line-clamp-3 italic">
                        &quot;{activePitch}&quot;
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-4 mt-3 border-t border-slate-800">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950 transition active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send 1-Click WhatsApp Pitch</span>
                    </a>

                    <a
                      href={`tel:+91${cleanPhone}`}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1 border border-slate-700 transition"
                      title="Call Owner Phone"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Initial Empty State Guide */}
      {leads.length === 0 && !loading && (
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">
              Ready to Discover High-Value Prospects in {selectedCity}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Select your city and industry category above, then click <strong>&quot;Find Hot Leads&quot;</strong>. The AI will extract businesses with low Google reviews and build personalized WhatsApp audit pitches!
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleSearch()}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs inline-flex items-center gap-2 shadow-lg shadow-indigo-950 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Hunt Leads in {selectedCity} Now</span>
          </button>
        </div>
      )}
    </div>
  );
}
