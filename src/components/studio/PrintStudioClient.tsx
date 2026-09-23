"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Printer,
  Copy,
  Check,
  Radio,
  Sparkles,
  Smartphone,
  Star,
  ShieldCheck,
  Palette,
  Layers,
  Scissors,
  Award,
  Crown,
  Camera,
  Upload,
  X,
} from "lucide-react";
import QRCode from "qrcode";
import { printElement } from "@/lib/print";

interface BusinessData {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  logoUrl?: string | null;
  primaryColor?: string;
  googleAddress?: string | null;
}

const LUXURY_THEMES = [
  {
    id: "royal-gold" as const,
    name: "Royal Gold & Black",
    subtitle: "Obsidian Black + Metallic Gold",
    accent: "#d4af37",
    bg: "#0b0f19",
    text: "#ffffff",
    subtext: "#cbd5e1",
    innerBorder: "rgba(245, 158, 11, 0.5)",
    ribbonBg: "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950",
    swatch: "bg-slate-950 border-amber-400 text-amber-300",
    badge: "Most Popular",
  },
  {
    id: "pearl-gold" as const,
    name: "Pearl White & Gold",
    subtitle: "Clean Ivory White + Metallic Gold",
    accent: "#d4af37",
    bg: "#ffffff",
    text: "#0f172a",
    subtext: "#475569",
    innerBorder: "rgba(212, 175, 55, 0.4)",
    ribbonBg: "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950",
    swatch: "bg-white border-amber-400 text-slate-900",
    badge: "Classic",
  },
  {
    id: "emerald-gold" as const,
    name: "Imperial Emerald",
    subtitle: "Royal Deep Green + Metallic Gold",
    accent: "#f59e0b",
    bg: "#064e3b",
    text: "#ffffff",
    subtext: "#a7f3d0",
    innerBorder: "rgba(245, 158, 11, 0.45)",
    ribbonBg: "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950",
    swatch: "bg-emerald-950 border-amber-400 text-amber-300",
    badge: "Luxury Dining",
  },
  {
    id: "sapphire-gold" as const,
    name: "Sapphire Navy",
    subtitle: "Midnight Navy + Metallic Gold",
    accent: "#f59e0b",
    bg: "#0a192f",
    text: "#ffffff",
    subtext: "#bfdbfe",
    innerBorder: "rgba(245, 158, 11, 0.45)",
    ribbonBg: "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950",
    swatch: "bg-blue-950 border-amber-400 text-amber-300",
    badge: "Corporate",
  },
];

type LuxuryThemeId = (typeof LUXURY_THEMES)[number]["id"];

