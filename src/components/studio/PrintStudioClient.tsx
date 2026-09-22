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
} from "lucide-react";
import QRCode from "qrcode";

interface BusinessData {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  logoUrl: string | null;
  primaryColor: string;
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
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copiedNfc, setCopiedNfc] = useState(false);

  const printAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    QRCode.toDataURL(reviewUrl, {
      width: 600,
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
      width: 800,
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Controls Column (Left) */}
      <div className="lg:col-span-5 space-y-4 no-print">
        {/* Format Selector */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm space-y-3">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            Display Template Formats
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setFormat("stand")}
              className={`p-2.5 rounded-xl border text-center transition ${
                format === "stand"
                  ? "border-indigo-600 bg-indigo-50/70 text-indigo-700 font-bold"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="text-xs">Acrylic Stand</div>
              <div className="text-[10px] text-slate-400">4" x 6" Portrait</div>
            </button>

            <button
              type="button"
              onClick={() => setFormat("tent")}
              className={`p-2.5 rounded-xl border text-center transition ${
                format === "tent"
                  ? "border-indigo-600 bg-indigo-50/70 text-indigo-700 font-bold"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="text-xs">Table Tent</div>
              <div className="text-[10px] text-slate-400">Compact Square</div>
            </button>

            <button
              type="button"
              onClick={() => setFormat("nfc")}
              className={`p-2.5 rounded-xl border text-center transition ${
                format === "nfc"
                  ? "border-indigo-600 bg-indigo-50/70 text-indigo-700 font-bold"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="text-xs">Smart Card</div>
              <div className="text-[10px] text-slate-400">Wallet NFC Size</div>
            </button>
          </div>
        </div>

        {/* Customization Details */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm space-y-4">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-indigo-600" />
            Visual Customization
          </label>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              QR Code Brand Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-1"
              />
              <span className="text-xs font-mono uppercase text-slate-600">
                {qrColor}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Headline
            </label>
            <input
              type="text"
              value={calloutTitle}
              onChange={(e) => setCalloutTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={calloutSubtitle}
              onChange={(e) => setCalloutSubtitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-100 transition"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF Template
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                PNG (300 DPI)
              </button>

              <button
                type="button"
                onClick={handleDownloadSvg}
                className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Vector SVG
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
            Want customers to tap their phone like in the video? You can buy inexpensive NTAG213 / NTAG215 stickers or acrylic cards on Amazon.
          </p>

          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">
              NFC Target URL:
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
      <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-200/50 p-6 sm:p-12 rounded-3xl border border-slate-200 min-h-[550px] relative overflow-hidden">
        {/* Printable Stand Container */}
        <div
          ref={printAreaRef}
          id="print-container"
          className={`bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 flex flex-col items-center text-center transition-all duration-300 ${
            format === "stand"
              ? "w-full max-w-[340px] aspect-[4/6] justify-between relative"
              : format === "tent"
              ? "w-full max-w-[320px] aspect-square justify-between relative"
              : "w-full max-w-[360px] aspect-[1.586/1] justify-between relative"
          }`}
          style={{
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Top Brand Accent Bar */}
          <div
            className="absolute top-0 left-0 right-0 h-3 rounded-t-3xl"
            style={{ backgroundColor: qrColor }}
          />

          {/* Stand Header */}
          <div className="flex flex-col items-center mt-2">
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

          {/* QR Code Container with High Error Redundancy */}
          <div className="p-3 bg-white rounded-2xl border-2 border-slate-100 shadow-sm relative my-2">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Review QR Code"
                className="w-40 h-40 sm:w-44 sm:h-44 object-contain"
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
          <div className="space-y-1">
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
        </div>

        <p className="text-xs text-slate-400 mt-4 no-print">
          👁️ Live countertop acrylic stand simulation. Print directly or send SVG to your acrylic fabricator.
        </p>
      </div>
    </div>
  );
}
