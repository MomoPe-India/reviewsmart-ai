"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Printer,
  Copy,
  Check,
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
  CreditCard,
  RotateCw,
  UserCheck,
  IndianRupee,
  HelpCircle,
  CheckCircle2,
  Share2,
  FileText,
  Send,
  ExternalLink,
} from "lucide-react";
import QRCode from "qrcode";
import { printElement } from "@/lib/print";
import { copyToClipboard } from "@/lib/clipboard";

interface BusinessData {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  logoUrl?: string | null;
  primaryColor?: string;
  googleAddress?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
}

interface PrintStudioProps {
  business: BusinessData;
  reviewUrl: string;
  agentMode?: boolean;
  merchantInfo?: {
    name?: string;
    phone?: string;
  };
}

const LUXURY_THEMES = [
  {
    id: "royal-gold" as const,
    name: "Royal Gold & Black",
    subtitle: "Obsidian Black + Metallic Gold",
    accent: "#d4af37",
    bg: "#0b0f19",
    innerBorder: "rgba(212, 175, 55, 0.4)",
    text: "#ffffff",
    subtext: "#cbd5e1",
    ribbonBg: "bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 text-slate-950",
    swatch: "bg-slate-950 border-amber-400 text-amber-300",
    badge: "Most Popular",
  },
  {
    id: "emerald-velvet" as const,
    name: "Emerald Velvet",
    subtitle: "Deep Pine + Mint Gold",
    accent: "#34d399",
    bg: "#091317",
    innerBorder: "rgba(52, 211, 153, 0.4)",
    text: "#ffffff",
    subtext: "#94a3b8",
    ribbonBg: "bg-gradient-to-r from-emerald-600 via-teal-400 to-emerald-600 text-slate-950",
    swatch: "bg-emerald-950 border-emerald-400 text-emerald-300",
    badge: "Luxury Retail",
  },
  {
    id: "pearl-gold" as const,
    name: "Pearl White & Gold",
    subtitle: "Clean Alabaster + Warm Gold",
    accent: "#b45309",
    bg: "#ffffff",
    innerBorder: "rgba(180, 83, 9, 0.3)",
    text: "#0f172a",
    subtext: "#475569",
    ribbonBg: "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-white",
    swatch: "bg-white border-amber-400 text-amber-800",
    badge: "Minimalist",
  },
  {
    id: "midnight-sapphire" as const,
    name: "Midnight Sapphire",
    subtitle: "Imperial Navy + Platinum",
    accent: "#60a5fa",
    bg: "#0b1226",
    innerBorder: "rgba(96, 165, 250, 0.4)",
    text: "#ffffff",
    subtext: "#94a3b8",
    ribbonBg: "bg-gradient-to-r from-blue-600 via-indigo-400 to-blue-600 text-white",
    swatch: "bg-blue-950 border-amber-400 text-amber-300",
    badge: "Corporate",
  },
];

type LuxuryThemeId = (typeof LUXURY_THEMES)[number]["id"];