export default function PrintStudioClient({
  business,
  reviewUrl,
}: {
  business: BusinessData;
  reviewUrl: string;
}) {
  const [format, setFormat] = useState<"stand" | "tent" | "nfc">("stand");
  const [luxuryTheme, setLuxuryTheme] = useState<LuxuryThemeId>("royal-gold");
  const [logoUrl, setLogoUrl] = useState<string | null>(business.logoUrl || null);
  const [calloutTitle, setCalloutTitle] = useState("Scan to Review Us on Google");
  const [calloutSubtitle, setCalloutSubtitle] = useState("Tap your phone or scan with camera");
  const [showCropMarks, setShowCropMarks] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedNfc, setCopiedNfc] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const activeTheme = LUXURY_THEMES.find((t) => t.id === luxuryTheme) || LUXURY_THEMES[0];

  useEffect(() => {
    QRCode.toDataURL(reviewUrl, {
      width: 900,
      margin: 2,
      color: {
        dark: "#0b0f19",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    }).then(setQrDataUrl);
  }, [reviewUrl]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setLogoUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadQr = () => {
    const link = document.createElement("a");
    link.download = `${business.slug}-review-qr.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handleDownloadSvg = async () => {
    const svgString = await QRCode.toString(reviewUrl, {
      type: "svg",
      width: 1000,
      margin: 2,
      color: {
        dark: "#0b0f19",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    });

    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${business.slug}-review-qr.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (format === "stand") {
      printElement(
        "print-target",
        `${business.name} - 4x6 Acrylic Stand (${activeTheme.name})`,
        "@page { size: 4in 6in; margin: 0; }"
      );
    } else if (format === "nfc") {
      printElement(
        "print-target",
        `${business.name} - Smart Card`,
        "@page { size: 3.375in 2.125in; margin: 0; }"
      );
    } else {
      printElement(
        "print-target",
        `${business.name} - Table Tent`,
        "@page { size: A4 portrait; margin: 8mm; }"
      );
    }
  };

  const handleCopyNfcUrl = async () => {
    await navigator.clipboard.writeText(reviewUrl);
    setCopiedNfc(true);
    setTimeout(() => setCopiedNfc(false), 2500);
  };

  // High Resolution 300 DPI Canvas Exporter (Clean, Unwatermarked for Paid Studio)
  const handleExportHighResPng = async () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (format === "stand") {
        // 4" x 6" at 300 DPI = 1200 x 1800 px (Flipkart A6 Acrylic L-Stand standard)
        canvas.width = 1200;
        canvas.height = 1800;

        // Background
        ctx.fillStyle = activeTheme.bg;
        ctx.fillRect(0, 0, 1200, 1800);

        // Outer Metallic Gold Border
        ctx.strokeStyle = activeTheme.accent;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.roundRect(40, 40, 1120, 1720, 36);
        ctx.stroke();

        // Inner Delicate Hairline Gold Border
        ctx.strokeStyle = activeTheme.innerBorder;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(60, 60, 1080, 1680, 24);
        ctx.stroke();

        // Corner Filigree Brackets
        ctx.font = "bold 44px Georgia, serif";
        ctx.fillStyle = activeTheme.accent;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("┌", 85, 85);
        ctx.fillText("┐", 1115, 85);
        ctx.fillText("└", 85, 1715);
        ctx.fillText("┘", 1115, 1715);

        // Top Luxury Award Ribbon Badge
        const ribbonGrad = ctx.createLinearGradient(350, 95, 850, 95);
        ribbonGrad.addColorStop(0, "#d97706");
        ribbonGrad.addColorStop(0.5, "#fbbf24");
        ribbonGrad.addColorStop(1, "#d97706");
        ctx.fillStyle = ribbonGrad;
        ctx.beginPath();
        ctx.roundRect(350, 95, 500, 64, 32);
        ctx.fill();

        ctx.fillStyle = "#0b0f19";
        ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("★ 5.0 GOOGLE EXCELLENCE AWARD ★", 600, 127);

        // Circular Brand Logo
        let logoDrawn = false;
        if (logoUrl) {
          try {
            const logoImg = new Image();
            logoImg.crossOrigin = "anonymous";
            await new Promise((resolve, reject) => {
              logoImg.onload = resolve;
              logoImg.onerror = reject;
              logoImg.src = logoUrl;
            });

            ctx.save();
            ctx.beginPath();
            ctx.arc(600, 260, 75, 0, Math.PI * 2);
            ctx.clip();
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(525, 185, 150, 150);
            ctx.drawImage(logoImg, 525, 185, 150, 150);
            ctx.restore();

            // Gold Ring around Logo
            ctx.strokeStyle = activeTheme.accent;
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(600, 260, 75, 0, Math.PI * 2);
            ctx.stroke();

            logoDrawn = true;
          } catch {
            logoDrawn = false;
          }
        }

        if (!logoDrawn) {
          // Fallback Initials Badge
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(600, 260, 75, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = activeTheme.accent;
          ctx.lineWidth = 6;
          ctx.stroke();

          ctx.fillStyle = "#d97706";
          ctx.font = "900 52px -apple-system, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(business.name.slice(0, 2).toUpperCase() || "RS", 600, 260);
        }

        // Business Name
        ctx.fillStyle = activeTheme.text;
        ctx.font = "900 54px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(business.name, 600, 395);

        // Branch Locality Address
        if (business.googleAddress) {
          ctx.fillStyle = activeTheme.subtext;
          ctx.font = "600 28px -apple-system, BlinkMacSystemFont, sans-serif";
          ctx.fillText(`📍 ${business.googleAddress}`, 600, 440);
        }

        // Star Rating & Badge
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 44px sans-serif";
        ctx.fillText("★★★★★", 510, 495);

        ctx.fillStyle = activeTheme.text;
        ctx.font = "800 32px -apple-system, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("5.0 on Google", 620, 495);

        // Center QR Code in Luxury Box
        if (qrDataUrl) {
          const qrImg = new Image();
          await new Promise((resolve) => {
            qrImg.onload = resolve;
            qrImg.src = qrDataUrl;
          });

          // QR White Container
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(310, 540, 580, 580, 40);
          ctx.fill();

          // Gold Frame around QR Box
          ctx.strokeStyle = activeTheme.accent;
          ctx.lineWidth = 8;
          ctx.stroke();

          // Draw QR Code
          ctx.drawImage(qrImg, 350, 580, 500, 500);

          // NFC Tap Badge Corner Pill
          ctx.fillStyle = "#fbbf24";
          ctx.beginPath();
          ctx.roundRect(750, 1070, 160, 60, 30);
          ctx.fill();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 4;
          ctx.stroke();

          ctx.fillStyle = "#0b0f19";
          ctx.font = "900 22px -apple-system, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("📶 NFC TAP", 830, 1100);
        }

        // 3-Step Instruction Pill
        ctx.fillStyle = activeTheme.id === "pearl-gold" ? "#f1f5f9" : "rgba(0, 0, 0, 0.4)";
        ctx.beginPath();
        ctx.roundRect(160, 1160, 880, 72, 36);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = activeTheme.subtext;
        ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("① Scan QR with Camera  •  ② Pick Instant Compliments  •  ③ Post in 5 Sec", 600, 1196);

        // Callout Title
        ctx.fillStyle = activeTheme.text;
        ctx.font = "900 48px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(calloutTitle, 600, 1310);

        // Subtitle
        ctx.fillStyle = activeTheme.subtext;
        ctx.font = "500 32px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.fillText(calloutSubtitle, 600, 1370);

        // Verified Partner Footer
        ctx.fillStyle = activeTheme.accent;
        ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.fillText("✨ ReviewSmart AI • Verified Google Partner", 600, 1660);

        // Optional crop border
        if (showCropMarks) {
          ctx.strokeStyle = "#94a3b8";
          ctx.lineWidth = 2;
          ctx.setLineDash([12, 12]);
          ctx.strokeRect(20, 20, 1160, 1760);
        }
      } else if (format === "nfc") {
        // Smart Card CR80: 3.375" x 2.125" at 300 DPI = 1012 x 638 px
        canvas.width = 1012;
        canvas.height = 638;

        ctx.fillStyle = activeTheme.bg;
        ctx.fillRect(0, 0, 1012, 638);

        // Gold border
        ctx.strokeStyle = activeTheme.accent;
        ctx.lineWidth = 6;
        ctx.strokeRect(18, 18, 976, 602);

        // Left Card Info
        ctx.fillStyle = activeTheme.text;
        ctx.font = "900 44px -apple-system, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(business.name, 60, 110);

        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 32px sans-serif";
        ctx.fillText("★★★★★", 60, 165);

        ctx.fillStyle = activeTheme.subtext;
        ctx.font = "bold 24px -apple-system, sans-serif";
        ctx.fillText("Google 5.0 Rating", 185, 165);

        ctx.fillStyle = activeTheme.text;
        ctx.font = "bold 34px -apple-system, sans-serif";
        ctx.fillText("Tap or Scan to Review", 60, 280);

        ctx.fillStyle = activeTheme.subtext;
        ctx.font = "24px -apple-system, sans-serif";
        ctx.fillText("Instant 30-sec AI feedback", 60, 325);

        // NFC contactless indicator
        ctx.fillStyle = activeTheme.accent;
        ctx.font = "bold 26px -apple-system, sans-serif";
        ctx.fillText("📶 NFC Contactless Enabled", 60, 520);

        // Draw QR Code on the right in white box
        if (qrDataUrl) {
          const qrImg = new Image();
          await new Promise((resolve) => {
            qrImg.onload = resolve;
            qrImg.src = qrDataUrl;
          });

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(560, 80, 400, 400, 24);
          ctx.fill();
          ctx.strokeStyle = activeTheme.accent;
          ctx.lineWidth = 4;
          ctx.stroke();

          ctx.drawImage(qrImg, 580, 100, 360, 360);
        }

        if (showCropMarks) {
          ctx.strokeStyle = "#cbd5e1";
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 8]);
          ctx.strokeRect(10, 10, 992, 618);
        }
      } else {
        // Table Tent (Square / Foldable)
        canvas.width = 1200;
        canvas.height = 1200;

        ctx.fillStyle = activeTheme.bg;
        ctx.fillRect(0, 0, 1200, 1200);

        ctx.strokeStyle = activeTheme.accent;
        ctx.lineWidth = 8;
        ctx.strokeRect(30, 30, 1140, 1140);

        ctx.fillStyle = activeTheme.text;
        ctx.font = "900 52px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(business.name, 600, 140);

        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 34px -apple-system, sans-serif";
        ctx.fillText("★★★★★  5.0 on Google", 600, 200);

        if (qrDataUrl) {
          const qrImg = new Image();
          await new Promise((resolve) => {
            qrImg.onload = resolve;
            qrImg.src = qrDataUrl;
          });

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(340, 260, 520, 520, 32);
          ctx.fill();
          ctx.strokeStyle = activeTheme.accent;
          ctx.lineWidth = 6;
          ctx.stroke();

          ctx.drawImage(qrImg, 370, 290, 460, 460);
        }

        ctx.fillStyle = activeTheme.text;
        ctx.font = "bold 44px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(calloutTitle, 600, 880);

        ctx.fillStyle = activeTheme.subtext;
        ctx.font = "30px -apple-system, sans-serif";
        ctx.fillText(calloutSubtitle, 600, 940);

        ctx.fillStyle = activeTheme.accent;
        ctx.font = "bold 24px -apple-system, sans-serif";
        ctx.fillText("✨ AI Review Assistant • Verified Google Partner", 600, 1100);
      }

      const link = document.createElement("a");
      link.download = `${business.slug}-${format}-${luxuryTheme}-300dpi.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Export error:", e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Controls Column (Left) - Hidden on Print */}
      <div className="lg:col-span-5 space-y-4 no-print">
        {/* Format Selector */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm space-y-3">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              Display Template Formats
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Flipkart A6 Ready
            </span>
          </label>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setFormat("stand")}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                format === "stand"
                  ? "border-amber-500 bg-amber-50/80 text-amber-900 font-bold shadow-sm"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="text-xs">Acrylic Stand</div>
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">4" x 6" Flipkart</div>
            </button>

            <button
              type="button"
              onClick={() => setFormat("tent")}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                format === "tent"
                  ? "border-amber-500 bg-amber-50/80 text-amber-900 font-bold shadow-sm"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="text-xs">Table Tent</div>
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">Foldable A4</div>
            </button>

            <button
              type="button"
              onClick={() => setFormat("nfc")}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                format === "nfc"
                  ? "border-amber-500 bg-amber-50/80 text-amber-900 font-bold shadow-sm"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="text-xs">Smart Card</div>
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">CR80 Wallet</div>
            </button>
          </div>
        </div>

        {/* 4 Luxury Themes Selector */}
        {format === "stand" && (
          <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-500" />
                4 Luxury Metallic Standee Themes
              </label>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                L-Shape A6
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {LUXURY_THEMES.map((t) => {
                const isSelected = luxuryTheme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setLuxuryTheme(t.id)}
                    className={`p-3 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                      isSelected
                        ? "border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-400"
                        : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`w-5 h-5 rounded-full border-2 ${t.swatch} flex items-center justify-center text-[10px]`}>
                          ✓
                        </span>
                        <span className="text-[9px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {t.badge}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900">{t.name}</div>
                      <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                        {t.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Brand Logo & Details */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-indigo-600" />
            Customization &amp; Logo Framing
          </label>

          {/* Logo Uploader / Switcher */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-white flex items-center justify-center p-1 shadow-sm overflow-hidden flex-shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain rounded-full" />
              ) : (
                <span className="text-[11px] font-black text-amber-600">
                  {business.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-slate-800 text-xs font-bold cursor-pointer shadow-sm transition">
                <Camera className="w-3.5 h-3.5 text-amber-600" />
                <span>{logoUrl ? "Change Logo" : "Upload Brand Logo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              {logoUrl && (
                <button
                  type="button"
                  onClick={() => setLogoUrl(null)}
                  className="text-[10px] font-bold text-red-600 ml-2 hover:underline"
                >
                  Reset
                </button>
              )}
              <p className="text-[10px] text-slate-500 mt-0.5">
                Automatically framed in metallic gold on stand.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Headline Callout
            </label>
            <input
              type="text"
              value={calloutTitle}
              onChange={(e) => setCalloutTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Instructions Subtitle
            </label>
            <input
              type="text"
              value={calloutSubtitle}
              onChange={(e) => setCalloutSubtitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Cutting Guides Option */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-slate-400" />
              Show 4"×6" trim / fold guidelines
            </span>
            <input
              type="checkbox"
              checked={showCropMarks}
              onChange={(e) => setShowCropMarks(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          {/* Print & Download Action Group */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-200 transition"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              Print / Save as PDF (4"×6" Flipkart A6)
            </button>

            <button
              type="button"
              onClick={handleExportHighResPng}
              disabled={isExporting}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-amber-400" />
              {isExporting ? "Generating 300 DPI Export..." : `Download ${activeTheme.name} Stand PNG (300 DPI)`}
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                QR Code PNG
              </button>

              <button
                type="button"
                onClick={handleDownloadSvg}
                className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                QR Vector SVG
              </button>
            </div>
          </div>
        </div>

        {/* NFC Programming Guide */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-5 rounded-3xl text-white shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/30 flex items-center justify-center text-indigo-300">
              <Radio className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold">Program Physical NFC Chips</h3>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Want customers to tap their phone directly on your standee or smart card? Buy inexpensive NTAG213 / NTAG215 stickers or cards on Amazon.
          </p>

          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
              Your Review Portal URL:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={reviewUrl}
                className="w-full text-[11px] font-mono p-2 rounded-lg bg-white/10 border border-white/20 text-indigo-100 truncate"
              />
              <button
                type="button"
                onClick={handleCopyNfcUrl}
                className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition flex-shrink-0"
                title="Copy NFC URL"
              >
                {copiedNfc ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <p className="text-[10px] text-slate-400">
            💡 Download the free app <strong className="text-slate-200">"NFC Tools"</strong> on iOS or Android $\rightarrow$ Write $\rightarrow$ Add a record $\rightarrow$ URL $\rightarrow$ Paste this link $\rightarrow$ Tap chip. Done!
          </p>
        </div>
      </div>

      {/* Live Preview Area (Right) */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-200/50 p-4 sm:p-10 rounded-3xl border border-slate-200 min-h-[620px] relative overflow-hidden">
        {/* Printable Target Container - Sized & Styled specifically for print */}
        {format === "stand" && (
          <div
            id="print-target"
            className="rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center justify-between relative transition-all border-[3px] shadow-2xl select-none overflow-hidden"
            style={{
              width: "360px",
              height: "540px",
              backgroundColor: activeTheme.bg,
              borderColor: activeTheme.accent,
              boxShadow: "0 25px 40px -10px rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Inner Hairline Gold Border */}
            <div
              className="absolute inset-2.5 rounded-2xl border pointer-events-none"
              style={{ borderColor: activeTheme.innerBorder }}
            />

            {/* Corner Filigree Accents */}
            <div className="absolute top-3.5 left-3.5 text-amber-400 font-serif text-xs pointer-events-none select-none">┌</div>
            <div className="absolute top-3.5 right-3.5 text-amber-400 font-serif text-xs pointer-events-none select-none">┐</div>
            <div className="absolute bottom-3.5 left-3.5 text-amber-400 font-serif text-xs pointer-events-none select-none">└</div>
            <div className="absolute bottom-3.5 right-3.5 text-amber-400 font-serif text-xs pointer-events-none select-none">┘</div>

            {/* Top Luxury Ribbon Badge */}
            <div className={`px-4 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow-md ${activeTheme.ribbonBg} flex items-center gap-1.5 z-10`}>
              <Award className="w-3.5 h-3.5" />
              <span>5.0 Google Excellence Award</span>
            </div>

            {/* Stand Header: Logo & Store Name */}
            <div className="flex flex-col items-center mt-1 z-10">
              <div className="w-14 h-14 rounded-full border-2 border-amber-400 bg-white flex items-center justify-center p-1 shadow-md mb-2 overflow-hidden">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={business.name}
                    className="w-full h-full object-contain rounded-full"
                  />
                ) : (
                  <span className="text-lg font-black text-amber-600">
                    {business.name.slice(0, 2).toUpperCase() || "RS"}
                  </span>
                )}
              </div>

              <h2
                className="text-base font-black tracking-tight leading-tight max-w-[280px]"
                style={{ color: activeTheme.text }}
              >
                {business.name}
              </h2>

              {business.googleAddress && (
                <p
                  className="text-[10px] truncate max-w-[260px] mt-0.5 font-medium"
                  style={{ color: activeTheme.subtext }}
                >
                  📍 {business.googleAddress}
                </p>
              )}

              <div className="flex items-center gap-1 mt-1">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span
                  className="text-[11px] font-extrabold ml-1"
                  style={{ color: activeTheme.text }}
                >
                  5.0 on Google
                </span>
              </div>
            </div>

            {/* Centerpiece QR Code */}
            <div className="p-3 bg-white rounded-2xl relative my-1 z-10 border-2 border-amber-400 shadow-xl">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Review QR Code"
                  className="w-36 h-36 object-contain"
                />
              ) : (
                <div className="w-36 h-36 bg-slate-100 animate-pulse rounded-xl" />
              )}

              {/* NFC Contactless Indicator */}
              <div className="absolute -bottom-2.5 -right-2.5 px-2 py-1 rounded-full text-[9px] font-black shadow-md border-2 border-white flex items-center gap-1 bg-amber-400 text-slate-950">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>NFC TAP</span>
              </div>
            </div>

            {/* Micro 3-Step Instruction Guide */}
            <div
              className="w-full px-2 py-1.5 rounded-xl bg-black/20 border border-white/10 text-[9px] font-bold z-10"
              style={{ color: activeTheme.subtext }}
            >
              ① Scan QR with Camera &bull; ② Pick Instant Compliments &bull; ③ Post in 5 Sec
            </div>

            {/* Stand Footer */}
            <div className="space-y-0.5 pb-0.5 z-10">
              <h3
                className="text-xs font-black tracking-tight"
                style={{ color: activeTheme.text }}
              >
                {calloutTitle}
              </h3>
              <p
                className="text-[10px] max-w-[260px] font-medium"
                style={{ color: activeTheme.subtext }}
              >
                {calloutSubtitle}
              </p>
              <div className="pt-1 text-[9px] font-bold text-amber-400 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>ReviewSmart AI &bull; Verified Google Partner</span>
              </div>
            </div>

            {/* Physical Print Dimension Indicator */}
            {showCropMarks && (
              <div className="absolute -bottom-6 text-[10px] text-slate-400 no-print flex items-center gap-1 font-mono">
                <Scissors className="w-3 h-3" /> Flipkart Standard 4" x 6" (A6) Acrylic Stand Insert
              </div>
            )}
          </div>
        )}

        {/* Foldable Table Tent (A4 Printable with Fold Guides) */}
        {format === "tent" && (
          <div
            id="print-target"
            className="table-tent-sheet bg-white p-6 rounded-2xl border border-slate-300 w-full max-w-[420px] flex flex-col space-y-4"
          >
            {/* Panel 1 (Front Side) */}
            <div className="border border-slate-200 p-5 rounded-2xl text-center relative flex flex-col items-center">
              <div
                className="absolute top-0 left-0 right-0 h-2 rounded-t-2xl"
                style={{ backgroundColor: activeTheme.accent }}
              />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Front Facing Table Side
              </span>
              <h3 className="text-sm font-bold text-slate-900">{business.name}</h3>
              <div className="flex items-center gap-1 my-1">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-500">5.0 on Google</span>
              </div>
              {qrDataUrl && (
                <img src={qrDataUrl} alt="QR" className="w-28 h-28 my-1 object-contain" />
              )}
              <p className="text-xs font-bold text-slate-800">{calloutTitle}</p>
              <p className="text-[10px] text-slate-500">{calloutSubtitle}</p>
            </div>

            {/* Fold Guide Line */}
            <div className="flex items-center justify-center gap-2 py-1 border-t-2 border-b-2 border-dashed border-slate-300 text-[10px] font-mono text-slate-500">
              <Scissors className="w-3 h-3" /> FOLD HERE (CREASE DOWNWARD) <Scissors className="w-3 h-3" />
            </div>

            {/* Panel 2 (Back Side) */}
            <div className="border border-slate-200 p-5 rounded-2xl text-center relative flex flex-col items-center">
              <div
                className="absolute top-0 left-0 right-0 h-2 rounded-t-2xl"
                style={{ backgroundColor: activeTheme.accent }}
              />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Back Facing Table Side
              </span>
              <h3 className="text-sm font-bold text-slate-900">{business.name}</h3>
              <div className="flex items-center gap-1 my-1">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-500">5.0 on Google</span>
              </div>
              {qrDataUrl && (
                <img src={qrDataUrl} alt="QR" className="w-28 h-28 my-1 object-contain" />
              )}
              <p className="text-xs font-bold text-slate-800">{calloutTitle}</p>
              <p className="text-[10px] text-slate-500">{calloutSubtitle}</p>
            </div>

            {/* Base Flap Guide */}
            <div className="p-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center text-[9px] text-slate-500 font-mono">
              FOLD BASE FLAP &amp; TUCK UNDERNEATH FOR TRIANGLE STAND
            </div>
          </div>
        )}

        {/* Smart NFC Card (CR80 Standard Wallet / Badge Size) */}
        {format === "nfc" && (
          <div
            id="print-target"
            className="rounded-2xl p-6 border-2 border-amber-400 flex items-center justify-between relative transition-all shadow-xl"
            style={{
              width: "400px",
              height: "240px",
              backgroundColor: activeTheme.bg,
            }}
          >
            {/* Left Card Info */}
            <div className="flex flex-col justify-between h-full pl-2 max-w-[210px]">
              <div>
                <h3
                  className="text-sm font-black tracking-tight leading-tight"
                  style={{ color: activeTheme.text }}
                >
                  {business.name}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: activeTheme.subtext }}
                  >
                    Google 5.0
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p
                  className="text-xs font-bold leading-tight"
                  style={{ color: activeTheme.text }}
                >
                  Tap or Scan to Review
                </p>
                <p
                  className="text-[10px]"
                  style={{ color: activeTheme.subtext }}
                >
                  Instant 30-sec AI review
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400">
                <Radio className="w-3 h-3" />
                <span>NFC Contactless Ready</span>
              </div>
            </div>

            {/* Right Card QR */}
            <div className="flex-shrink-0 bg-white p-2 rounded-xl border border-amber-400 shadow-md">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR" className="w-28 h-28 object-contain" />
              ) : (
                <div className="w-28 h-28 bg-slate-100 animate-pulse rounded-lg" />
              )}
            </div>

            {showCropMarks && (
              <div className="absolute -bottom-6 left-0 right-0 text-center text-[10px] text-slate-400 no-print font-mono flex items-center justify-center gap-1">
                <Scissors className="w-3 h-3" /> Standard CR80 Wallet Card Size (85.6mm x 54mm)
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-slate-400 mt-8 no-print text-center max-w-sm">
          💡 Click <strong>"Print / Save as PDF"</strong> for direct paper printout, or <strong>"Download Stand PNG"</strong> for 300 DPI high-res output for your acrylic fabricator.
        </p>
      </div>
    </div>
  );
}
