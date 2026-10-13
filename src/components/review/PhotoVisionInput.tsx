"use client";

import React, { useRef, useState } from "react";
import { Camera, ImagePlus, Sparkles, X, CheckCircle2, Loader2 } from "lucide-react";

interface PhotoVisionInputProps {
  onPhotoCaptured: (base64Data: string, mimeType: string, previewUrl: string) => void;
  onPhotoRemoved: () => void;
  isAnalyzing?: boolean;
  businessName: string;
}

export default function PhotoVisionInput({
  onPhotoCaptured,
  onPhotoRemoved,
  isAnalyzing = false,
  businessName,
}: PhotoVisionInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setIsCompressing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        setIsCompressing(false);
        return;
      }

      const img = new window.Image();
      img.onload = () => {
        try {
          const MAX_DIM = 768;
          let width = img.width;
          let height = img.height;

          if (width > height && width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else if (height >= width && height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.78);
            const base64Data = compressedDataUrl.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");
            setPreviewUrl(compressedDataUrl);
            setIsCompressing(false);
            onPhotoCaptured(base64Data, "image/jpeg", compressedDataUrl);
            return;
          }
        } catch (err) {
          console.warn("Image compression fallback:", err);
        }

        // Fallback if canvas fails
        const rawBase64 = dataUrl.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");
        setPreviewUrl(dataUrl);
        setIsCompressing(false);
        onPhotoCaptured(rawBase64, file.type || "image/jpeg", dataUrl);
      };
      img.onerror = () => {
        setIsCompressing(false);
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      setIsCompressing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = "";
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onPhotoRemoved();
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-emerald-950/30 border border-amber-400/30 p-3 space-y-2.5 shadow-md">
      {/* Hidden File Inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Camera className="w-3 h-3" />
          </span>
          <span className="text-[11px] font-black text-amber-200 tracking-tight">
            📸 AI Photo-to-Review Vision Engine
          </span>
        </div>
        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
          3.5&times; Google Boost
        </span>
      </div>

      {!previewUrl ? (
        <>
          <p className="text-[10px] text-slate-300 leading-relaxed">
            Snap a quick photo of your service or product at <strong className="text-white">{businessName}</strong> &mdash; Gemini Vision will describe what it sees in your review!
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isCompressing}
              onClick={() => cameraInputRef.current?.click()}
              className="py-2 px-3 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 text-xs font-black flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              {isCompressing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>1-Snap Camera</span>
            </button>
            <button
              type="button"
              disabled={isCompressing}
              onClick={() => galleryInputRef.current?.click()}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <ImagePlus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Pick Photo</span>
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3 bg-slate-950/80 p-2.5 rounded-xl border border-amber-400/40 animate-fadeIn">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-amber-400/50 shrink-0 bg-slate-900">
            <img
              src={previewUrl}
              alt="Snapped visit photo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            {isAnalyzing ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400 shrink-0" />
                <span className="truncate">Gemini Vision analyzing photo...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs font-black text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Photo Vision Applied to Drafts!</span>
              </div>
            )}
            <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">
              📌 Remember to tap <strong className="text-amber-300">&ldquo;Add Photos&rdquo;</strong> when Google Maps opens to attach this photo!
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center shrink-0 transition"
            title="Remove photo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
