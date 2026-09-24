import Link from "next/link";
import { BrandIcon } from "@/components/brand/BrandLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center px-4 text-center">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative z-10 max-w-sm mx-auto">
        <BrandIcon size="xl" className="mx-auto mb-6" />

        <div className="text-8xl font-black text-white/10 select-none leading-none mb-4">
          404
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          This page doesn&apos;t exist or the review link may have changed.
          <br />
          Double-check the URL you scanned.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition shadow-lg shadow-indigo-900/50"
          >
            Back to Home
          </Link>
          <a
            href="https://wa.me/918639831132"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
