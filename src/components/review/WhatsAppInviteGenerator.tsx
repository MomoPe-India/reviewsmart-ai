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
  const [language, setLanguage] = useState<"TELUGU" | "ENGLISH" | "HINDI" | "TAMIL" | "KANNADA" | "MALAYALAM">("TELUGU");
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

    if (language === "HINDI") {
      return (
        `नमस्ते ${customerName.trim() ? customerName.trim() + " जी" : "जी"}! 🙏\n\n` +
        `आज ${businessName} की ${serviceMention} सेवा चुनने के लिए बहुत-बहुत धन्यवाद।\n\n` +
        `कृपया Google पर 5-स्टार रेटिंग देकर अपना अनुभव साझा करें, यह हमारे लिए बहुत महत्वपूर्ण है:\n` +
        `👉 ${reviewUrl}\n\n` +
        `अपनी समीक्षा पोस्ट करें और तुरंत अपना विशेष डिस्काउंट वाउचर प्राप्त करें! 🎉`
      );
    }

    if (language === "TAMIL") {
      return (
        `வணக்கம் ${customerName.trim() ? customerName.trim() + " அவர்களே" : "அன்பான வாடிக்கையாளரே"}! 🙏\n\n` +
        `இன்று ${businessName} இன் ${serviceMention} சேவையைத் தேர்ந்தெடுத்தமைக்கு மிக்க நன்றி.\n\n` +
        `கூகுளில் 5-நட்சத்திர மதிப்பீடு வழங்கி தங்களின் ஆதரவை 5 வினாடிகளில் தெரியப்படுத்துங்கள்:\n` +
        `👉 ${reviewUrl}\n\n` +
        `விமர்சனத்தைப் பதிவிட்டு உடனடியாக தங்களின் பிரத்யேக தள்ளுபடி வவுச்சரைப் பெறுங்கள்! 🎉`
      );
    }

    if (language === "KANNADA") {
      return (
        `ನಮಸ್ಕಾರ ${customerName.trim() ? customerName.trim() + " ಅವರೇ" : "ಗ್ರಾಹಕರೇ"}! 🙏\n\n` +
        `ಇಂದು ${businessName} ನ ${serviceMention} ಸೇವೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು.\n\n` +
        `ಗೂಗಲ್‌ನಲ್ಲಿ 5-ಸ್ಟಾರ್ ರೇಟಿಂಗ್ ನೀಡುವ ಮೂಲಕ ನಿಮ್ಮ ಅನುಭವವನ್ನು 5 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ:\n` +
        `👉 ${reviewUrl}\n\n` +
        `ನಿಮ್ಮ ವಿಮರ್ಶೆ ಪೋಸ್ಟ್ ಮಾಡಿ ಮತ್ತು ತಕ್ಷಣ ವಿಶೇಷ ರಿಯಾಯಿತಿ ವೋಚರ್ ಪಡೆಯಿರಿ! 🎉`
      );
    }

    if (language === "MALAYALAM") {
      return (
        `നമസ്കാരം ${customerName.trim() ? customerName.trim() : "പ്രിയ ഉപഭോക്താവേ"}! 🙏\n\n` +
        `ഇന്ന് ${businessName}-ന്റെ ${serviceMention} സേവനം തിരഞ്ഞെടുത്തതിന് വളരെ നന്ദി.\n\n` +
        `Google-ൽ 5-സ്റ്റാർ റേറ്റിംഗ് നൽകി നിങ്ങളുടെ അനുഭവം പങ്കുവെക്കാൻ ദയവായി 5 സെക്കൻഡ് ചെലവഴിക്കൂ:\n` +
        `👉 ${reviewUrl}\n\n` +
        `റിവ്യൂ പോസ്റ്റ് ചെയ്ത് ഉടൻ തന്നെ പ്രത്യേക കിഴിവ് വൗച്ചർ നേടൂ! 🎉`
      );
    }

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
      <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
        {(
          [
            { code: "TELUGU", label: "తెలుగు" },
            { code: "ENGLISH", label: "English" },
            { code: "HINDI", label: "हिंदी" },
            { code: "TAMIL", label: "தமிழ்" },
            { code: "KANNADA", label: "ಕನ್ನಡ" },
            { code: "MALAYALAM", label: "മലയാളം" },
          ] as const
        ).map((item) => (
          <button
            key={item.code}
            type="button"
            onClick={() => setLanguage(item.code)}
            className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition shrink-0 ${
              language === item.code
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
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
