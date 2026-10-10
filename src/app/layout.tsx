import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://reviewsmart.online"),
  title: "ReviewSmart AI - Smart Google Review Cards & AI Reputation Platform 🇮🇳",
  description:
    "Empower local Indian businesses to get 100+ 5-star Google reviews in Telugu, Hindi, English, Tamil, and Kannada with luxury NFC acrylic standees, smart QR cards, and private negative review shield.",
  applicationName: "ReviewSmart AI",
  keywords: [
    "Google review cards India",
    "NFC review standee",
    "ReviewSmart AI",
    "Google business profile setup free",
    "Smart review card Telugu",
    "Smart review card Hindi",
    "Google reviews Kadapa",
    "Google reviews Hyderabad",
    "Google reviews Bangalore",
    "NFC tap to review",
    "Local business SEO India",
    "Review management tool",
  ],
  authors: [{ name: "ReviewSmart AI Team", url: "https://reviewsmart.online" }],
  creator: "ReviewSmart AI",
  publisher: "ReviewSmart AI",
  category: "Business Application",
  alternates: {
    canonical: "https://reviewsmart.online",
  },
  openGraph: {
    title: "ReviewSmart AI - Smart Google Review Cards & AI Reputation Platform 🇮🇳",
    description:
      "Get 100+ 5-Star Google Reviews in Telugu, Hindi & English with Luxury NFC Counter Standees & AI Cards. Lifetime Pass at just ₹2,999.",
    url: "https://reviewsmart.online",
    siteName: "ReviewSmart AI",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReviewSmart AI - Smart Google Review Cards & AI Reputation Platform",
    description:
      "Get 100+ 5-Star Google Reviews with Luxury NFC Counter Standees & AI Cards in Telugu, Hindi & English. Lifetime Pass at ₹2,999.",
    creator: "@reviewsmart_ai",
  },
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

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "ReviewSmart AI",
  "operatingSystem": "All",
  "applicationCategory": "BusinessApplication",
  "url": "https://reviewsmart.online",
  "offers": {
    "@type": "Offer",
    "price": "2999",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
  },
  "description":
    "Smart Google Review Cards, Luxury NFC Counter Standees, and AI Review Platform in Telugu, Hindi, English, Tamil, and Kannada for Indian merchants.",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "1280",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white overflow-x-hidden touch-manipulation">
        {children}
      </body>
    </html>
  );
}
