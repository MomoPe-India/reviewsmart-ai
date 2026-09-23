import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReviewSmart AI - Smart Google Review Cards & AI Reputation Platform",
  description:
    "Empower local businesses to capture 5-star Google reviews with AI-powered draft suggestions, smart NFC/QR cards, and a private negative review shield.",
  applicationName: "ReviewSmart AI",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ReviewSmart AI",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0f19" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white overflow-x-hidden touch-manipulation">
        {children}
      </body>
    </html>
  );
}
