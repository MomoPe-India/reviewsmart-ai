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
   BRAND ICON — Standalone Luxury Emblem
   A precision-sculpted 3D faceted Celestial Diamond Star
   (the mark of 5-star perfection & Gemini AI intelligence)
   anchored inside an elite obsidian-sapphire chassis with a
   brushed champagne-gold metallic bezel and micro-specular glints.
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
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
        aria-hidden="true"
      >
        <defs>
          {/* Deep Obsidian-Sapphire Luxury Chassis */}
          <linearGradient id="rs-chassis-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="35%" stopColor="#090d16" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* 24K Brushed Champagne Gold Bezel */}
          <linearGradient id="rs-gold-bezel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Facet Light: Top-Left (Pure Radiant Gold) */}
          <linearGradient id="rs-facet-tl" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="40%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Facet Light: Top-Right (Specular Gold) */}
          <linearGradient id="rs-facet-tr" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Facet Shadow: Bottom-Right (Deep Obsidian Bronze) */}
          <linearGradient id="rs-facet-br" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Facet Tone: Bottom-Left (Warm Core Gold) */}
          <linearGradient id="rs-facet-bl" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>

          {/* Electric Sapphire AI Ribbon / Smart Review Orbit */}
          <linearGradient id="rs-sapphire-orbit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="40%" stopColor="#3b82f6" />
            <stop offset="80%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>

          {/* Ambient Core Luminosity Glow */}
          <radialGradient id="rs-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Micro Specular Glint Glow */}
          <filter id="rs-glint-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── 1. Luxury Outer Beveled Chassis ── */}
        <rect
          x="2.5"
          y="2.5"
          width="51"
          height="51"
          rx="15"
          fill="url(#rs-chassis-bg)"
          stroke="url(#rs-gold-bezel)"
          strokeWidth="1.25"
        />

        {/* Inner subtle luxury rim */}
        <rect
          x="4"
          y="4"
          width="48"
          height="48"
          rx="13.5"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="0.75"
          strokeOpacity="0.25"
        />

        {/* ── 2. Ambient Core Aura ── */}
        <circle cx="28" cy="28" r="20" fill="url(#rs-core-glow)" />

        {/* ── 3. Smart Review Crest Orbit (Sweeping Sapphire Arch) ── */}
        {/* Represents the continuous cycle of incoming 5-star customer reviews */}
        <path
          d="M 17 21 C 21 13, 35 12, 41 18 C 46 23, 44 33, 38 39 C 33 44, 21 44, 16 38"
          stroke="url(#rs-sapphire-orbit)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="42 12"
          opacity="0.85"
        />

        {/* ── 4. The 3D Precision Faceted Diamond Star ── */}
        {/* Center: (28, 28). Top: (28, 13). Right: (43, 28). Bottom: (28, 43). Left: (13, 28) */}
        
        {/* Top-Left Facet */}
        <polygon points="28,28 28,13 13,28" fill="url(#rs-facet-tl)" />

        {/* Top-Right Facet */}
        <polygon points="28,28 28,13 43,28" fill="url(#rs-facet-tr)" />

        {/* Bottom-Right Facet */}
        <polygon points="28,28 43,28 28,43" fill="url(#rs-facet-br)" />

        {/* Bottom-Left Facet */}
        <polygon points="28,28 28,43 13,28" fill="url(#rs-facet-bl)" />

        {/* Central Luminous Diamond Heart (Specular Pinnacle) */}
        <polygon
          points="28,22 34,28 28,34 22,28"
          fill="#ffffff"
          opacity="0.95"
          filter="url(#rs-glint-glow)"
        />

        {/* ── 5. Luxury Micro-Sparkles (Signature Shimmer) ── */}
        {/* Top-Right Diamond Sparkle */}
        <path
          d="M 43 12 L 44 15 L 47 16 L 44 17 L 43 20 L 42 17 L 39 16 L 42 15 Z"
          fill="#fef08a"
          opacity="0.9"
        />
        {/* Bottom-Left Micro Glint */}
        <circle cx="13" cy="41" r="1.5" fill="#93c5fd" opacity="0.8" />
        <circle cx="13" cy="41" r="0.75" fill="#ffffff" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   BRAND LOGO — Luxury Icon + Typography Combo
   Balanced editorial letterforms, Google-inspired sapphire,
   and brushed 24K gold metallic AI jewelry capsule.
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
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <BrandIcon size={size} />

      {variant === "full" && (
        <div className="flex items-center tracking-tight leading-none gap-1.5">
          <span
            className={`font-black tracking-tight ${textSizes[size]} ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Review
            <span
              className={
                isDark
                  ? "bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-200 bg-clip-text text-transparent font-black"
                  : "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent font-black"
              }
            >
              Smart
            </span>
          </span>

          {/* Luxury 24K Gold AI Micro-Badge */}
          <span
            className={`font-black uppercase tracking-widest rounded-full border shadow-sm ${badgeSizes[size]} ${
              isDark
                ? "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 border-amber-300/80 shadow-amber-500/20"
                : "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 border-amber-400/90 shadow-amber-500/15"
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
        className="group hover:opacity-95 transition-opacity inline-flex items-center"
      >
        {content}
      </Link>
    );
  }

  return content;
}
