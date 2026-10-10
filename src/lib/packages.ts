export type PackageTierId =
  | "ONLINE_LIFETIME"
  | "STARTER_PVC"
  | "EXECUTIVE_STANDEE"
  | "ALL_IN_ONE_HUB"
  | "ENTERPRISE_CUSTOM";

export interface HardwarePackage {
  id: PackageTierId;
  name: string;
  shortName: string;
  price: number;
  tagline: string;
  badge?: string;
  isPopular?: boolean;
  hardwareDeliverables: string[];
  softwareDeliverables: string[];
  bestFor: string;
  salesPitch: string;
}

export const HARDWARE_PACKAGES: Record<PackageTierId, HardwarePackage> = {
  ONLINE_LIFETIME: {
    id: "ONLINE_LIFETIME",
    name: "ReviewSmart AI Lifetime Pass (All India)",
    shortName: "Lifetime Pass",
    price: 2999,
    tagline: "100% Free For Lifetime • Zero Monthly/Yearly Fees • Free GMB Setup Included",
    badge: "🇮🇳 Pan-India Flagship • ₹2,999 Lifetime Pass",
    isPopular: true,
    hardwareDeliverables: [
      "1x 4″×6″ Luxury Crystal Acrylic Counter Standee (Retail Showpiece)",
      "1x Dual-Sided Vertical PVC Smart NFC Card (Google Review + Digital Visiting Card)",
      "Official Google 'G' High-Precision Circular QR Badge",
      "Free Doorstep Express Courier Delivery across India",
      "🆓 FREE Google Business Profile (GMB) Setup & Verification (if you don't have one)",
    ],
    softwareDeliverables: [
      "Gemini AI 5-Star Review Generation in 6 Indian Languages (EN, TE, HI, TA, KN, ML)",
      "⚡ Express 1-Tap Sub-3-Second Review Automation",
      "Native Android Google Maps App Intent Deep Linking",
      "🎙️ Voice-to-Review Speech Recognition (6 Languages)",
      "🎁 Interactive Scratch Card & Customer Voucher Rewards",
      "🛡️ Private WhatsApp Negative Feedback Intercept Shield",
      "📲 1-Click WhatsApp Personalized Review Inviter (?cust= & ?service=)",
      "🤖 AI Google Review Reply Copilot (SEO Ranking Booster)",
      "📍 Complete Google Maps Category & Local SEO Keyword Optimization",
      "100% Free for Lifetime — 0 Monthly or Yearly Software Fees Forever",
      "All Future Platform Updates & New AI Features Included at No Extra Cost",
    ],
    bestFor: "Retail stores, restaurants, clinics, boutiques, salons, service businesses across India",
    salesPitch:
      "Pay ₹2,999 once and get complete lifetime access with zero renewals. Free Google Business Profile creation & verification included, plus Standee Studio access.",
  },
  STARTER_PVC: {
    id: "STARTER_PVC",
    name: "Starter PVC Card Pack",
    shortName: "Starter PVC",
    price: 1999,
    tagline: "Compact review solution for single-till counters",
    badge: "Compact Entry",
    isPopular: false,
    hardwareDeliverables: [
      "1x Dual-Sided Vertical PVC Smart Card (CR80 Standard)",
      "Front: Google 5-Star Review Station with Dynamic QR & NFC Tap",
      "Back: Custom Merchant Business Visiting Card (or Direct UPI QR)",
      "Scratch & waterproof matte/gloss executive finish",
    ],
    softwareDeliverables: [
      "Gemini AI 5-Star Review Generation Engine",
      "Private WhatsApp Negative Feedback Intercept Shield",
      "100% Ad-Free Smart Hub Card with Direct UPI",
      "1 Full Year Platform License & Cloud Hosting",
    ],
    bestFor: "Small counter tills, tea/coffee counters, compact boutique desks, takeaway counters",
    salesPitch:
      "Pocket-friendly starter kit with 1 Dual-Sided PVC Card (Google Review Front + Store Visiting Card Back).",
  },
  EXECUTIVE_STANDEE: {
    id: "EXECUTIVE_STANDEE",
    name: "Executive Counter Standee Kit",
    shortName: "Executive Standee",
    price: 2499,
    tagline: "Heavy crystal acrylic counter showpiece + PVC card",
    badge: "Most Popular • Retail Best Seller",
    isPopular: true,
    hardwareDeliverables: [
      "1x 4″×6″ (A6) Crystal Acrylic L-Standee (Flipkart/Retail standard)",
      "1x Dual-Sided Vertical PVC Smart Card (Google Review + Store Business Card)",
      "Official Google 'G' Circular Badge Authentic Brand Styling",
    ],
    softwareDeliverables: [
      "Gemini AI 5-Star Review Generation Engine",
      "Private WhatsApp Negative Feedback Intercept Shield",
      "All-in-One Smart Hub: Google Reviews + WhatsApp + Direct UPI",
      "Zero-Reprint Dynamic QR Guarantee (edit anytime without reprinting)",
      "Priority Merchant Verification & Support",
    ],
    bestFor: "Retail stores, apparel boutiques, restaurants, clinics, beauty salons",
    salesPitch:
      "Our best-selling package featuring a luxury 4″×6″ crystal acrylic standee for the cash counter plus a dual-sided PVC smart card.",
  },
  ALL_IN_ONE_HUB: {
    id: "ALL_IN_ONE_HUB",
    name: "All-in-One Multi-Counter Hub",
    shortName: "All-in-One VIP Hub",
    price: 2999,
    tagline: "Complete multi-point storefront presentation & digital menu",
    badge: "VIP Complete Kit",
    isPopular: false,
    hardwareDeliverables: [
      "1x 4″×6″ (A6) Crystal Acrylic Counter Standee",
      "2x Dual-Sided Vertical PVC Smart Cards (For billing & dining/service desks)",
      "1x A4 Framed Entrance / Glass Door Wall Poster",
      "Staff Attribution QR Badges for team members",
    ],
    softwareDeliverables: [
      "Full All-in-One Smart Business Hub (Reviews + Menu + UPI + Catalog)",
      "Digital Menu & Product Showcase URL integration",
      "Gemini AI 5-Star Review Generator with Staff Credit",
      "Private WhatsApp Negative Feedback Intercept Shield",
      "Zero-Reprint Dynamic QR Guarantee",
      "VIP Dedicated Support & Annual Hardware Replacement Warranty",
    ],
    bestFor: "Multi-counter showrooms, fine dining restaurants, hotels, multi-stylist salons, studios",
    salesPitch:
      "Comprehensive multi-station storefront hardware: 1 Acrylic Standee + 2 PVC Cards + 1 A4 Glass Door Poster + Full Digital Menu & UPI Hub.",
  },
  ENTERPRISE_CUSTOM: {
    id: "ENTERPRISE_CUSTOM",
    name: "Enterprise Multi-Branch Bundle",
    shortName: "Enterprise Bundle",
    price: 3999,
    tagline: "Tailored multi-branch hardware bundle for chains & franchises",
    badge: "Chains & Multi-Branch",
    isPopular: false,
    hardwareDeliverables: [
      "Custom Acrylic Standees & PVC Cards tailored to branch count",
      "Multi-counter placement for each branch location",
    ],
    softwareDeliverables: [
      "Multi-Branch Central Management Dashboard",
      "Custom Branch-wise UPI Settlement Routing",
      "Consolidated Multi-location Review Analytics",
      "Dedicated Account Manager & Priority Hardware Dispatch",
    ],
    bestFor: "Multi-branch retail chains, medical clinics with branches, hotel franchises",
    salesPitch:
      "Custom multi-branch rollout covering all counters and branches with centralized management.",
  },
};

