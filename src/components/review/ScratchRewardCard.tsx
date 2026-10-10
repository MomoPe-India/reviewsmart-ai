"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Gift, Sparkles, Copy, Check, X, Tag, ArrowRight } from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";

interface ScratchRewardCardProps {
  businessName: string;
  whatsappNumber?: string | null;
  onClose: () => void;
}

export default function ScratchRewardCard({
  businessName,
  whatsappNumber,
  onClose,
}: ScratchRewardCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [voucherCode] = useState(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `REVIEW-${randomNum}`;
  });

  const rewardTitle = "Special Thank You Voucher!";
  const rewardBenefit = "Flat 5% Off / ₹50 Cashback on Next Visit";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // High DPI support
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Draw scratchable silver-gold metallic background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#cbd5e1");
    grad.addColorStop(0.3, "#f8fafc");
    grad.addColorStop(0.5, "#fbbf24");
    grad.addColorStop(0.7, "#f8fafc");
    grad.addColorStop(1, "#94a3b8");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add subtle scratch pattern & instructions
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ Scratch Here to Reveal Your Reward! ✨", width / 2, height / 2 - 10);

    ctx.fillStyle = "#64748b";
    ctx.font = "10px sans-serif";
    ctx.fillText("Rub with your finger or mouse", width / 2, height / 2 + 14);

    let isDrawing = false;
    let scratchedPixels = 0;

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if ("touches" in e && e.touches.length > 0) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      }
      const me = e as MouseEvent;
      return {
        x: me.clientX - rect.left,
        y: me.clientY - rect.top,
      };
    };

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      // Check percentage scratched periodically
      scratchedPixels++;
      if (scratchedPixels % 12 === 0) {
        checkPercentage();
      }
    };

    const checkPercentage = () => {
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;
        let transparent = 0;
        const total = pixels.length / 4;
        // Sample every 16th pixel for performance
        for (let i = 3; i < pixels.length; i += 64) {
          if (pixels[i] === 0) transparent++;
        }
        const pct = (transparent / (total / 16)) * 100;
        if (pct > 35) {
          revealCard();
        }
      } catch {}
    };

    const revealCard = () => {
      setIsRevealed(true);
      ctx.clearRect(0, 0, width, height);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([40, 30, 60]);
      }
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#f59e0b", "#10b981", "#6366f1", "#ec4899"],
        });
      } catch {}
    };

    const handleStart = (e: any) => {
      isDrawing = true;
      const { x, y } = getPos(e);
      scratch(x, y);
    };

    const handleMove = (e: any) => {
      if (!isDrawing) return;
      e.preventDefault();
      const { x, y } = getPos(e);
      scratch(x, y);
    };

    const handleEnd = () => {
      isDrawing = false;
    };

    canvas.addEventListener("mousedown", handleStart);
    canvas.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);

    canvas.addEventListener("touchstart", handleStart, { passive: false });
    canvas.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleStart);
      canvas.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      canvas.removeEventListener("touchstart", handleStart);
      canvas.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, []);

  const handleCopyCode = async () => {
    await copyToClipboard(voucherCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const getWaClaimUrl = () => {
    if (!whatsappNumber) return null;
    const clean = whatsappNumber.replace(/\D/g, "");
    const full = clean.length === 10 ? `91${clean}` : clean;
    const text = encodeURIComponent(
      `Hi ${businessName}, I just gave a 5-star review on Google and unlocked reward coupon code ${voucherCode}! Please apply this for my next order/visit.`
    );
    return `https://wa.me/${full}?text=${text}`;
  };

  const waUrl = getWaClaimUrl();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl relative text-center overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
          <Gift className="w-7 h-7 animate-bounce" />
        </div>

        <h3 className="text-lg font-black text-white">
          🎉 Customer Appreciation Reward!
        </h3>
        <p className="text-xs text-slate-300 mt-0.5">
          Thank you for rating <strong className="text-white">{businessName}</strong> on Google!
        </p>

        {/* Scratch Card Container */}
        <div className="my-4 relative w-full h-32 rounded-2xl overflow-hidden border-2 border-amber-400/60 bg-gradient-to-br from-amber-500/20 via-slate-900 to-indigo-950 p-3 flex flex-col items-center justify-center shadow-inner">
          {/* Revealed Reward Underneath */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              {rewardTitle}
            </span>
            <p className="text-sm font-black text-white leading-tight">
              {rewardBenefit}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-mono font-black text-xs shadow mt-1">
              <Tag className="w-3.5 h-3.5" />
              <span>{voucherCode}</span>
            </div>
            <p className="text-[9px] text-slate-400">
              Valid for next 7 days · Show to staff
            </p>
          </div>

          {/* Canvas Scratch Foil Layer */}
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full cursor-pointer touch-none transition-opacity duration-500 ${
              isRevealed ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleCopyCode}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Coupon Code Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Coupon Code ({voucherCode})</span>
              </>
            )}
          </button>

          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition"
            >
              <span>Claim on WhatsApp with Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 pt-1"
          >
            Done / Close Voucher
          </button>
        </div>
      </div>
    </div>
  );
}
