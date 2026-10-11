"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Star,
  Shield,
  Smartphone,
  QrCode,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Zap,
  Store,
  Users,
  ChevronRight,
  Play,
  Globe,
  Lock,
  BarChart2,
  Package,
  Truck,
  Flame,
  Award,
  CreditCard,
  Camera,
  Shirt,
  UtensilsCrossed,
  Laptop,
  Check,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Printer,
  FileText,
  Palette,
  Coins,
  Stethoscope,
  Scissors,
  HelpCircle,
  ChevronDown,
  Search,
  CheckCircle,
  Clock,
  ThumbsUp,
  Volume2,
  VolumeX,
  Mic,
} from "lucide-react";
import confetti from "canvas-confetti";
import BrandLogo, { BrandIcon } from "@/components/brand/BrandLogo";

// ─── 6 INDIAN LANGUAGES DEFINITION ──────────────────────────────────────────
type LanguageKey = "ALL" | "ENGLISH" | "HINDI" | "TELUGU" | "TAMIL" | "KANNADA" | "MALAYALAM";

interface LanguageOption {
  key: LanguageKey;
  label: string;
  native: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { key: "ENGLISH", label: "English", native: "English", flag: "🇬🇧" },
  { key: "HINDI", label: "Hindi", native: "हिंदी", flag: "🇮🇳" },
  { key: "TELUGU", label: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { key: "TAMIL", label: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { key: "KANNADA", label: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" },
  { key: "MALAYALAM", label: "Malayalam", native: "മലയാളം", flag: "🇮🇳" },
];

// ─── MULTI-INDUSTRY DEMO PRESETS WITH 6 LANGUAGES ───────────────────────────
interface DemoPreset {
  id: string;
  name: string;
  category: string;
  location: string;
  icon: any;
  color: string;
  slug: string;
  chips: string[];
  reviews: Record<LanguageKey, string>;
  author: string;
}

const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "fashion",
    name: "Sri Guru Fashions",
    category: "Clothing & Menswear",
    location: "Kadapa, Andhra Pradesh",
    icon: Shirt,
    color: "#4f46e5",
    slug: "sri-guru-fashions-393a",
    chips: ["Exclusive Menswear", "Latest Trends", "Premium Fabric", "Reasonable Prices", "Polite Staff"],
    reviews: {
      ALL: "Sri Guru Fashions has the best menswear collection in Kadapa! Found stylish shirts, trousers, and festive menswear at great prices. The fabric quality is top-notch and staff is very polite. Highly recommended!",
      ENGLISH: "Sri Guru Fashions has the best menswear collection in Kadapa! Found stylish shirts, trousers, and festive menswear at great prices. The fabric quality is top-notch and staff is very polite. Highly recommended!",
      HINDI: "श्री गुरु फैशन्स में पुरुषों के कपड़ों का बहुत ही शानदार और लेटेस्ट कलेक्शन है! कपड़े की क्वालिटी बहुत बढ़िया है और दाम भी एकदम सही हैं। स्टाफ का व्यवहार बहुत विनम्र है। बहुत अच्छा अनुभव!",
      TELUGU: "శ్రీ గురు ఫ్యాషన్స్‌లో బట్టల క్వాలిటీ అద్భుతంగా ఉంది! లేటెస్ట్ ట్రెండ్స్, బెస్ట్ రేట్స్ మరియు స్టాఫ్ చాలా మర్యాదగా మాట్లాడారు. కడపలో షాపింగ్ చేయడానికి బెస్ట్ మెన్స్‌వేర్ షాప్!",
      TAMIL: "ஸ்ரீ குரு ஃபேஷன்ஸில் ஆடைகளின் தரம் மிக அருமையாக உள்ளது! சிறந்த கலெக்ஷன் மற்றும் நியாயமான விலை. ஊழியர்களின் உபசரிப்பு மிக நன்று! அனைவரும் கண்டிப்பாக சென்று பாருங்கள்.",
      KANNADA: "ಶ್ರೀ ಗುರು ಫ್ಯಾಷನ್ಸ್‌ನಲ್ಲಿ ಬಟ್ಟೆಗಳ ಕ್ವಾಲಿಟಿ ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ! ಲೇಟೆಸ್ಟ್ ಡಿಸೈನ್ಸ್ ಮತ್ತು ಸಮಂಜಸವಾದ ಬೆಲೆಗಳು. ಸಿಬ್ಬಂದಿಯ ನಡವಳಿಕೆ ತುಂಬಾ ವಿನಮ್ರವಾಗಿದೆ. ಶಾಪಿಂಗ್‌ಗೆ ಉತ್ತಮ ತಾಣ!",
      MALAYALAM: "ശ്രീ ഗുരു ഫാഷൻസിൽ മികച്ച തുണിത്തരങ്ങളും ട്രെൻഡി കളക്ഷനുകളും ലഭ്യമാണ്! ന്യായമായ വിലയും ജീവനക്കാരുടെ മികച്ച പെരുമാറ്റവും. ഷോപ്പിംഗിനായി തീർച്ചയായും ശുപാർശ ചെയ്യുന്നു!",
    },
    author: "Karthik R.",
  },
  {
    id: "food",
    name: "Vijaya's Yummy Food",
    category: "Restaurant & Cloud Kitchen",
    location: "Kadugodi, Bengaluru",
    icon: UtensilsCrossed,
    color: "#ea580c",
    slug: "vijayas-yummy-food-0900",
    chips: ["Delicious Taste", "Fast Service", "Clean Kitchen", "Polite Staff", "Value for Money"],
    reviews: {
      ALL: "Delicious food with exceptional flavor and authentic home-style taste at Vijaya's Yummy Food! Fast delivery, hygienic packing, and wonderful hospitality. 5 stars!",
      ENGLISH: "Delicious food with exceptional flavor and authentic home-style taste at Vijaya's Yummy Food! Fast delivery, hygienic packing, and wonderful hospitality. 5 stars!",
      HINDI: "विजय'स यम्मी फूड का खाना सच में बहुत ही स्वादिष्ट और शुद्ध है! घर जैसा स्वाद, साफ-सुथरी रसोई और तुरंत सर्विस। सभी डिशेज बहुत लाजवाब थीं। 5 स्टार अनुभव!",
      TELUGU: "విజయస్ యమ్మీ ఫుడ్ లో ప్రతి వంటకం ఎంతో రుచిగా మరియు స్వచ్ఛంగా ఉంది! వేడి వేడి ఆహారం, పరిశుభ్రమైన వాతావరణం మరియు ఫాస్ట్ సర్వీస్. కుటుంబంతో కలిసి తినడానికి బెస్ట్ ప్లేస్!",
      TAMIL: "விஜயாஸ் யம்மி உணவகத்தில் உணவு மிகவும் சுவையாகவும் தரமாகவும் உள்ளது! சுத்தமான சமையல் மற்றும் சிறந்த சேவை. வீட்டுச் சாப்பாடு போன்ற உணர்வு!",
      KANNADA: "ವಿಜಯಾಸ್ ಯಮ್ಮಿ ಫುಡ್‌ನಲ್ಲಿ ಊಟ ಮತ್ತು ತಿಂಡಿಗಳು ತುಂಬಾ ರುಚಿಕರವಾಗಿವೆ! ಮನೆಯೂಟದ ಸವಿ, ಶುಚಿತ್ವ ಮತ್ತು ತ್ವರಿತ ಸೇವೆ. ಅದ್ಭುತ ಅನುಭವ!",
      MALAYALAM: "വിജയാസ് യമ്മി ഫുഡിലെ ഭക്ഷണം അതീവ രുചികരവും വൃത്തിയുള്ളതുമാണ്! നാടൻ രുചിയും മികച്ച സർവീസും. കുടുംബത്തോടൊപ്പം കഴിക്കാൻ ഏറ്റവും മികച്ചത്!",
    },
    author: "Kiran R.",
  },
  {
    id: "clinic",
    name: "Apex Smile Dental Care",
    category: "Dental & Healthcare Clinic",
    location: "Indiranagar, Bengaluru",
    icon: Stethoscope,
    color: "#0284c7",
    slug: "momo-it-technologies",
    chips: ["Painless Treatment", "Experienced Doctors", "Ultra Clean Clinic", "Clear Explanation", "Fair Pricing"],
    reviews: {
      ALL: "Exceptional dental care and highly skilled doctors at Apex Smile! Completely painless root canal and cleaning. The clinic is spotless and modern. Highly satisfied!",
      ENGLISH: "Exceptional dental care and highly skilled doctors at Apex Smile! Completely painless root canal and cleaning. The clinic is spotless and modern. Highly satisfied!",
      HINDI: "एपेक्स स्माइल में बहुत ही कुशल और अनुभवी डॉक्टर्स हैं! बिल्कुल दर्द रहित इलाज, क्लीनिक की बेहतरीन सफाई और हर बात को बहुत तसल्ली से समझाया। बहुत ही संतोषजनक!",
      TELUGU: "డాక్టర్ల అనుభవం మరియు చికిత్స చాలా బాగుంది! ఎలాంటి నొప్పి లేకుండా ట్రీట్మెంట్ పూర్తి చేశారు. అత్యాధునిక పరికరాలు మరియు అత్యంత పరిశుభ్రమైన క్లినిక్!",
      TAMIL: "மிகவும் திறமையான மருத்துவர்கள் மற்றும் வலி இல்லாத சிகிச்சை! கிளினிக் மிக சுத்தமாகவும் நவீன வசதிகளுடனும் உள்ளது. மிக்க நன்றி!",
      KANNADA: "ಅತ್ಯುತ್ತಮ ದಂತ ಚಿಕಿತ್ಸೆ ಮತ್ತು ನುರಿತ ವೈದ್ಯರು! ಯಾವುದೇ ನೋವಿಲ್ಲದೆ ಚಿಕಿತ್ಸೆ ನೀಡಿದರು. ಕ್ಲಿನಿಕ್ ತುಂಬಾ ಸ್ವಚ್ಛ ಮತ್ತು ಆಧುನಿಕವಾಗಿದೆ!",
      MALAYALAM: "മികച്ച ദന്തചികിത്സയും പരിചയസമ്പന്നരായ ഡോക്ടർമാരും! വേദനയില്ലാത്ത ചികിത്സയും മികച്ച ക്ലിനിക്ക് അന്തരീക്ഷവും. വളരെ സംതൃപ്തനാണ്!",
    },
    author: "Dr. Arvind S.",
  },
  {
    id: "salon",
    name: "Luxe Glow Salon & Spa",
    category: "Salon, Hair & Beauty Spa",
    location: "Jubilee Hills, Hyderabad",
    icon: Scissors,
    color: "#db2777",
    slug: "anand-fashion-studio-bf84",
    chips: ["Trendy Haircut", "Branded Products", "Relaxing Ambience", "Skilled Stylists", "Great Hospitality"],
    reviews: {
      ALL: "Outstanding haircut, styling and grooming at Luxe Glow! Premium ambience, branded organic products, and skilled stylists who listen carefully to your preferences.",
      ENGLISH: "Outstanding haircut, styling and grooming at Luxe Glow! Premium ambience, branded organic products, and skilled stylists who listen carefully to your preferences.",
      HINDI: "लाजवाब हेयर कट और ग्रूमिंग सर्विस! बहुत ही लग्जरी और शांत माहौल, ब्रांडेड प्रोडक्ट्स और बहुत ही हुनरमंद स्टाइलिस्ट। पूरा पैसा वसूल!",
      TELUGU: "హెయిర్ కట్ మరియు స్టైలింగ్ సూపర్ గా చేశారు! ప్రొఫెషనల్ స్టాఫ్, ఆహ్లాదకరమైన వాతావరణం మరియు బ్రాండెడ్ ప్రొడక్ట్స్ వాడారు. చాలా హ్యాపీ!",
      TAMIL: "சிறந்த ஹேர் கட் மற்றும் அழகு பராமரிப்பு! ஆடம்பரமான சூழல், அனுபவம் வாய்ந்த ஸ்டைலிஸ்ட்டுகள். மிகவும் திருப்திகரமாக இருந்தது!",
      KANNADA: "ತುಂಬಾ ಉತ್ತಮವಾದ ಹೇರ್ ಕಟಿಂಗ್ ಮತ್ತು ಬ್ಯೂಟಿ ಸರ್ವಿಸ್! ಐಷಾರಾಮಿ ಪರಿಸರ ಮತ್ತು ನುರಿತ ಸಿಬ್ಬಂದಿ. ಪೂರ್ಣ ತೃಪ್ತಿ ಸಿಕ್ಕಿದೆ!",
      MALAYALAM: "മികച്ച ഹെയർ സ്റ്റൈലിംഗും സൗന്ദര്യ സംരക്ഷണവും! പ്രൊഫഷണൽ ജീവനക്കാരും മനോഹരമായ ആംബിയൻസും. മികച്ച അനുഭവം!",
    },
    author: "Ananya M.",
  },
  {
    id: "gold",
    name: "VR GOLD - Kadapa",
    category: "Gold & Jewellery Evaluation",
    location: "Kadapa, Andhra Pradesh",
    icon: Coins,
    color: "#d97706",
    slug: "vrgold",
    chips: ["Sell Gold for Cash", "Computerized Purity Test", "Live Market Bullion Rate", "Zero Deduction", "Instant 2-Min Transfer"],
    reviews: {
      ALL: "Evaluated and sold old gold at VR GOLD! German computerized purity testing with live bullion rates and instant bank transfer in 2 minutes. Completely transparent and trustworthy!",
      ENGLISH: "Evaluated and sold old gold at VR GOLD! German computerized purity testing with live bullion rates and instant bank transfer in 2 minutes. Completely transparent and trustworthy!",
      HINDI: "कंप्यूटराइज्ड जर्मन मशीन पर पारदर्शी गोल्ड टेस्टिंग और लाइव मार्केट रेट! सिर्फ 2 मिनट में बिना किसी कटौती के तुरंत पेमेंट। पूरी तरह से भरोसेमंद!",
      TELUGU: "జర్మన్ కంప్యూటరైజ్డ్ మిషన్ ద్వారా పారదర్శకమైన గోల్డ్ టెస్టింగ్ మరియు లైవ్ మార్కెట్ రేట్! ఎలాంటి కోతలు లేకుండా కేవలం 2 నిమిషాల్లో ఇన్స్టంట్ పేమెంట్!",
      TAMIL: "ஜெர்மன் மெஷின் மூலம் துல்லியமான தங்கம் பரிசோதனை மற்றும் நேரடி சந்தை விலை! 2 நிமிடத்தில் உடனடி பணம். நம்பகமான சேவை!",
      KANNADA: "ಜರ್ಮನ್ ಕಂಪ್ಯೂಟರೈಸ್ಡ್ ಯಂತ್ರದ ಮೂಲಕ ನಿಖರವಾದ ಚಿನ್ನದ ಪರೀಕ್ಷೆ ಮತ್ತು ಲೈವ್ ದರ! ಕೇವಲ 2 ನಿಮಿಷದಲ್ಲಿ ಸಂಪೂರ್ಣ ಪಾರದರ್ಶಕ ಹಣ ಸಂದಾಯ!",
      MALAYALAM: "കമ്പ്യൂട്ടറൈസ്ഡ് മെഷീൻ വഴി കൃത്യമായ സ്വർണ്ണ പരിശോധനയും തത്സമയ മാർക്കറ്റ് വിലയും! 2 മിനിറ്റിനുള്ളിൽ തുക അക്കൗണ്ടിൽ ലഭിച്ചു. വിശ്വസനീയം!",
    },
    author: "Prasad R.",
  },
  {
    id: "tech",
    name: "Momo IT Technologies",
    category: "Software & AI Solutions",
    location: "Krishnapuram, Kadapa",
    icon: Laptop,
    color: "#4f46e5",
    slug: "momo-it-technologies",
    chips: ["Fast Delivery", "Professional Team", "Cutting Edge AI", "Great Support", "Reliable"],
    reviews: {
      ALL: "Exceptional software development and AI engineering services. Momo IT delivered our custom app ahead of schedule with flawless quality and excellent ongoing support!",
      ENGLISH: "Exceptional software development and AI engineering services. Momo IT delivered our custom app ahead of schedule with flawless quality and excellent ongoing support!",
      HINDI: "शानदार सॉफ्टवेयर और AI सॉल्यूशंस! मोमो आईटी ने तय समय से पहले बहुत ही बेहतरीन क्वालिटी का एप्लिकेशन तैयार किया। कस्टमर सपोर्ट भी बहुत शानदार है।",
      TELUGU: "సాఫ్ట్‌వేర్ డెవలప్‌మెంట్ మరియు ఏఐ సొల్యూషన్స్ అద్భుతంగా అందించారు! ఎంతో సమయపాలనతో, ఉన్నతమైన నాణ్యతతో ప్రాజెక్ట్ డెలివరీ చేశారు. గ్రేట్ టీమ్!",
      TAMIL: "சிறந்த மென்பொருள் மற்றும் ஏஐ தொழில்நுட்ப சேவைகள்! தரமான செயலியை குறித்த நேரத்திற்கு முன்பே தயார் செய்து கொடுத்தார்கள். சிறந்த வாடிக்கையாளர் சேவை!",
      KANNADA: "ಅತ್ಯುತ್ತಮ ಸಾಫ್ಟ್‌ವೇರ್ ಮತ್ತು ಎಐ ತಂತ್ರಜ್ಞಾನ ಸೇವೆಗಳು! ಗುಣಮಟ್ಟದ ಆಪ್ ಅನ್ನು ನಿಗದಿತ ಸಮಯಕ್ಕಿಂತ ಮೊದಲೇ ನೀಡಿದ್ದಾರೆ. ಅತ್ಯುತ್ತಮ ಬೆಂಬಲ!",
      MALAYALAM: "മികച്ച സോഫ്റ്റ്‌വെയർ, AI സൊല്യൂഷനുകൾ! കൃത്യസമയത്ത് മികച്ച ക്വാളിറ്റിയോടെ പ്രൊജക്റ്റ് പൂർത്തിയാക്കി. കസ്റ്റമർ സപ്പോർട്ടും മികച്ചതാണ്!",
    },
    author: "Rajesh G.",
  },
];

// ─── 3D HARDWARE THEMES ──────────────────────────────────────────────────────
const DISPLAY_THEMES = {
  "royal-gold": {
    name: "Royal Gold",
    badge: "bg-amber-400 text-slate-950 font-black",
    border: "border-amber-400/80 shadow-amber-400/20",
    cardBg: "from-slate-950 via-slate-900 to-black",
    dot: "#f59e0b",
  },
  "emerald-luxe": {
    name: "Emerald Luxe",
    badge: "bg-emerald-400 text-slate-950 font-black",
    border: "border-emerald-500/80 shadow-emerald-500/20",
    cardBg: "from-emerald-950 via-slate-950 to-black",
    dot: "#10b981",
  },
  "midnight-sapphire": {
    name: "Midnight Sapphire",
    badge: "bg-cyan-400 text-slate-950 font-black",
    border: "border-cyan-400/80 shadow-cyan-400/20",
    cardBg: "from-blue-950 via-slate-950 to-black",
    dot: "#06b6d4",
  },
  "rose-platinum": {
    name: "Rose Platinum",
    badge: "bg-rose-400 text-slate-950 font-black",
    border: "border-rose-400/80 shadow-rose-400/20",
    cardBg: "from-rose-950 via-slate-950 to-black",
    dot: "#f43f5e",
  },
};

export default function HomePage() {
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);
  const [selectedLang, setSelectedLang] = useState<LanguageKey>("ENGLISH");
  const [demoStars, setDemoStars] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [dailyCustomers, setDailyCustomers] = useState(50);
  const [mockupFormat, setMockupFormat] = useState<"stand" | "pvc-vertical" | "poster-a4">("stand");
  const [mockupTheme, setMockupTheme] = useState<keyof typeof DISPLAY_THEMES>("royal-gold");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [referralPartner, setReferralPartner] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingLang, setSpeakingLang] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingLang(null);
    }
  }, [selectedLang, selectedDemoIndex]);

  const handleToggleSpeakReview = (text: string, lang: LanguageKey) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Voice playback is not supported on your browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingLang(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const langTagMap: Record<LanguageKey, string> = {
      ALL: "en-IN",
      ENGLISH: "en-IN",
      HINDI: "hi-IN",
      TELUGU: "te-IN",
      TAMIL: "ta-IN",
      KANNADA: "kn-IN",
      MALAYALAM: "ml-IN",
    };

    utterance.lang = langTagMap[lang] || "en-IN";
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) => v.lang.startsWith(utterance.lang) || v.lang.includes("IN")
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingLang(lang);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingLang(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingLang(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref") || params.get("agent") || localStorage.getItem("reviewsmart_ref");
      if (ref) {
        const clean = ref.trim().toUpperCase();
        setReferralPartner(clean);
        localStorage.setItem("reviewsmart_ref", clean);
        document.cookie = `reviewsmart_ref=${encodeURIComponent(clean)}; path=/; max-age=2592000; SameSite=Lax`;
      }
    }
  }, []);

  const activeDemo = DEMO_PRESETS[selectedDemoIndex];
  const activeReviewText = activeDemo.reviews[selectedLang] || activeDemo.reviews.ENGLISH;

  const whatsappInquiryUrl =
    "https://wa.me/918639831132?text=" +
    encodeURIComponent("Hi ReviewSmart AI, I saw your ad and want to get the ₹2,999 Lifetime Pass for my business across India.");

  const whatsappDirectBuyUrl =
    "https://wa.me/918639831132?text=" +
    encodeURIComponent("Hi ReviewSmart AI! I want to activate the ₹2,999 One-Time Lifetime Pass for my business. Please send me the instant activation link.");

  const whatsappGmbSetupUrl =
    "https://wa.me/918639831132?text=" +
    encodeURIComponent("Hi ReviewSmart AI team! I don't have a Google Business Profile yet. Please help me create, verify and set up my shop on Google Maps for free with the ₹2,999 Lifetime Pass.");

  const handleCopyReview = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedDraft(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setTimeout(() => setCopiedDraft(false), 2200);
    }
  };

  // ROI Calculator formula
  const monthlyWalkins = dailyCustomers * 30;
  const estimatedReviewsWithout = Math.max(1, Math.round(monthlyWalkins * 0.005));
  const estimatedReviewsWith = Math.round(monthlyWalkins * 0.12);
  const shieldedComplaints = Math.max(1, Math.round(monthlyWalkins * 0.018));
  const estimatedRevenueGain = Math.round(estimatedReviewsWith * 520);

  const faqs = [
    {
      q: "Is ₹2,999 really a one-time payment for lifetime? Are there any hidden monthly charges?",
      a: "Yes! 100% Guaranteed. For our online customers, ₹2,999 is a strictly one-time fee. There are ZERO monthly fees, ZERO yearly renewal charges, and NO transaction cuts. All upcoming features, AI improvements, and future updates are included forever at no additional cost.",
    },
    {
      q: "What if I don't have a Google Business Profile (Google Maps listing) yet?",
      a: "No problem at all! As part of your ₹2,999 Lifetime Pass, our dedicated verification team will create, claim, verify, and SEO-optimize your Google Business Profile completely FREE. We set up your categories, address pin, opening hours, photos, and direct review shortlink so you can start getting reviews from day one.",
    },
    {
      q: "How does the AI generate reviews in Hindi, Telugu, Tamil, Kannada, and Malayalam?",
      a: "Our smart multi-lingual engine is powered by Google Gemini AI with fine-tuned conversational prompt engineering for Indian regional dialects. When customers tap 2 or 3 quick tags about your service, the system synthesizes natural, native-phrased 5-star reviews that sound genuine and relatable.",
    },
    {
      q: "Does ReviewSmart AI violate Google review policies?",
      a: "No! ReviewSmart AI is 100% compliant with Google's policies. We do NOT use bots or fake reviews. Real walk-in customers scan the QR code and publish the reviews directly from their own verified personal Google accounts on the official Google Maps app.",
    },
    {
      q: "How does the Negative Feedback Shield protect my business reputation?",
      a: "When a customer rates 4 or 5 stars, they are seamlessly guided to post on Google Maps with an AI draft. If a customer rates 1, 2, or 3 stars, our intelligent shield intercepts the feedback privately to your WhatsApp desk or email. You resolve the issue with the customer immediately, while Google Maps remains 100% shielded from public negative damage.",
    },
    {
      q: "How do I get the physical Acrylic Standee or PVC Cards for my counter?",
      a: "Your merchant dashboard includes our Standee Studio with instant high-resolution 300 DPI vector PDF downloads ready for 4\"×6\" Acrylic Standees, CR80 PVC Cards, and A4 Wall Posters. You can print them locally anywhere, or contact our support team on WhatsApp to order our physical luxury crystal acrylic kits delivered straight to your doorstep.",
    },
    {
      q: "What is the difference between Online and Offline pricing?",
      a: "Online customers purchasing directly via our website / Meta Ads get instant digital access, the complete 6-language AI review platform, free GMB setup, and full Standee Studio PDF exports for ₹2,999 Lifetime. Offline agent customers work with regional sales partners who provide in-person onboarding, store visits, and custom physical hardware packages with flexible local pricing.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-indigo-600 selection:text-white relative">
      {/* ─── 3D AMBIENT LIGHT MESH BACKGROUND ────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-indigo-600/20 via-purple-600/15 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[40%] -left-32 w-[500px] h-[500px] bg-blue-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-[60%] -right-32 w-[550px] h-[550px] bg-emerald-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-10 left-1/3 w-[600px] h-[400px] bg-indigo-900/15 blur-[120px] rounded-full" />
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ─── TOP NOTIFICATION BANNER (META ADS EXCLUSIVE) ─────────────────── */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white text-xs py-2.5 px-4 text-center font-bold tracking-wide flex items-center justify-center gap-2 shadow-md">
        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping shrink-0" />
        <span>
          PAN-INDIA LAUNCH OFFER: ₹2,999 One-Time Lifetime Pass &bull; 100% Free For Lifetime &bull; 🆓 Free Google Business Profile Setup Included!
        </span>
        <a
          href="#pricing"
          className="underline underline-offset-2 ml-1 text-emerald-200 hover:text-white hidden sm:inline"
        >
          Claim ₹2,999 Pass &rarr;
        </a>
      </div>

      {/* ─── NAVBAR ───────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <BrandLogo href="/" size="md" theme="dark" />

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <a
              href="#demo"
              className="text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-full transition"
            >
              6-Language Demo
            </a>
            <a
              href="#gmb-setup"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 px-3 py-1.5 rounded-full transition flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Free GMB Setup</span>
            </a>
            <a
              href="#ranking-boost"
              className="text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-full transition"
            >
              Ranking Booster
            </a>
            <a
              href="#hardware"
              className="text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-full transition"
            >
              3D Standee Studio
            </a>
            <a
              href="#pricing"
              className="text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-full transition"
            >
              Lifetime Pricing
            </a>
            <a
              href="#faq"
              className="text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-full transition"
            >
              FAQ
            </a>
            <Link
              href="/r/sri-guru-fashions-393a"
              target="_blank"
              className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full transition hover:bg-emerald-500/20"
            >
              <Play className="w-3 h-3" /> Live Customer Card
            </Link>
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Login</span>
            </Link>

            <a
              href="#pricing"
              className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-500/25 active:scale-95 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>₹2,999 Lifetime</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ─── 3D HERO SECTION ──────────────────────────────────────────────── */}
      <section className="pt-12 sm:pt-16 pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Top Floating Badge Bar */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-6 sm:mb-8 animate-fadeIn">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold backdrop-blur-md shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PAN-INDIA LAUNCH</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>6 Indian Languages &bull; Hindi, Telugu, Tamil +3</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold backdrop-blur-md">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>₹2,999 Lifetime Pass</span>
            </div>
          </div>

          {/* Hero Grid: Value Prop (Left) + Floating Hero Presenter (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left Column on Desktop / Main Flow on Mobile */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-5">
              {/* Responsive Fitted Heading: Never splits 5-Star across lines */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.12] sm:leading-[1.1] hyphens-none">
                <span className="block">
                  Collect 100+ Genuine{" "}
                  <span className="inline-block whitespace-nowrap text-amber-300">5-Star</span>
                </span>
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-sm block mt-1 sm:mt-1.5">
                  Google Reviews Every Month
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Customers tap your smart NFC card or scan your crystal counter standee. Gemini AI writes authentic 5-star reviews in their native language in 10 seconds. Bad reviews are shielded privately to your WhatsApp.
              </p>

              {/* ─── MOBILE-ONLY HERO PRESENTER SHOWCASE (Visible on mobile, hidden on lg) ─── */}
              <div className="lg:hidden py-2 flex flex-col items-center">
                {/* Hero Card for Mobile */}
                <div className="relative w-full max-w-sm mx-auto">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-600/30 via-purple-600/25 to-pink-500/20 rounded-3xl blur-xl -z-10" />
                  <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-slate-900/90 shadow-2xl">
                    <Image
                      src="/images/hero-presenter.jpg"
                      alt="ReviewSmart AI - 5-Star Google Reviews NFC Tap Card and QR Acrylic Standee"
                      width={600}
                      height={600}
                      priority
                      className="w-full h-auto object-cover"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 bg-slate-950/90 backdrop-blur-md border border-amber-400/60 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span className="text-[10px] font-black text-amber-300 uppercase">NFC Tap & QR Standee</span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 bg-slate-950/90 backdrop-blur-md border border-emerald-400/60 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <span className="text-amber-400 text-[10px]">★★★★★</span>
                      <span className="text-[10px] font-black text-emerald-400">5.0 Official</span>
                    </div>

                    {/* Bottom Info Pill */}
                    <div className="absolute inset-x-2.5 bottom-2.5 p-2.5 rounded-2xl bg-slate-950/92 backdrop-blur-xl border border-white/20 flex items-center justify-between gap-2 shadow-2xl">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                        </div>
                        <div className="text-left">
                          <p className="text-[11px] font-black text-white leading-tight">AI Instant Reviews</p>
                          <p className="text-[9px] text-slate-300">Telugu &bull; Hindi &bull; Tamil &bull; English</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-400">₹2,999</span>
                        <p className="text-[8px] text-slate-400">Lifetime</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Business Tag Chips */}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-bold text-slate-300">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">🍽️ Dining</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">👗 Boutiques</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">💇 Salons</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">🏥 Clinics</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">💎 Jewellery</span>
                </div>
              </div>

              {/* Main CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
                <a
                  href="#pricing"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-400 hover:to-purple-400 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-2xl shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Get ₹2,999 Lifetime Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-white font-bold text-sm flex items-center justify-center gap-2 backdrop-blur-xl shadow-xl transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Quick Trust Badges Strip */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3.5 sm:gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Free For Lifetime
                </span>
                <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" /> 🆓 Free GMB Setup Included
                </span>
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Zero Monthly Subscriptions
                </span>
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" /> 100% Ad-Free Experience
                </span>
              </div>
            </div>

            {/* Right Column: Desktop Hero Presenter (Hidden on mobile, flex on lg) */}
            <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center">
              <div className="relative w-full max-w-md lg:max-w-none">
                {/* Radiant Ambient Glow Behind Image */}
                <div className="absolute -inset-3 bg-gradient-to-tr from-indigo-600/30 via-purple-600/25 to-pink-500/20 rounded-3xl blur-2xl -z-10" />

                {/* Main Image Frame with Floating Badges */}
                <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-slate-900/90 shadow-[0_25px_60px_-15px_rgba(79,70,229,0.4)] backdrop-blur-2xl group">
                  <Image
                    src="/images/hero-presenter.jpg"
                    alt="ReviewSmart AI - 5-Star Google Reviews NFC Tap Card and QR Acrylic Standee"
                    width={700}
                    height={700}
                    priority
                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Floating Micro-Badge Top Left */}
                  <div className="absolute top-3.5 left-3.5 bg-slate-950/85 backdrop-blur-md border border-amber-400/50 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px] font-black text-amber-300 uppercase tracking-wide">
                      NFC Tap & QR Standee
                    </span>
                  </div>

                  {/* Floating Micro-Badge Top Right */}
                  <div className="absolute top-3.5 right-3.5 bg-slate-950/85 backdrop-blur-md border border-emerald-400/50 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl">
                    <span className="text-amber-400 text-xs">★★★★★</span>
                    <span className="text-[11px] font-black text-emerald-400">5.0 Official</span>
                  </div>

                  {/* Floating Info Banner Bottom */}
                  <div className="absolute inset-x-3 bottom-3 p-3 rounded-2xl bg-slate-950/92 backdrop-blur-xl border border-white/15 flex items-center justify-between gap-2 shadow-2xl">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
                        <Zap className="w-4 h-4 text-amber-300" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white">AI Instant Reviews</p>
                        <p className="text-[10px] text-slate-300">Telugu &bull; Hindi &bull; Tamil &bull; English</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-400">₹2,999</span>
                      <p className="text-[9px] text-slate-400">Lifetime Pass</p>
                    </div>
                  </div>
                </div>

                {/* Desktop Business Category Tags */}
                <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-300">
                  <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition">🍽️ Cafes & Dining</span>
                  <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-400/40 transition">👗 Boutiques & Retail</span>
                  <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 hover:border-pink-400/40 transition">💇 Salons & Spas</span>
                  <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-400/40 transition">🏥 Clinics & Doctors</span>
                  <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition">💎 Jewellery</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── REALISTIC 3D COUNTERTOP + CAMERA SCANNER SIMULATION ────────── */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-white/15 p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(79,70,229,0.3)] backdrop-blur-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Realistic 3D Crystal Acrylic Standee on Walnut Counter (7 cols) */}
                <div className="lg:col-span-7 flex flex-col items-center justify-center">
                  <div
                    className="relative w-full max-w-md flex flex-col items-center justify-center py-6"
                    style={{ perspective: "1200px" }}
                  >
                    {/* Realistic 3D Crystal Acrylic Standee Face */}
                    <div
                      className="relative w-64 sm:w-72 rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-black p-5 border-2 border-amber-400/80 text-center transition-all duration-500 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)]"
                      style={{
                        transform: "rotateY(-7deg) rotateX(4deg)",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {/* Glass Specular Reflection Highlight */}
                      <div
                        className="absolute inset-0 rounded-3xl pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.06) 30%, transparent 60%)",
                        }}
                      />

                      {/* Standee Header */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                          SMARTREVIEW AI
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] bg-amber-400 text-slate-950 font-black shadow-sm">
                          ★ 5.0 GOOGLE
                        </span>
                      </div>

                      {/* Official Google 'G' Circular Badge */}
                      <div className="w-14 h-14 rounded-full bg-white border-2 border-amber-400 p-3 mx-auto mb-2 flex items-center justify-center shadow-lg ring-2 ring-amber-400/30">
                        <svg className="w-full h-full" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.665-5.2 3.665-9.12z" />
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.43 7.37 24 12 24z" />
                          <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.28 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                        </svg>
                      </div>

                      <h4 className="text-sm font-black text-white truncate px-2">{activeDemo.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate mb-3">{activeDemo.category} &bull; Kadapa</p>

                      {/* High-density QR Container with Scanner Reticle */}
                      <div className="w-36 h-36 bg-white p-2.5 rounded-2xl mx-auto shadow-2xl flex items-center justify-center relative border border-white/20 mb-3">
                        <QrCode className="w-full h-full text-slate-950" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-8 h-8 rounded-lg bg-indigo-600 border-2 border-white flex items-center justify-center shadow-lg">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                        </div>

                        {/* Animated Scanner Laser */}
                        <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_rgba(52,211,153,1)] animate-pulse top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-black mb-1">
                        <span>★ ★ ★ ★ ★</span>
                      </div>
                      <p className="text-[11px] font-black text-white tracking-wide uppercase">
                        POINT CAMERA TO REVIEW
                      </p>
                      <p className="text-[9px] text-slate-400 mt-0.5 font-medium">
                        FAST GOOGLE MAPS REDIRECT &bull; ZERO APP INSTALL
                      </p>
                    </div>

                    {/* Acrylic L-Stand Foot with Soft Shadow */}
                    <div
                      className="w-56 sm:w-64 h-5 rounded-b-2xl bg-gradient-to-r from-white/25 via-white/45 to-white/20 backdrop-blur-md border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.8)] -mt-2.5"
                      style={{ transform: "rotateY(-7deg) rotateX(28deg)" }}
                    />

                    {/* Realistic Polished Walnut Cash Counter Surface */}
                    <div className="w-72 sm:w-80 h-7 rounded-2xl bg-gradient-to-r from-[#2c1a11] via-[#4a2e1d] to-[#2c1a11] border-t-2 border-amber-900/60 shadow-[0_15px_30px_rgba(0,0,0,0.9)] mt-2 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-amber-200/50 uppercase tracking-widest">
                        Polished Billing Counter Top
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Camera Scanner Experience (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                    <Camera className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Instant Customer Experience</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    Customer Points Phone Camera &bull; Review Appears in 5 Seconds
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Zero friction. No app installation needed. Works natively on iPhone Camera, Android Camera, or Google Lens built into older Android home search bars.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-white/10 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">1. Instant QR Scan</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Camera opens directly to your customized ReviewSmart AI portal.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-white/10 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">2. AI Native Language Draft</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Selects 5 stars and 2 chips &bull; Gemini drafts authentic review in their mother tongue.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-white/10 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Star className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">3. Direct Google Maps Launch</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          1-tap copies draft and opens the official Google Maps app to paste and post!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEW KILLER FEATURE: 100% FREE GOOGLE BUSINESS PROFILE SETUP ──── */}
      <section id="gmb-setup" className="py-20 px-4 sm:px-6 relative scroll-mt-16 bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-black shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>SPECIAL INCLUDED SERVICE &bull; VALUE: ₹2,500 &bull; YOUR COST: ₹0</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              Don&apos;t Have a Google Business Profile?
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                We&apos;ll Create, Verify &amp; Optimize It 100% FREE!
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
              Never listed your shop on Google Maps before? Don&apos;t worry! Our expert team handles the entire Google verification, category setup, and pin placement at zero extra charge with your ₹2,999 Lifetime Pass.
            </p>
          </div>

          {/* 4-Step Illustrated Roadmap Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 relative overflow-hidden shadow-xl flex flex-col justify-between group hover:border-emerald-500/50 transition">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center border border-emerald-500/30">
                    01
                  </span>
                  <MessageCircle className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition" />
                </div>
                <h4 className="text-base font-bold text-white">Send Shop Details on WhatsApp</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Simply share your store name, category, shop address, and 2-3 storefront photos over WhatsApp. That&apos;s all we need from you!
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Takes 2 minutes
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 relative overflow-hidden shadow-xl flex flex-col justify-between group hover:border-emerald-500/50 transition">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center border border-emerald-500/30">
                    02
                  </span>
                  <ShieldCheck className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition" />
                </div>
                <h4 className="text-base font-bold text-white">Google Verification Handled</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Our verification specialists coordinate directly with Google Maps to verify your business location and claim ownership without paperwork hassles.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Official Google verification
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 relative overflow-hidden shadow-xl flex flex-col justify-between group hover:border-emerald-500/50 transition">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center border border-emerald-500/30">
                    03
                  </span>
                  <Search className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition" />
                </div>
                <h4 className="text-base font-bold text-white">Local SEO Category Setup</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We configure high-volume &quot;near me&quot; search categories, opening hours, business tags, and generate your direct 1-tap review shortlink.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Search optimized profile
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 relative overflow-hidden shadow-xl flex flex-col justify-between group hover:border-emerald-500/50 transition">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center border border-emerald-500/30">
                    04
                  </span>
                  <Zap className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition" />
                </div>
                <h4 className="text-base font-bold text-white">Standee Goes Live on Counter</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your review QR stands and PVC passes are connected. From day 1, walk-in customers tap &amp; post genuine 5-star reviews effortlessly!
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Ready for 5-star reviews
              </div>
            </div>
          </div>

          {/* Direct CTA for Free GMB Setup */}
          <div className="mt-10 p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-lg font-black text-white">
                Ready to Put Your Shop on Google Maps for Free?
              </h4>
              <p className="text-xs text-slate-300">
                Claim your ₹2,999 Lifetime Pass now, and our team will start your Google Business Profile setup immediately!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href={whatsappGmbSetupUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Request Free GMB Setup on WhatsApp</span>
              </a>
              <Link
                href="/dashboard/billing?plan=ONLINE_LIFETIME"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition"
              >
                <span>Get Lifetime Pass (₹2,999)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BEFORE VS AFTER GOOGLE MAPS RANKING BOOSTER ───────────────────── */}
      <section id="ranking-boost" className="py-20 px-4 sm:px-6 relative scroll-mt-16 bg-slate-900/60 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> Google Maps Local Pack Impact
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              From Invisible to #1 on Google Maps in 30 Days
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              See what happens when your business switches from asking customers manually to automated AI review collection:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
            {/* Before Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-rose-500/30 space-y-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/15 px-3 py-1 rounded-full border border-rose-500/30">
                    ❌ BEFORE REVIEWSMART AI
                  </span>
                  <span className="text-xs text-rose-400 font-bold">Ranking #9 Local Search</span>
                </div>

                <h4 className="text-lg font-bold text-white mb-2">
                  Struggling for Organic Walk-ins
                </h4>

                <div className="space-y-3 text-xs text-slate-300 pt-2">
                  <div className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>Only 10-15 reviews collected after 3 years in business</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>Customers say &quot;I will post later&quot; but forget once they leave</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>A single 1-star complaint drops your public rating drastically</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>Competitors higher on Google Maps steal nearby customers</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 text-center">
                <span className="text-xs text-slate-400 font-medium">Monthly Google Maps Views:</span>
                <div className="text-2xl font-black text-slate-500 mt-0.5">~350 Views / Mo</div>
              </div>
            </div>

            {/* After Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-emerald-500/60 space-y-5 shadow-2xl flex flex-col justify-between relative">
              <div className="absolute -top-3 right-6 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                ★ 3.5× REVENUE GROWTH
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
                    ✅ WITH REVIEWSMART AI
                  </span>
                  <span className="text-xs text-emerald-400 font-bold">🏆 Ranking #1 Local Pack</span>
                </div>

                <h4 className="text-lg font-bold text-white mb-2">
                  Dominate Search &bull; Daily New Walk-ins
                </h4>

                <div className="space-y-3 text-xs text-slate-200 pt-2">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">100+ new 5-star reviews</strong> added every single month</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Gemini AI drafts reviews in <strong className="text-white">6 native Indian languages</strong></span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">100% Negative Shield</strong>: 1-3 star grievances routed to private WhatsApp</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">#1 on Google Maps</strong>: Nearby tourists and locals choose you first</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <span className="text-xs text-emerald-300 font-medium">Monthly Google Maps Views:</span>
                <div className="text-2xl font-black text-emerald-400 mt-0.5">3,200+ Views / Mo 🚀</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LIVE 6-LANGUAGE INTERACTIVE DEMO ─────────────────────────────── */}
      <section id="demo" className="py-20 px-4 sm:px-6 relative scroll-mt-16 bg-slate-900/40 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
              <Globe className="w-3.5 h-3.5 text-indigo-400" /> Pan-India Multi-Language Simulator
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              Try the 6-Language Review Generator
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Select your store industry and any of the 6 Indian languages below to experience how your customers will draft authentic, local-keyword reviews in 10 seconds.
            </p>
          </div>

          {/* 1. Language Tabs Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-400" /> Select Language:
            </span>
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.key;
              return (
                <button
                  key={lang.key}
                  type="button"
                  onClick={() => setSelectedLang(lang.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400 scale-105"
                      : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/5"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.native}</span>
                  <span className="text-[10px] opacity-75 hidden sm:inline">({lang.label})</span>
                </button>
              );
            })}
          </div>

          {/* 2. Industry Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {DEMO_PRESETS.map((p, idx) => {
              const IconComp = p.icon;
              const isSelected = selectedDemoIndex === idx;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedDemoIndex(idx);
                    setDemoStars(5);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
                    isSelected
                      ? "bg-white text-slate-950 shadow-md font-extrabold scale-105"
                      : "bg-slate-800/60 hover:bg-slate-750 text-slate-300 border border-white/10"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>

          {/* 3. Interactive Split Simulator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 3D Smartphone View (lg:col-span-6) */}
            <div className="lg:col-span-6 flex justify-center" style={{ perspective: "1000px" }}>
              <div
                className="w-full max-w-sm rounded-[2.5rem] bg-slate-900 border-4 border-slate-700/80 p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(99,102,241,0.2)] text-center relative overflow-hidden transition-all duration-300"
                style={{ transform: "rotateY(-4deg)" }}
              >
                {/* Phone Speaker pill */}
                <div className="w-20 h-3.5 bg-slate-800 rounded-full mx-auto mb-4 border border-slate-700 flex items-center justify-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-600" />
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                </div>

                {/* Business Profile */}
                <div className="mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-xl mx-auto mb-2 shadow-inner">
                    {activeDemo.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h3 className="font-extrabold text-white text-base leading-tight">
                    {activeDemo.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-[11px] text-amber-400 font-semibold mt-0.5">
                    <span>★ 4.9</span>
                    <span className="text-slate-400">&bull; {activeDemo.category}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" /> {activeDemo.location}
                  </p>
                </div>

                {/* Star Rating Picker */}
                <div className="mb-4 p-3 rounded-2xl bg-slate-800/70 border border-slate-700/80">
                  <p className="text-[11px] font-bold text-slate-300 mb-2">
                    How was your experience today?
                  </p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onMouseEnter={() => setHoveredStar(s)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setDemoStars(s)}
                        className="transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-7 h-7 transition ${
                            s <= (hoveredStar || demoStars)
                              ? "fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]"
                              : "text-slate-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 1-3 Stars Negative Shield Alert */}
                {demoStars > 0 && demoStars < 4 && (
                  <div className="p-3.5 bg-amber-500/15 border border-amber-500/40 rounded-2xl text-left space-y-1 animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span>Private Feedback Shield Active</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      This customer grievance is redirected directly to your private WhatsApp desk. Google Maps remains 100% clean and protected from public rating drop!
                    </p>
                  </div>
                )}

                {/* 4-5 Stars AI Review Card */}
                {demoStars >= 4 && (
                  <div className="space-y-3 animate-fadeIn text-left">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {activeDemo.chips.map((chip) => (
                        <span
                          key={chip}
                          className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                        >
                          ✓ {chip}
                        </span>
                      ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-850 border border-indigo-500/30 space-y-2.5 shadow-lg">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="flex items-center gap-1.5 text-indigo-300">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>AI Review ({selectedLang})</span>
                        </span>
                        <span className="text-amber-400 text-xs">★★★★★</span>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed font-normal italic bg-black/30 p-3 rounded-xl border border-white/5">
                        &quot;{activeReviewText}&quot;
                      </p>

                      {/* Interactive Voice AI Speaker Demonstration */}
                      <button
                        type="button"
                        onClick={() => handleToggleSpeakReview(activeReviewText, selectedLang)}
                        className={`w-full py-2.5 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-2 transition active:scale-95 ${
                          isSpeaking && speakingLang === selectedLang
                            ? "bg-amber-500/20 border-amber-400/50 text-amber-300 ring-2 ring-amber-400/30 animate-pulse shadow-lg shadow-amber-950/40"
                            : "bg-slate-800/80 hover:bg-slate-700/80 border-indigo-500/30 text-indigo-200 hover:text-white"
                        }`}
                      >
                        {isSpeaking && speakingLang === selectedLang ? (
                          <>
                            <VolumeX className="w-4 h-4 text-amber-400 animate-bounce" />
                            <span>🔊 Playing Natural Voice AI • Tap to Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4 text-amber-400" />
                            <span>
                              🎙️ Listen to AI Speak in{" "}
                              {selectedLang === "TELUGU"
                                ? "Telugu (తెలుగు)"
                                : selectedLang === "HINDI"
                                ? "Hindi (हिंदी)"
                                : selectedLang === "TAMIL"
                                ? "Tamil (தமிழ்)"
                                : selectedLang === "KANNADA"
                                ? "Kannada (ಕನ್ನಡ)"
                                : selectedLang === "MALAYALAM"
                                ? "Malayalam (മലയാളం)"
                                : "English"}
                            </span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleCopyReview(activeReviewText)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition active:scale-95"
                        >
                          {copiedDraft ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-300" />
                              <span>Copied to Clipboard!</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-amber-300" />
                              <span>Copy &amp; Post Review</span>
                            </>
                          )}
                        </button>

                        <a
                          href={`/r/${activeDemo.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition flex items-center justify-center"
                          title="View live demo page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Explanation */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" /> High-Converting Pan-India Meta Strategy
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Why Regional Language Reviews Rank You #1 on Google Maps
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  In India, over 70% of local Google Maps and voice searches happen in native regional languages or Hinglish/Tanglish terms. When customers post reviews in Hindi, Telugu, Tamil, Kannada, or Malayalam:
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="p-4 rounded-2xl bg-slate-850/80 border border-white/10 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Dominates Local Voice Search Keywords</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Google Maps indexes phrases like &quot;బెస్ట్ షాప్&quot; or &quot;शानदार स्वाद&quot; directly to your Google Business Profile, bringing high-intent nearby customers to your door.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-850/80 border border-white/10 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Zero Typing Friction for Customers</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Customers are shy or uncomfortable typing long English paragraphs. With 1 tap, our AI generates authentic, warm reviews in their native language effortlessly.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-850/80 border border-white/10 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">100% Genuine Human Profiles</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Zero fake bots. Real walk-in customers submit from their own smartphones, passing Google&apos;s spam filters with zero penalty risk.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition active:scale-95"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Get Started for ₹2,999 Lifetime</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3D HARDWARE & STANDEE STUDIO SHOWCASE ─────────────────────────── */}
      <section id="hardware" className="py-20 px-4 sm:px-6 relative scroll-mt-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Printer className="w-3.5 h-3.5 text-amber-400" /> Physical Counter Display Formats
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Luxury Counter Displays &bull; Print Instantly
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Download high-resolution 300 DPI vector PDFs directly from your dashboard for 4&quot;×6&quot; Acrylic Standees, CR80 PVC Cards, or A4 Posters.
            </p>

            {/* Display Format Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMockupFormat("stand")}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  mockupFormat === "stand"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>4&quot;×6&quot; Acrylic Standee</span>
              </button>

              <button
                type="button"
                onClick={() => setMockupFormat("pvc-vertical")}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  mockupFormat === "pvc-vertical"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Dual-Sided PVC Card</span>
              </button>

              <button
                type="button"
                onClick={() => setMockupFormat("poster-a4")}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  mockupFormat === "poster-a4"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>A4 Wall Poster</span>
              </button>
            </div>

            {/* Theme switcher */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Palette className="w-3 h-3 text-indigo-400" /> Luxury Theme:
              </span>
              {(Object.keys(DISPLAY_THEMES) as Array<keyof typeof DISPLAY_THEMES>).map((tKey) => {
                const item = DISPLAY_THEMES[tKey];
                const isActive = mockupTheme === tKey;
                return (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => setMockupTheme(tKey)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition ${
                      isActive ? "bg-white text-slate-950 font-black shadow" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.dot }} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 3D Realistic Render Mockup (lg:col-span-6) */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
              {(() => {
                const currentTheme = DISPLAY_THEMES[mockupTheme];

                if (mockupFormat === "stand") {
                  return (
                    <div
                      className="relative flex flex-col items-center justify-center p-2 py-6 w-full max-w-sm"
                      style={{ perspective: "1200px" }}
                    >
                      <div
                        className={`relative w-64 sm:w-72 rounded-3xl bg-gradient-to-b ${currentTheme.cardBg} p-5 border-2 ${currentTheme.border} text-center transition-all duration-500 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.95)]`}
                        style={{
                          transform: "rotateY(-7deg) rotateX(4deg)",
                          transformStyle: "preserve-3d",
                        }}
                      >
                        <div
                          className="absolute inset-0 rounded-3xl pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.03) 40%, transparent 60%)",
                          }}
                        />

                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                            SMARTREVIEW AI
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] ${currentTheme.badge}`}>
                            ★ 5.0 GOOGLE
                          </span>
                        </div>

                        <div className="w-14 h-14 rounded-full bg-white border-2 border-amber-400 p-3 mx-auto mb-2 flex items-center justify-center shadow-lg">
                          <svg className="w-full h-full" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.665-5.2 3.665-9.12z" />
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.43 7.37 24 12 24z" />
                            <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.28 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                          </svg>
                        </div>

                        <h4 className="text-sm font-black text-white truncate px-2">{activeDemo.name}</h4>
                        <p className="text-[10px] text-slate-400 truncate mb-3">{activeDemo.category}</p>

                        <div className="w-36 h-36 bg-white p-2.5 rounded-2xl mx-auto shadow-2xl flex items-center justify-center relative border border-white/20 mb-3">
                          <QrCode className="w-full h-full text-slate-950" />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 border-2 border-white flex items-center justify-center shadow-lg">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-black mb-1">
                          <span>★ ★ ★ ★ ★</span>
                        </div>
                        <p className="text-[11px] font-black text-white tracking-wide">
                          POINT CAMERA TO REVIEW
                        </p>
                        <p className="text-[9px] text-slate-400 mt-0.5">
                          FAST GOOGLE MAPS REDIRECT &bull; ZERO APP INSTALL
                        </p>
                      </div>

                      <div
                        className="w-56 sm:w-64 h-5 rounded-b-2xl bg-gradient-to-r from-white/25 via-white/40 to-white/20 backdrop-blur-md border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.8)] -mt-2.5"
                        style={{ transform: "rotateY(-7deg) rotateX(28deg)" }}
                      />
                    </div>
                  );
                }

                if (mockupFormat === "pvc-vertical") {
                  return (
                    <div
                      className="relative flex flex-col items-center justify-center p-2 py-6 w-full max-w-sm"
                      style={{ perspective: "1200px" }}
                    >
                      <div
                        className={`relative w-56 sm:w-60 rounded-2xl bg-gradient-to-b ${currentTheme.cardBg} p-5 border-2 ${currentTheme.border} text-center transition-all duration-500 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.95)]`}
                        style={{
                          aspectRatio: "54 / 85.6",
                          transform: "rotateY(7deg) rotateX(4deg)",
                          transformStyle: "preserve-3d",
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                            CR80 PVC
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] ${currentTheme.badge}`}>
                            REVIEW PASS
                          </span>
                        </div>

                        <div className="w-12 h-12 rounded-full bg-white border-2 border-amber-400 p-2.5 mx-auto mb-2 flex items-center justify-center shadow-md">
                          <svg className="w-full h-full" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.665-5.2 3.665-9.12z" />
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.43 7.37 24 12 24z" />
                            <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.28 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                          </svg>
                        </div>

                        <h4 className="text-xs font-black text-white truncate px-1">{activeDemo.name}</h4>
                        <p className="text-[9px] text-slate-400 truncate mb-2.5">Official Customer Review Pass</p>

                        <div className="w-28 h-28 bg-white p-2 rounded-xl mx-auto shadow-xl flex items-center justify-center border border-white/20 mb-2.5">
                          <QrCode className="w-full h-full text-slate-950" />
                        </div>

                        <p className="text-[10px] font-black text-white tracking-wider uppercase">
                          POINT CAMERA &amp; REVIEW
                        </p>
                        <p className="text-[8px] text-slate-400 mt-0.5 font-mono">
                          PAN CARD SIZE &bull; 54×85.6 MM
                        </p>
                      </div>
                    </div>
                  );
                }

                // Poster
                return (
                  <div
                    className="relative flex flex-col items-center justify-center p-2 py-6 w-full max-w-sm"
                    style={{ perspective: "1200px" }}
                  >
                    <div
                      className={`relative w-64 sm:w-72 rounded-2xl bg-gradient-to-b ${currentTheme.cardBg} p-5 border-4 border-slate-700/80 text-center transition-all duration-500 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] ring-1 ${currentTheme.border}`}
                      style={{
                        aspectRatio: "210 / 297",
                        transform: "rotateY(-4deg) rotateX(2deg)",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">
                        OFFICIAL CUSTOMER NOTICE
                      </span>
                      <h4 className="text-sm font-black text-white leading-tight mb-2">WE VALUE YOUR FEEDBACK</h4>

                      <div className="w-12 h-12 rounded-full bg-white border-2 border-amber-400 p-2.5 mx-auto mb-2 flex items-center justify-center shadow-md">
                        <svg className="w-full h-full" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.665-5.2 3.665-9.12z" />
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.43 7.37 24 12 24z" />
                          <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.28 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                        </svg>
                      </div>

                      <div className="text-xs font-black text-white truncate">{activeDemo.name}</div>
                      <div className="text-amber-400 text-xs my-1">★ ★ ★ ★ ★</div>

                      <div className="w-32 h-32 bg-white p-2.5 rounded-2xl mx-auto shadow-2xl flex items-center justify-center border border-white/20 my-2">
                        <QrCode className="w-full h-full text-slate-950" />
                      </div>

                      <p className="text-[8px] text-slate-400 mt-2 font-mono">
                        A4 PRINTABLE &bull; 210×297 MM &bull; 300 DPI VECTOR PDF
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Specifications & Features */}
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Instant Vector PDF Exports
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Ready to Print at Any Local Xerox or Photo Studio
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Every ReviewSmart merchant receives lifetime access to our digital Standee Studio. You can generate custom PDF templates with your store brand colors, high-density QR code, and logo anytime with zero reprint costs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10">
                  <div className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-indigo-400" />
                    <span>Instant Camera Scan</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Works on iPhone &amp; Android cameras, plus Google Lens and PhonePe/GPay scanner.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10">
                  <div className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <span>Dynamic QR Guarantee</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Change your Google review link anytime from dashboard without changing physical standee!
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10">
                  <div className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>100% Ad-Free Experience</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Zero popups or third-party ads. A high-speed, luxury experience that elevates your brand.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10">
                  <div className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-purple-400" />
                    <span>Doorstep Acrylic Delivery</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Prefer physical pre-printed acrylic standees? Order directly on WhatsApp anytime!
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/15 text-white font-bold text-xs shadow-md transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Order Physical Standees on WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING SECTION (FLAGSHIP ₹2,999 LIFETIME PASS) ──────────────── */}
      <section id="pricing" className="py-24 px-4 sm:px-6 relative scroll-mt-16 bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SPECIAL ONLINE PROMOTION &bull; PAN-INDIA META ADS EXCLUSIVE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              One Price. Zero Subscriptions.
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                100% Free For Lifetime.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
              Say goodbye to greedy software subscriptions. Pay once today, and use ReviewSmart AI forever with all upcoming updates and free Google Business Profile setup.
            </p>
          </div>

          {/* Hero Lifetime Pricing Card */}
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-500/60 p-6 sm:p-10 shadow-[0_20px_70px_rgba(16,185,129,0.2)] max-w-3xl mx-auto overflow-hidden">
            {/* Top Banner Tag */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-500 text-slate-950 text-xs font-black uppercase tracking-wider py-1.5 px-6 rounded-bl-2xl shadow-md">
              ★ Lifetime Free Pass
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-white/10 pb-6 mb-6">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                  All-Inclusive Online License
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-3">
                  Online Direct Lifetime Access
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Complete Google Review Engine + 6-Language AI + Standee Studio + Free GMB
                </p>
              </div>

              <div className="text-left sm:text-right">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white">₹2,999</span>
                  <span className="text-xs text-slate-400 font-semibold line-through">₹7,999</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 block mt-1">
                  100% One-Time &bull; Lifetime Free
                </span>
              </div>
            </div>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-200 mb-8">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Lifetime Free Access</strong> (Zero monthly or annual subscriptions)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">🆓 Free GMB Setup &amp; Verification</strong> (If you don&apos;t have one yet)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">All Future Updates Free</strong> (All AI upgrades included at no extra cost)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">6 Indian Languages</strong> (Hindi, Telugu, Tamil, Kannada, Malayalam, English)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Private WhatsApp Feedback Shield</strong> (100% bad review damage control)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Standee Studio PDF Generator</strong> (300 DPI vector PDFs for 4x6, PVC &amp; A4)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">AI Review Reply Copilot</strong> (Instant polite review replies in 6 languages)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">100% Ad-Free Experience</strong> (Zero third-party ads or spam trackers)</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard/billing?plan=ONLINE_LIFETIME"
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition active:scale-98"
              >
                <Zap className="w-4 h-4" />
                <span>Activate Lifetime Pass (₹2,999)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={whatsappDirectBuyUrl}
                target="_blank"
                rel="noreferrer"
                className="py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm flex items-center justify-center gap-2 border border-white/15 transition active:scale-98"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Activate via WhatsApp</span>
              </a>
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-4">
              🔒 Instant UPI Payment (GPay, PhonePe, Paytm, BHIM) &bull; Activated in 2 minutes &bull; Instant Invoice
            </p>
          </div>

          {/* Honest Comparison Table */}
          <div className="mt-14 overflow-hidden rounded-3xl bg-slate-900 border border-white/10 shadow-xl">
            <div className="p-5 sm:p-6 bg-slate-850 border-b border-white/10">
              <h3 className="text-base sm:text-lg font-bold text-white text-center">
                Honest Comparison: ReviewSmart AI vs Monthly Subscription Tools
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 bg-slate-950/40">
                    <th className="py-3.5 px-4 font-bold">Feature / Cost</th>
                    <th className="py-3.5 px-4 font-black text-emerald-400 bg-emerald-500/10 border-x border-emerald-500/20">
                      ReviewSmart AI
                    </th>
                    <th className="py-3.5 px-4 font-bold text-slate-400">Typical SaaS Agencies</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr>
                    <td className="py-3.5 px-4 font-medium">Software Cost</td>
                    <td className="py-3.5 px-4 font-black text-emerald-400 bg-emerald-500/5 border-x border-emerald-500/10">
                      ₹2,999 One-Time (Lifetime)
                    </td>
                    <td className="py-3.5 px-4 text-rose-400 font-semibold">₹2,000 - ₹4,500 / Month</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium">1-Year Cost</td>
                    <td className="py-3.5 px-4 font-black text-emerald-400 bg-emerald-500/5 border-x border-emerald-500/10">
                      ₹2,999 Total
                    </td>
                    <td className="py-3.5 px-4 text-rose-400 font-semibold">₹24,000 - ₹54,000+</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium">Free GMB Creation &amp; Verification</td>
                    <td className="py-3.5 px-4 font-black text-emerald-400 bg-emerald-500/5 border-x border-emerald-500/10">
                      Included 100% Free
                    </td>
                    <td className="py-3.5 px-4 text-rose-400 font-semibold">₹2,500 - ₹5,000 Extra Charge</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium">Regional Indian Languages</td>
                    <td className="py-3.5 px-4 font-black text-emerald-400 bg-emerald-500/5 border-x border-emerald-500/10">
                      6 Native Languages
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">English Only</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium">Private Negative Shield</td>
                    <td className="py-3.5 px-4 font-black text-emerald-400 bg-emerald-500/5 border-x border-emerald-500/10">
                      Included 100%
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">Rarely Included</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium">Future AI Upgrades</td>
                    <td className="py-3.5 px-4 font-black text-emerald-400 bg-emerald-500/5 border-x border-emerald-500/10">
                      Free for Life
                    </td>
                    <td className="py-3.5 px-4 text-rose-400 font-semibold">Extra Upgrade Fees</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Offline Deals Clarification Note */}
          <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-white/10 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <p>
                <strong className="text-white">Note for Offline Agent Deals:</strong> Offline clients working with our certified marketing partners in their cities receive on-site store setup and physical hardware standee packs at localized agent pricing. Online customers receive instant full-platform lifetime software access at ₹2,999!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── REAL VERIFIED MERCHANTS SHOWCASE ─────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 relative bg-slate-900/40 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-emerald-400" /> Real Verified Stores
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Trusted by Merchants Across South &amp; North India
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Click any store below to experience their live public review portal:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEMO_PRESETS.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-2xl bg-slate-900 border border-white/10 hover:border-indigo-500/40 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {m.category}
                    </span>
                    <span className="text-amber-400 text-xs font-bold">★ 4.9</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{m.name}</h4>
                  <p className="text-xs text-slate-400 mb-3">{m.location}</p>
                </div>

                <a
                  href={`/r/${m.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <span>Open Live Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INTERACTIVE ROI CALCULATOR ───────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 relative border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> ROI Revenue Projection
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              See How Fast You Recover ₹2,999
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Drag the slider to match your estimated daily walk-in customers:
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl">
            {/* Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300">Daily Walk-in Footfall:</span>
                <span className="text-base font-black text-indigo-300 bg-indigo-500/20 border border-indigo-500/40 px-3.5 py-1 rounded-xl">
                  {dailyCustomers} Walk-ins / Day
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={dailyCustomers}
                onChange={(e) => setDailyCustomers(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                <span>10 (Clinic / Boutique)</span>
                <span>50 (Busy Store / Salon)</span>
                <span>250+ (High Footfall Restaurant)</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-850 border border-white/5">
                <div className="text-xs font-medium text-slate-400 mb-1">Without ReviewSmart</div>
                <div className="text-2xl font-black text-slate-500">~{estimatedReviewsWithout} reviews</div>
                <p className="text-[10px] text-slate-500 mt-1">Per month organic</p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-b from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500/40 shadow-lg">
                <div className="text-xs font-bold text-indigo-300 mb-1 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> With ReviewSmart AI
                </div>
                <div className="text-3xl font-black text-emerald-400">+{estimatedReviewsWith} Reviews!</div>
                <p className="text-[10px] text-emerald-300 font-semibold mt-1">5-Star Google Reviews / Month 🚀</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-850 border border-white/5">
                <div className="text-xs font-medium text-slate-400 mb-1">Shielded Complaints</div>
                <div className="text-2xl font-black text-emerald-400">{shieldedComplaints} Alerts</div>
                <p className="text-[10px] text-slate-500 mt-1">Saved from public Google damage</p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <span className="text-xs font-bold text-emerald-300 flex items-center justify-center sm:justify-start gap-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Estimated Monthly Revenue Gain:
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ranking #1 on Google Maps drives fresh high-value walk-ins each week.
                </p>
              </div>
              <div className="text-2xl font-black text-emerald-400 whitespace-nowrap">
                +₹{estimatedRevenueGain.toLocaleString("en-IN")}/mo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FREQUENTLY ASKED QUESTIONS (FAQ) ─────────────────────────────── */}
      <section id="faq" className="py-20 px-4 sm:px-6 relative border-t border-white/10 bg-slate-900/50 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" /> Common Questions
            </div>
            <h2 className="text-3xl font-black text-white">
              Everything You Need to Know
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Clear, transparent answers about our pan-India ₹2,999 Lifetime Pass:
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900 border border-white/10 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-sm sm:text-base font-bold text-white hover:text-indigo-300 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? "rotate-180 text-indigo-400" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA BANNER ─────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-t border-white/10 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <BrandIcon size="xl" className="mx-auto drop-shadow-2xl" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            Ready to Dominate Google Maps in Your City?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join forward-thinking shop owners and healthcare professionals across India. Activate your ₹2,999 Lifetime Pass in 2 minutes &bull; Free GMB Setup Included!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/dashboard/billing?plan=ONLINE_LIFETIME"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-2xl shadow-emerald-500/30 transition active:scale-98"
            >
              <Zap className="w-4 h-4" />
              <span>Get Lifetime Pass (₹2,999)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={whatsappDirectBuyUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm flex items-center justify-center gap-2 border border-white/15 transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Instant WhatsApp Activation</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 py-8 px-4 sm:px-6 bg-slate-950 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo href="/" size="sm" theme="dark" />
          <p className="text-center text-slate-500">
            &copy; {new Date().getFullYear()} ReviewSmart AI &bull; Pan-India Google Review Engine &bull; All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/918639831132"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp
            </a>
            <Link href="/login" className="hover:text-white transition flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-indigo-400" /> Merchant Login
            </Link>
          </div>
        </div>
      </footer>

      {/* ─── STICKY MOBILE CONVERSION BAR (FOR INSTA & FB WEBVIEWS) ───────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 p-3 pb-[max(env(safe-area-inset-bottom),12px)] shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-400 block tracking-wider">
              LIFETIME PASS &bull; FREE GMB SETUP
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-white">₹2,999</span>
              <span className="text-[10px] text-slate-400 line-through">₹7,999</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={whatsappDirectBuyUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-slate-800 border border-white/10 text-emerald-400 hover:text-emerald-300 transition"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            <Link
              href="/dashboard/billing?plan=ONLINE_LIFETIME"
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md active:scale-95 transition"
            >
              <span>Get Pass</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
