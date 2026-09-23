"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Eye,
  CheckCircle2,
  FileText,
} from "lucide-react";
import QRCode from "qrcode";

interface BusinessData {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  logoUrl?: string | null;
  primaryColor?: string;
}

export default function PrintStudioClient({
  business,
  reviewUrl,
}: {
  business: BusinessData;
  reviewUrl: string;
}) {
  const [format, setFormat] = useState<"stand" | "tent" | "nfc">("stand");
  const [qrColor, setQrColor] = useState(business.primaryColor || "#4f46e5");
  const [calloutTitle, setCalloutTitle] = useState("Scan to Review Us on Google");
  const [calloutSubtitle, setCalloutSubtitle] = useState("Tap your phone or scan with camera");
  const [showCropMarks, setShowCropMarks] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedNfc, setCopiedNfc] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(reviewUrl, {
      width: 800,
      margin: 2,
      color: {
        dark: qrColor,
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    }).then(setQrDataUrl);
  }, [reviewUrl, qrColor]);

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
        dark: qrColor,
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
    window.print();
  };

  const handleCopyNfcUrl = async () => {
    await navigator.clipboard.writeText(reviewUrl);
    setCopiedNfc(true);
    setTimeout(() => setCopiedNfc(false), 2500);
  };

  // High Resolution 300 DPI Canvas Exporter for the full stand/card
  const handleExportHighResPng = async () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (format === "stand") {
        // 4" x 6" at 300 DPI = 1200 x 1800 px
        canvas.width = 1200;
        canvas.height = 1800;

        // Background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 1200, 1800);

        // Top Brand Accent Bar
        ctx.fillStyle = qrColor;
        ctx.fillRect(0, 0, 1200, 36);

        // Header Background subtle pill
        ctx.fillStyle = "#f8fafc";
        ctx.beginPath();
        ctx.roundRect(100, 70, 1000, 260, 24);
        ctx.fill();
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Business Logo Initials Badge
        ctx.fillStyle = qrColor;
        ctx.beginPath();
        ctx.roundRect(550, 95, 100, 100, 20);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 44px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(business.name.slice(0, 2).toUpperCase(), 600, 145);

        // Business Name
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 48px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(business.name, 600, 245);

        // Star Rating & Badge
        ctx.fillStyle = "#f59e0b";
        ctx.font = "bold 34px -apple-system, sans-serif";
        ctx.fillText("★★★★★", 530, 295);
        ctx.fillStyle = "#475569";
        ctx.font = "bold 26px -apple-system, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("5.0 on Google", 630, 295);

        // Center QR Code
        if (qrDataUrl) {
          const qrImg = new Image();
          await new Promise((resolve) => {
            qrImg.onload = resolve;
            qrImg.src = qrDataUrl;
          });

          // QR Border Box
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(280, 400, 640, 640, 32);
          ctx.fill();
          ctx.strokeStyle = "#e2e8f0";
          ctx.lineWidth = 6;
          ctx.stroke();

          ctx.drawImage(qrImg, 320, 440, 560, 560);

          // NFC Badge on QR Corner
          ctx.fillStyle = "#0f172a";
          ctx.beginPath();
          ctx.arc(880, 1000, 55, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 8;
          ctx.stroke();
          ctx.fillStyle = "#818cf8";
          ctx.font = "bold 32px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("NFC", 880, 1010);
        }

        // Callout Title
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 52px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(calloutTitle, 600, 1220);

        // Subtitle
        ctx.fillStyle = "#64748b";
        ctx.font = "34px -apple-system, sans-serif";
        ctx.fillText(calloutSubtitle, 600, 1290);

        // Tap Phone Instructions Pill
        ctx.fillStyle = "#e0e7ff";
        ctx.beginPath();
        ctx.roundRect(250, 1370, 700, 100, 50);
        ctx.fill();
        ctx.fillStyle = "#3730a3";
        ctx.font = "bold 30px -apple-system, sans-serif";
        ctx.fillText("📱 Tap phone on card or open camera to scan", 600, 1430);

        // Bottom Footer AI Branding
        ctx.fillStyle = "#4f46e5";
        ctx.font = "bold 26px -apple-system, sans-serif";
        ctx.fillText("✨ Powered by AI Google Review Assistant", 600, 1680);

        // Optional crop border
        if (showCropMarks) {
          ctx.strokeStyle = "#94a3b8";
          ctx.lineWidth = 1;
          ctx.setLineDash([12, 12]);
          ctx.strokeRect(30, 30, 1140, 1740);
        }
      } else if (format === "nfc") {
        // Smart Card CR80: 3.375" x 2.125" at 300 DPI = 1012 x 638 px
        canvas.width = 1012;
        canvas.height = 638;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 1012, 638);

        // Left Brand Stripe
        ctx.fillStyle = qrColor;
        ctx.fillRect(0, 0, 24, 638);

        // Business Name & Stars
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 44px -apple-system, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(business.name, 70, 100);

        ctx.fillStyle = "#f59e0b";
        ctx.font = "bold 28px -apple-system, sans-serif";
        ctx.fillText("★★★★★", 70, 150);
        ctx.fillStyle = "#64748b";
        ctx.font = "bold 22px -apple-system, sans-serif";
        ctx.fillText("Google 5.0 Rating", 180, 150);

        // Callout
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 32px -apple-system, sans-serif";
        ctx.fillText("Tap or Scan to Review", 70, 250);

        ctx.fillStyle = "#64748b";
        ctx.font = "22px -apple-system, sans-serif";
        ctx.fillText("Instant 30-sec AI feedback", 70, 290);

        // NFC contactless icon symbol
        ctx.fillStyle = "#4f46e5";
        ctx.font = "bold 26px -apple-system, sans-serif";
        ctx.fillText("📶 NFC Contactless Enabled", 70, 520);

        // Draw QR Code on the right
        if (qrDataUrl) {
          const qrImg = new Image();
          await new Promise((resolve) => {
            qrImg.onload = resolve;
            qrImg.src = qrDataUrl;
          });
          ctx.drawImage(qrImg, 560, 80, 400, 400);
        }

        // Crop guides
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

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 1200, 1200);

        ctx.fillStyle = qrColor;
        ctx.fillRect(0, 0, 1200, 28);

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 52px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(business.name, 600, 140);

        ctx.fillStyle = "#f59e0b";
        ctx.font = "bold 34px -apple-system, sans-serif";
        ctx.fillText("★★★★★  5.0 on Google", 600, 200);

        if (qrDataUrl) {
          const qrImg = new Image();
          await new Promise((resolve) => {
            qrImg.onload = resolve;
            qrImg.src = qrDataUrl;
          });
          ctx.drawImage(qrImg, 350, 270, 500, 500);
        }

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 44px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(calloutTitle, 600, 870);

        ctx.fillStyle = "#64748b";
        ctx.font = "30px -apple-system, sans-serif";
        ctx.fillText(calloutSubtitle, 600, 930);

        ctx.fillStyle = "#4f46e5";
        ctx.font = "bold 24px -apple-system, sans-serif";
        ctx.fillText("✨ AI Review Assistant", 600, 1100);
      }

      const link = document.createElement("a");
      link.download = `${business.slug}-${format}-print-300dpi.png`;
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
              Print Ready
            </span>
          </label>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setFormat("stand")}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                format === "stand"
                  ? "border-indigo-600 bg-indigo-50/80 text-indigo-700 font-bold shadow-sm"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="text-xs">Acrylic Stand</div>
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">4" x 6" Portrait</div>
            </button>

            <button
              type="button"
              onClick={() => setFormat("tent")}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                format === "tent"
                  ? "border-indigo-600 bg-indigo-50/80 text-indigo-700 font-bold shadow-sm"
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
                  ? "border-indigo-600 bg-indigo-50/80 text-indigo-700 font-bold shadow-sm"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="text-xs">Smart Card</div>
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">CR80 Wallet</div>
            </button>
          </div>
        </div>

        {/* Visual Customization */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-indigo-600" />
            Visual Customization &amp; Branding
          </label>

          {/* Color palette presets */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
              Brand Accent Color
            </label>
            <div className="flex items-center gap-2">
              {[
                "#4f46e5", // Indigo
                "#059669", // Emerald
                "#7c3aed", // Violet
                "#e11d48", // Rose
                "#d97706", // Amber
                "#0f172a", // Slate
              ].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setQrColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-xl transition-transform ${
                    qrColor === c ? "ring-2 ring-offset-2 ring-indigo-600 scale-110" : "hover:scale-105"
                  }`}
                />
              ))}
              <input
                type="color"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5 ml-2"
                title="Custom Color"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Main Headline
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
              Show scissor cut / fold guidelines
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
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF Template
            </button>

            <button
              type="button"
              onClick={handleExportHighResPng}
              disabled={isExporting}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              {isExporting ? "Generating High-Res..." : "Download Stand PNG (300 DPI High-Res)"}
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
            Want customers to tap their phone on your stand or smart card? Buy inexpensive NTAG213 / NTAG215 stickers or cards on Amazon.
          </p>

          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">
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
            className={`bg-white rounded-3xl p-8 flex flex-col items-center text-center justify-between relative transition-all ${
              showCropMarks ? "border-2 border-dashed border-slate-300" : "border border-slate-200"
            }`}
            style={{
              width: "360px",
              height: "540px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Top Brand Accent Bar */}
            <div
              className="absolute top-0 left-0 right-0 h-3 rounded-t-3xl"
              style={{ backgroundColor: qrColor }}
            />

            {/* Stand Header */}
            <div className="flex flex-col items-center mt-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner flex items-center justify-center p-1.5 overflow-hidden mb-2">
                {business.logoUrl ? (
                  <img
                    src={business.logoUrl}
                    alt={business.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-lg font-black text-slate-800">
                    {business.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                {business.name}
              </h2>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-slate-600 ml-1">5.0 on Google</span>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="p-3 bg-white rounded-2xl border-2 border-slate-100 shadow-sm relative my-2">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Review QR Code"
                  className="w-40 h-40 object-contain"
                />
              ) : (
                <div className="w-40 h-40 bg-slate-100 animate-pulse rounded-xl" />
              )}

              {/* NFC Wave Icon Indicator */}
              <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md border-2 border-white">
                <Radio className="w-4 h-4 text-indigo-400" />
              </div>
            </div>

            {/* Stand Footer */}
            <div className="space-y-1 pb-1">
              <h3 className="text-sm font-bold text-slate-800 leading-tight">
                {calloutTitle}
              </h3>
              <p className="text-[11px] text-slate-500 max-w-[240px]">
                {calloutSubtitle}
              </p>
              <div className="pt-2 text-[10px] font-semibold text-indigo-600 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Powered by AI Review Assistant
              </div>
            </div>

            {/* Physical Print Dimension Indicator */}
            {showCropMarks && (
              <div className="absolute -bottom-6 text-[10px] text-slate-400 no-print flex items-center gap-1 font-mono">
                <Scissors className="w-3 h-3" /> Standard 4" x 6" Acrylic Stand Insert
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
                style={{ backgroundColor: qrColor }}
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
                style={{ backgroundColor: qrColor }}
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
            className="bg-white rounded-2xl p-6 border-2 border-dashed border-slate-300 flex items-center justify-between relative transition-all"
            style={{
              width: "400px",
              height: "240px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Left Brand Accent Stripe */}
            <div
              className="absolute left-0 top-0 bottom-0 w-2.5 rounded-l-2xl"
              style={{ backgroundColor: qrColor }}
            />

            {/* Left Card Info */}
            <div className="flex flex-col justify-between h-full pl-2 max-w-[210px]">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight leading-tight">
                  {business.name}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">Google 5.0</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  Tap or Scan to Review
                </p>
                <p className="text-[10px] text-slate-500">
                  Instant 30-sec AI review
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600">
                <Radio className="w-3 h-3" />
                <span>NFC Contactless Ready</span>
              </div>
            </div>

            {/* Right Card QR */}
            <div className="flex-shrink-0 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
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
