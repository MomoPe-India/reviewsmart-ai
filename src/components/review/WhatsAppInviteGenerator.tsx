"use client";

import React, { useState } from "react";
import { MessageSquare, Copy, Check, Share2, Sparkles, Send, User, Wrench } from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";

interface WhatsAppInviteGeneratorProps {
  businessName: string;
  businessSlug: string;
  defaultService?: string;
}

export default function WhatsAppInviteGenerator({
  businessName,
  businessSlug,
  defaultService = "Service",
}: WhatsAppInviteGeneratorProps) {
  const [customerName, setCustomerName] = useState("");
  const [serviceName, setServiceName] = useState(defaultService);
  const [customerPhone, setCustomerPhone] = useState("");
  const [language, setLanguage] = useState<"TELUGU" | "ENGLISH">("TELUGU");
  const [copied, setCopied] = useState(false);

  const getBaseAppUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "https://www.reviewsmart.online";
  };

  const getPersonalizedUrl = () => {
    const origin = getBaseAppUrl();
    const params = new URLSearchParams();
    if (customerName.trim()) params.set("cust", customerName.trim());
    if (serviceName.trim()) params.set("service", serviceName.trim());
    const query = params.toString();
    return `${origin}/r/${businessSlug}${query ? `?${query}` : ""}`;
  };

  const reviewUrl = getPersonalizedUrl();

  const getInviteMessage = () => {
    const custGreeting = customerName.trim() ? `${customerName.trim()} garu` : "Sir/Madam";
    const serviceMention = serviceName.trim() ? serviceName.trim() : "service";

    if (language === "TELUGU") {
      return (
        `నమస్కారం ${custGreeting}! 🙏\n\n` +
        `ఈరోజు ${businessName} వారి ${serviceMention} ఎంచుకున్నందుకు ధన్యవాదాలు.\n\n` +
        `మీ అనుభవాన్ని కేవలం 5 సెకన్లలో Google లో 5-స్టార్ రివ్యూ ద్వారా షేర్ చేయండి. మీ రివ్యూ మాకు చాలా ముఖ్యం:\n` +
        `👉 ${reviewUrl}\n\n` +
        `మీ రివ్యూ పూర్తి చేసి వెంటనే స్పెషల్ డిస్కౌంట్ వోచర్ పొందండి! 🎉`
      );
    }

    return (
      `Hello ${customerName.trim() ? customerName.trim() : "valued customer"}! 👋\n\n` +
      `Thank you for choosing ${businessName} for your ${serviceMention} today!\n\n` +
      `Could you take 5 seconds to share your 5-star feedback on Google? It means the world to our team:\n` +
      `👉 ${reviewUrl}\n\n` +
      `Post your review and instantly unlock your exclusive customer reward voucher! 🎁`
    );
  };

  const messageText = getInviteMessage();

  const handleCopyMessage = async () => {
    await copyToClipboard(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    const digits = customerPhone.replace(/\D/g, "");
    let waUrl = "";
    if (digits.length >= 10) {
      const full = digits.length === 10 ? `91${digits}` : digits;
      waUrl = `https://wa.me/${full}?text=${encodeURIComponent(messageText)}`;
    } else {
      waUrl = `https://wa.me/?text=${encodeURIComponent(messageText)}`;
    }
    window.open(waUrl, "_blank");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 text-slate-100">
      <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-black text-white">
            1-Click WhatsApp Review Invite
          </h3>
          <p className="text-xs text-slate-400">
            Send doorstep or billing clients an instant personalized review link
          </p>
        </div>
      </div>

      {/* Language Toggle */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => setLanguage("TELUGU")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
            language === "TELUGU"
              ? "bg-emerald-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-white"
          }`}
        >
          తెలుగు (Telugu)
        </button>
        <button
          type="button"
          onClick={() => setLanguage("ENGLISH")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
            language === "ENGLISH"
              ? "bg-emerald-500 text-slate-950 shadow"
              : "text-slate-400 hover:text-white"
          }`}
        >
          English
        </button>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
            <User className="w-3 h-3 text-emerald-400" />
            Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Ramesh"
            className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
            <Wrench className="w-3 h-3 text-emerald-400" />
            Service / Product
          </label>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="e.g. AC Repair, Gold Valuation"
            className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-slate-300 mb-1">
          Customer WhatsApp Number (Optional)
        </label>
        <input
          type="tel"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="10-digit mobile number (e.g. 9876543210)"
          className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      {/* Message Preview */}
      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-all font-sans">
        {messageText}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={handleSendWhatsApp}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-98"
        >
          <Send className="w-4 h-4" />
          <span>Send on WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={handleCopyMessage}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition active:scale-98"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Message Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Message</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
