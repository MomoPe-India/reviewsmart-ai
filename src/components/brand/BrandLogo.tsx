"use client";

import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "light" | "dark";
  href?: string;
  className?: string;
}

export function BrandIcon({ size = "md", className = "" }: { size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const sizeMap = {
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
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {/* Main Shield / Squircle Gradient */}
          <linearGradient id="rs-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Indigo Ribbon Gradient */}
          <linearGradient id="rs-indigo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>

          {/* Radiant 5-Star Gold Gradient */}
          <linearGradient id="rs-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Soft Glow Ambient */}
          <radialGradient id="rs-ambient-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Glow */}
        <circle cx="24" cy="24" r="20" fill="url(#rs-ambient-glow)" />

        {/* Base Squircle Chassis */}
        <rect
          x="3"
          y="3"
          width="42"
          height="42"
          rx="13"
          fill="url(#rs-bg-grad)"
          stroke="#4338ca"
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />

        {/* Inner Tech Grid / NFC Radar Arc */}
        <path
          d="M 33 11 A 16 16 0 0 1 37 20"
          stroke="#818cf8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />
        <path
          d="M 36 8 A 21 21 0 0 1 41 18"
          stroke="#818cf8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.25"
        />

        {/* Modern Stylized 'R' Ribbon & Shield Contour */}
        <path
          d="M14 34V14H24C28 14 30.5 16.5 30.5 20C30.5 23.5 28 26 24 26H18.5"
          stroke="url(#rs-indigo-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 'R' Leg morphing into a Forward Dynamic Sweep */}
        <path
          d="M23 26L31 34"
          stroke="url(#rs-indigo-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Central Brilliant AI 5-Star Sparkle Emblem */}
        <path
          d="M25 15.5L26.5 19L30 20.5L26.5 22L25 25.5L23.5 22L20 20.5L23.5 19L25 15.5Z"
          fill="url(#rs-gold-grad)"
          filter="drop-shadow(0px 2px 4px rgba(245, 158, 11, 0.5))"
        />

        {/* Miniature Top-Left Sparkle */}
        <path
          d="M13 11L13.8 12.8L15.5 13.5L13.8 14.2L13 16L12.2 14.2L10.5 13.5L12.2 12.8L13 11Z"
          fill="#fef08a"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}

export default function BrandLogo({
  variant = "full",
  size = "md",
  theme = "light",
  href = "/",
  className = "",
}: BrandLogoProps) {
  const isDark = theme === "dark";

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  const badgeSizes = {
    sm: "text-[8px] px-1 py-0.2",
    md: "text-[9px] px-1.5 py-0.5",
    lg: "text-[10px] px-2 py-0.5",
    xl: "text-xs px-2.5 py-0.5",
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <BrandIcon size={size} />

      {variant === "full" && (
        <div className="flex items-center tracking-tight leading-none">
          <span
            className={`font-black ${textSizes[size]} ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Review<span className="text-indigo-500">Smart</span>
          </span>

          <span
            className={`ml-1.5 font-black uppercase tracking-wider rounded-md border shadow-xs ${badgeSizes[size]} ${
              isDark
                ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300"
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
      <Link href={href} className="group hover:opacity-95 transition-opacity inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