export default function PrintStudioClient({
  business,
  reviewUrl,
  agentMode = false,
  merchantInfo,
}: PrintStudioProps) {
  const [format, setFormat] = useState<"stand" | "pvc-vertical" | "poster-a4">("stand");
  const [pvcSide, setPvcSide] = useState<"front" | "back">("front");
  const [pvcBackMode, setPvcBackMode] = useState<"guide" | "staff" | "dual-upi">("guide");
  const [staffName, setStaffName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [showLanyardSlot, setShowLanyardSlot] = useState(false);
  const [luxuryTheme, setLuxuryTheme] = useState<LuxuryThemeId>("royal-gold");
  const [logoUrl, setLogoUrl] = useState<string | null>(business.logoUrl || null);
  const [logoStyle, setLogoStyle] = useState<"auto" | "badge" | "banner">("auto");
  const [logoPlate, setLogoPlate] = useState<"white" | "frost" | "none">("white");
  const [calloutTitle, setCalloutTitle] = useState("Scan to Review Us on Google");
  const [calloutSubtitle, setCalloutSubtitle] = useState("Takes only 5 seconds · AI generated reviews");
  const [showCropMarks, setShowCropMarks] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [upiQrDataUrl, setUpiQrDataUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const activeTheme = LUXURY_THEMES.find((t) => t.id === luxuryTheme) || LUXURY_THEMES[0];

  const activeReviewUrl =
    format === "pvc-vertical" && staffName.trim()
      ? `${reviewUrl}${reviewUrl.includes("?") ? "&" : "?"}staff=${encodeURIComponent(staffName.trim())}`
      : reviewUrl;

  const upiPhone = business.phone || business.whatsapp || "8639831132";
  const upiUrl = `upi://pay?pa=${upiPhone}@ybl&pn=${encodeURIComponent(business.name)}&cu=INR`;

  useEffect(() => {
    QRCode.toDataURL(activeReviewUrl, {
      width: 900,
      margin: 2,
      color: {
        dark: "#0b0f19",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    }).then(setQrDataUrl);

    QRCode.toDataURL(upiUrl, {
      width: 900,
      margin: 2,
      color: {
        dark: "#0b0f19",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    }).then(setUpiQrDataUrl);
  }, [activeReviewUrl, upiUrl]);

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
    } else if (format === "pvc-vertical") {
      printElement(
        "print-target",
        `${business.name} - Vertical PVC Card (${pvcSide === "front" ? "Front" : "Back"})`,
        "@page { size: 2.125in 3.375in; margin: 0; }"
      );
    } else {
      printElement(
        "print-target",
        `${business.name} - A4 Wall Poster (${activeTheme.name})`,
        "@page { size: A4 portrait; margin: 10mm; }"
      );
    }
  };

  const handleCopyReviewUrl = async () => {
    await copyToClipboard(activeReviewUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Helper to draw step box on back of vertical PVC card canvas
  const drawStepBox = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    stepNum: string,
    title: string,
    desc: string,
    accentColor: string,
    innerBorderColor: string,
    textColor: string,
    subtextColor: string
  ) => {
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.beginPath();
    ctx.roundRect(x, y, 485, 105, 16);
    ctx.fill();
    ctx.strokeStyle = innerBorderColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.roundRect(x + 18, y + 22, 50, 60, 12);
    ctx.fill();

    ctx.fillStyle = "#0b0f19";
    ctx.font = "900 28px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(stepNum, x + 43, y + 52);

    ctx.textAlign = "left";
    ctx.fillStyle = textColor;
    ctx.font = "bold 19px -apple-system, sans-serif";
    ctx.fillText(title, x + 85, y + 42);

    ctx.fillStyle = subtextColor;
    ctx.font = "15px -apple-system, sans-serif";
    ctx.fillText(desc, x + 85, y + 70);
    ctx.textBaseline = "alphabetic";
  };

  // Adaptive Logo Canvas Drawing Helper
  const drawAdaptiveLogoOnCanvas = async (
    ctx: CanvasRenderingContext2D,
    url: string | null,
    storeName: string,
    centerX: number,
    centerY: number,
    maxW: number,
    maxH: number,
    style: "auto" | "badge" | "banner",
    plate: "white" | "frost" | "none",
    accentColor: string
  ) => {
    if (!url) {
      // Fallback Initials Badge
      const radius = Math.min(maxW, maxH) / 2;
      ctx.fillStyle = plate === "none" ? "rgba(255,255,255,0.1)" : "#ffffff";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = "#d97706";
      ctx.font = `900 ${Math.round(radius * 0.7)}px -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(storeName.slice(0, 2).toUpperCase() || "RS", centerX, centerY);
      return;
    }

    try {
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        logoImg.onload = resolve;
        logoImg.onerror = reject;
        logoImg.src = url;
      });

      const aspect = logoImg.width / logoImg.height;
      const isWide = style === "banner" || (style === "auto" && aspect > 1.25);

      if (isWide) {
        let drawW = Math.min(maxW, maxH * aspect);
        let drawH = drawW / aspect;
        if (drawH > maxH) {
          drawH = maxH;
          drawW = drawH * aspect;
        }

        // Draw background plate capsule
        if (plate === "white") {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(centerX - drawW / 2 - 14, centerY - drawH / 2 - 8, drawW + 28, drawH + 16, 16);
          ctx.fill();
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 3;
          ctx.stroke();
        } else if (plate === "frost") {
          ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
          ctx.beginPath();
          ctx.roundRect(centerX - drawW / 2 - 14, centerY - drawH / 2 - 8, drawW + 28, drawH + 16, 16);
          ctx.fill();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.drawImage(logoImg, centerX - drawW / 2, centerY - drawH / 2, drawW, drawH);
      } else {
        const radius = Math.min(maxW, maxH) / 2;

        if (plate === "white") {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius + 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 4;
          ctx.stroke();
        } else if (plate === "frost") {
          ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius + 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.clip();

        let drawW = radius * 2;
        let drawH = radius * 2;
        if (aspect > 1) {
          drawH = drawW / aspect;
        } else {
          drawW = drawH * aspect;
        }
        ctx.drawImage(logoImg, centerX - drawW / 2, centerY - drawH / 2, drawW, drawH);
        ctx.restore();
      }
    } catch (e) {
      console.error("Adaptive logo render error:", e);
    }
  };

  // High Resolution 300 DPI Canvas Exporter (Clean, Unwatermarked for Paid Studio)
  const handleExportHighResPng = async (targetSide?: "front" | "back") => {
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

        // Brand Logo (Adaptive framing)
        await drawAdaptiveLogoOnCanvas(
          ctx,
          logoUrl,
          business.name,
          600,
          260,
          480,
          150,
          logoStyle,
          logoPlate,
          activeTheme.accent
        );

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
        }

        // 3-Step Instruction Pill
        ctx.fillStyle = activeTheme.id === "pearl-gold" ? "#f1f5f9" : "rgba(0, 0, 0, 0.4)";
        ctx.beginPath();
        ctx.roundRect(160, 1160, 880, 72, 36);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = activeTheme.text;
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
      } else if (format === "pvc-vertical") {
        const sideToExport = targetSide || pvcSide;
        // Standard CR80 Vertical: 54mm x 85.6mm with 2mm bleed at 300 DPI = 685 x 1058 px
        canvas.width = 685;
        canvas.height = 1058;

        ctx.fillStyle = activeTheme.bg;
        ctx.fillRect(0, 0, 685, 1058);

        // Outer Metallic Gold Border
        ctx.strokeStyle = activeTheme.accent;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.roundRect(24, 24, 637, 1010, 24);
        ctx.stroke();

        // Inner Delicate Hairline Border
        ctx.strokeStyle = activeTheme.innerBorder;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(38, 38, 609, 982, 16);
        ctx.stroke();

        // Corner Filigree Brackets
        ctx.font = "bold 28px Georgia, serif";
        ctx.fillStyle = activeTheme.accent;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("┌", 54, 54);
        ctx.fillText("┐", 631, 54);
        ctx.fillText("└", 54, 1004);
        ctx.fillText("┘", 631, 1004);

        // Optional Lanyard Slot Cutout Guide
        if (showLanyardSlot) {
          ctx.fillStyle = "#1e293b";
          ctx.strokeStyle = "#64748b";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(282, 48, 120, 28, 14);
          ctx.fill();
          ctx.stroke();
        }

        if (sideToExport === "front") {
          // Top Ribbon Badge
          const ribbonText = staffName.trim()
            ? `★ ASSISTED BY ${staffName.trim().toUpperCase()} ★`
            : "★ 5.0 GOOGLE EXCELLENCE ★";
          const ribbonGrad = ctx.createLinearGradient(160, 95, 525, 95);
          ribbonGrad.addColorStop(0, "#d97706");
          ribbonGrad.addColorStop(0.5, "#fbbf24");
          ribbonGrad.addColorStop(1, "#d97706");
          ctx.fillStyle = ribbonGrad;
          ctx.beginPath();
          ctx.roundRect(160, 95, 365, 46, 23);
          ctx.fill();

          ctx.fillStyle = "#0b0f19";
          ctx.font = "bold 17px -apple-system, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(ribbonText, 342, 118);

          // Brand Logo (Adaptive framing)
          await drawAdaptiveLogoOnCanvas(
            ctx,
            logoUrl,
            business.name,
            342,
            195,
            300,
            84,
            logoStyle,
            logoPlate,
            activeTheme.accent
          );

          // Business Name
          ctx.fillStyle = activeTheme.text;
          ctx.font = "900 28px -apple-system, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "alphabetic";
          ctx.fillText(business.name, 342, 275);

          // 5-Star Rating
          ctx.fillStyle = "#fbbf24";
          ctx.font = "bold 24px sans-serif";
          ctx.fillText("★★★★★", 342, 312);

          // Dynamic QR Code Container
          if (qrDataUrl) {
            const qrImg = new Image();
            await new Promise((resolve) => {
              qrImg.onload = resolve;
              qrImg.src = qrDataUrl;
            });

            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.roundRect(167, 345, 350, 350, 24);
            ctx.fill();
            ctx.strokeStyle = activeTheme.accent;
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.drawImage(qrImg, 187, 365, 310, 310);
          }

          // Callout Title & Subtitle
          ctx.fillStyle = activeTheme.text;
          ctx.font = "bold 26px -apple-system, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("Scan QR to Review Us", 342, 750);

          ctx.fillStyle = activeTheme.subtext;
          ctx.font = "19px -apple-system, sans-serif";
          ctx.fillText("Instant 30-sec AI Review on Google", 342, 788);

          // Subtitle pill
          ctx.fillStyle = activeTheme.accent;
          ctx.font = "bold 20px -apple-system, sans-serif";
          ctx.fillText("✨ AI Review Assistant Ready", 342, 855);

          // Micro Authenticity Footer
          ctx.fillStyle = activeTheme.subtext;
          ctx.font = "bold 16px -apple-system, sans-serif";
          ctx.fillText("✨ ReviewSmart AI • Smart Business Card", 342, 980);
        } else {
          // BACK SIDE
          if (pvcBackMode === "guide") {
            ctx.fillStyle = activeTheme.accent;
            ctx.font = "bold 26px -apple-system, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("How to Review in 30 Secs", 342, 130);

            ctx.fillStyle = activeTheme.subtext;
            ctx.font = "18px -apple-system, sans-serif";
            ctx.fillText("Fast, authentic & automated", 342, 165);

            drawStepBox(ctx, 100, 215, "1", "📷 Scan QR with Camera", "Point phone camera at QR code", activeTheme.accent, activeTheme.innerBorder, activeTheme.text, activeTheme.subtext);
            drawStepBox(ctx, 100, 350, "2", "⭐ Tap 5 Stars & Compliments", "ReviewSmart AI generates genuine draft", activeTheme.accent, activeTheme.innerBorder, activeTheme.text, activeTheme.subtext);
            drawStepBox(ctx, 100, 485, "3", "📋 Tap Copy & Post on Google", "Review fills in clipboard automatically", activeTheme.accent, activeTheme.innerBorder, activeTheme.text, activeTheme.subtext);

            ctx.fillStyle = activeTheme.text;
            ctx.font = "bold 20px -apple-system, sans-serif";
            ctx.fillText(business.name, 342, 720);

            ctx.fillStyle = activeTheme.subtext;
            ctx.font = "16px -apple-system, sans-serif";
            ctx.fillText(business.googleAddress || "Kadapa • Bengaluru", 342, 755);

            if (business.phone) {
              ctx.fillText(`Phone: ${business.phone}`, 342, 785);
            }

            ctx.fillStyle = activeTheme.accent;
            ctx.font = "bold 18px -apple-system, sans-serif";
            ctx.fillText("✨ Official ReviewSmart Partner Card", 342, 980);
          } else if (pvcBackMode === "staff") {
            ctx.fillStyle = activeTheme.accent;
            ctx.font = "bold 26px -apple-system, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("★ OFFICIAL SERVICE BADGE ★", 342, 130);

            ctx.fillStyle = activeTheme.text;
            ctx.font = "bold 22px -apple-system, sans-serif";
            ctx.fillText(business.name, 342, 170);

            // Avatar Circle
            ctx.beginPath();
            ctx.arc(342, 270, 60, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
            ctx.strokeStyle = activeTheme.accent;
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.fillStyle = "#0f172a";
            ctx.font = "bold 56px -apple-system, sans-serif";
            ctx.textBaseline = "middle";
            ctx.fillText("👤", 342, 270);
            ctx.textBaseline = "alphabetic";

            ctx.fillStyle = activeTheme.text;
            ctx.font = "900 36px -apple-system, sans-serif";
            ctx.fillText(staffName.trim() || "Team Member", 342, 385);

            ctx.fillStyle = activeTheme.accent;
            ctx.font = "bold 22px -apple-system, sans-serif";
            ctx.fillText(staffId.trim() || "Official Service Staff", 342, 425);

            // Quote Box
            ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
            ctx.beginPath();
            ctx.roundRect(80, 480, 525, 210, 20);
            ctx.fill();
            ctx.strokeStyle = activeTheme.innerBorder;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = activeTheme.text;
            ctx.font = "bold 22px -apple-system, sans-serif";
            ctx.fillText("“Loved our service today?", 342, 535);
            ctx.fillText("Please scan my badge with your camera", 342, 575);
            ctx.fillText("to leave a 5-star Google review!”", 342, 615);

            ctx.fillStyle = "#fbbf24";
            ctx.font = "bold 24px sans-serif";
            ctx.fillText("★★★★★", 342, 665);

            ctx.fillStyle = activeTheme.subtext;
            ctx.font = "18px -apple-system, sans-serif";
            ctx.fillText(business.phone ? `Direct Line: ${business.phone}` : "Customer Satisfaction Guaranteed", 342, 790);

            ctx.fillStyle = activeTheme.accent;
            ctx.font = "bold 18px -apple-system, sans-serif";
            ctx.fillText("✨ ReviewSmart AI Staff Edition", 342, 980);
          } else {
            // dual-upi
            ctx.fillStyle = activeTheme.accent;
            ctx.font = "bold 28px -apple-system, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("★ SCAN TO PAY & REVIEW ★", 342, 125);

            ctx.fillStyle = activeTheme.text;
            ctx.font = "bold 20px -apple-system, sans-serif";
            ctx.fillText(business.name, 342, 160);

            // Left: UPI QR
            if (upiQrDataUrl) {
              const upiImg = new Image();
              await new Promise((resolve) => {
                upiImg.onload = resolve;
                upiImg.src = upiQrDataUrl;
              });

              ctx.fillStyle = "#ffffff";
              ctx.beginPath();
              ctx.roundRect(75, 200, 240, 240, 16);
              ctx.fill();
              ctx.strokeStyle = activeTheme.accent;
              ctx.lineWidth = 3;
              ctx.stroke();

              ctx.drawImage(upiImg, 87, 212, 216, 216);

              ctx.fillStyle = activeTheme.text;
              ctx.font = "bold 18px -apple-system, sans-serif";
              ctx.fillText("₹ Pay with UPI", 195, 475);
              ctx.fillStyle = activeTheme.subtext;
              ctx.font = "14px -apple-system, sans-serif";
              ctx.fillText("Any UPI App", 195, 502);
            }

            // Right: Review QR
            if (qrDataUrl) {
              const qrImg = new Image();
              await new Promise((resolve) => {
                qrImg.onload = resolve;
                qrImg.src = qrDataUrl;
              });

              ctx.fillStyle = "#ffffff";
              ctx.beginPath();
              ctx.roundRect(370, 200, 240, 240, 16);
              ctx.fill();
              ctx.strokeStyle = activeTheme.accent;
              ctx.lineWidth = 3;
              ctx.stroke();

              ctx.drawImage(qrImg, 382, 212, 216, 216);

              ctx.fillStyle = activeTheme.text;
              ctx.font = "bold 18px -apple-system, sans-serif";
              ctx.fillText("⭐ Rate on Google", 490, 475);
              ctx.fillStyle = activeTheme.subtext;
              ctx.font = "14px -apple-system, sans-serif";
              ctx.fillText("5-Star AI Review", 490, 502);
            }

            // Fast checkout banner
            ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
            ctx.beginPath();
            ctx.roundRect(75, 545, 535, 120, 16);
            ctx.fill();
            ctx.strokeStyle = activeTheme.innerBorder;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = activeTheme.text;
            ctx.font = "bold 20px -apple-system, sans-serif";
            ctx.fillText("Instant Billing & 5-Star Feedback", 342, 595);
            ctx.fillStyle = activeTheme.accent;
            ctx.font = "bold 16px -apple-system, sans-serif";
            ctx.fillText("Fast • 100% Secure • Contactless", 342, 630);

            ctx.fillStyle = activeTheme.subtext;
            ctx.font = "16px -apple-system, sans-serif";
            ctx.fillText(business.googleAddress || "Kadapa • Bengaluru", 342, 740);

            ctx.fillStyle = activeTheme.accent;
            ctx.font = "bold 18px -apple-system, sans-serif";
            ctx.fillText("✨ ReviewSmart AI Dual Counter Card", 342, 980);
          }
        }
      } else {
        // A4 Wall Poster: 210mm x 297mm at 300 DPI = 2480 x 3508 px
        canvas.width = 2480;
        canvas.height = 3508;

        // Background
        ctx.fillStyle = activeTheme.bg;
        ctx.fillRect(0, 0, 2480, 3508);

        // Outer Metallic Gold Border
        ctx.strokeStyle = activeTheme.accent;
        ctx.lineWidth = 16;
        ctx.beginPath();
        ctx.roundRect(80, 80, 2320, 3348, 48);
        ctx.stroke();

        // Inner Delicate Hairline Border
        ctx.strokeStyle = activeTheme.innerBorder;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(110, 110, 2260, 3288, 36);
        ctx.stroke();

        // Corner Filigree Brackets
        ctx.font = "bold 72px Georgia, serif";
        ctx.fillStyle = activeTheme.accent;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("┌", 160, 160);
        ctx.fillText("┐", 2320, 160);
        ctx.fillText("└", 160, 3348);
        ctx.fillText("┘", 2320, 3348);

        // Top Luxury Award Ribbon Badge
        const ribbonGrad = ctx.createLinearGradient(640, 180, 1840, 180);
        ribbonGrad.addColorStop(0, "#d97706");
        ribbonGrad.addColorStop(0.5, "#fbbf24");
        ribbonGrad.addColorStop(1, "#d97706");
        ctx.fillStyle = ribbonGrad;
        ctx.beginPath();
        ctx.roundRect(640, 180, 1200, 100, 50);
        ctx.fill();

        ctx.fillStyle = "#0b0f19";
        ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("★ 5.0 GOOGLE EXCELLENCE AWARD ★", 1240, 230);

        // Brand Logo (Adaptive framing)
        await drawAdaptiveLogoOnCanvas(
          ctx,
          logoUrl,
          business.name,
          1240,
          480,
          900,
          240,
          logoStyle,
          logoPlate,
          activeTheme.accent
        );

        // Business Name
        ctx.fillStyle = activeTheme.text;
        ctx.font = "900 96px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(business.name, 1240, 780);

        // Branch Locality Address
        if (business.googleAddress) {
          ctx.fillStyle = activeTheme.subtext;
          ctx.font = "600 48px -apple-system, BlinkMacSystemFont, sans-serif";
          ctx.fillText(`📍 ${business.googleAddress}`, 1240, 860);
        }

        // Star Rating & Badge
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 64px sans-serif";
        ctx.fillText("★★★★★  5.0 on Google Maps", 1240, 960);

        // Giant Center QR Code
        if (qrDataUrl) {
          const qrImg = new Image();
          await new Promise((resolve) => {
            qrImg.onload = resolve;
            qrImg.src = qrDataUrl;
          });

          // QR White Container
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(590, 1060, 1300, 1300, 56);
          ctx.fill();

          // Gold Frame
          ctx.strokeStyle = activeTheme.accent;
          ctx.lineWidth = 14;
          ctx.stroke();

          // Draw QR
          ctx.drawImage(qrImg, 650, 1120, 1180, 1180);
        }

        // Callout Title
        ctx.fillStyle = activeTheme.text;
        ctx.font = "900 84px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(calloutTitle, 1240, 2520);

        // Subtitle
        ctx.fillStyle = activeTheme.subtext;
        ctx.font = "500 52px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.fillText(calloutSubtitle, 1240, 2620);

        // 3-Step Instruction Pill
        ctx.fillStyle = activeTheme.id === "pearl-gold" ? "#f1f5f9" : "rgba(0, 0, 0, 0.4)";
        ctx.beginPath();
        ctx.roundRect(240, 2720, 2000, 130, 65);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = activeTheme.text;
        ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("① Scan with Phone Camera  •  ② Pick Instant AI Compliments  •  ③ Post in 5 Sec", 1240, 2785);

        // Verified Partner Footer
        ctx.fillStyle = activeTheme.accent;
        ctx.font = "bold 46px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.fillText("✨ ReviewSmart AI • Verified Google Partner", 1240, 3280);

        if (showCropMarks) {
          ctx.strokeStyle = "#94a3b8";
          ctx.lineWidth = 4;
          ctx.setLineDash([20, 20]);
          ctx.strokeRect(40, 40, 2400, 3428);
        }
      }

      const sideSuffix = format === "pvc-vertical" ? `-${targetSide || pvcSide}` : "";
      const link = document.createElement("a");
      link.download = `${business.slug}-${format}${sideSuffix}-${luxuryTheme}-300dpi.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Export error:", e);
    } finally {
      setIsExporting(false);
    }
  };

  const shareRecipientPhone = merchantInfo?.phone || business.phone || business.whatsapp || "";
  const dispatchMessage = `Namaste ${merchantInfo?.name || business.name}! 🙏

Here is your official Google Review QR Display Kit prepared by ReviewSmart AI:

✨ Live Customer Review Portal:
${reviewUrl}

📁 Available Physical Formats:
1. 4"×6" Acrylic Counter Standee (${activeTheme.name})
2. Vertical PVC Staff & Counter Card
3. A4 Printable Wall / Door Poster

All high-resolution 300 DPI files are ready. Print on A4 paper or let us know if you would like physical acrylic countertop stands delivered to your store!`;

  const waShareUrl = `https://wa.me/91${shareRecipientPhone.replace(/\D/g, "")}?text=${encodeURIComponent(dispatchMessage)}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Controls Column (Left) - Hidden on Print */}
      <div className="lg:col-span-5 space-y-4 no-print">
        {/* Agent Mode Header Banner if active */}
        {agentMode && (
          <div className="p-3.5 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-indigo-200">Marketing Agent Workspace</div>
                <div className="text-[10px] text-slate-300">Customizing for: {business.name}</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
              Agent Access
            </span>
          </div>
        )}

        {/* Format Selector (3 Practical Physical Formats) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm space-y-3">
          <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              Display Template Formats
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {format === "stand" ? "Flipkart A6 Ready" : format === "pvc-vertical" ? "CR80 Standard" : "A4 Print Ready"}
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
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">4" x 6" Counter</div>
            </button>

            <button
              type="button"
              onClick={() => setFormat("pvc-vertical")}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                format === "pvc-vertical"
                  ? "border-amber-500 bg-amber-50/80 text-amber-900 font-bold shadow-sm"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="text-xs">Vertical PVC</div>
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">PAN Card Size</div>
            </button>

            <button
              type="button"
              onClick={() => setFormat("poster-a4")}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                format === "poster-a4"
                  ? "border-amber-500 bg-amber-50/80 text-amber-900 font-bold shadow-sm"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="text-xs">A4 Wall Poster</div>
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">Wall &amp; Door</div>
            </button>
          </div>
        </div>

        {/* 4 Luxury Themes Selector */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-500" />
              4 Luxury Metallic Themes
            </label>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {format === "stand" ? '4"×6" Standee' : format === "pvc-vertical" ? "CR80 54×85.6mm" : "A4 210×297mm"}
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

        {/* PVC Card Specific Options */}
        {format === "pvc-vertical" && (
          <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-amber-500" />
                Vertical PVC Card Options
              </label>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                CR80 54×85.6mm
              </span>
            </div>

            {/* Front / Back Toggle Buttons */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Active Card View (Click card preview to flip)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPvcSide("front")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    pvcSide === "front"
                      ? "border-amber-500 bg-amber-50 text-amber-900 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>Front Side (Brand &amp; QR)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPvcSide("back")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    pvcSide === "back"
                      ? "border-amber-500 bg-amber-50 text-amber-900 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Back Side ({pvcBackMode === "guide" ? "Guide" : pvcBackMode === "staff" ? "Staff" : "UPI"})</span>
                </button>
              </div>
            </div>

            {/* Back Side Mode Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Back Side Configuration Mode
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setPvcBackMode("guide");
                    setPvcSide("back");
                  }}
                  className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                    pvcBackMode === "guide"
                      ? "border-indigo-500 bg-indigo-50/80 text-indigo-950 font-bold ring-1 ring-indigo-400"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 mb-0.5 text-indigo-600" />
                  <span className="text-[11px]">3-Step Guide</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPvcBackMode("staff");
                    setPvcSide("back");
                  }}
                  className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                    pvcBackMode === "staff"
                      ? "border-indigo-500 bg-indigo-50/80 text-indigo-950 font-bold ring-1 ring-indigo-400"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 mb-0.5 text-indigo-600" />
                  <span className="text-[11px]">Staff Badge</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPvcBackMode("dual-upi");
                    setPvcSide("back");
                  }}
                  className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                    pvcBackMode === "dual-upi"
                      ? "border-indigo-500 bg-indigo-50/80 text-indigo-950 font-bold ring-1 ring-indigo-400"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <IndianRupee className="w-3.5 h-3.5 mb-0.5 text-indigo-600" />
                  <span className="text-[11px]">Pay &amp; Review</span>
                </button>
              </div>
            </div>

            {/* Staff Attribution Inputs */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Staff Member Attribution
                </span>
                {staffName && (
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Live in QR
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500">
                Attaches to QR &amp; automatically credits this staff member in AI-generated review drafts.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Staff Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul / Priya"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Staff ID / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Stylist"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Lanyard Hole Guide Option */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-slate-400" />
                Show top lanyard hole / slot guide
              </span>
              <input
                type="checkbox"
                checked={showLanyardSlot}
                onChange={(e) => setShowLanyardSlot(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[10px] text-slate-500">
              💡 Standard CR80 PAN Card size (54mm × 85.6mm) — Print using standard ID card printers or PVC card fabricators.
            </div>
          </div>
        )}

        {/* Adaptive Merchant Logo & Details */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-indigo-600" />
            Adaptive Logo &amp; Brand Framing
          </label>

          {/* Logo Uploader / Switcher */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl border-2 border-amber-400 bg-white flex items-center justify-center p-1 shadow-sm overflow-hidden flex-shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
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
                Preserves transparent PNGs &amp; original aspect ratio.
              </p>
            </div>
          </div>

          {/* Flexible Logo Style Switcher */}
          <div className="space-y-2 pt-1">
            <label className="block text-[10px] font-bold text-slate-700">
              Logo Framing Layout
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setLogoStyle("auto")}
                className={`py-1.5 px-2 rounded-xl border text-center transition ${
                  logoStyle === "auto"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-950 font-bold"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50 text-[10px]"
                }`}
              >
                <div className="text-[10px]">Auto-Fit</div>
                <div className="text-[8px] text-slate-400">Aspect-Safe</div>
              </button>

              <button
                type="button"
                onClick={() => setLogoStyle("badge")}
                className={`py-1.5 px-2 rounded-xl border text-center transition ${
                  logoStyle === "badge"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-950 font-bold"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50 text-[10px]"
                }`}
              >
                <div className="text-[10px]">Badge / Crest</div>
                <div className="text-[8px] text-slate-400">Square/Circle</div>
              </button>

              <button
                type="button"
                onClick={() => setLogoStyle("banner")}
                className={`py-1.5 px-2 rounded-xl border text-center transition ${
                  logoStyle === "banner"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-950 font-bold"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50 text-[10px]"
                }`}
              >
                <div className="text-[10px]">Wide Banner</div>
                <div className="text-[8px] text-slate-400">Typography</div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-600 font-medium">Logo Contrast Shield:</span>
              <div className="flex gap-1">
                {(["white", "frost", "none"] as const).map((plate) => (
                  <button
                    key={plate}
                    type="button"
                    onClick={() => setLogoPlate(plate)}
                    className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border transition ${
                      logoPlate === plate
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {plate === "white" ? "Solid White" : plate === "frost" ? "Frosted Glass" : "Transparent"}
                  </button>
                ))}
              </div>
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
              {format === "stand"
                ? 'Show 4"×6" trim / fold guidelines'
                : format === "pvc-vertical"
                ? "Show CR80 card bleed cutline"
                : "Show A4 10mm print margin"}
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
              {format === "stand"
                ? 'Print / Save as PDF (4"×6" Flipkart A6)'
                : format === "pvc-vertical"
                ? `Print PVC Card (${pvcSide === "front" ? "Front Side" : "Back Side"})`
                : "Print / Save as PDF (A4 Poster 210×297mm)"}
            </button>

            {format === "pvc-vertical" ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleExportHighResPng("front")}
                  disabled={isExporting}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  {isExporting ? "Exporting..." : "Front (300 DPI)"}
                </button>
                <button
                  type="button"
                  onClick={() => handleExportHighResPng("back")}
                  disabled={isExporting}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  {isExporting ? "Exporting..." : "Back (300 DPI)"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleExportHighResPng()}
                disabled={isExporting}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-amber-400" />
                {isExporting
                  ? "Generating 300 DPI Export..."
                  : `Download ${activeTheme.name} ${format === "stand" ? "Stand" : "Poster"} PNG (300 DPI)`}
              </button>
            )}

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

        {/* WhatsApp Dispatch & Share Suite */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 rounded-3xl text-white shadow-sm space-y-3 border border-indigo-950">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Share2 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold">1-Click WhatsApp Delivery</h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Direct to Merchant
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            Dispatch the live review portal link and ready-to-print kit instructions directly to the merchant via WhatsApp.
          </p>

          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
              Live Review Portal Link:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={activeReviewUrl}
                className="w-full text-[11px] font-mono p-2 rounded-lg bg-white/10 border border-white/20 text-indigo-100 truncate"
              />
              <button
                type="button"
                onClick={handleCopyReviewUrl}
                className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition flex-shrink-0"
                title="Copy Link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="pt-1">
            <a
              href={waShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Share Design Kit on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Live Preview Area (Right) */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-200/50 p-4 sm:p-10 rounded-3xl border border-slate-200 min-h-[620px] relative overflow-hidden">
        {/* Acrylic Stand Preview (4" x 6") */}
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
            <div className="flex flex-col items-center mt-1 z-10 w-full px-4">
              {/* Adaptive Logo */}
              {logoUrl ? (
                <div
                  className={`p-1.5 flex items-center justify-center mb-1 overflow-hidden transition-all ${
                    logoStyle === "banner"
                      ? "w-40 h-11 rounded-xl"
                      : "w-14 h-14 rounded-full"
                  } ${
                    logoPlate === "white"
                      ? "bg-white border-2 border-amber-400 shadow-sm"
                      : logoPlate === "frost"
                      ? "bg-white/15 border border-white/30 backdrop-blur-sm"
                      : ""
                  }`}
                >
                  <img
                    src={logoUrl}
                    alt={business.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full border-2 border-amber-400 bg-white flex items-center justify-center p-1 shadow-md mb-1 overflow-hidden">
                  <span className="text-lg font-black text-amber-600">
                    {business.name.slice(0, 2).toUpperCase() || "RS"}
                  </span>
                </div>
              )}

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

        {/* Vertical PVC Card (CR80 PAN Card Standard Size: 54mm x 85.6mm) */}
        {format === "pvc-vertical" && (
          <div className="flex flex-col items-center">
            {/* 3D Flip Card Container */}
            <div
              className="relative cursor-pointer select-none"
              style={{
                perspective: "1200px",
                width: "290px",
                height: "460px",
              }}
              onClick={() => setPvcSide(pvcSide === "front" ? "back" : "front")}
              title="Click card to flip side"
            >
              <div
                className="w-full h-full relative transition-transform duration-700"
                style={{
                  transformStyle: "preserve-3d",
                  transform: pvcSide === "back" ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* FRONT SIDE FACE */}
                <div
                  id={pvcSide === "front" ? "print-target" : undefined}
                  className="absolute inset-0 rounded-2xl p-5 flex flex-col items-center text-center justify-between border-2 shadow-2xl overflow-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    backgroundColor: activeTheme.bg,
                    borderColor: activeTheme.accent,
                    boxShadow: "0 20px 35px -10px rgba(0, 0, 0, 0.45)",
                  }}
                >
                  {/* Inner Hairline Gold Border */}
                  <div
                    className="absolute inset-2 rounded-xl border pointer-events-none"
                    style={{ borderColor: activeTheme.innerBorder }}
                  />

                  {/* Corner Filigree Brackets */}
                  <div className="absolute top-2.5 left-2.5 text-amber-400 font-serif text-[11px] pointer-events-none">┌</div>
                  <div className="absolute top-2.5 right-2.5 text-amber-400 font-serif text-[11px] pointer-events-none">┐</div>
                  <div className="absolute bottom-2.5 left-2.5 text-amber-400 font-serif text-[11px] pointer-events-none">└</div>
                  <div className="absolute bottom-2.5 right-2.5 text-amber-400 font-serif text-[11px] pointer-events-none">┘</div>

                  {/* Optional Lanyard Hole Slot Guide */}
                  {showLanyardSlot && (
                    <div className="w-12 h-2.5 rounded-full border-2 border-dashed border-amber-400/70 bg-black/40 text-[7px] text-amber-300 font-mono flex items-center justify-center z-20 -mt-1">
                      SLOT
                    </div>
                  )}

                  {/* Top Luxury Ribbon Badge */}
                  <div className={`px-3 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase shadow-md ${activeTheme.ribbonBg} flex items-center gap-1 z-10 ${showLanyardSlot ? "mt-0.5" : "mt-1"}`}>
                    <Award className="w-3 h-3" />
                    <span>5.0 Excellence Award</span>
                  </div>

                  {/* Store Info */}
                  <div className="flex flex-col items-center z-10 -mt-1 w-full px-2">
                    {/* Adaptive Logo */}
                    {logoUrl ? (
                      <div
                        className={`p-1 flex items-center justify-center mb-1 overflow-hidden transition-all ${
                          logoStyle === "banner"
                            ? "w-32 h-9 rounded-lg"
                            : "w-11 h-11 rounded-full"
                        } ${
                          logoPlate === "white"
                            ? "bg-white border-2 border-amber-400 shadow-sm"
                            : logoPlate === "frost"
                            ? "bg-white/15 border border-white/30 backdrop-blur-sm"
                            : ""
                        }`}
                      >
                        <img
                          src={logoUrl}
                          alt={business.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-full border-2 border-amber-400 bg-white flex items-center justify-center p-0.5 shadow-md mb-1 overflow-hidden">
                        <span className="text-xs font-black text-amber-600">
                          {business.name.slice(0, 2).toUpperCase() || "RS"}
                        </span>
                      </div>
                    )}

                    <h2
                      className="text-xs font-black tracking-tight leading-tight max-w-[240px] truncate"
                      style={{ color: activeTheme.text }}
                    >
                      {business.name}
                    </h2>

                    {business.googleAddress && (
                      <p
                        className="text-[9px] truncate max-w-[220px] font-medium"
                        style={{ color: activeTheme.subtext }}
                      >
                        📍 {business.googleAddress}
                      </p>
                    )}

                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span
                        className="text-[9px] font-bold"
                        style={{ color: activeTheme.text }}
                      >
                        5.0 on Google
                      </span>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="p-2 bg-white rounded-xl relative z-10 border-2 border-amber-400 shadow-lg">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Review QR Code"
                        className="w-28 h-28 object-contain"
                      />
                    ) : (
                      <div className="w-28 h-28 bg-slate-100 animate-pulse rounded-lg" />
                    )}
                  </div>

                  {/* Staff Attribution Pill if entered */}
                  {staffName ? (
                    <div className="w-full py-1 px-2 rounded-lg bg-amber-400/20 border border-amber-400/40 text-[9px] font-bold text-amber-300 truncate z-10">
                      Assisted by: {staffName} {staffId ? `(${staffId})` : ""}
                    </div>
                  ) : (
                    <div
                      className="w-full py-1 px-2 rounded-lg bg-black/25 border border-white/10 text-[8.5px] font-bold z-10 truncate"
                      style={{ color: activeTheme.subtext }}
                    >
                      Scan QR with Camera to Review in 5 Sec
                    </div>
                  )}

                  {/* Footer */}
                  <div className="space-y-0.5 z-10">
                    <p
                      className="text-[9px] font-bold tracking-tight"
                      style={{ color: activeTheme.text }}
                    >
                      {calloutTitle}
                    </p>
                    <div className="text-[8px] font-bold text-amber-400 flex items-center justify-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      <span>ReviewSmart AI • Verified Partner</span>
                    </div>
                  </div>
                </div>

                {/* BACK SIDE FACE */}
                <div
                  id={pvcSide === "back" ? "print-target" : undefined}
                  className="absolute inset-0 rounded-2xl p-5 flex flex-col items-center text-center justify-between border-2 shadow-2xl overflow-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    backgroundColor: activeTheme.bg,
                    borderColor: activeTheme.accent,
                    boxShadow: "0 20px 35px -10px rgba(0, 0, 0, 0.45)",
                  }}
                >
                  {/* Inner Hairline Gold Border */}
                  <div
                    className="absolute inset-2 rounded-xl border pointer-events-none"
                    style={{ borderColor: activeTheme.innerBorder }}
                  />

                  {/* Corner Filigree Brackets */}
                  <div className="absolute top-2.5 left-2.5 text-amber-400 font-serif text-[11px] pointer-events-none">┌</div>
                  <div className="absolute top-2.5 right-2.5 text-amber-400 font-serif text-[11px] pointer-events-none">┐</div>
                  <div className="absolute bottom-2.5 left-2.5 text-amber-400 font-serif text-[11px] pointer-events-none">└</div>
                  <div className="absolute bottom-2.5 right-2.5 text-amber-400 font-serif text-[11px] pointer-events-none">┘</div>

                  {/* Optional Lanyard Hole Slot Guide */}
                  {showLanyardSlot && (
                    <div className="w-12 h-2.5 rounded-full border-2 border-dashed border-amber-400/70 bg-black/40 text-[7px] text-amber-300 font-mono flex items-center justify-center z-20 -mt-1">
                      SLOT
                    </div>
                  )}

                  {/* Back Mode 1: 3-Step Guide */}
                  {pvcBackMode === "guide" && (
                    <div className="flex flex-col justify-between h-full w-full py-1 z-10">
                      <div>
                        <div className="text-[10px] uppercase font-black tracking-wider text-amber-400 mb-0.5">
                          How to Review
                        </div>
                        <h3
                          className="text-xs font-bold leading-tight"
                          style={{ color: activeTheme.text }}
                        >
                          3 Quick &amp; Easy Steps
                        </h3>
                      </div>

                      <div className="space-y-2 my-auto w-full px-1">
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-black/25 border border-white/10 text-left">
                          <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                            1
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-white leading-tight">
                              Scan QR with Camera
                            </div>
                            <div className="text-[8px] text-slate-400">
                              Instant camera scan, zero app needed
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-2 rounded-xl bg-black/25 border border-white/10 text-left">
                          <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                            2
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-white leading-tight">
                              Pick AI Compliments
                            </div>
                            <div className="text-[8px] text-slate-400">
                              Tap 2-3 feedback chips
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-2 rounded-xl bg-black/25 border border-white/10 text-left">
                          <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                            3
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-white leading-tight">
                              Post 5 Stars in 5 Sec
                            </div>
                            <div className="text-[8px] text-slate-400">
                              Auto-opens Google Maps review
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-[8px] font-semibold text-amber-400/90">
                        ⚡ Powered by ReviewSmart AI
                      </div>
                    </div>
                  )}

                  {/* Back Mode 2: Staff Attribution Badge */}
                  {pvcBackMode === "staff" && (
                    <div className="flex flex-col justify-between items-center h-full w-full py-1 z-10 text-center">
                      <div>
                        <div className="text-[9px] uppercase font-black tracking-widest text-amber-400">
                          Staff ID Badge
                        </div>
                        <h3
                          className="text-xs font-black truncate max-w-[220px]"
                          style={{ color: activeTheme.text }}
                        >
                          {business.name}
                        </h3>
                      </div>

                      <div className="flex flex-col items-center my-auto">
                        <div className="w-16 h-16 rounded-full border-2 border-amber-400 bg-black/40 flex items-center justify-center shadow-inner mb-2">
                          <UserCheck className="w-8 h-8 text-amber-400" />
                        </div>
                        <h4 className="text-sm font-black text-white tracking-tight">
                          {staffName || "Staff Member"}
                        </h4>
                        <p className="text-[10px] text-amber-300/90 font-medium">
                          {staffId || "Customer Service Executive"}
                        </p>
                        <div className="mt-2 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[8.5px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Verified Store Staff</span>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-black/30 border border-white/10 w-full text-[8px] text-slate-300">
                        "Your feedback directly supports my recognition and rating!"
                      </div>
                    </div>
                  )}

                  {/* Back Mode 3: Pay & Review (UPI + Google Review) */}
                  {pvcBackMode === "dual-upi" && (
                    <div className="flex flex-col justify-between items-center h-full w-full py-1 z-10 text-center">
                      <div>
                        <div className="text-[9px] uppercase font-black tracking-wider text-amber-400">
                          Contactless Counter
                        </div>
                        <h3
                          className="text-xs font-black truncate max-w-[220px]"
                          style={{ color: activeTheme.text }}
                        >
                          Pay &amp; Review
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-2 my-auto w-full px-1">
                        {/* UPI Payment QR */}
                        <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-amber-400/30">
                          <div className="p-1 bg-white rounded-lg shadow-sm">
                            {upiQrDataUrl ? (
                              <img src={upiQrDataUrl} alt="UPI QR" className="w-20 h-20 object-contain" />
                            ) : (
                              <div className="w-20 h-20 bg-slate-200 animate-pulse rounded" />
                            )}
                          </div>
                          <span className="text-[9px] font-black text-amber-400 mt-1 flex items-center gap-0.5">
                            <IndianRupee className="w-2.5 h-2.5" /> Pay UPI
                          </span>
                          <span className="text-[7.5px] text-slate-400">Any UPI App</span>
                        </div>

                        {/* Review QR */}
                        <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-amber-400/30">
                          <div className="p-1 bg-white rounded-lg shadow-sm">
                            {qrDataUrl ? (
                              <img src={qrDataUrl} alt="Review QR" className="w-20 h-20 object-contain" />
                            ) : (
                              <div className="w-20 h-20 bg-slate-200 animate-pulse rounded" />
                            )}
                          </div>
                          <span className="text-[9px] font-black text-amber-400 mt-1 flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-amber-400" /> Review
                          </span>
                          <span className="text-[7.5px] text-slate-400">Google 5.0</span>
                        </div>
                      </div>

                      <div className="text-[8px] font-semibold text-slate-300">
                        Fast • 100% Secure • Contactless
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Flip Action Controls below Card */}
            <div className="flex items-center gap-2 mt-4 no-print">
              <button
                type="button"
                onClick={() => setPvcSide(pvcSide === "front" ? "back" : "front")}
                className="px-4 py-1.5 rounded-full bg-slate-900 hover:bg-black text-amber-400 text-xs font-bold flex items-center gap-1.5 shadow-md border border-amber-400/30 transition"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Flip to {pvcSide === "front" ? "Back Side" : "Front Side"} (3D)</span>
              </button>
            </div>

            <div className="text-[10px] text-slate-500 font-mono mt-2 text-center no-print">
              CR80 Standard PAN Card Size: 54mm × 85.6mm (2.125" × 3.375")
            </div>
          </div>
        )}

        {/* A4 Printable Wall / Counter / Door Poster (210mm x 297mm) */}
        {format === "poster-a4" && (
          <div
            id="print-target"
            className="rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center justify-between relative transition-all border-[3px] shadow-2xl select-none overflow-hidden"
            style={{
              width: "360px",
              height: "509px",
              backgroundColor: activeTheme.bg,
              borderColor: activeTheme.accent,
              boxShadow: "0 25px 40px -10px rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Inner Hairline Gold Border */}
            <div
              className="absolute inset-3 rounded-2xl border pointer-events-none"
              style={{ borderColor: activeTheme.innerBorder }}
            />

            {/* Corner Filigree Accents */}
            <div className="absolute top-4 left-4 text-amber-400 font-serif text-sm pointer-events-none select-none">┌</div>
            <div className="absolute top-4 right-4 text-amber-400 font-serif text-sm pointer-events-none select-none">┐</div>
            <div className="absolute bottom-4 left-4 text-amber-400 font-serif text-sm pointer-events-none select-none">└</div>
            <div className="absolute bottom-4 right-4 text-amber-400 font-serif text-sm pointer-events-none select-none">┘</div>

            {/* Top Luxury Ribbon Badge */}
            <div className={`px-4 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow-md ${activeTheme.ribbonBg} flex items-center gap-1.5 z-10`}>
              <Award className="w-3.5 h-3.5" />
              <span>★ 5.0 GOOGLE EXCELLENCE AWARD ★</span>
            </div>

            {/* Header: Logo & Store Name */}
            <div className="flex flex-col items-center mt-1 z-10 w-full px-4">
              {/* Adaptive Logo */}
              {logoUrl ? (
                <div
                  className={`p-1.5 flex items-center justify-center mb-1 overflow-hidden transition-all ${
                    logoStyle === "banner"
                      ? "w-44 h-12 rounded-xl"
                      : "w-14 h-14 rounded-full"
                  } ${
                    logoPlate === "white"
                      ? "bg-white border-2 border-amber-400 shadow-sm"
                      : logoPlate === "frost"
                      ? "bg-white/15 border border-white/30 backdrop-blur-sm"
                      : ""
                  }`}
                >
                  <img
                    src={logoUrl}
                    alt={business.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-white flex items-center justify-center p-1 shadow-md mb-1 overflow-hidden">
                  <span className="text-base font-black text-amber-600">
                    {business.name.slice(0, 2).toUpperCase() || "RS"}
                  </span>
                </div>
              )}

              <h2
                className="text-base font-black tracking-tight leading-tight max-w-[280px] truncate"
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

              <div className="flex items-center gap-1 mt-0.5">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span
                  className="text-[11px] font-extrabold ml-1"
                  style={{ color: activeTheme.text }}
                >
                  5.0 on Google Maps
                </span>
              </div>
            </div>

            {/* Centerpiece Giant QR Code */}
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
            </div>

            {/* Micro 3-Step Instruction Guide */}
            <div
              className="w-full px-2 py-1.5 rounded-xl bg-black/20 border border-white/10 text-[9px] font-bold z-10"
              style={{ color: activeTheme.subtext }}
            >
              ① Scan with Any Phone Camera • ② Pick Instant Compliments • ③ Post in 5 Sec
            </div>

            {/* Poster Footer */}
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
                <Scissors className="w-3 h-3" /> Standard A4 (210mm × 297mm) Printable Wall / Door Poster
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-slate-400 mt-8 no-print text-center max-w-sm">
          💡 Click <strong>"Print / Save as PDF"</strong> for direct paper printout, or <strong>"Download 300 DPI"</strong> for ultra high-res print shop files.
        </p>
      </div>
    </div>
  );
}