export const PACKAGE_LIST = [
  HARDWARE_PACKAGES.ONLINE_LIFETIME,
  HARDWARE_PACKAGES.EXECUTIVE_STANDEE,
  HARDWARE_PACKAGES.STARTER_PVC,
  HARDWARE_PACKAGES.ALL_IN_ONE_HUB,
  HARDWARE_PACKAGES.ENTERPRISE_CUSTOM,
];

export function getPackageById(id?: string | null): HardwarePackage {
  if (id && id in HARDWARE_PACKAGES) {
    return HARDWARE_PACKAGES[id as PackageTierId];
  }
  return HARDWARE_PACKAGES.ONLINE_LIFETIME;
}

export function getPackageByPrice(price?: number | null): HardwarePackage {
  if (!price || price === 2999 || price === 3000) {
    return HARDWARE_PACKAGES.ONLINE_LIFETIME;
  }
  if (price < 2200) {
    return HARDWARE_PACKAGES.STARTER_PVC;
  }
  if (price >= 2200 && price < 2800) {
    return HARDWARE_PACKAGES.EXECUTIVE_STANDEE;
  }
  if (price >= 2800 && price < 3500) {
    return HARDWARE_PACKAGES.ALL_IN_ONE_HUB;
  }
  return HARDWARE_PACKAGES.ENTERPRISE_CUSTOM;
}
