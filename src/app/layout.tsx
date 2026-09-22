import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReviewSmart AI - Smart Google Review Cards & AI Reputation Platform",
  description:
    "Empower local businesses to capture 5-star Google reviews with AI-powered draft suggestions, smart NFC/QR cards, and a private negative review shield.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
