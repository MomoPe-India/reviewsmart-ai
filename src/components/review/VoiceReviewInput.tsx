"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Languages, CheckCircle2 } from "lucide-react";

export type SupportedSpeechLang = "en-IN" | "te-IN" | "hi-IN" | "ta-IN" | "kn-IN" | "ml-IN";

interface VoiceReviewInputProps {
  onTranscript: (text: string, spokenLang: SupportedSpeechLang) => void;
  languageMode?: "ENGLISH" | "TELUGU_SCRIPT" | "HINDI" | "TAMIL" | "KANNADA" | "MALAYALAM" | "AUTO" | string;
  placeholder?: string;
}

const SPEECH_LANG_OPTIONS: {
  code: SupportedSpeechLang;
  label: string;
  nativeName: string;
  promptHint: string;
}[] = [
  {
    code: "te-IN",
    label: "తెలుగు",
    nativeName: "Telugu",
    promptHint: "e.g. 'సర్వీస్ చాలా బాగుంది, టైమ్ కి పూర్తి చేశారు'",
  },
  {
    code: "hi-IN",
    label: "हिंदी",
    nativeName: "Hindi",
    promptHint: "e.g. 'बहुत अच्छा काम किया, समय पर सर्विस मिली'",
  },
  {
    code: "en-IN",
    label: "English",
    nativeName: "English",
    promptHint: "e.g. 'Fast service, polite staff and reasonable pricing'",
  },
  {
    code: "ta-IN",
    label: "தமிழ்",
    nativeName: "Tamil",
    promptHint: "e.g. 'சிறந்த சேவை, சரியான நேரத்தில் முடித்தார்கள்'",
  },
  {
    code: "kn-IN",
    label: "ಕನ್ನಡ",
    nativeName: "Kannada",
    promptHint: "e.g. 'ತುಂಬಾ ಒಳ್ಳೆಯ ಸೇವೆ, ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಕೆಲಸ ಮಾಡಿದ್ದಾರೆ'",
  },
  {
    code: "ml-IN",
    label: "മലയാളം",
    nativeName: "Malayalam",
    promptHint: "e.g. 'വളരെ നല്ല സേവനം, കൃത്യസമയത്ത് ചെയ്തു തന്നു'",
  },
];

export default function VoiceReviewInput({
  onTranscript,
  languageMode = "AUTO",
}: VoiceReviewInputProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [lastFinalTranscript, setLastFinalTranscript] = useState("");
  const [speechLang, setSpeechLang] = useState<SupportedSpeechLang>("te-IN");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
      }
    }
  }, []);

  // Sync preferred speech language when user explicitly switches top language tabs
  useEffect(() => {
    if (languageMode === "TELUGU_SCRIPT") {
      setSpeechLang("te-IN");
    } else if (languageMode === "HINDI") {
      setSpeechLang("hi-IN");
    } else if (languageMode === "TAMIL") {
      setSpeechLang("ta-IN");
    } else if (languageMode === "KANNADA") {
      setSpeechLang("kn-IN");
    } else if (languageMode === "MALAYALAM") {
      setSpeechLang("ml-IN");
    } else if (languageMode === "ENGLISH") {
      setSpeechLang("en-IN");
    }
  }, [languageMode]);

  const activeLangMeta =
    SPEECH_LANG_OPTIONS.find((l) => l.code === speechLang) || SPEECH_LANG_OPTIONS[0];

  const startListening = () => {
    if (!isSupported) return;

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = speechLang;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimText("");
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate(30);
        }
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            const cleaned = transcript.trim();
            if (cleaned) {
              setLastFinalTranscript(cleaned);
              onTranscript(cleaned, speechLang);
            }
            setInterimText("");
          } else {
            currentTranscript += transcript;
          }
        }
        if (currentTranscript) {
          setInterimText(currentTranscript);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
        setInterimText("");
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText("");
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Could not start speech recognition:", err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-950/50 via-slate-900/90 to-slate-950 border border-indigo-500/30 p-3 space-y-2.5 shadow-md">
      {/* Top Row: Feature Label + Spoken Language Selector */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <Languages className="w-3 h-3" />
          </span>
          <span className="text-[11px] font-black text-indigo-200 tracking-tight">
            🎙️ Speak in Regional Dialect &rarr; AI Translates to English &amp; Native
          </span>
        </div>
      </div>

      {/* Spoken Dialect Pills */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
        {SPEECH_LANG_OPTIONS.map((item) => {
          const isActive = speechLang === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => setSpeechLang(item.code)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition shrink-0 ${
                isActive
                  ? "bg-amber-400 text-slate-950 border-amber-300 font-black shadow-sm"
                  : "bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Main Tap-to-Speak Action Bar */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
            isListening
              ? "bg-gradient-to-r from-red-500 to-rose-600 text-white animate-pulse shadow-red-500/30"
              : "bg-gradient-to-r from-amber-400/20 via-indigo-500/20 to-amber-400/20 hover:from-amber-400/30 hover:to-indigo-500/30 text-amber-300 border border-amber-400/40"
          }`}
        >
          {isListening ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <MicOff className="w-4 h-4" />
              <span>Listening in {activeLangMeta.label}... Tap when done</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Tap &amp; Speak in {activeLangMeta.label} ({activeLangMeta.nativeName})
              </span>
            </>
          )}
        </button>
      </div>

      {/* Hint or Live Interim Transcript */}
      {interimText ? (
        <div className="text-[11px] text-amber-300 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/30 italic animate-fadeIn flex items-center gap-2">
          <Volume2 className="w-3.5 h-3.5 shrink-0 animate-bounce text-amber-400" />
          <span>&ldquo;{interimText}&rdquo;</span>
        </div>
      ) : lastFinalTranscript ? (
        <div className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/25 flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-1.5 truncate">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">
              Spoken ({activeLangMeta.label}): <strong className="text-white">&ldquo;{lastFinalTranscript}&rdquo;</strong>
            </span>
          </div>
          <span className="text-[9px] font-bold text-amber-300 shrink-0">
            ✨ Translated
          </span>
        </div>
      ) : (
        <p className="text-[10px] text-slate-400 italic px-0.5">
          💡 {activeLangMeta.promptHint}
        </p>
      )}
    </div>
  );
}
