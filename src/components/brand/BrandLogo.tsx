"use client";

import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  variant?: "full" | "icon";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  theme?: "light" | "dark";
  href?: string;
  className?: string;
}

/* ─────────────────────────────────────────────────────────
   BRAND ICON — standalone squircle mark
   A bold 5-point star with a subtle signal arc, sitting on
   a deep indigo-to-black gradient chassis. Crisp at 16px,
   gorgeous at 80px.
───────────────────────────────────────────────────────── */
export function BrandIcon({
  size = "md",
  className = "",
}: {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeMap: Record<string, string> = {
    xs: "w-5 h-5",
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
    xl: "w-14 h-14",
  };

  return (
    <div className={`relative shrink-0 select-none ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          {/* Deep indigo-slate gradient for the chassis */}
          <linearGradient id="rs-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#312e81" />
            <stop offset="50%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0c0a1e" />
          </linearGradient>

          {/* Warm gold for the star */}
          <linearGradient id="rs-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="55%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Indigo shimmer for the signal arc */}
          <linearGradient id="rs-arc" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="rs-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── Base squircle chassis ── */}
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="12"
          fill="url(#rs-bg)"
          stroke="#4338ca"
          strokeWidth="1"
          strokeOpacity="0.5"
        />

        {/* ── Signal arcs (top-right, WiFi-style) — represent NFC/connectivity ── */}
        <path
          d="M 30 8 A 14 14 0 0 1 40 18"
          stroke="url(#rs-arc)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.35"
        />
        <path
          d="M 33 5 A 20 20 0 0 1 43 15"
          stroke="url(#rs-arc)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.18"
        />

        {/* ── Central star — the main visual anchor ── */}
        {/* Using a proper 5-point star path centred at 22, 27, size ≈ 13px */}
        <path
          d="M22 14 L24.47 21.38 L32 21.38 L25.77 25.62 L28.24 33 L22 28.76 L15.76 33 L18.23 25.62 L12 21.38 L19.53 21.38 Z"
          fill="url(#rs-gold)"
          filter="url(#rs-glow)"
        />

        {/* ── Tiny accent dot — bottom right, breathing room ── */}
        <circle cx="37" cy="37" r="2.5" fill="#6366f1" opacity="0.7" />
        <circle cx="37" cy="37" r="1.2" fill="#a5b4fc" opacity="0.9" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   BRAND LOGO — icon + wordmark combo
───────────────────────────────────────────────────────── */
export default function BrandLogo({
  variant = "full",
  size = "md",
  theme = "light",
  href = "/",
  className = "",
}: BrandLogoProps) {
  const isDark = theme === "dark";

  const textSizes: Record<string, string> = {
    xs: "text-sm",
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  const badgeSizes: Record<string, string> = {
    xs: "text-[7px] px-1 py-px",
    sm: "text-[8px] px-1 py-px",
    md: "text-[9px] px-1.5 py-0.5",
    lg: "text-[10px] px-2 py-0.5",
    xl: "text-xs px-2.5 py-0.5",
  };

  const content = (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <BrandIcon size={size} />

      {variant === "full" && (
        <div className="flex items-center tracking-tight leading-none gap-1.5">
          <span
            className={`font-black ${textSizes[size]} ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Review
            <span className="text-indigo-500">Smart</span>
          </span>

          <span
            className={`font-black uppercase tracking-widest rounded-md border ${badgeSizes[size]} ${
              isDark
                ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300/60 shadow-sm"
                : "bg-indigo-50 text-indigo-700 border-indigo-200"
            }`}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group hover:opacity-90 transition-opacity inline-flex items-center"
      >
        {content}
      </Link>
    );
  }

  return content;
}
