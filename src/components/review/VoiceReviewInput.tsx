"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2, Sparkles, Volume2 } from "lucide-react";

interface VoiceReviewInputProps {
  onTranscript: (text: string) => void;
  languageMode?: "ENGLISH" | "TELUGU_SCRIPT" | "AUTO" | string;
  placeholder?: string;
}

export default function VoiceReviewInput({
  onTranscript,
  languageMode = "AUTO",
  placeholder = "Speak what you liked (English or Telugu)...",
}: VoiceReviewInputProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [speechLang, setSpeechLang] = useState<"te-IN" | "en-IN">("en-IN");
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

  // Sync preferred speech language with languageMode
  useEffect(() => {
    if (languageMode === "TELUGU_SCRIPT") {
      setSpeechLang("te-IN");
    } else {
      setSpeechLang("en-IN");
    }
  }, [languageMode]);

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
            onTranscript(transcript.trim());
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
    return null; // Gracefully hidden if browser doesn't support Web Speech API
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
            isListening
              ? "bg-red-500 text-white animate-pulse shadow-red-500/30"
              : "bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/30"
          }`}
          title="Tap to speak your review in Telugu or English"
        >
          {isListening ? (
            <>
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <MicOff className="w-3.5 h-3.5" />
              <span>Listening... Tap to stop</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5 text-amber-400" />
              <span>🎙️ Voice Input ({speechLang === "te-IN" ? "తెలుగు" : "English"})</span>
            </>
          )}
        </button>

        {/* Quick Language Toggle */}
        <button
          type="button"
          onClick={() => setSpeechLang((prev) => (prev === "en-IN" ? "te-IN" : "en-IN"))}
          className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold border border-slate-700 transition"
        >
          {speechLang === "te-IN" ? "Switch to English" : "Switch to తెలుగు"}
        </button>
      </div>

      {interimText && (
        <div className="text-[11px] text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 italic animate-fadeIn flex items-center gap-1.5">
          <Volume2 className="w-3 h-3 shrink-0 animate-bounce" />
          <span>&ldquo;{interimText}&rdquo;</span>
        </div>
      )}
    </div>
  );
}
