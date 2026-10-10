import {
  validateReviewUniqueness,
  MemoryReviewItem,
} from "./review-memory";
import { detectIndustry, IndustryType } from "./industry";
import {
  validateBusinessRelevance,
  extractBusinessLocation,
  BusinessProfile,
} from "./domain-fences";

export type LanguageMode = "ENGLISH" | "TELUGU_SCRIPT" | "TELUGU_ENGLISH" | "TELUGU_ROMAN" | "AUTO";

export interface SynthesizerParams {
  businessName: string;
  category?: string;
  tagline?: string | null;
  location?: string;
  keywords?: string;
  tagChips?: string;
  selectedTags?: string[];
  customNote?: string;
  tone?: string;
  languageMode?: LanguageMode;
  history?: MemoryReviewItem[];
}

export interface SynthesizedReview {
  id: number;
  headline: string;
  text: string;
  tone: string;
  structureTag: string;
  writingStyle: string;
  languageMix: string;
}

// ─── RANDOM HELPERS ─────────────────────────────────────────────────────────
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMaybe<T>(arr: T[], probability = 0.5): T | null {
  return Math.random() < probability ? pickRandom(arr) : null;
}

// ─── DOMAIN LEXICONS ────────────────────────────────────────────────────────
export interface DomainLexicon {
  items: string[];
  qualities: string[];
  adjectives: string[];
  actions: string[];
  occasions: string[];
}

export const DOMAIN_LEXICONS: Record<IndustryType, DomainLexicon> = {
  GOLD_BUYERS: {
    items: [
      "selling gold for cash",
      "old gold evaluation and buying",
      "computerized gold purity testing",
      "transparent gold valuation",
      "pledged gold assistance to release bank loans",
      "transparent gold pricing based on live bullion rate",
      "quick instant payment via bank transfer",
      "doorstep gold evaluation assistance",
      "converting old unused gold ornaments into money",
      "releasing pledged gold from pawn brokers",
    ],
    qualities: [
      "German computerized XRF purity testing without damaging or melting ornaments",
      "100% transparent digital weighing with live market pricing right before our eyes",
      "spot IMPS / RTGS bank transfer credited within 2 minutes of evaluation",
      "professional pledged gold assistance clearing bank loans without hassle",
      "transparent gold valuation with zero hidden deductions or melting losses",
      "safe, respectful, and confidential gold buying service",
      "honest old-gold evaluation giving the absolute highest market value",
      "doorstep gold evaluation assistance with prompt, courteous service",
    ],
    adjectives: [
      "transparent and honest",
      "safe and confidential",
      "quick and professional",
      "genuine and trustworthy",
      "best market rate",
      "smooth and hassle-free",
      "reliable and polite",
    ],
    actions: [
      "visited them to sell gold for cash",
      "opted for old gold evaluation and immediate payment",
      "sought their pledged gold assistance to close a bank loan",
      "got our gold purity tested and valued",
      "approached them to convert unused gold ornaments into funds",
      "checked their transparent gold pricing for",
    ],
    occasions: [
      "during an urgent financial requirement",
      "to release pledged gold from the bank and get balance cash",
      "to convert old unused gold into instant funds",
      "to get accurate gold purity testing and market valuation",
      "for a quick, confidential bank transfer",
      "recently",
      "last week",
      "yesterday",
    ],
  },

  PRINTING_GRAPHICS: {
    items: [
      "flex banner printing",
      "commercial sign board",
      "visiting cards",
      "vinyl stickers",
      "glow sign board",
      "pamphlets and brochures",
      "customized mug printing",
      "customized t-shirt printing",
      "roll-up standee",
      "acrylic lettering board",
      "offset printing",
      "graphic design work",
    ],
    qualities: [
      "sharp color printing, clean edges, and weather-proof outdoor flex durability",
      "high-resolution vector graphics, accurate typography, and vibrant banner colors",
      "thick card stock, premium matte laminate, and crisp font readability on visiting cards",
      "strong frame structure, bright LED illumination, and clean installation on the sign board",
      "seamless color grading, creative layout balance, and quick file delivery",
      "flawless printing speed, zero color banding, and punctual handover",
      "patient design adjustments and accurate proof verification before final print",
    ],
    adjectives: [
      "sharp and vibrant",
      "clear and high resolution",
      "super neat and professional",
      "durable and eye-catching",
      "clean and premium",
      "reliable and fast",
      "solid and well executed",
    ],
    actions: [
      "ordered",
      "got our",
      "designed and printed",
      "customized",
      "hired them for",
      "printed our",
      "coordinated for",
    ],
    occasions: [
      "for our shop grand opening",
      "for our business marketing campaign",
      "for our event promotion banners",
      "for our brand visiting cards",
      "for a college fest sponsorship flex",
      "for our new office sign board",
      "recently",
      "last week",
    ],
  },

  PHOTOGRAPHY_STUDIO: {
    items: [
      "pre-wedding shoot",
      "candid wedding photography",
      "traditional wedding photography",
      "cinematic wedding film",
      "fashion and portfolio shoot",
      "headshots and corporate portraits",
      "corporate event coverage",
      "customized gifts",
      "cup printing",
      "pillow printing",
      "magic pillow",
      "keychain printing",
      "big size photo frame",
      "photo frame",
      "photo prints",
      "acrylic wall frame",
      "album design",
      "tabletop photo frame",
      "canvas print",
    ],
    qualities: [
      "camera angles, lighting setup, and natural expressions",
      "cinematic color grading, drone footage, and background music in the film",
      "candid moments captured naturally without staged poses",
      "sharp focus, studio lighting, and clean background in the portfolio",
      "ceramic cup print gloss and vibrant durable colors",
      "magic pillow sequin flip smoothness and crisp hidden photo reveal",
      "pillow print fabric softness and stitch durability",
      "acrylic keychain border cut and scratch-resistant photo finish",
      "big size photo frame clarity, high-res canvas texture, and wall presence",
      "print resolution, album binding, and photo clarity",
      "punctuality and polite coordination during the entire shoot",
    ],
    adjectives: [
      "sharp and vibrant",
      "cinematic and breathtaking",
      "super neat and professional",
      "high quality and natural",
      "clean and premium",
      "very crisp",
      "flawless and creative",
    ],
    actions: [
      "booked them for",
      "hired their team for",
      "scheduled our",
      "customized",
      "designed",
      "covered our",
      "coordinated for",
      "got our",
    ],
    occasions: [
      "for our wedding ceremony",
      "for our pre-wedding outdoor shoot",
      "for a personalized surprise gift",
      "for my professional corporate profile",
      "for our corporate conference",
      "for an anniversary surprise gift",
      "for a family celebration",
      "recently",
      "last month",
    ],
  },

  SOFTWARE_IT: {
    items: [
      "custom software development",
      "web application development",
      "mobile app development",
      "cloud infrastructure setup",
      "UI/UX design and prototyping",
      "backend API integration",
      "system database optimization",
      "responsive website design",
      "prompt tech support and maintenance",
    ],
    qualities: [
      "clean code architecture, modular design, and robust error handling",
      "intuitive user interface, smooth animations, and responsive mobile layouts",
      "fast API response times, secure authentication, and seamless database queries",
      "agile sprint communication, regular demo updates, and transparent tracking",
      "quick bug resolution and reliable post-launch technical support",
    ],
    adjectives: [
      "robust and scalable",
      "clean and responsive",
      "highly efficient",
      "professional and dependable",
      "smooth and modern",
      "well structured",
    ],
    actions: [
      "hired them for",
      "partnered with them for",
      "collaborated on our",
      "developed our",
      "entrusted them with",
      "built our",
    ],
    occasions: [
      "for our company platform launch",
      "for our mobile app release",
      "for our business digital transformation",
      "for our client project delivery",
      "recently",
      "this quarter",
    ],
  },

  RESTAURANT_FOOD: {
    items: [
      "special biryani and starters",
      "authentic thali meals",
      "tandoori specialties",
      "evening snacks",
      "freshly prepared curries and rotis",
      "refreshing mocktails",
      "desserts and ice creams",
      "hot breakfast combo",
    ],
    qualities: [
      "rich aroma, balanced spice blend, and authentic traditional taste",
      "generous portion sizes, fresh ingredients, and piping hot serving",
      "clean kitchen hygiene, organized seating, and welcoming ambiance",
      "attentive and polite table service with minimal wait time",
    ],
    adjectives: [
      "delicious and authentic",
      "flavorful and piping hot",
      "freshly prepared",
      "rich in taste",
      "generous and satisfying",
      "wonderfully spiced",
    ],
    actions: ["tried", "ordered", "visited for", "enjoyed", "stopped by for", "dined in for"],
    occasions: [
      "with family for dinner",
      "during lunch break",
      "for a weekend treat",
      "with friends yesterday",
      "while passing by the area",
    ],
  },

  SALON_BEAUTY: {
    items: [
      "haircut and styling",
      "beard grooming and shaping",
      "facial cleanup",
      "hair spa therapy",
      "head massage",
      "bridal makeover",
      "skin care treatment",
    ],
    qualities: [
      "patient listening to personal styling preferences",
      "sanitized equipment, clean towels, and hygienic workstation",
      "skillful scissor work and neat hairline finishing",
      "relaxing atmosphere and unrushed attentive service",
    ],
    adjectives: [
      "neat and stylish",
      "hygienic and relaxing",
      "super professional",
      "sharp and well finished",
      "very polite and skilled",
    ],
    actions: ["got a", "went for", "booked a session for", "tried their", "visited for"],
    occasions: [
      "before a family function",
      "for monthly grooming",
      "over the weekend",
      "yesterday afternoon",
    ],
  },

  HEALTHCARE_CLINIC: {
    items: [
      "health consultation",
      "routine checkup",
      "diagnostic service",
      "painless dental cleaning",
      "physiotherapy session",
      "clinical follow-up",
    ],
    qualities: [
      "doctor's detailed and reassuring explanation",
      "strict clinical hygiene and sanitized instruments",
      "polite clinic staff and minimal waiting time",
      "honest medical guidance without unnecessary procedures",
    ],
    adjectives: [
      "caring and attentive",
      "thorough and reassuring",
      "very hygienic and safe",
      "patient and transparent",
      "professional and gentle",
    ],
    actions: ["visited for", "consulted for", "had an appointment for", "approached them for"],
    occasions: ["for a routine check", "earlier this week", "recently"],
  },

  AUTO_GARAGE: {
    items: [
      "vehicle periodic servicing",
      "engine oil change and filter replacement",
      "brake and suspension inspection",
      "wheel alignment and balancing",
      "electrical diagnostic check",
      "general vehicle repair",
    ],
    qualities: [
      "transparent cost estimation before beginning repair work",
      "use of genuine OEM spare parts and quality lubricants",
      "skilled mechanics who accurately diagnose issues without guesswork",
      "timely vehicle delivery and noticeably smoother driving performance",
    ],
    adjectives: [
      "honest and dependable",
      "skilled and thorough",
      "prompt and professional",
      "transparently priced",
      "very reliable",
    ],
    actions: ["gave my vehicle for", "got serviced", "visited for", "had repairs done on"],
    occasions: [
      "before a long road trip",
      "for periodic general maintenance",
      "after noticing unusual noise",
      "recently",
      "last week",
    ],
  },

  FITNESS_GYM: {
    items: [
      "strength and resistance training",
      "personal fitness coaching",
      "cardio and endurance workout",
      "weight management program",
      "functional training session",
    ],
    qualities: [
      "state-of-the-art gym machinery and well-maintained weights",
      "encouraging and certified personal trainers who correct form",
      "clean workout floor, hygienic locker rooms, and great ventilation",
      "energetic and motivating fitness atmosphere",
    ],
    adjectives: [
      "high-energy and motivating",
      "well equipped",
      "clean and spacious",
      "highly supportive",
      "results oriented",
    ],
    actions: ["joined for", "training here for", "enrolled in", "worked out with"],
    occasions: ["for daily workout", "to build strength", "for fitness routine", "recently"],
  },

  RETAIL_SHOP: {
    items: [
      "ethnic wear and designer sarees",
      "casual and formal clothing",
      "curated fabric collection",
      "festive fashion wear",
      "lifestyle accessories",
    ],
    qualities: [
      "rich fabric textures, durable stitching, and attractive color palettes",
      "wide variety of designs matching current fashion trends",
      "patient and courteous sales assistance without pushy selling",
      "fair and transparent pricing with clear billing",
    ],
    adjectives: [
      "elegant and premium",
      "vibrant and trendy",
      "great value for money",
      "courteous and helpful",
      "highly satisfied",
    ],
    actions: ["shopped for", "purchased", "selected", "picked up"],
    occasions: [
      "for an upcoming family function",
      "for festival shopping",
      "for a family celebration",
      "over the weekend",
      "recently",
    ],
  },

  HOTEL_HOSPITALITY: {
    items: [
      "room accommodation",
      "weekend stay",
      "suite booking",
      "dining and room service",
      "travel lodging",
    ],
    qualities: [
      "spotless and sanitized rooms with comfortable bedding",
      "quick check-in and check-out by courteous front desk staff",
      "calm and peaceful ambiance in a convenient location",
      "warm hospitality and attentive customer care",
    ],
    adjectives: [
      "comfortable and clean",
      "peaceful and relaxing",
      "courteous and hospitable",
      "convenient and pleasant",
    ],
    actions: ["stayed for", "booked a room for", "checked in for", "visited for"],
    occasions: [
      "during a family holiday",
      "on a business trip",
      "for a weekend getaway",
      "recently",
    ],
  },

  PROFESSIONAL_SERVICES: {
    items: [
      "professional advisory consultation",
      "document verification",
      "legal and compliance guidance",
      "tax planning and filing",
      "business documentation assistance",
    ],
    qualities: [
      "deep domain knowledge and clear explanation of processes",
      "transparent pricing with zero hidden charges",
      "prompt follow-up and timely completion of paperwork",
      "honest and confidential handling of documentation",
    ],
    adjectives: [
      "trustworthy and competent",
      "meticulous and prompt",
      "clear and transparent",
      "highly professional",
    ],
    actions: ["consulted for", "approached for", "engaged for", "sought advisory on"],
    occasions: [
      "for annual filing",
      "for legal documentation",
      "for official verification",
      "recently",
    ],
  },

  TOURS_TRAVELS: {
    items: [
      "Tirupati temple darshan round trip cab",
      "self-drive car rental with FASTag",
      "fixed-fare Bangalore airport drop",
      "Gandikota Grand Canyon and Belum Caves day tour",
      "local Kadapa city cab package",
      "outstation cab for urgent Hyderabad trip",
      "clean AC Innova Crysta for family pilgrimage to Ahobilam",
      "weekend road trip cab with safe highway chauffeur",
      "outstation cab booking for Chennai corporate travel",
      "Kadapa local sightseeing and outstation drop",
    ],
    qualities: [
      "spotless sanitized AC vehicle with prompt 10-minute early arrival",
      "experienced highway chauffeur who drove smoothly on ghat roads",
      "100% upfront transparent pricing with zero hidden charges or extra fuel demands",
      "well-maintained Toyota Etios and Innova Crysta fleet with working AC and music",
      "instant WhatsApp quote and 24/7 responsive booking desk with Pavan and Jyothi",
      "FASTag-enabled self-drive cars with quick handover and zero deposit hassle",
      "safe highway driving, disciplined driver, and comfortable seating for elderly family members",
      "fixed airport transfer fare without surge pricing or late-night extra charges",
    ],
    adjectives: [
      "punctual and disciplined",
      "clean and well-maintained",
      "transparent and fair priced",
      "safe and courteous",
      "smooth and reliable",
      "professional and dependable",
      "comfortable and peaceful",
    ],
    actions: [
      "booked their cab for",
      "availed self-drive car rental for",
      "reserved their outstation ride for",
      "traveled with family for",
      "arranged temple darshan transport for",
      "hired their Innova Crysta for",
      "booked an airport drop for",
    ],
    occasions: [
      "for our family Tirupati pilgrimage trip",
      "for an early morning Bangalore airport flight drop",
      "for our weekend trip to Gandikota and Belum Caves",
      "for our outstation office trip to Hyderabad",
      "for our family pilgrimage darshan at Ahobilam",
      "for an urgent one-way drop",
      "recently",
      "last weekend",
    ],
  },

  TATTOO_STUDIO: {
    items: [
      "custom tattoo design",
      "fine-line portrait tattoo",
      "ear and nose piercing",
      "cover-up tattoo artwork",
      "calligraphy name tattoo",
      "helix and cartilage piercing",
      "tribal forearm tattoo",
      "minimalist aesthetic tattoo",
      "tattoo touch-up and shading",
      "skin pigmentation art",
    ],
    qualities: [
      "100% sterile setup with fresh single-use needles opened in front of me",
      "exceptional precision with crisp line work and smooth shading",
      "gentle hands and virtually painless piercing technique",
      "patient consultation and stencil customization until perfection",
      "modern wireless tattoo machine and high-grade skin-safe inks",
      "spotless studio hygiene and clear day-by-day healing aftercare advice",
      "skilled artistic hands that brought the reference design alive",
      "honest and reasonable pricing with zero hidden charges",
    ],
    adjectives: [
      "skilled and patient",
      "neat and hygienic",
      "detailed and precise",
      "gentle and professional",
      "creative and dependable",
      "friendly and courteous",
    ],
    actions: [
      "got inked with a custom tattoo at",
      "got ear piercing done at",
      "visited for a portrait tattoo at",
      "consulted for a cover-up tattoo at",
      "got nose piercing done at",
      "availed body piercing service at",
    ],
    occasions: [
      "for my first permanent tattoo",
      "for a meaningful memorial tattoo",
      "for a stylish ear piercing",
      "for an aesthetic custom design",
      "recently",
      "last week",
    ],
  },

  APPLIANCE_REPAIR: {
    items: [
      "AC deep jet wash and cleaning",
      "split AC cooling issue repair",
      "AC gas charging and leak fixing",
      "refrigerator cooling repair",
      "washing machine drum and spin fix",
      "doorstep appliance inspection",
      "inverter AC PCB circuit repair",
      "single and double door fridge gas refill",
      "prompt same-day doorstep repair",
      "copper pipe fitting and AC reinstallation",
    ],
    qualities: [
      "thorough deep jet wash restoring ice-cold cooling instantly",
      "transparent diagnosis with exact issue explained before touching the unit",
      "genuine replacement parts and precise pressure testing for gas refilling",
      "fast doorstep response arriving within an hour in Kadapa",
      "very neat work with zero wall dirt or water leakage mess",
      "fair and honest service charges with zero inflated estimates",
      "polite, certified technicians who tested the appliance thoroughly before leaving",
      "reliable cooling performance with lasting peace of mind",
    ],
    adjectives: [
      "prompt and skilled",
      "honest and reasonable",
      "neat and professional",
      "punctual and courteous",
      "reliable and efficient",
      "technically sound",
    ],
    actions: [
      "booked doorstep AC repair with",
      "called for urgent refrigerator cooling fix from",
      "availed deep jet wash AC service from",
      "got AC gas refilling done by",
      "reached out for washing machine repair to",
      "scheduled appliance servicing with",
    ],
    occasions: [
      "during the peak Kadapa summer heat",
      "when our AC stopped blowing cool air suddenly",
      "for our annual pre-summer AC servicing",
      "when our refrigerator stopped freezing overnight",
      "for our washing machine spin cycle issue",
      "recently",
      "yesterday",
      "last week",
    ],
  },

  GENERAL: {
    items: [
      "service requirement",
      "custom order",
      "work requested",
      "support assistance",
      "local service",
    ],
    qualities: [
      "polite and supportive staff coordination",
      "prompt communication and on-time completion",
      "honest recommendations and transparent dealing",
      "dependable outcome matching expectations",
    ],
    adjectives: [
      "dependable and polite",
      "neat and prompt",
      "honest and fair",
      "very satisfied",
      "reliable and smooth",
    ],
    actions: ["approached them for", "availed", "requested", "coordinated for", "visited for"],
    occasions: ["recently", "this week", "a couple days back"],
  },
};

export interface TagIntent {
  isPledged: boolean;
  isPurity: boolean;
  isSellOld: boolean;
  isValuation: boolean;
  isPayment: boolean;
  isDoorstep: boolean;
  isSafe: boolean;
  // Printing
  isFlexBanner: boolean;
  isSignBoard: boolean;
  isVisitingCard: boolean;
  isCustomMug: boolean;
  isGraphicDesign: boolean;
  // Photography
  isWeddingShoots: boolean;
  isCustomGifts: boolean;
  isPhotoFraming: boolean;
  // Salon & Beauty
  isBridal: boolean;
  isHair: boolean;
  isSkinFacial: boolean;
  isBodySpa: boolean;
  isAcademy: boolean;
  isLadiesOnly: boolean;
  // Tours & Travels
  isTirupati: boolean;
  isSelfDrive: boolean;
  isAirport: boolean;
  isGandikota: boolean;
  isCleanCab: boolean;
  isPunctualDriver: boolean;
  isOutstation: boolean;
  isFairPricing: boolean;
  // Tattoo & Piercing
  isCustomTattoo: boolean;
  isPiercing: boolean;
  isCoverUp: boolean;
  isPortrait: boolean;
  isHygiene: boolean;
  // Appliance Repair
  isAcService: boolean;
  isAcGasRefill: boolean;
  isJetWash: boolean;
  isFridgeRepair: boolean;
  isWashingMachine: boolean;
  isDoorstepService: boolean;
  isFairPriceAppliance: boolean;
  rawTag: string;
}

export function detectTagIntent(tags: string[], ind: IndustryType): TagIntent {
  const combined = (tags || []).join(" ").toLowerCase();
  return {
    isPledged: /pledge|loan|తాకట్టు|విడిపించ/i.test(combined),
    isPurity: /purity|xrf|test|ప్యూరిటీ|టెస్ట్/i.test(combined),
    isSellOld: /sell|old\s*gold|cash|అమ్మ|సేల్/i.test(combined),
    isValuation: /valuation|pricing|rate|ధర|రేటు|వాల్యుయేషన్|బులియన్/i.test(combined),
    isPayment: /instant|payment|quick|స్పాట్|పేమెంట్|డబ్బు/i.test(combined),
    isDoorstep: /doorstep|door\s*step|ఇంటి/i.test(combined),
    isSafe: /safe|confidential|నమ్మక|సెక్యూర్/i.test(combined),
    // Printing
    isFlexBanner: /flex|banner|బ్యానర్|ఫ్లెక్స్/i.test(combined),
    isSignBoard: /sign\s*board|glow|acrylic|బోర్డు|సైన్/i.test(combined),
    isVisitingCard: /visiting|card|brochure|pamphlet|కార్డ్|బ్రోచర్/i.test(combined),
    isCustomMug: /mug|t-?shirt|మగ్|టీషర్ట్/i.test(combined),
    isGraphicDesign: /graphic|design|డిజైన్/i.test(combined),
    // Photography
    isWeddingShoots: /wedding|candid|cinematic|shoot|వెడ్డింగ్|షూట్/i.test(combined),
    isCustomGifts: /gift|cup|pillow|magic|keychain|గిఫ్ట్|పిల్లో|కీచైన్|మగ్/i.test(combined),
    isPhotoFraming: /frame|framing|big\s*size|ఫ్రేమ్|ఫోటో/i.test(combined),
    // Salon & Beauty
    isBridal: /bridal|wedding|makeover|బ్రైడల్|పెళ్లి|మేకప్/i.test(combined),
    isHair: /hair|cut|spa|styling|smoothening|keratin|హెయిర్|కట్|స్పా|స్టైలింగ్/i.test(combined),
    isSkinFacial: /facial|skin|cleanup|glow|ఫేషియల్|స్కిన్/i.test(combined),
    isBodySpa: /body\s*spa|massage|relaxation|బాడీ|స్పా|మసాజ్/i.test(combined),
    isAcademy: /academy|course|training|beautician|designing|అకాడమీ|ట్రైనింగ్|కోర్స్/i.test(combined),
    isLadiesOnly: /ladies|women|female|స్త్రీ|మహిళ/i.test(combined),
    // Tours & Travels
    isTirupati: /tirupati|darshan|pilgrimage|ahobilam|srisailam|temple|తిరుపతి|దర్శనం/i.test(combined),
    isSelfDrive: /self\s*drive|car\s*rent|rental|సెల్ఫ్\s*డ్రైవ్|రెంటల్/i.test(combined),
    isAirport: /airport|drop|pickup|blr|flight|విమానాశ్రయం|ఎయిర్‌పోర్ట్/i.test(combined),
    isGandikota: /gandikota|canyon|belum|cave|tour|గండికోట/i.test(combined),
    isCleanCab: /clean|ambiance|vehicle|good\s*vehicles?|ac|innova|etios|కారు|వాహనం/i.test(combined),
    isPunctualDriver: /punctual|driver|chauffeur|fast\s*service|staff|friendly|డ్రైవర్|టైమ్/i.test(combined),
    isOutstation: /outstation|hyderabad|bangalore|chennai|హైదరాబాద్|బెంగళూరు/i.test(combined),
    isFairPricing: /fair|price|pricing|rate|rates|zero\s*hidden|ధర/i.test(combined),
    // Tattoo & Piercing
    isCustomTattoo: /custom|tattoo|ink|lettering|tribal|టాటూ|ఇంక్/i.test(combined),
    isPiercing: /piercing|ear|nose|helix|body\s*piercing|పియర్సింగ్|ముక్కుపుడక|చెవి/i.test(combined),
    isCoverUp: /cover-?up|re-?work|కవర్\s*అప్/i.test(combined),
    isPortrait: /portrait|realism|face|పోర్ట్రెయిట్/i.test(combined),
    isHygiene: /hygiene|sterile|needle|clean|హైజీన్|నీడిల్/i.test(combined),
    // Appliance Repair
    isAcService: /ac|air\s*conditioner|cooling|కూలింగ్|ఎయిర్\s*కండీషనర్/i.test(combined),
    isAcGasRefill: /gas|refill|charging|leak|గ్యాస్/i.test(combined),
    isJetWash: /jet\s*wash|foam|deep\s*clean|వాష్|జెట్/i.test(combined),
    isFridgeRepair: /fridge|refrigerator|freezer|ఫ్రిజ్|రిఫ్రిజిరేటర్/i.test(combined),
    isWashingMachine: /washing\s*machine|motor|drum|వాషింగ్\s*మెషిన్/i.test(combined),
    isDoorstepService: /doorstep|same-?day|quick|visit|ఇంటి|డెలివరీ|ఫాస్ట్|డోర్‌స్టెప్/i.test(combined),
    isFairPriceAppliance: /affordable|fair|rate|price|genuine|ధర|రీజనబుల్/i.test(combined),
    rawTag: tags[0] || "",
  };
}

export function getDomainLexicon(
  industryType: IndustryType,
  activeTags: string[] = [],
  profileContext: string = ""
): DomainLexicon {
  const base = DOMAIN_LEXICONS[industryType] || DOMAIN_LEXICONS.GENERAL;

  if (industryType === "SALON_BEAUTY") {
    const tagsText = activeTags.join(" ").toLowerCase();
    const fullContext = (tagsText + " " + profileContext).toLowerCase();
    const isLadies = fullContext.includes("ladies") || fullContext.includes("women") || fullContext.includes("sushma") || fullContext.includes("sussma");
    const isAcademy = fullContext.includes("academy") || fullContext.includes("training") || fullContext.includes("course");

    let items = [...base.items];
    let qualities = [...base.qualities];

    if (isLadies) {
      items = items.filter((it) => !it.toLowerCase().includes("beard"));
    }
    if (isAcademy) {
      items.push(
        "beautician course & practical training",
        "advanced hair cutting & styling classes",
        "fashion designing diploma training"
      );
      qualities.push(
        "hands-on practical training, experienced faculty, and step-by-step guidance",
        "in-depth beautician curriculum with personal attention to every student"
      );
    }

    return {
      ...base,
      items,
      qualities,
    };
  }

  if (industryType !== "GOLD_BUYERS") {
    return base;
  }

  const tagsText = activeTags.join(" ").toLowerCase();
  const fullContext = (tagsText + " " + profileContext).toLowerCase();
  const allowDoorstep = fullContext.includes("doorstep") || fullContext.includes("door step");
  const allowPledged = fullContext.includes("pledge") || fullContext.includes("loan") || fullContext.includes("తాకట్టు");

  const filteredItems = base.items.filter((item) => {
    const itemLower = item.toLowerCase();
    if (!allowDoorstep && itemLower.includes("doorstep")) return false;
    if (!allowPledged && (itemLower.includes("pledge") || itemLower.includes("loan"))) return false;
    return true;
  });

  const filteredQualities = base.qualities.filter((q) => {
    const qLower = q.toLowerCase();
    if (!allowDoorstep && qLower.includes("doorstep")) return false;
    if (!allowPledged && (qLower.includes("pledge") || qLower.includes("loan"))) return false;
    return true;
  });

  const filteredOccasions = base.occasions.filter((o) => {
    const oLower = o.toLowerCase();
    if (!allowPledged && (oLower.includes("pledge") || oLower.includes("loan"))) return false;
    return true;
  });

  return {
    ...base,
    items: filteredItems.length > 0 ? filteredItems : base.items,
    qualities: filteredQualities.length > 0 ? filteredQualities : base.qualities,
    occasions: filteredOccasions.length > 0 ? filteredOccasions : base.occasions,
  };
}

// ─── DOMAIN-ISOLATED STYLES ─────────────────────────────────────────────────

// Style 1: Short & Direct Punchy (Structure F)
function generateShortDirect(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  const intent = detectTagIntent(tags, ind);
  const item = tags[0] || pickRandom(lex.items);

  let openers: string[];
  let closers: string[];

  if (ind === "GOLD_BUYERS") {
    if (intent.isPledged) {
      openers = [
        `Quick turnaround and dependable handling of pledged gold release.`,
        `Smooth experience getting our pledged gold loan settled.`,
        `Very pleased with the pledged gold assistance from ${bName}.`,
        `Prompt gold loan clearance and polite staff at ${bName}.`,
        `Got my pledged gold released and settled in no time.`,
      ];
      closers = [
        `Received the balance payout immediately.`,
        `Bank loan closed with zero hassle.`,
        `Totally satisfied with the loan assistance.`,
        `Thank you team!`,
        `Smooth and transparent transaction.`,
      ];
    } else if (intent.isPurity) {
      openers = [
        `Accurate and 100% transparent gold purity testing at ${bName}.`,
        `Computerized German XRF testing with zero damage on our ornaments.`,
        `Very pleased with the digital purity testing from ${bName}.`,
        `Prompt gold purity test and polite staff at ${bName}.`,
      ];
      closers = [
        `Output was scientifically precise.`,
        `Accurate karat report in 2 minutes.`,
        `Totally satisfied with the testing.`,
        `Thank you team!`,
      ];
    } else {
      openers = [
        `Neat and transparent handling for selling our gold.`,
        `Quick turnaround and fair live market rate at ${bName}.`,
        `Very pleased with the instant payment from ${bName}.`,
        `Clean digital weighing and respectful behavior at ${bName}.`,
        `Smooth experience getting our gold evaluated and sold.`,
      ];
      closers = [
        `Bank transfer was instant.`,
        `Received full fair value.`,
        `Totally satisfied with the payout.`,
        `Thank you team!`,
        `Will visit again.`,
        `100% genuine dealing.`,
      ];
    }
  } else if (ind === "SALON_BEAUTY") {
    if (intent.isBridal) {
      openers = [
        `Superb bridal makeup and grooming at ${bName}.`,
        `Loved the bridal makeover for my special day!`,
        `Flawless HD bridal styling with a natural glow.`,
        `Punctual, polite, and wonderful bridal makeover at ${bName}.`,
      ];
      closers = [
        `Looked stunning in photos and got compliments throughout the event!`,
        `The makeup lasted all day without needing touchups.`,
        `Made my wedding day feel truly special, thank you ${bName}!`,
        `Highly recommend their bridal team!`,
      ];
    } else if (intent.isAcademy) {
      openers = [
        `Excellent beautician and styling training at ${bName} Academy.`,
        `Joined ${bName} for their beauty salon training course.`,
        `Very thorough and hands-on coaching at ${bName} Academy.`,
        `Best academy in Kadapa for professional beautician courses.`,
      ];
      closers = [
        `Instructors teach with great patience and practical focus.`,
        `Gained huge confidence in advanced hair cuts and bridal styling.`,
        `Truly value for money and a great place to learn.`,
        `Great career guidance for women!`,
      ];
    } else if (intent.isBodySpa || intent.isSkinFacial) {
      openers = [
        `Relaxing facial and spa session at ${bName}.`,
        `Loved the skin care and body spa treatment at ${bName}.`,
        `Soothing ladies-only atmosphere and gentle skin care.`,
        `Very refreshing facial and herbal skincare service.`,
      ];
      closers = [
        `Skin feels noticeably hydrated, soft, and refreshed.`,
        `Complete privacy and peace of mind for ladies in Viswandhapuram.`,
        `Walked out feeling rejuvenated and relaxed.`,
        `Soothing experience all around.`,
      ];
    } else if (intent.isHair) {
      openers = [
        `Great advanced hair cut and hair spa at ${bName}.`,
        `Loved how my hair turned out at ${bName}!`,
        `Professional hair styling and nourishing hair spa session.`,
        `Neat styling that matched my exact preference.`,
      ];
      closers = [
        `Hair feels so light, healthy, and bouncy.`,
        `The stylist understood exactly the length and cut I wanted.`,
        `Zero frizz and great hair texture after the spa!`,
        `Very happy with the hair makeover.`,
      ];
    } else {
      openers = [
        `Comfortable and hygienic ladies-only beauty salon at ${bName}.`,
        `Always a pleasant grooming visit at ${bName}.`,
        `One of the most trusted beauty parlors in Viswandhapuram, Kadapa.`,
        `Clean setup and gentle beauty care at ${bName}.`,
      ];
      closers = [
        `Courteous staff, safe environment for women, and great prices.`,
        `Definitely my regular spot for beauty care in Kadapa!`,
        `Polite ladies staff and excellent service.`,
        `Totally satisfied!`,
      ];
    }
  } else if (ind === "TOURS_TRAVELS") {
    if (intent.isSelfDrive) {
      openers = [
        `Booked self-drive rental from ${bName} and had a fantastic experience.`,
        `Smooth self-drive car rental at ₹1,499/day with FASTag included.`,
        `Sanitized car, easy documentation, and quick vehicle handover at ${bName}.`,
        `Rented an Etios self-drive car for our weekend road trip.`,
      ];
      closers = [
        `Zero hidden charges at return and deposit was settled promptly.`,
        `Best self-drive car service in Kadapa!`,
        `Vehicle was in showroom condition with chilled AC.`,
        `100% recommended for hassle-free self-drive!`,
      ];
    } else if (intent.isTirupati) {
      openers = [
        `Booked ${bName} for our family Tirupati darshan round trip.`,
        `Punctual early morning pickup for our Tirupati temple trip.`,
        `Clean AC Innova Crysta and very disciplined chauffeur for Tirupati darshan.`,
        `Hassle-free sacred pilgrimage tour to Tirupati with ${bName}.`,
      ];
      closers = [
        `Round trip was just ₹2,099 as quoted with zero hidden costs.`,
        `Safe driving on ghat roads and peaceful family darshan.`,
        `Driver was polite, knew temple timings, and waited patiently.`,
        `Will always book them for pilgrimage trips!`,
      ];
    } else if (intent.isAirport) {
      openers = [
        `Fixed-fare Bangalore airport drop with ${bName}.`,
        `Punctual 2 AM pickup for our morning flight to Bangalore airport.`,
        `Hassle-free outstation airport transfer from Kadapa.`,
        `Reliable airport drop service with ${bName}.`,
      ];
      closers = [
        `Reached BLR airport well ahead of schedule with smooth highway driving.`,
        `Fixed fare of ₹5,499 with zero surge pricing or night drama.`,
        `Spacious luggage boot, chilled AC, and very safe highway chauffeur.`,
        `Dependable airport drop anytime!`,
      ];
    } else if (intent.isGandikota) {
      openers = [
        `Had a memorable day tour to Gandikota canyon and Belum Caves with ${bName}.`,
        `Superb sightseeing package to Gandikota from Kadapa.`,
        `Full-day Gandikota tour at ₹2,799 with clean AC car and polite driver.`,
      ];
      closers = [
        `Driver acted as a helpful guide and showed all viewpoints patiently.`,
        `Returned safely to Kadapa by evening without feeling rushed.`,
        `Best day trip package around Kadapa!`,
      ];
    } else {
      openers = [
        `Punctual pickup, spotless AC cab, and courteous driver from ${bName}.`,
        `Dependable cab service in Kadapa with upfront transparent pricing.`,
        `Very smooth outstation journey with ${bName}.`,
        `Booked through WhatsApp and received instant confirmation from Pavan & Jyothi.`,
      ];
      closers = [
        `Driver was polite, drove safely, and AC was chilling throughout.`,
        `Zero hidden costs, exactly what was quoted on WhatsApp.`,
        `Will definitely book again for our next journey!`,
        `Top travel service in Kadapa and Rayalaseema!`,
      ];
    }
  } else if (ind === "TATTOO_STUDIO") {
    if (intent.isPiercing) {
      openers = [
        `Got ear and nose piercing done at ${bName} and it was virtually painless.`,
        `Very gentle hands and sterile single-use equipment for piercing at ${bName}.`,
        `Super hygienic piercing setup with clear healing advice.`,
        `Got helix piercing done here and the healing has been so smooth.`,
      ];
      closers = [
        `Zero swelling or irritation, healed up quickly!`,
        `Opened sterilized needles right in front of me. Highly recommend!`,
        `Most gentle and safe piercing studio in Kadapa!`,
        `Extremely satisfied with the piercing experience!`,
      ];
    } else if (intent.isPortrait) {
      openers = [
        `Got a realistic portrait tattoo done by Karthik at ${bName}.`,
        `The facial detailing and shading on my portrait tattoo are unbelievable!`,
        `Brought a complex portrait photo to ${bName} and the outcome is identical.`,
      ];
      closers = [
        `The line work and depth look alive on skin. True artistic talent!`,
        `Everyone who sees the portrait is stunned by the perfection.`,
        `Master tattoo artist in Kadapa!`,
      ];
    } else if (intent.isCoverUp) {
      openers = [
        `Came to ${bName} for a cover-up tattoo over an old faded design.`,
        `Karthik designed a clever cover-up that completely masked my old tattoo.`,
        `Exceptional cover-up tattoo work at ${bName}.`,
      ];
      closers = [
        `You cannot even tell there was an old tattoo underneath. Amazing transformation!`,
        `Creative stencil placement and rich dark shading. Delighted!`,
        `Best cover-up specialist in Rayalaseema!`,
      ];
    } else {
      openers = [
        `Got inked with a custom tattoo at ${bName} and the detailing is superb.`,
        `First-class tattoo studio in Kadapa with top-grade hygiene.`,
        `Very patient artist at ${bName} who refined the stencil until I was 100% happy.`,
        `Clean studio, modern wireless tattoo machine, and premium imported inks at ${bName}.`,
      ];
      closers = [
        `Crisp line work, smooth shading, and clear healing guidance.`,
        `Opened fresh sterile needles in front of me. Utmost professional hygiene!`,
        `Reasonable pricing and extraordinary artwork. 10/10 recommendation!`,
        `Hands down the best tattoo studio in Kadapa!`,
      ];
    }
  } else if (ind === "APPLIANCE_REPAIR") {
    if (intent.isJetWash) {
      openers = [
        `Booked AC deep jet wash service with ${bName} and the cooling difference is night and day!`,
        `Got deep foam and jet wash done for our split AC by ${bName}.`,
        `Thorough AC jet cleaning service at home by ${bName}.`,
        `Called ${bName} for AC deep servicing and jet wash in Kadapa.`,
      ];
      closers = [
        `All indoor dust, muck, and bad odor were completely cleared. Ice-cold airflow restored!`,
        `Technicians used waterproof cover sheets and left zero mess on our walls or floor.`,
        `Chilling cooling like a brand-new AC now! Highly recommended service in Kadapa.`,
        `Super fast response and very neat jet wash work. 10/10!`,
      ];
    } else if (intent.isAcGasRefill) {
      openers = [
        `Called ${bName} when our AC stopped cooling and was just blowing normal room air.`,
        `Prompt AC gas refilling and nitrogen leak testing by ${bName}.`,
        `Accurate gas charging (R32/R410) done at our doorstep by ${bName}.`,
      ];
      closers = [
        `They identified the micro-leak, brazed it cleanly, and refilled gas with exact pressure gauge reading.`,
        `Instant ice-cold cooling restored within 45 minutes of their arrival.`,
        `Honest pricing with zero unnecessary parts charged. Best AC mechanic in Kadapa!`,
      ];
    } else if (intent.isFridgeRepair) {
      openers = [
        `Our double-door refrigerator stopped cooling and called ${bName} for doorstep inspection.`,
        `Prompt same-day fridge repair service by ${bName} in Kadapa.`,
        `Quick doorstep visit for refrigerator cooling issue by ${bName}.`,
      ];
      closers = [
        `Diagnosed the faulty sensor/defrost timer quickly and replaced with a genuine part.`,
        `Freezer and lower cabin cooling both working perfectly now. Very fair charges!`,
        `Courteous technician who explained the issue clearly. Dependable home service!`,
      ];
    } else if (intent.isWashingMachine) {
      openers = [
        `Contacted ${bName} for washing machine drum spin and drainage repair.`,
        `Fast doorstep repair for our front-load washing machine by ${bName}.`,
        `Accurate diagnosis and fix for our washing machine motor issue at ${bName}.`,
      ];
      closers = [
        `The technician solved the vibration and noise issue smoothly on the first visit.`,
        `Genuine replacement parts and very reasonable labor charges.`,
        `Prompt, professional, and trustworthy appliance technician in Kadapa!`,
      ];
    } else {
      openers = [
        `Top-notch doorstep appliance repair service in Kadapa by ${bName}.`,
        `Called ${bName} for urgent AC repair and they arrived at our home within an hour.`,
        `Very reliable and professional home appliance service team at ${bName}.`,
        `Affordable rates and expert technician support from ${bName}.`,
      ];
      closers = [
        `Fast doorstep turnaround, transparent quotation, and lasting cooling performance.`,
        `Polite technicians, clean workmanship, and genuine spare parts.`,
        `Number one AC and appliance repair service in Kadapa!`,
        `Completely satisfied with the prompt doorstep assistance. Highly recommend!`,
      ];
    }
  } else {
    openers = [
      `Neat work on the ${item}.`,
      `Quick turnaround and dependable handling of ${item}.`,
      `Very pleased with the ${item} from ${bName}.`,
      `Prompt work and polite staff at ${bName}.`,
      `Solid quality ${item}, delivered right on time.`,
      `Good service and fair rates here.`,
      `Smooth experience getting ${item} handled.`,
      `Got my ${item} sorted in no time.`,
      `Happy with how the ${item} turned out.`,
      `Clean work and respectful behavior.`,
    ];
    closers = [
      `Output was crisp.`,
      `Delivered as promised.`,
      `Totally satisfied.`,
      `Thank you team!`,
      `Will visit again.`,
      `Worth every penny.`,
      `No delays at all.`,
      `Definitely coming back.`,
    ];
  }

  const notePart = note ? ` ${note} was handled properly.` : "";
  return `${pickRandom(openers)}${notePart} ${pickRandom(closers)}`;
}

// Style 2: Product & Craftsmanship Quality Focus (Structure B)
function generateProductQuality(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  const intent = detectTagIntent(tags, ind);
  const item = tags[0] || pickRandom(lex.items);
  const quality = pickRandom(lex.qualities);
  const adj = pickRandom(lex.adjectives);

  let openers: string[];
  let middles: string[];
  let closers: string[];

  if (ind === "GOLD_BUYERS") {
    if (intent.isPledged) {
      openers = [
        `Noticeable transparency during the pledged gold loan release at ${bName}.`,
        `Assistance with the gold loan clearance was ${adj}.`,
        `Chose ${bName} specifically to release pledged gold from the bank.`,
      ];
      middles = [
        `Everything was handled cleanly with clear accounting and zero hidden deductions.`,
        `The loan closure paperwork was prompt and staff explained the math clearly.`,
        `The handover and balance settlement were done with complete professionalism.`,
      ];
      closers = [
        `Reliable service and honest execution.`,
        `Happy with the loan clearance outcome.`,
        `Real peace of mind throughout.`,
        `A dependable place to release pledged gold.`,
      ];
    } else if (intent.isPurity) {
      openers = [
        `The computerized German XRF testing on our gold was ${adj}.`,
        `Noticeable precision in their digital gold purity testing.`,
        `Chose ${bName} specifically for computerized purity analysis.`,
      ];
      middles = [
        `Tested purity right in front of us without melting or cutting any ornament.`,
        `The digital readings are clear and 100% scientific.`,
        `Turnaround was swift and communication was clear.`,
      ];
      closers = [
        `Scientific precision at its best.`,
        `Happy with the transparent report.`,
        `Accurate and dependable testing.`,
      ];
    } else {
      openers = [
        `The transparent digital weighing on our gold was ${adj}.`,
        `Noticeable fairness in their live bullion rate calculation.`,
        `Chose ${bName} specifically for old gold evaluation and selling.`,
      ];
      middles = [
        `Everything was weighed transparently on a certified digital scale right before our eyes.`,
        `Pricing matched the live bullion rate with zero unexpected deductions.`,
        `Turnaround was swift and bank transfer was credited right away.`,
      ];
      closers = [
        `Reliable service and execution.`,
        `Happy with the final payout.`,
        `Fair value for the gold sold.`,
        `A solid place for gold transactions.`,
      ];
    }
  } else if (ind === "TOURS_TRAVELS") {
    openers = [
      `The vehicle condition and interior hygiene at ${bName} were ${adj}.`,
      `Took their cab service for ${item} and the entire ride was ${adj}.`,
      `Noticeable punctuality and driving comfort with ${bName}.`,
      `Chose ${bName} specifically for their clean AC fleet.`,
    ];
    middles = [
      `The car was thoroughly cleaned, AC was cooling strong, and seats were very comfortable.`,
      `The chauffeur maintained steady speeds, avoided abrupt braking, and followed all road safety rules.`,
      `Upfront pricing with FASTag and fuel was clearly outlined without any last-minute surprises.`,
      `Booking on WhatsApp with Pavan was smooth and vehicle was at our doorstep on time.`,
    ];
    closers = [
      `Reliable travel service and safe driving.`,
      `Very happy with the overall travel experience.`,
      `Comfort and punctuality speak for themselves.`,
      `Great value for the fare charged.`,
      `A dependable travel partner in Kadapa.`,
    ];
  } else if (ind === "TATTOO_STUDIO") {
    openers = [
      `The artistic precision and studio hygiene at ${bName} were ${adj}.`,
      `Got my ${item} done here and the overall experience was ${adj}.`,
      `Noticeable attention to detail and sterile setup with ${bName}.`,
      `Chose ${bName} specifically for their custom tattoo art and skilled hands.`,
    ];
    middles = [
      `The artist showed sterilized single-use needles before starting, and the studio was spotless and hygienic.`,
      `The linework is razor sharp, shading is smooth, and the ink pigmentation is deeply vibrant.`,
      `The wireless tattoo machine made minimal noise and the artist's gentle touch made the session comfortable.`,
      `Clear day-by-day aftercare healing instructions were provided to ensure perfect recovery.`,
    ];
    closers = [
      `Reliable tattoo studio and true artistry on skin.`,
      `Very happy with the overall outcome and zero post-tattoo irritation.`,
      `Hygiene and artistry speak for themselves.`,
      `Great value for the detailing provided.`,
      `A dependable tattoo and piercing studio in Kadapa.`,
    ];
  } else if (ind === "APPLIANCE_REPAIR") {
    openers = [
      `The doorstep response and technical expertise at ${bName} were ${adj}.`,
      `Took their service for ${item} and the cooling result was ${adj}.`,
      `Noticeable attention to clean workmanship and exact troubleshooting at ${bName}.`,
      `Chose ${bName} specifically for their professional appliance repair and prompt doorstep visit.`,
    ];
    middles = [
      `The technician arrived on time with proper pressure gauges and tools, and tested the unit thoroughly before leaving.`,
      `They diagnosed the exact root cause without inflating the bill, and replaced faulty components with genuine parts.`,
      `The deep jet wash cleared all choking muck and restored ice-cold airflow instantly.`,
      `They kept the floor and walls completely clean with protective covers during the entire service.`,
    ];
    closers = [
      `Reliable doorstep appliance mechanic and very fair rates.`,
      `Very happy with the overall cooling outcome and lasting performance.`,
      `Punctuality and genuine repair work speak for themselves.`,
      `Great value for money with zero hidden inspection fees.`,
      `The most dependable AC and refrigerator service team in Kadapa.`,
    ];
  } else {
    openers = [
      `The ${quality} on the ${item} is ${adj}.`,
      `Took their service for ${item} and the result is ${adj}.`,
      `Noticeable attention to ${quality} here.`,
      `Chose ${bName} specifically for ${item}.`,
      `Checked out their ${item} work recently.`,
    ];
    middles = [
      `Everything was done cleanly without cutting any corners.`,
      `The detailing and execution are very well maintained.`,
      `You can clearly tell they value professional standards.`,
      `Output matched exactly what was discussed before confirming.`,
      `Turnaround was swift and communication was clear.`,
    ];
    closers = [
      `Reliable service and execution.`,
      `Happy with the final outcome.`,
      `Quality speaks for itself.`,
      `Great value for the price charged.`,
      `A solid place to get ${item} done.`,
    ];
  }

  const notePart = note ? ` Also took good care of ${note.toLowerCase()}.` : "";
  return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
}

// Style 3: Problem -> Solution -> Result (Structure C) - DOMAIN ISOLATED
function generateProblemSolution(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  const intent = detectTagIntent(tags, ind);
  const item = tags[0] || pickRandom(lex.items);
  const occasion = pickRandom(lex.occasions);

  let problem = "";
  let solution = "";
  let result = "";

  switch (ind) {
    case "GOLD_BUYERS": {
      if (intent.isPledged) {
        problem = pickRandom([
          `Needed reliable assistance to close an existing bank gold loan and release our pledged gold.`,
          `Was searching for a trustworthy service to help clear pledged gold from the bank without high interest.`,
          `Had gold pledged with a lender and wanted to release it and settle the balance amount.`,
        ]);
        solution = pickRandom([
          `The team at ${bName} stepped in, cleared the loan dues directly, and handled the complete process smoothly.`,
          `Staff coordinated the bank release with total transparency and zero hidden deductions.`,
          `They assisted throughout the bank formalities with complete professionalism and peace of mind.`,
        ]);
        result = pickRandom([
          `Received the balance payout instantly via bank transfer without any hassle.`,
          `Got the pledged gold released safely and the remaining cash credited immediately.`,
          `Very relieved to have the loan settled and receive fair market value for the balance.`,
        ]);
      } else if (intent.isPurity) {
        problem = pickRandom([
          `Wanted to get our gold tested for exact purity without melting or damaging the ornaments.`,
          `Was searching for an honest place with computerized testing to verify gold karats.`,
          `Needed accurate gold purity valuation before making any decision.`,
        ]);
        solution = pickRandom([
          `The team at ${bName} tested purity right in front of me on their computerized German XRF machine in 2 minutes.`,
          `They showed the exact karat percentage digitally without melting or scratching any piece.`,
          `Staff explained the computer readings clearly with 100% transparency.`,
        ]);
        result = pickRandom([
          `Got a clear, trustworthy report with zero guesswork or melting loss.`,
          `Very satisfied with the scientific precision and honest service.`,
          `Gave complete confidence knowing the exact purity of my gold.`,
        ]);
      } else {
        problem = pickRandom([
          `Was searching for a trustworthy place to sell old gold ornaments at fair market rate.`,
          `Needed instant funds and wanted to convert unused gold with zero hidden cuts.`,
          `Wanted genuine valuation and spot payout for our old gold items.`,
        ]);
        solution = pickRandom([
          `Staff walked me through the live market bullion rate clearly and weighed everything transparently on a digital scale.`,
          `They handled the entire verification and paperwork with genuine care, confidentiality, and zero hidden deductions.`,
          `Evaluated the ornaments right before my eyes and offered the highest prevailing rate.`,
        ]);
        result = pickRandom([
          `Transaction was completed in 10 minutes with instant bank transfer credited right away.`,
          `Received the full fair payout with complete peace of mind.`,
          `Very satisfied with the quick turnaround and transparent outcome.`,
        ]);
      }
      break;
    }

    case "PRINTING_GRAPHICS":
      solution = pickRandom([
        `The team at ${bName} patiently understood the banner dimensions and suggested the right weather-proof material.`,
        `The graphic designer finalized the layout proof quickly and aligned all typography perfectly.`,
        `They handled the color vibrancy and border cuts with genuine care and precision.`,
      ]);
      result = pickRandom([
        `Delivered right on time with vibrant colors and flawless print clarity.`,
        `The sign board and banners turned out super sharp, exceeding expectations.`,
        `Output matched the digital preview exactly, great workmanship.`,
      ]);
      break;

    case "PHOTOGRAPHY_STUDIO":
      solution = pickRandom([
        `The team at ${bName} patiently guided on angles, lighting, and sample layouts without rushing.`,
        `They accommodated our custom preferences and paid attention to natural expressions.`,
        `The studio crew coordinated everything smoothly from shoot to final delivery.`,
      ]);
      result = pickRandom([
        `The album and photos turned out stunning, with rich colors and crisp clarity.`,
        `Everyone at home was thrilled with the creative presentation.`,
        `Received the finished piece in pristine condition, truly happy with the choice.`,
      ]);
      break;

    case "SOFTWARE_IT":
      solution = pickRandom([
        `The development team quickly grasped our technical architecture and suggested clean, scalable solutions.`,
        `They maintained transparent sprint updates and demonstrated high engineering standards throughout.`,
        `Team was quick to respond to requirements and implemented responsive, bug-free components.`,
      ]);
      result = pickRandom([
        `Delivered the project ahead of schedule with robust performance and clean code.`,
        `The web platform works smoothly and our team is thoroughly impressed.`,
        `Seamless deployment and solid tech support from start to finish.`,
      ]);
      break;

    case "RESTAURANT_FOOD":
      solution = pickRandom([
        `The staff seated us promptly, explained the day's fresh specials, and took our order with a smile.`,
        `Kitchen prepared everything fresh with authentic spice balance and clean hygiene.`,
        `The serving was quick and piping hot, with great attention to hospitality.`,
      ]);
      result = pickRandom([
        `The taste and aroma were top notch, every bite was flavorful.`,
        `Generous portions and wonderful flavors made it a memorable meal.`,
        `Definitely one of our favorite dining spots now.`,
      ]);
      break;

    case "SALON_BEAUTY":
      if (intent.isBridal) {
        solution = pickRandom([
          `The bridal stylist understood my preferences, skin undertone, and wedding outfit detailing thoroughly before starting.`,
          `They handled the bridal makeover with immense care, ensuring an elegant HD finish and neat saree draping.`,
          `The staff was punctual, polite, and coordinated the bridal grooming with zero rush or stress.`,
        ]);
        result = pickRandom([
          `The bridal look turned out stunning in daylight and under stage photography.`,
          `Received countless compliments from relatives and guests throughout the ceremony.`,
          `Made my special day memorable with a radiant, long-lasting bridal glow.`,
        ]);
      } else if (intent.isAcademy) {
        solution = pickRandom([
          `The faculty explained each beautician technique with hands-on live model demonstrations and patient guidance.`,
          `The training curriculum covered advanced haircuts, styling, and bridal makeup step by step.`,
          `Every student received personal attention to master practical salon skills thoroughly.`,
        ]);
        result = pickRandom([
          `Gained great confidence to handle salon client services independently.`,
          `Best academy experience in Kadapa for anyone wanting a professional beauty career.`,
          `Truly valuable practical knowledge and supportive mentorship throughout.`,
        ]);
      } else if (intent.isSkinFacial || intent.isBodySpa) {
        solution = pickRandom([
          `The therapist provided a deeply relaxing spa and facial session in a peaceful ladies-only environment.`,
          `They used gentle, hygienic skincare products and explained the skin benefits clearly.`,
          `The soothing massage and cleanup were done with complete patience and hygiene.`,
        ]);
        result = pickRandom([
          `Skin feels incredibly soft, hydrated, and naturally radiant.`,
          `Walked out feeling completely refreshed, calm, and relieved of stress.`,
          `Superb relaxation and skin rejuvenation for women in Kadapa.`,
        ]);
      } else {
        solution = pickRandom([
          `The stylist listened patiently to the exact styling and haircut preferences before starting.`,
          `They maintained strict hygiene with sanitized tools and gave genuine beauty suggestions.`,
          `The hair styling and grooming were carried out with great skill and attention to detail.`,
        ]);
        result = pickRandom([
          `The final look turned out stylish, clean, and exactly what I wanted.`,
          `Walked out feeling refreshed, well-groomed, and confident.`,
          `Top-notch ladies salon experience in Viswandhapuram, highly satisfied.`,
        ]);
      }
      break;

    case "HEALTHCARE_CLINIC":
      solution = pickRandom([
        `The doctor listened thoroughly to all symptoms and explained the diagnosis with great empathy.`,
        `Clinic was spotless, sanitized, and the staff maintained a calm, supportive environment.`,
        `The treatment was gentle, painless, and completely transparent without unnecessary tests.`,
      ]);
      result = pickRandom([
        `Felt completely reassured and experienced fast relief.`,
        `Rare to find such compassionate and honest healthcare.`,
        `Highly grateful for the prompt and professional medical care.`,
      ]);
      break;

    case "AUTO_GARAGE":
      solution = pickRandom([
        `The mechanic thoroughly diagnosed the issue and explained the estimate upfront before touching the vehicle.`,
        `They fitted genuine parts and carried out servicing with complete technical precision.`,
        `Staff kept me updated and completed the work within the promised timeline.`,
      ]);
      result = pickRandom([
        `The vehicle drives as smooth as brand new, with zero unwanted vibration.`,
        `Very reasonable charges and honest mechanical work.`,
        `Found my trusted automobile garage for all future maintenance.`,
      ]);
      break;

    case "TOURS_TRAVELS":
      if (intent.isSelfDrive) {
        problem = pickRandom([
          `Needed a clean, reliable self-drive car in Kadapa for an urgent family trip without hefty deposit hassles.`,
          `Was looking for an affordable self-drive car with FASTag and clear fuel policy for a weekend road trip.`,
        ]);
        solution = pickRandom([
          `Pavan and Jyothi at ${bName} arranged a sanitized Toyota Etios within 30 minutes with clear documentation.`,
          `They provided a well-maintained car at ₹1,499/day, checked vehicle condition together, and handed over keys swiftly.`,
        ]);
        result = pickRandom([
          `The road trip was seamless, car had great mileage, and deposit was settled right away on return.`,
          `Zero hidden fees and hassle-free return. Best self-drive rental experience in Kadapa!`,
        ]);
      } else if (intent.isAirport) {
        problem = pickRandom([
          `Had an early morning flight from Bangalore airport and was anxious about getting a dependable cab from Kadapa at 2 AM.`,
          `Needed guaranteed on-time transport to BLR airport without last-minute driver cancellations.`,
        ]);
        solution = pickRandom([
          `${bName} dispatched an Innova Crysta 15 minutes ahead of schedule and the driver was well-rested and alert.`,
          `They offered a fixed fare of ₹5,499 with zero surge pricing and handled the highway journey with extreme care.`,
        ]);
        result = pickRandom([
          `Reached Bangalore airport comfortably 2 hours before boarding without any tension.`,
          `Smooth highway ride, polite chauffeur, and transparent billing. Highly recommended!`,
        ]);
      } else if (intent.isTirupati) {
        problem = pickRandom([
          `Planning a family Tirupati darshan with elderly parents and needed a comfortable AC vehicle with a calm, experienced driver.`,
          `Wanted a reliable round-trip package to Tirupati from Kadapa with transparent rates and zero toll confusion.`,
        ]);
        solution = pickRandom([
          `${bName} arranged a clean AC Innova at ₹2,099 with an experienced driver who knew all ghat road regulations.`,
          `The chauffeur was respectful, assisted elderly family members with boarding, and waited patiently during darshan.`,
        ]);
        result = pickRandom([
          `Our family had a peaceful, blessed darshan and return journey was completely smooth.`,
          `Affordable fare, punctual service, and genuine hospitality from start to finish.`,
        ]);
      } else {
        problem = pickRandom([
          `Needed an urgent outstation cab from Kadapa on short notice with safe highway driving.`,
          `Was looking for a dependable travel service in Kadapa that charges fair rates without hidden add-ons.`,
        ]);
        solution = pickRandom([
          `${bName} confirmed our booking immediately on WhatsApp and the AC cab was ready at our doorstep on time.`,
          `Driver drove with great discipline, maintained proper speed limits, and kept the vehicle clean and cool.`,
        ]);
        result = pickRandom([
          `Reached our destination safely and on schedule. Truly impressed with their professionalism.`,
          `Billing was transparent and exact to the quote. Will definitely book all future trips with ${bName}!`,
        ]);
      }
      break;

    case "TATTOO_STUDIO":
      if (intent.isPiercing) {
        problem = pickRandom([
          `Was very hesitant about getting ear and nose piercing due to fear of pain and infection.`,
          `Needed a safe, sterile studio in Kadapa for cartilage piercing with disposable equipment.`,
        ]);
        solution = pickRandom([
          `The specialist at ${bName} used sterilized single-use equipment and performed the piercing with incredible speed and gentle hands.`,
          `They sanitized the area thoroughly, guided my breathing, and made the whole process virtually painless.`,
        ]);
        result = pickRandom([
          `Healed cleanly without swelling or pain. Truly grateful for the gentle care!`,
          `Zero discomfort and clear aftercare guidance. Best piercing service in Kadapa!`,
        ]);
      } else if (intent.isCoverUp) {
        problem = pickRandom([
          `Had an old, poorly done tattoo that I was embarrassed of and needed an expert cover-up artist.`,
          `Looked all over Kadapa for a tattoo artist skilled enough to completely mask an old dark tattoo.`,
        ]);
        solution = pickRandom([
          `Karthik at ${bName} designed a brilliant custom piece that seamlessly incorporated and masked the old artwork.`,
          `He spent two hours refining the stencil overlay and used rich shading to conceal the old ink completely.`,
        ]);
        result = pickRandom([
          `The old tattoo is 100% invisible now! The new design looks stunning and modern.`,
          `Exceeded all expectations. Best tattoo cover-up artist in Rayalaseema!`,
        ]);
      } else {
        problem = pickRandom([
          `Wanted to get my first permanent tattoo in Kadapa but was nervous about hygiene, needle reuse, and design accuracy.`,
          `Had a very intricate reference artwork and was searching for an artist who could execute crisp, fine line work.`,
        ]);
        solution = pickRandom([
          `Karthik at ${bName} walked me through the design, opened a sealed sterile needle right in front of me, and maintained hospital-grade hygiene.`,
          `He customized the stencil patiently until the sizing was perfect, and worked with steady, master hands using a wireless machine.`,
        ]);
        result = pickRandom([
          `The tattoo turned out even better than the reference image with razor-sharp detailing and rich contrast.`,
          `Minimal pain during the session and flawless healing with zero irritation. Best tattoo studio in Kadapa!`,
        ]);
      }
      break;

    case "APPLIANCE_REPAIR":
      if (intent.isJetWash) {
        problem = pickRandom([
          `Our split AC was barely throwing cool air and had a terrible foul odor due to clogged cooling coils during the hot summer.`,
          `Needed an expert technician in Kadapa for high-pressure jet cleaning without damaging the copper fins or making a mess indoors.`,
        ]);
        solution = pickRandom([
          `The technician from ${bName} arrived promptly, wrapped waterproof cover jackets around the AC, and performed a comprehensive deep foam and jet wash.`,
          `They flushed out months of caked dust and mold from the blower and cooling coils with high pressure, and cleared the drain line completely.`,
        ]);
        result = pickRandom([
          `Cooling restored to ice-cold levels in 10 minutes and zero water drops on our wall or floor. Outstanding service!`,
          `Airflow is super powerful, fresh, and odorless now. Best AC jet wash service in Kadapa!`,
        ]);
      } else if (intent.isAcGasRefill) {
        problem = pickRandom([
          `Our AC compressor was running continuously but there was zero cooling in the room due to gas leakage.`,
          `Had bad experiences previously with mechanics claiming false gas leaks and charging inflated prices.`,
        ]);
        solution = pickRandom([
          `The technician from ${bName} checked the pressure with a proper gauge, pinpointed the exact micro-leak in the copper flare nut, and brazed it with nitrogen testing.`,
          `They recharged genuine refrigerant gas to the exact manufacturer specification and checked indoor temperatures thoroughly.`,
        ]);
        result = pickRandom([
          `Room cooled down within 15 minutes of completion and charges were completely fair and transparent.`,
          `Honest diagnosis, genuine gas refilling, and lasting cooling peace of mind!`,
        ]);
      } else if (intent.isFridgeRepair) {
        problem = pickRandom([
          `Our refrigerator suddenly stopped cooling overnight and all stored milk and groceries were at risk of spoiling.`,
          `Needed an urgent same-day doorstep technician in Kadapa who could inspect and fix our double-door fridge immediately.`,
        ]);
        solution = pickRandom([
          `The technician from ${bName} reached our house within 45 minutes of booking, diagnosed a faulty thermostat and defrost relay, and had genuine spares ready.`,
          `He explained the issue clearly, installed the original replacement part, and checked compressor cycling before leaving.`,
        ]);
        result = pickRandom([
          `Freezer and bottom compartments started chilling rapidly within two hours. Lifesaver doorstep service!`,
          `Very reasonable service charges and polite technician. Highly recommended!`,
        ]);
      } else {
        problem = pickRandom([
          `Our home appliance broke down unexpectedly and we needed a reliable, experienced technician in Kadapa for quick doorstep service.`,
          `Was looking for an appliance repair service that gives honest quotes without hidden visitation fees.`,
        ]);
        solution = pickRandom([
          `The team from ${bName} dispatched a skilled technician who inspected the appliance, diagnosed the exact root cause, and resolved it neatly on the spot.`,
          `They tested the entire machine thoroughly and gave helpful maintenance tips to extend its working life.`,
        ]);
        result = pickRandom([
          `Appliance is running smoothly and quietly like brand new. Top-quality service!`,
          `Transparent pricing, prompt doorstep response, and total peace of mind. Best appliance repair in Kadapa!`,
        ]);
      }
      break;

    default:
      solution = pickRandom([
        `The team at ${bName} patiently understood the requirement and suggested the right options.`,
        `Staff walked me through the choices clearly and gave a realistic completion timeframe.`,
        `Everything was handled transparently with polite behavior and genuine dedication.`,
      ]);
      result = pickRandom([
        `Delivered right on time with dependable quality.`,
        `The final output exceeded what I anticipated, very satisfied.`,
        `Very happy with the quick turnaround and neat outcome.`,
      ]);
      break;
  }

  const notePart = note ? ` Handled ${note.toLowerCase()} seamlessly.` : "";
  return `${problem} ${solution}${notePart} ${result}`;
}

// Style 4: Conversational Flow (Structure A)
function generateConversationalFlow(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  const item = tags[0] || pickRandom(lex.items);
  const openers = [
    `Dropped in at ${bName} for ${item}.`,
    `Visited ${bName} earlier this week for ${item}.`,
    `Decided to try ${bName} after hearing good things.`,
    `Went to this place for some ${item} work.`,
  ];
  const middles = [
    `Staff was welcoming and coordinated the entire visit smoothly.`,
    `Work was finished cleanly and they kept me updated on the status.`,
    `They paid genuine attention to the small details I requested.`,
    `The process was straightforward with no unnecessary wait times.`,
  ];
  const closers = [
    `Pleasantly surprised by the efficiency.`,
    `Glad I chose them over other nearby options.`,
    `Good team and honest service.`,
    `Satisfied customer right here.`,
  ];
  const notePart = note ? ` Special thanks for sorting out ${note.toLowerCase()}.` : "";
  return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
}

// Style 5: Calm Personal Reaction (Structure D)
function generateCalmPersonal(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  const item = tags[0] || pickRandom(lex.items);
  const reactions = [
    `Really appreciated the polite approach at ${bName}.`,
    `Clean work and honest communication on the ${item}.`,
    `Calm, professional, and dependable service.`,
    `Quite content with the ${item} I received from ${bName}.`,
  ];
  const observations = [
    `Charges were transparent and the quality turned out very solid.`,
    `They didn't push for expensive add-ons and gave genuine suggestions.`,
    `The handover was prompt and the staff handled everything patiently.`,
  ];
  const closers = [
    `Will definitely return whenever needed.`,
    `Keep up the consistent good work.`,
    `A dependable local business.`,
    `Happy with my visit.`,
  ];
  const notePart = note ? ` ${note} was addressed carefully.` : "";
  return `${pickRandom(reactions)} ${pickRandom(observations)}${notePart} ${pickRandom(closers)}`;
}

// Style 6: Occasion / Event Context (Structure E)
function generateOccasionContext(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  const intent = detectTagIntent(tags, ind);
  const item = tags[0] || pickRandom(lex.items);
  const occasion = pickRandom(lex.occasions);

  let openers: string[];
  let middles: string[];
  let closers: string[];

  if (ind === "GOLD_BUYERS") {
    if (intent.isPledged) {
      openers = [
        `Approached ${bName} to release our family's pledged gold from the bank.`,
        `Needed reliable assistance to close our bank gold loan.`,
        `Visited ${bName} to clear pledged gold and settle the balance payout.`,
      ];
      middles = [
        `The bank formalities and loan closure were handled smoothly and on time.`,
        `The coordination made the entire pledged gold release completely hassle-free.`,
        `Balance settlement was credited directly to our account without delay.`,
      ];
      closers = [
        `Truly grateful for the prompt assistance.`,
        `Relieved to have the loan cleared so easily!`,
        `Will surely rely on them again.`,
        `Much appreciated!`,
      ];
    } else if (intent.isPurity) {
      openers = [
        `Got our gold purity tested at ${bName} on their German XRF machine.`,
        `Approached ${bName} to get a precise computerized purity report.`,
        `Needed reliable gold purity testing without damaging our ornaments.`,
      ];
      middles = [
        `The testing was completed in 2 minutes right before our eyes without any melting.`,
        `The computerized readings and honest explanation made the experience completely transparent.`,
        `Accuracy and service came out top notch as promised.`,
      ];
      closers = [
        `Truly grateful for the honest testing.`,
        `Gave complete peace of mind!`,
        `Accurate and dependable service.`,
      ];
    } else {
      openers = [
        `Approached ${bName} to sell old gold ornaments.`,
        `Visited ${bName} for honest gold valuation and immediate payout.`,
        `Needed to convert unused gold into funds on short notice.`,
      ];
      middles = [
        `Weighed right before our eyes on a digital scale and live rate was given.`,
        `The prompt coordination and spot IMPS payout made the transaction completely hassle-free.`,
        `Transparent rates and prompt bank transfer as promised.`,
      ];
      closers = [
        `Truly grateful for the fair payout.`,
        `Made the transaction so much smoother!`,
        `Will surely recommend to friends.`,
        `Much appreciated!`,
      ];
    }
  } else if (ind === "TOURS_TRAVELS") {
    if (intent.isTirupati) {
      openers = [
        `Booked a cab with ${bName} ${occasion} for our family Tirupati darshan.`,
        `Needed a reliable AC cab ${occasion} for our pilgrimage to Tirupati.`,
        `Reserved an Innova Crysta ${occasion} for our family temple trip.`,
      ];
      middles = [
        `The driver reached our home 15 minutes before time, was very respectful, and drove safely on ghat roads.`,
        `The package rate was clear with zero hidden tolls or extra driver allowance demands.`,
        `The clean vehicle and smooth driving made the pilgrimage peaceful and comfortable.`,
      ];
      closers = [
        `Truly grateful for the safe journey and prompt service!`,
        `Made our family pilgrimage completely stress-free!`,
        `Will surely book with them again for our next temple trip.`,
        `Much appreciated!`,
      ];
    } else if (intent.isSelfDrive) {
      openers = [
        `Rented a self-drive car from ${bName} ${occasion}.`,
        `Needed a reliable self-drive car ${occasion} for a weekend trip.`,
        `Availed their self-drive rental ${occasion} at ₹1,499/day.`,
      ];
      middles = [
        `The vehicle handover was swift, FASTag was pre-loaded, and the car drove like a dream.`,
        `Inspection was transparent and security deposit was refunded promptly upon return.`,
        `Zero hidden costs and transparent fuel policy throughout.`,
      ];
      closers = [
        `Best self-drive car experience in Kadapa!`,
        `Smooth rental and dependable service!`,
        `Will definitely rent from them again.`,
      ];
    } else {
      openers = [
        `Booked an outstation cab with ${bName} ${occasion}.`,
        `Approached ${bName} ${occasion} for our highway travel.`,
        `Needed dependable cab service ${occasion} from Kadapa.`,
      ];
      middles = [
        `Driver was punctual, the AC car was spotless, and highway driving was very safe.`,
        `Coordination over WhatsApp was seamless and pricing was 100% transparent.`,
        `Reached our destination right on time without any hassle.`,
      ];
      closers = [
        `Truly grateful for the safe and comfortable travel!`,
        `Made the whole journey so much smoother!`,
        `Will surely rely on them for all future travel needs.`,
        `Highly recommended travel partner!`,
      ];
    }
  } else if (ind === "TATTOO_STUDIO") {
    if (intent.isPiercing) {
      openers = [
        `Got ear and nose piercing done at ${bName} ${occasion}.`,
        `Visited ${bName} ${occasion} for safe body piercing.`,
        `Needed a hygienic studio ${occasion} for helix piercing.`,
      ];
      middles = [
        `The piercer was gentle, used fresh disposable needles, and completed it in seconds.`,
        `Clean, sanitized setup and gave very clear healing and aftercare instructions.`,
        `Virtually zero pain and healed up very smoothly.`,
      ];
      closers = [
        `Truly grateful for the safe and gentle piercing!`,
        `Best piercing experience in Kadapa!`,
        `Will surely recommend to friends and family.`,
      ];
    } else {
      openers = [
        `Got my custom tattoo done at ${bName} ${occasion}.`,
        `Approached ${bName} ${occasion} for a special memorial tattoo design.`,
        `Decided to get inked at ${bName} ${occasion}.`,
      ];
      middles = [
        `Karthik took time to customize the artwork and executed crisp lines with smooth shading.`,
        `The studio hygiene was impeccable and the wireless machine made the session comfortable.`,
        `The final tattoo looks phenomenal and healed cleanly without any issues.`,
      ];
      closers = [
        `Truly grateful for the beautiful tattoo artwork!`,
        `Made this milestone so much more memorable!`,
        `Will surely visit again for my next tattoo.`,
        `Master artist in Kadapa, much appreciated!`,
      ];
    }
  } else if (ind === "APPLIANCE_REPAIR") {
    openers = [
      `Booked doorstep appliance repair with ${bName} ${occasion}.`,
      `Called ${bName} for urgent cooling assistance ${occasion}.`,
      `Scheduled deep AC jet cleaning with ${bName} ${occasion}.`,
    ];
    middles = [
      `The technician arrived promptly, diagnosed the issue with precision, and resolved it in a single visit.`,
      `They used professional equipment, took care not to dirty the premises, and tested everything properly.`,
      `The appliance is running ice-cold and smooth with zero noise.`,
    ];
    closers = [
      `Truly grateful for the prompt doorstep service!`,
      `Saved us from scorching Kadapa heat!`,
      `Will surely contact them for all future appliance servicing.`,
      `Best appliance technicians in Kadapa, much appreciated!`,
    ];
  } else {
    openers = [
      `Got ${item} done ${occasion}.`,
      `Approached ${bName} ${occasion} for ${item}.`,
      `Needed reliable ${item} ${occasion}.`,
    ];
    middles = [
      `Everything was ready on time and executed with high standards.`,
      `The coordination and finish made the experience completely hassle-free.`,
      `Quality and service came out top notch as promised.`,
    ];
    closers = [
      `Truly grateful for the prompt assistance.`,
      `Made the entire experience so much smoother!`,
      `Will surely rely on them again.`,
      `Much appreciated!`,
    ];
  }

  const notePart = note ? ` Handled ${note.toLowerCase()} very nicely.` : "";
  return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
}

// Style 7: Detailed Multi-Angle Review (Structure G) - DOMAIN ISOLATED
function generateDetailedReview(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  const intent = detectTagIntent(tags, ind);
  const item1 = tags[0] || pickRandom(lex.items);
  const remaining = lex.items.filter((i) => i.toLowerCase() !== item1.toLowerCase());
  const item2 = tags[1] && tags[1].toLowerCase() !== item1.toLowerCase() ? tags[1] : pickRandom(remaining.length > 0 ? remaining : lex.items);

  let opener = `Coordinated with ${bName} for ${item1}.`;
  let middle = `Communication was clear from the start and they didn't try to rush any stage of the work.`;

  switch (ind) {
    case "GOLD_BUYERS": {
      if (intent.isPledged) {
        opener = pickRandom([
          `Visited ${bName} specifically to release our pledged gold and settle the bank loan.`,
          `Coordinated with ${bName} to handle our pledged gold release.`,
          `Needed reliable assistance to close an existing bank gold loan and stopped by here.`,
        ]);
        middle = pickRandom([
          `First, the team helped clear the bank loan dues smoothly. Second, the balance payout was transferred immediately.`,
          `All formalities and paperwork were handled with 100% transparency and zero hidden deductions.`,
          `Loan closure charges and live bullion rates were explained clearly upfront with honest accounting.`,
        ]);
      } else if (intent.isPurity) {
        opener = pickRandom([
          `Visited ${bName} specifically for computerized gold purity testing.`,
          `Coordinated with ${bName} to check our gold purity on their German machine.`,
          `Needed a scientifically accurate purity check and stopped by here.`,
        ]);
        middle = pickRandom([
          `First, the team tested purity on their German XRF machine without melting. Second, digital readings were explained clearly.`,
          `The accuracy of digital testing and zero damage to the ornaments exceeded expectations.`,
          `Everything was shown directly on the monitor with complete transparency.`,
        ]);
      } else {
        opener = pickRandom([
          `Visited ${bName} specifically for old gold valuation and selling.`,
          `Coordinated with ${bName} to convert unused gold into funds.`,
          `Needed a transparent and reliable service for selling gold and stopped by here.`,
        ]);
        middle = pickRandom([
          `First, digital weighing was completed right in front of me. Second, bank transfer was credited in 2 minutes.`,
          `The accuracy of digital weighing and fair live market bullion rate exceeded expectations.`,
          `Live bullion rates were explained clearly upfront with zero hidden melting losses.`,
        ]);
      }
      break;
    }

    case "PRINTING_GRAPHICS":
      opener = pickRandom([
        `Coordinated with ${bName} for our ${item1} order.`,
        `Visited ${bName} specifically for ${item1} and commercial signage.`,
        `Had promotional work printed here for ${item1}.`,
      ]);
      middle = pickRandom([
        `First, the design team helped finalize layout proofs quickly. Second, delivery was prompt.`,
        `The color vibrancy and weather-proof finishing on ${item2} exceeded expectations.`,
        `Charges were explained clearly upfront and the final output looks really vibrant and premium.`,
      ]);
      break;

    case "PHOTOGRAPHY_STUDIO":
      opener = pickRandom([
        `Coordinated with ${bName} for our ${item1}.`,
        `Visited ${bName} specifically for ${item1} and studio shoots.`,
        `Booked ${bName} after hearing great reviews about their ${item1}.`,
      ]);
      middle = pickRandom([
        `First, the photographers patiently guided on lighting and poses. Second, album editing was prompt.`,
        `The natural expressions captured and sharp clarity on ${item2} exceeded expectations.`,
        `They handled the color grading and presentation with genuine care and precision.`,
      ]);
      break;

    case "SOFTWARE_IT":
      opener = pickRandom([
        `Partnered with ${bName} for our ${item1} project.`,
        `Engaged ${bName} to develop our ${item1}.`,
        `Collaborated with their engineering team on ${item1}.`,
      ]);
      middle = pickRandom([
        `First, their architects planned modular, scalable code. Second, sprint handovers were punctual.`,
        `The speed of API execution and clean UI responsiveness on ${item2} exceeded expectations.`,
        `Regular demos and prompt technical support gave total confidence throughout.`,
      ]);
      break;

    case "RESTAURANT_FOOD":
      opener = pickRandom([
        `Visited ${bName} specifically for their ${item1}.`,
        `Dined at ${bName} yesterday to try the ${item1}.`,
        `Stopped by ${bName} with family for ${item1}.`,
      ]);
      middle = pickRandom([
        `First, table service was prompt and welcoming. Second, the food was served piping hot.`,
        `The authentic spice balance and generous portions on ${item2} exceeded expectations.`,
        `Clean dining area and kitchen hygiene made the entire experience enjoyable.`,
      ]);
      break;

    case "SALON_BEAUTY":
      opener = pickRandom([
        `Booked a session at ${bName} for ${item1}.`,
        `Visited ${bName} specifically for ${item1} and grooming.`,
        `Went to ${bName} for a quick ${item1}.`,
      ]);
      middle = pickRandom([
        `First, the stylist listened to styling preferences patiently. Second, execution was spot on.`,
        `The attention to hygiene, sterilized tools, and clean finishing on ${item2} exceeded expectations.`,
        `Relaxing environment with respectful staff behavior throughout.`,
      ]);
      break;

    case "HEALTHCARE_CLINIC":
      opener = pickRandom([
        `Consulted ${bName} for ${item1}.`,
        `Visited ${bName} for specialized ${item1}.`,
        `Had an appointment at ${bName} regarding ${item1}.`,
      ]);
      middle = pickRandom([
        `First, the doctor explained the diagnosis in detail. Second, treatment was gentle and painless.`,
        `Clinical cleanliness and attentive care regarding ${item2} exceeded expectations.`,
        `Transparent medical advice without pushing unnecessary procedures.`,
      ]);
      break;

    case "AUTO_GARAGE":
      opener = pickRandom([
        `Brought my vehicle to ${bName} for ${item1}.`,
        `Had periodic service done at ${bName} for ${item1}.`,
        `Visited ${bName} to diagnose an issue with ${item1}.`,
      ]);
      middle = pickRandom([
        `First, mechanics explained the required repairs clearly. Second, genuine parts were installed.`,
        `The engine smoothness and driving responsiveness on ${item2} exceeded expectations.`,
        `Billing was 100% transparent and delivery was right on schedule.`,
      ]);
      break;

    case "TOURS_TRAVELS":
      opener = pickRandom([
        `Booked ${bName} for our outstation journey from Kadapa.`,
        `Coordinated with ${bName} for our family travel requirements.`,
        `Used ${bName} after a friend recommended their reliable cab service.`,
      ]);
      middle = pickRandom([
        `First, the driver arrived 10 minutes early in a sanitized AC vehicle. Second, highway driving was remarkably safe and calm.`,
        `The upfront transparent pricing on WhatsApp and zero hidden charges on tolls exceeded expectations.`,
        `The vehicle condition, chilled air conditioning, and polite driver etiquette made the entire trip relaxing.`,
      ]);
      break;

    case "TATTOO_STUDIO":
      opener = pickRandom([
        `Visited ${bName} for our ${item1} session.`,
        `Consulted with Karthik at ${bName} regarding ${item1}.`,
        `Got our ${item1} done after seeing great reviews about their studio in Kadapa.`,
      ]);
      middle = pickRandom([
        `First, the artist unwrapped new sterilized needles right in front of us. Second, the linework and shading on ${item2} were executed with exceptional artistic accuracy.`,
        `The studio cleanliness, modern wireless machine, and gentle hands made the entire session comfortable.`,
        `The stencil customization was patient and the post-session healing guidance on ${item2} was very thorough.`,
      ]);
      break;

    case "APPLIANCE_REPAIR":
      opener = pickRandom([
        `Booked ${bName} for doorstep ${item1} in Kadapa.`,
        `Called ${bName} when we needed fast repair for ${item1}.`,
        `Reached out to ${bName} after neighbors praised their reliable appliance service.`,
      ]);
      middle = pickRandom([
        `First, the technician arrived right on schedule with proper equipment. Second, they diagnosed and resolved ${item2} transparently on the spot.`,
        `The ice-cold cooling restored and clean workmanship on ${item2} exceeded expectations.`,
        `Charges were clearly broken down upfront with genuine spare parts and zero hidden inspection fees.`,
      ]);
      break;

    default:
      opener = pickRandom([
        `Coordinated with ${bName} for our ${item1}.`,
        `Had service done at ${bName} for ${item1}.`,
        `Approached ${bName} after a colleague recommended their ${item1}.`,
      ]);
      middle = pickRandom([
        `Communication was clear from the start and they didn't try to rush any stage of the work.`,
        `The quality of execution and reliable coordination on ${item2} exceeded expectations.`,
        `Charges were explained clearly upfront and the final output is dependable.`,
      ]);
      break;
  }

  const closer = pickRandom([
    `A well-managed spot that takes pride in quality.`,
    `Dependable service from start to finish.`,
    `Five stars for reliability and neat execution.`,
    `Completely satisfied with both the process and outcome.`,
    `Will certainly be coming back for future requirements.`,
  ]);

  const notePart = note ? ` Especially liked how they handled ${note.toLowerCase()}.` : "";
  return `${opener} ${middle}${notePart} ${closer}`;
}

// Style 8: Casual Local Recommendation
function generateCasualLocal(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  const intent = detectTagIntent(tags, ind);
  if (ind === "TOURS_TRAVELS") {
    const travelHighlight = intent.isSelfDrive
      ? "self-drive car rentals"
      : intent.isTirupati
      ? "Tirupati darshan packages"
      : intent.isAirport
      ? "airport drops"
      : intent.isGandikota
      ? "Gandikota day tours"
      : "clean outstation cabs";
    const openers = [
      `One of the best cab and rental services in Kadapa for ${travelHighlight}.`,
      `If you need reliable outstation cabs or self-drive cars, ${bName} is the go-to place in Kadapa.`,
      `Locals in Kadapa recommended ${bName} for travel bookings and they were 100% right.`,
      `Easily among the most punctual and trustworthy travel services in Rayalaseema.`,
    ];
    const middles = [
      `Chauffeurs are disciplined, vehicles are spotless, and fares are completely transparent.`,
      `Pavan and Jyothi coordinate everything smoothly on WhatsApp without any hidden charges.`,
      `Smooth highway driving, chilled AC, and zero last-minute cancellations.`,
    ];
    const closers = [
      `Check them out for your next trip!`,
      `Good to have a reliable cab partner in Kadapa.`,
      `Deserves 5 stars for honest and safe service.`,
      `Will refer friends and family for sure.`,
    ];
    const notePart = note ? ` Handled ${note.toLowerCase()} smoothly.` : "";
    return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
  }

  if (ind === "TATTOO_STUDIO") {
    const tattooHighlight = intent.isPiercing
      ? "painless body piercings"
      : intent.isPortrait
      ? "realistic portrait tattoos"
      : intent.isCoverUp
      ? "creative cover-up tattoos"
      : "custom tattoo designs";
    const openers = [
      `One of the best studios in Kadapa for ${tattooHighlight}.`,
      `If you're planning to get inked or pierced, ${bName} is the go-to place in Kadapa.`,
      `Locals in Kadapa recommended Karthik at ${bName} for tattooing and they were 100% right.`,
      `Easily among the most skilled and hygienic tattoo artists in Rayalaseema.`,
    ];
    const middles = [
      `The artist is patient, explains the stencil placement carefully, and maintains top-notch hygiene.`,
      `Clean setup, fresh sterile needles opened in front of you, and crisp linework with rich shading.`,
      `Very polite artist who puts first-timers completely at ease and gives honest advice.`,
    ];
    const closers = [
      `Check them out if you want quality body art!`,
      `Good to have a world-class tattoo studio right here in Kadapa.`,
      `Deserves 5 stars for authentic artwork and hygiene.`,
      `Will refer all my friends for tattoos and piercings!`,
    ];
    const notePart = note ? ` Handled ${note.toLowerCase()} smoothly.` : "";
    return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
  }

  if (ind === "APPLIANCE_REPAIR") {
    const applianceHighlight = intent.isJetWash
      ? "deep AC jet wash & cleaning"
      : intent.isAcGasRefill
      ? "AC gas refilling & leak fixing"
      : intent.isFridgeRepair
      ? "refrigerator cooling repair"
      : intent.isWashingMachine
      ? "washing machine repair"
      : "doorstep AC & appliance repair";
    const openers = [
      `One of the best home appliance repair services in Kadapa for ${applianceHighlight}.`,
      `If you have AC or fridge cooling issues in Kadapa, ${bName} is the go-to doorstep team.`,
      `Neighbors in Kadapa recommended ${bName} for appliance servicing and they were 100% right.`,
      `Easily among the most skilled and prompt appliance mechanics in Rayalaseema.`,
    ];
    const middles = [
      `The technician is punctual, explains the exact technical issue, and carries proper professional tools.`,
      `Neat workmanship, zero mess left on walls, and ice-cold cooling restored immediately.`,
      `Honest technician who gives fair estimates without pushing unnecessary parts or extra fees.`,
    ];
    const closers = [
      `Check them out if you need reliable doorstep appliance repair!`,
      `Good to have such a trustworthy AC and fridge mechanic right here in Kadapa.`,
      `Deserves 5 stars for fast doorstep turnaround and quality repair.`,
      `Will definitely call them again and recommend to neighbors!`,
    ];
    const notePart = note ? ` Handled ${note.toLowerCase()} smoothly.` : "";
    return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
  }

  const item = tags[0] || pickRandom(lex.items);
  const openers = [
    `One of the better places in the area for ${item}.`,
    `If you need ${item}, ${bName} is definitely worth checking out.`,
    `Locals recommended ${bName} for ${item} and they were right.`,
    `Easily among the most reliable spots around here for ${item}.`,
  ];
  const middles = [
    `Staff is down to earth, work is neat, and prices are fair.`,
    `They know their craft well and don't make false promises on timing.`,
    `Turnaround was fast without any compromise on the final output.`,
  ];
  const closers = [
    `Check them out once!`,
    `Good to have a reliable team nearby.`,
    `Deserves support for honest work.`,
    `Will refer friends for sure.`,
  ];
  const notePart = note ? ` Handled ${note.toLowerCase()} smoothly.` : "";
  return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
}

// Style 9: Minimalist Punchy
function generateMinimalist(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  const intent = detectTagIntent(tags, ind);
  const item = tags[0] || pickRandom(lex.items);

  let fragments: string[];
  if (ind === "GOLD_BUYERS") {
    if (intent.isPledged) {
      fragments = [
        `Fast pledged gold release. Clear loan settlement. Dependable team at ${bName}.`,
        `Smooth gold loan clearance. Instant balance transfer. 10/10 experience.`,
        `Hassle-free pledged gold release. Transparent paperwork at ${bName}.`,
        `Quick loan closure. Full fair payout for the balance. Dependable service.`,
      ];
    } else if (intent.isPurity) {
      fragments = [
        `Computerized XRF purity test. 100% accurate. Polite staff at ${bName}.`,
        `Fast purity testing. No melting or damage. Crisp digital report.`,
        `Scientific precision. Transparent karat measurement at ${bName}.`,
        `Accurate gold testing in 2 minutes. Very satisfied.`,
      ];
    } else {
      fragments = [
        `Transparent digital weighing. Live market rate. Instant bank transfer at ${bName}.`,
        `Quick 10-minute transaction. Full fair payout. Dependable team.`,
        `Clean weighing and honest rates. No delays at ${bName}.`,
        `Spot bank payment. Transparent valuation. Highly recommend.`,
      ];
    }
  } else if (ind === "TOURS_TRAVELS") {
    fragments = [
      `Spotless AC car. Punctual pickup. Dependable chauffeur from ${bName}.`,
      `Fixed upfront fare. No hidden costs. 10/10 travel experience with ${bName}.`,
      `Punctual early morning drop. Safe highway driving. Highly recommended!`,
      `Smooth self-drive booking. FASTag enabled. Clean vehicle and hassle-free return.`,
      `Comfortable Innova Crysta. Calm ghat road driving. Blessed family Tirupati trip.`,
    ];
  } else if (ind === "TATTOO_STUDIO") {
    fragments = [
      `Sterile needles. Flawless linework. Top-notch tattoo studio in Kadapa.`,
      `Custom tattoo design. Smooth shading. 10/10 artist skill at ${bName}.`,
      `Painless piercing. Fresh disposable needles. Clear healing instructions.`,
      `Spotless studio hygiene. Wireless machine. Great aftercare advice.`,
      `Master portrait detailing. Honest pricing. Best tattoo artist in Kadapa!`,
    ];
  } else if (ind === "APPLIANCE_REPAIR") {
    fragments = [
      `Deep AC jet wash. Ice-cold airflow restored. 10/10 service at ${bName}.`,
      `Prompt doorstep visit. Genuine spares. Honest repair by ${bName}.`,
      `AC gas refilled. Leak repaired on the spot. Chilled cooling restored!`,
      `Fridge cooling fixed. Same-day doorstep turnaround. Polite technician.`,
      `Fast response in Kadapa. Clean workmanship. Very fair service rates!`,
    ];
  } else {
    fragments = [
      `Super neat ${item}. Fair price, on-time service.`,
      `Clean work on ${item}. Polite staff. Happy with the result.`,
      `Fast service. Crisp output. Dependable team at ${bName}.`,
      `Great quality ${item}. No delays. 10/10 experience.`,
      `Good outcome on the ${item}. Worth the money.`,
    ];
  }
  let base = pickRandom(fragments);
  if (note) base += ` Handled ${note.toLowerCase()} properly.`;
  return base;
}

// Style 10: Enthusiastic & Delighted
function generateEnthusiastic(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  const intent = detectTagIntent(tags, ind);
  if (ind === "TOURS_TRAVELS") {
    const travelHighlight = intent.isSelfDrive
      ? "self-drive car rental"
      : intent.isTirupati
      ? "family Tirupati pilgrimage"
      : intent.isAirport
      ? "Bangalore airport drop"
      : intent.isGandikota
      ? "Gandikota day trip"
      : "outstation journey";
    const openers = [
      `Absolutely loved our journey with ${bName} for our ${travelHighlight}!`,
      `So glad we booked our ${travelHighlight} with ${bName}!`,
      `Such a delightful and peaceful travel experience with ${bName}.`,
    ];
    const middles = [
      `The vehicle condition was pristine, AC was chilling, and the driver reached right on time.`,
      `Pavan and Jyothi confirmed the booking on WhatsApp instantly and pricing was 100% upfront.`,
      `The driver drove very safely on the highway and was extremely respectful throughout.`,
    ];
    const closers = [
      `Big thumbs up to the entire team!`,
      `Will definitely book all our future family trips with them.`,
      `Thank you for making our travel so smooth and stress-free!`,
    ];
    const notePart = note ? ` ${note} was managed smoothly.` : "";
    return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
  }

  if (ind === "TATTOO_STUDIO") {
    const tattooHighlight = intent.isPiercing
      ? "piercing session"
      : intent.isPortrait
      ? "portrait tattoo"
      : intent.isCoverUp
      ? "cover-up tattoo"
      : "custom tattoo";
    const openers = [
      `Absolutely in love with my new ${tattooHighlight} from ${bName}!`,
      `So glad I chose ${bName} for my ${tattooHighlight}!`,
      `Such a delightful and comfortable experience getting inked at ${bName}.`,
    ];
    const middles = [
      `The attention to detail, razor-sharp linework, and smooth shading completely blew me away.`,
      `Karthik is exceptionally talented and made sure the stencil sat in the exact perfect spot.`,
      `The studio is spotless, needles were fresh single-use, and the healing advice was crystal clear.`,
    ];
    const closers = [
      `Big thumbs up to Karthik and the team!`,
      `Will definitely come back for my next tattoo!`,
      `Thank you for creating such a masterpiece on my skin!`,
    ];
    const notePart = note ? ` ${note} was managed smoothly.` : "";
    return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
  }

  if (ind === "APPLIANCE_REPAIR") {
    const applianceHighlight = intent.isJetWash
      ? "AC deep jet wash"
      : intent.isAcGasRefill
      ? "AC gas charging"
      : intent.isFridgeRepair
      ? "refrigerator repair"
      : intent.isWashingMachine
      ? "washing machine repair"
      : "doorstep appliance repair";
    const openers = [
      `Absolutely delighted with the ${applianceHighlight} done by ${bName}!`,
      `So glad we called ${bName} to fix our ${applianceHighlight}!`,
      `Such a prompt and hassle-free repair experience with ${bName}.`,
    ];
    const middles = [
      `The technician arrived within an hour, worked swiftly without any mess, and the AC is blowing icy cold air now.`,
      `Transparent diagnosis, genuine replacement parts, and polite conduct throughout.`,
      `They cleaned up completely after the service and verified the cooling performance before leaving.`,
    ];
    const closers = [
      `Big thumbs up to the technician and the ${bName} team!`,
      `Will definitely rely on them for all future appliance servicing!`,
      `Thank you for restoring our comfort in this Kadapa heat!`,
    ];
    const notePart = note ? ` ${note} was managed smoothly.` : "";
    return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
  }

  const item = tags[0] || pickRandom(lex.items);
  const openers = [
    `Absolutely loved what ${bName} did with our ${item}!`,
    `So glad I got the ${item} done here!`,
    `Such a delightful experience getting ${item} handled.`,
  ];
  const middles = [
    `The quality and finish turned out so much better and neater than I hoped.`,
    `They delivered it right when promised and the coordination was super smooth.`,
    `The staff was courteous and genuinely helpful throughout the process.`,
  ];
  const closers = [
    `Big thumbs up to the team!`,
    `Will definitely recommend to friends and family.`,
    `Thank you for making it such a smooth experience!`,
  ];
  const notePart = note ? ` ${note} was executed to perfection.` : "";
  return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
}

// Style 11: First-Time Visitor Perspective
function generateFirstTime(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  if (ind === "TOURS_TRAVELS") {
    const openers = [
      `First time booking a cab with ${bName} in Kadapa.`,
      `Used ${bName} for the first time for our outstation journey.`,
      `Was my first experience with their travel and rental service.`,
    ];
    const middles = [
      `Pavan and Jyothi on WhatsApp made booking effortless and answered all route queries patiently.`,
      `The cab was waiting at my doorstep 10 minutes before pickup time, sparkling clean.`,
      `The transparent quote with zero hidden extras gave immediate confidence in their service.`,
    ];
    const closers = [
      `Definitely won't be my last booking with them.`,
      `Very pleased with the driving and comfort on my first try.`,
      `Found our permanent go-to travel service in Kadapa!`,
    ];
    const notePart = note ? ` Also managed ${note.toLowerCase()} effortlessly.` : "";
    return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
  }

  if (ind === "TATTOO_STUDIO") {
    const openers = [
      `First time getting inked and chose ${bName} in Kadapa.`,
      `Was my first time visiting a tattoo studio and went to ${bName}.`,
      `First tattoo experience here and was naturally nervous at the start.`,
    ];
    const middles = [
      `Karthik was super patient, explained the entire process calmly, and opened sealed sterile needles in front of me.`,
      `The stencil placement was checked multiple times to ensure perfect alignment, and the wireless machine felt surprisingly gentle.`,
      `The studio setup was spotless and hygienic, which gave me immense confidence immediately.`,
    ];
    const closers = [
      `Definitely won't be my last tattoo with Karthik!`,
      `So relieved and thrilled with how it turned out on my very first try.`,
      `Found my permanent tattoo artist in Kadapa!`,
    ];
    const notePart = note ? ` Also managed ${note.toLowerCase()} effortlessly.` : "";
    return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
  }

  if (ind === "APPLIANCE_REPAIR") {
    const openers = [
      `First time booking doorstep appliance service with ${bName} in Kadapa.`,
      `Was my first time calling an AC repair service here and went with ${bName}.`,
      `First experience with their home appliance repair and was pleasantly surprised.`,
    ];
    const middles = [
      `The technician arrived within 45 minutes, inspected the cooling problem calmly, and explained what was needed without any jargon.`,
      `The repair work was clean, transparent, and tested thoroughly with temperature gauges before wrapping up.`,
      `They charged exactly what was quoted over the phone with zero hidden visitation fees.`,
    ];
    const closers = [
      `Definitely won't be my last time calling ${bName}!`,
      `So relieved to find a dependable appliance repair team on my very first try.`,
      `Found our permanent go-to AC and appliance technician in Kadapa!`,
    ];
    const notePart = note ? ` Also managed ${note.toLowerCase()} effortlessly.` : "";
    return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
  }

  const item = tags[0] || pickRandom(lex.items);
  const openers = [
    `First time trying ${bName} for ${item}.`,
    `Walked in here for the first time needing ${item}.`,
    `Was my first visit to ${bName}.`,
  ];
  const middles = [
    `The staff made me feel comfortable and guided me through options patiently.`,
    `Impression was very positive from the initial discussion to the final outcome.`,
    `The quality immediately gave me confidence in their work.`,
  ];
  const closers = [
    `Definitely won't be my last visit.`,
    `Happy with the outcome on my very first try.`,
    `Found my go-to place for ${item}.`,
  ];
  const notePart = note ? ` Also sorted out ${note.toLowerCase()} effortlessly.` : "";
  return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
}

// Style 12: Repeat Customer Perspective
function generateRepeatCustomer(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  if (ind === "TOURS_TRAVELS") {
    const openers = [
      `Have used ${bName} for multiple outstation and pilgrimage trips now.`,
      `Another punctual and comfortable journey with ${bName}.`,
      `This is our third time booking cabs with them from Kadapa.`,
    ];
    const middles = [
      `Their punctuality, vehicle cleanliness, and polite driver behavior never decline.`,
      `Always prompt on WhatsApp bookings and drivers always arrive early with working AC.`,
      `Consistent upfront billing every single time with zero surprise charges.`,
    ];
    const closers = [
      `Always a pleasure traveling with this team.`,
      `Consistency and passenger safety are why we keep coming back.`,
      `The most dependable travels in Rayalaseema!`,
    ];
    const notePart = note ? ` Handled ${note.toLowerCase()} with their usual care.` : "";
    return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
  }

  if (ind === "TATTOO_STUDIO") {
    const openers = [
      `Have gotten multiple tattoos done at ${bName} now.`,
      `Returned to ${bName} for my second tattoo piece in Kadapa.`,
      `This is my third visit here for custom body art and piercings.`,
    ];
    const middles = [
      `Their standard of hygiene, needle safety, and artistic execution has never dropped.`,
      `Karthik is always welcoming, attentive to new design ideas, and gives honest feedback.`,
      `Clean healing, vibrant ink retention, and razor-sharp linework every single time.`,
    ];
    const closers = [
      `Always a pleasure getting inked with Karthik.`,
      `Artistic excellence and strict hygiene keep me coming back.`,
      `The most dependable tattoo studio in Kadapa!`,
    ];
    const notePart = note ? ` Handled ${note.toLowerCase()} with their usual care.` : "";
    return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
  }

  if (ind === "APPLIANCE_REPAIR") {
    const openers = [
      `Have relied on ${bName} for multiple home appliance repairs now.`,
      `Called ${bName} again for our annual AC servicing before the summer heat.`,
      `This is our third time getting our AC and fridge serviced by them in Kadapa.`,
    ];
    const middles = [
      `Their prompt response, honesty with pricing, and technical skills have never dropped.`,
      `Technicians are always courteous, punctual, and carry original spare parts.`,
      `Consistent ice-cold cooling and zero recurring faults every single time.`,
    ];
    const closers = [
      `Always a pleasure dealing with ${bName}.`,
      `Honesty and prompt doorstep service keep us calling them back.`,
      `The most reliable home appliance team in Kadapa!`,
    ];
    const notePart = note ? ` Handled ${note.toLowerCase()} with their usual care.` : "";
    return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
  }

  const item = tags[0] || pickRandom(lex.items);
  const openers = [
    `Have been coming to ${bName} multiple times now.`,
    `Another consistent experience with ${bName} for ${item}.`,
    `This is my third time getting work done here.`,
  ];
  const middles = [
    `Their standard of quality and timely commitment hasn't dropped once.`,
    `Always polite and attentive to whatever requirements I bring in.`,
    `They deliver consistent results every single time without excuses.`,
  ];
  const closers = [
    `Always a pleasure dealing with this team.`,
    `Consistency is what keeps me coming back.`,
    `Dependable as always!`,
  ];
  const notePart = note ? ` Handled ${note.toLowerCase()} with their usual care.` : "";
  return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
}

// Style 13: Initial Skepticism / Relief
function generateRelief(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  const intent = detectTagIntent(tags, ind);
  const item = tags[0] || pickRandom(lex.items);

  let openers: string[];
  let middles: string[];
  let closers: string[];

  if (ind === "GOLD_BUYERS") {
    if (intent.isPledged) {
      openers = [
        `Was initially worried about the bank loan clearance process for our pledged gold.`,
        `Had doubts whether closing our gold loan and releasing pledged gold would be smooth.`,
        `Was wondering how long releasing our pledged gold would take.`,
      ];
      middles = [
        `Thankfully, the team at ${bName} handled the bank formalities and balance payment seamlessly.`,
        `They coordinated with the bank, cleared the dues, and transferred the remaining balance in minutes.`,
        `The entire transaction was completed transparently with zero complications.`,
      ];
      closers = [
        `Relieved and very satisfied!`,
        `Exceeded expectations in the best way possible.`,
        `Huge peace of mind knowing the loan is cleared.`,
      ];
    } else if (intent.isPurity) {
      openers = [
        `Was wondering if they would need to melt or damage our gold ornaments for testing.`,
        `Was slightly skeptical about the accuracy of gold testing.`,
        `Had high expectations for an honest and scientific purity evaluation.`,
      ];
      middles = [
        `Thankfully, their computerized German XRF machine tested purity in 2 minutes without melting or scratching anything.`,
        `They showed the exact karat percentage digitally right before my eyes.`,
        `Staff was polite, transparent, and answered all questions patiently.`,
      ];
      closers = [
        `Relieved and very satisfied!`,
        `Scientific precision without any damage.`,
        `Accurate and honest testing.`,
      ];
    } else {
      openers = [
        `Was slightly skeptical about unfair deductions when selling old gold.`,
        `Was initially wondering whether we would get the true live bullion market rate.`,
        `Needed urgent funds and hoped for a transparent gold valuation.`,
      ];
      middles = [
        `Thankfully, they weighed everything transparently on a certified digital scale with zero hidden cuts.`,
        `The payout was calculated strictly on live market rates and credited via IMPS in minutes.`,
        `The staff handled the entire evaluation with complete honesty and care.`,
      ];
      closers = [
        `Relieved and very satisfied!`,
        `Exceeded expectations in the best way possible.`,
        `Honest and transparent service.`,
      ];
    }
  } else if (ind === "TOURS_TRAVELS") {
    openers = [
      `Was initially worried about getting a punctual cab from Kadapa for an early morning departure.`,
      `Had doubts whether the self-drive rental would have hidden fuel or deposit deductions.`,
      `Was anxious about highway driver discipline for our family pilgrimage trip.`,
    ];
    middles = [
      `Thankfully, the team at ${bName} arrived 15 minutes early in a spotless vehicle.`,
      `The driver maintained safe highway speeds, avoided aggressive overtaking, and handled ghat roads smoothly.`,
      `The billing was 100% transparent and matched the exact WhatsApp quote.`,
    ];
    closers = [
      `Completely relieved and very satisfied with the journey!`,
      `Exceeded expectations in terms of comfort and passenger safety.`,
      `True peace of mind throughout the entire road trip!`,
    ];
  } else if (ind === "TATTOO_STUDIO") {
    openers = [
      `Was initially very nervous about needle pain and hygiene before visiting ${bName}.`,
      `Had doubts whether an artist in Kadapa could accurately capture such an intricate tattoo design.`,
      `Was hesitant about getting pierced because my previous piercing elsewhere caused swelling.`,
    ];
    middles = [
      `Thankfully, Karthik at ${bName} proved my apprehensions completely wrong.`,
      `He opened brand new sterilized needles right in front of me, worked with gentle precision, and kept checking on my comfort.`,
      `The tattoo lines came out laser-sharp and the healing has been completely smooth without irritation.`,
    ];
    closers = [
      `Relieved, thrilled, and very satisfied!`,
      `Exceeded my expectations in the best artistic way possible.`,
      `True professionalism and clinical hygiene standards!`,
    ];
  } else if (ind === "APPLIANCE_REPAIR") {
    openers = [
      `Was initially worried about false gas leakage claims and high repair quotes before calling ${bName}.`,
      `Had bad experiences with other local mechanics in Kadapa who made a mess with dirty water on walls.`,
      `Was skeptical whether our old AC could ever cool properly again in the summer heat.`,
    ];
    middles = [
      `Thankfully, the technician from ${bName} proved my apprehensions completely wrong.`,
      `He diagnosed the exact fault honestly, showed me the pressure gauge readings, and performed a spotless jet wash using protective cover bags.`,
      `The room turned ice-cold within 20 minutes and the charges were completely fair and transparent.`,
    ];
    closers = [
      `Relieved, cool, and very satisfied!`,
      `Exceeded my expectations with honest diagnosis and clean work.`,
      `True professionalism and dependable home appliance service!`,
    ];
  } else {
    openers = [
      `Was initially wondering about the turnaround on the ${item}.`,
      `Was slightly skeptical whether they could deliver ${item} on time.`,
      `Had high expectations for this ${item} requirement.`,
    ];
    middles = [
      `Thankfully, the team at ${bName} proved my doubts completely wrong.`,
      `When I inspected the final outcome, the quality was spotless.`,
      `They actually delivered right on schedule with zero compromises.`,
    ];
    closers = [
      `Relieved and very satisfied!`,
      `Exceeded expectations in the best way possible.`,
      `Great work by the team.`,
    ];
  }

  const notePart = note ? ` Handled ${note.toLowerCase()} exceptionally well.` : "";
  return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
}

// Style 14: Family / Specialized Context - DOMAIN ADAPTIVE
function generateFamilyContext(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  const intent = detectTagIntent(tags, ind);
  const item = tags[0] || pickRandom(lex.items);
  const occasion = pickRandom(lex.occasions);

  let opener = `Needed ${item} for our family ${occasion}.`;
  let middle = `Everyone was genuinely pleased with the polite coordination and solid outcome.`;

  if (ind === "GOLD_BUYERS") {
    if (intent.isPledged) {
      opener = `Approached ${bName} with family to release pledged gold and close our bank loan.`;
      middle = `The staff handled the bank formalities and balance settlement with complete confidentiality and care.`;
    } else if (intent.isPurity) {
      opener = `Visited ${bName} with family to get our gold ornaments tested for exact purity.`;
      middle = `The computerized German XRF testing was done right in front of us without melting or damage.`;
    } else {
      opener = `Visited ${bName} with family to evaluate and sell old gold ornaments.`;
      middle = `The staff was respectful, confidential, and completed the digital weighing right before our eyes.`;
    }
  } else if (ind === "PRINTING_GRAPHICS") {
    opener = `Ordered ${item} for our business promotion ${occasion}.`;
    middle = `The material durability and color vibrancy impressed our entire team.`;
  } else if (ind === "PHOTOGRAPHY_STUDIO") {
    opener = `Got ${item} done as a surprise family gift ${occasion}.`;
    middle = `Everyone at home loved the neat finishing and natural expressions.`;
  } else if (ind === "RESTAURANT_FOOD") {
    opener = `Visited with family for a special meal and ordered ${item}.`;
    middle = `The flavors were authentic and everyone enjoyed the meal thoroughly.`;
  } else if (ind === "HEALTHCARE_CLINIC") {
    opener = `Visited ${bName} with a family member for ${item}.`;
    middle = `The doctor's gentle approach put everyone at ease immediately.`;
  } else if (ind === "AUTO_GARAGE") {
    opener = `Brought our family vehicle here for ${item} before a long trip.`;
    middle = `The ride is remarkably smooth and the vehicle is safe for travel.`;
  } else if (ind === "TOURS_TRAVELS") {
    opener = `Booked an outstation cab with ${bName} for our family trip ${occasion}.`;
    middle = `The vehicle was spotless with powerful AC, and the chauffeur drove very calmly and safely with elderly family members on board.`;
  } else if (ind === "TATTOO_STUDIO") {
    opener = intent.isPiercing
      ? `Visited ${bName} with a family member for ear and nose piercing.`
      : `Visited ${bName} with family to get matching custom tattoos.`;
    middle = intent.isPiercing
      ? `The specialist was extremely gentle, used sterilized equipment, and made the whole piercing calm and pain-free.`
      : `Karthik customized our tattoo stencils patiently and made everyone feel relaxed in the studio.`;
  } else if (ind === "APPLIANCE_REPAIR") {
    opener = `Called ${bName} to repair our home AC and refrigerator for our family in Kadapa.`;
    middle = `The technician was very polite with our family members, worked quietly and cleanly, and restored chilled cooling instantly.`;
  }

  const closer = pickRandom([
    `Worth every rupee spent.`,
    `Thanks to ${bName} for making it memorable.`,
    `Will definitely rely on them again.`,
    `Highly recommend their service!`,
  ]);

  const notePart = note ? ` Attention to ${note.toLowerCase()} made a big difference.` : "";
  return `${opener} ${middle}${notePart} ${closer}`;
}

// Style 15: Staff & Service Behavior Focus
function generateStaffService(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  if (ind === "TOURS_TRAVELS") {
    const openers = [
      `Really appreciated the respectful behavior of the chauffeur and desk staff at ${bName}.`,
      `The team running ${bName} (Pavan & Jyothi) are genuinely polite and helpful.`,
      `Customer service and travel assistance here are top notch.`,
    ];
    const middles = [
      `They answered our route queries patiently on WhatsApp and confirmed the cab right away.`,
      `The driver was well-mannered, drove with great caution, and helped with our family luggage.`,
      `Zero attitude, zero fare haggling, just courteous and professional hospitality throughout.`,
    ];
    const closers = [
      `Good people doing honest travel business.`,
      `Rare to find such courteous cab drivers and managers nowadays.`,
      `Great service culture and dependable travels!`,
    ];
    const notePart = note ? ` They took care of ${note.toLowerCase()} smoothly.` : "";
    return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
  }

  if (ind === "TATTOO_STUDIO") {
    const openers = [
      `Really appreciated the respectful and patient behavior of Karthik at ${bName}.`,
      `The artist at ${bName} is genuinely polite, humble, and deeply skilled.`,
      `Customer care and personal consultation here are top notch.`,
    ];
    const middles = [
      `He answered all my tattoo design queries calmly and didn't rush the stencil placement.`,
      `He checked on my pain tolerance constantly and kept the entire atmosphere comfortable.`,
      `No false promises or rushing, just authentic artistry and clinical hygiene throughout.`,
    ];
    const closers = [
      `True artist doing honest work in Kadapa.`,
      `Rare to find such courteous and patient tattoo artists nowadays.`,
      `Great studio culture and dependable care!`,
    ];
    const notePart = note ? ` They took care of ${note.toLowerCase()} smoothly.` : "";
    return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
  }

  if (ind === "APPLIANCE_REPAIR") {
    const openers = [
      `Really appreciated the respectful and polite behavior of the technicians at ${bName}.`,
      `The team at ${bName} are genuinely courteous, punctual, and technically sound.`,
      `Customer service and doorstep communication here are top notch.`,
    ];
    const middles = [
      `They answered our phone call promptly, arrived at the agreed time, and explained the cooling issue in simple terms.`,
      `They handled the appliance carefully, cleaned up all dirt and water with protective covers, and tested everything before leaving.`,
      `Zero attitude, zero inflated repair bills, just honest doorstep service and courteous hospitality throughout.`,
    ];
    const closers = [
      `Good technicians doing honest business in Kadapa.`,
      `Rare to find such well-mannered and dependable appliance mechanics nowadays.`,
      `Great service culture and reliable support!`,
    ];
    const notePart = note ? ` They took care of ${note.toLowerCase()} smoothly.` : "";
    return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
  }

  const item = tags[0] || pickRandom(lex.items);
  const openers = [
    `Really appreciated the respectful behavior of the staff at ${bName}.`,
    `The people running ${bName} are genuinely polite and helpful.`,
    `Customer service here is top notch.`,
  ];
  const middles = [
    `They took the time to answer every question and explained everything patiently.`,
    `No rushing or pushing unnecessary upgrades, just honest guidance on ${item}.`,
    `Handled the coordination with a friendly attitude.`,
  ];
  const closers = [
    `Good people doing honest business.`,
    `Rare to find such courteous customer support nowadays.`,
    `Great service culture.`,
  ];
  const notePart = note ? ` They took care of ${note.toLowerCase()} smoothly.` : "";
  return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
}

// Style 16: Value & Honest Pricing Focus
function generateValuePricing(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  if (ind === "TOURS_TRAVELS") {
    const openers = [
      `Fair pricing and honest billing at ${bName}.`,
      `Got great value for our outstation cab package with ${bName}.`,
      `Compared cab fares across Kadapa and ${bName} offered the most transparent quote.`,
    ];
    const middles = [
      `The vehicle condition is showroom clean and AC is powerful without any overcharging.`,
      `They clearly explained the fare breakup upfront with zero hidden driver allowance or toll surprises.`,
      `The trip was completed comfortably and the pricing was completely justified.`,
    ];
    const closers = [
      `Real value for money in cab services.`,
      `Honest dealings with zero hidden fees. Highly satisfied.`,
      `Would definitely recommend ${bName} to anyone traveling from Kadapa.`,
    ];
    const notePart = note ? ` Addressed ${note.toLowerCase()} without extra fuss.` : "";
    return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
  }

  if (ind === "TATTOO_STUDIO") {
    const openers = [
      `Fair pricing and honest quotes at ${bName}.`,
      `Got great value for our custom tattoo artwork with ${bName}.`,
      `Compared tattoo studio rates across Kadapa and ${bName} offered the most reasonable price for this level of quality.`,
    ];
    const middles = [
      `The linework and shading are truly international grade without any overpriced commercial hype.`,
      `They clearly explained the pricing based on tattoo size and detailing upfront with zero hidden charges.`,
      `Included sterile equipment, disposable cartridges, and thorough healing advice in the package.`,
    ];
    const closers = [
      `Real value for money for custom skin art.`,
      `Honest dealings and master artistry. Highly satisfied.`,
      `Would definitely recommend ${bName} to anyone wanting a tattoo in Kadapa.`,
    ];
    const notePart = note ? ` Addressed ${note.toLowerCase()} without extra fuss.` : "";
    return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
  }

  if (ind === "APPLIANCE_REPAIR") {
    const openers = [
      `Fair pricing and honest repair charges at ${bName}.`,
      `Got great value for money on our AC and fridge service with ${bName}.`,
      `Compared service quotes across Kadapa and ${bName} offered the most reasonable rates for genuine doorstep repair.`,
    ];
    const middles = [
      `The deep jet cleaning and cooling repair are top tier without any overpriced service markup.`,
      `They clearly explained the part costs and service charges upfront with zero hidden fees.`,
      `Used original manufacturer spares and tested pressure levels properly before taking payment.`,
    ];
    const closers = [
      `Real value for money in doorstep home appliance services.`,
      `Honest dealings and skilled technicians. Highly satisfied.`,
      `Would definitely recommend ${bName} to anyone needing AC or fridge repair in Kadapa.`,
    ];
    const notePart = note ? ` Addressed ${note.toLowerCase()} without extra fuss.` : "";
    return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
  }

  const item = tags[0] || pickRandom(lex.items);
  const openers = [
    `Fair pricing and honest business at ${bName}.`,
    `Got great value for money on the ${item}.`,
    `Compared prices around and ${bName} offered the most genuine quote.`,
  ];
  const middles = [
    `Quality of the ${item} is premium without any overcharging.`,
    `They clearly explained the price breakup upfront with no hidden add-ons.`,
    `Work is completed to a high standard that easily justifies the cost.`,
  ];
  const closers = [
    `Real value for money.`,
    `Honest dealings. Highly satisfied.`,
    `Would definitely recommend their ${item}.`,
  ];
  const notePart = note ? ` Addressed ${note.toLowerCase()} without extra fuss.` : "";
  return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
}

// ─── TELUGU SCRIPT STYLES (Strictly Domain Gated) ───────────────────────────

// Style 17: Telugu Conversational Experience (Telugu Script)
function generateTeluguConversational(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  const intent = detectTagIntent(tags, ind);
  const item = tags[0] || pickRandom(lex.items);

  let opener = `మా requirement ని అర్థం చేసుకుని ${item} చాలా neat గా చేశారు.`;
  let middle = `స్టాఫ్ చాలా ఓపికగా వివరాలు చెప్పారు, ఎక్కడా కంగారు పెట్టలేదు.`;
  let closer = `Thank you ${bName}! మంచి సర్వీస్ ఇచ్చే షాప్.`;

  switch (ind) {
    case "GOLD_BUYERS": {
      if (intent.isPledged) {
        opener = pickRandom([
          `బ్యాంకులో తాకట్టు పెట్టిన బంగారం విడిపించడానికి ${bName} ని సంప్రదించాము.`,
          `గోల్డ్ లోన్ క్లోజ్ చేసి ప్లెడ్జ్డ్ గోల్డ్ రిలీజ్ చేసుకోవడానికి ${bName} టీమ్ సహాయం తీసుకున్నాము.`,
          `తాకట్టు బంగారం విడిపించి బ్యాలెన్స్ అమౌంట్ తీసుకోవడానికి ఇక్కడికి వెళ్ళాము.`,
        ]);
        middle = pickRandom([
          `బ్యాంక్ లోన్ క్లియర్ చేయడంలో చాలా బాగా గైడ్ చేశారు, ఎక్కడా ఇబ్బంది లేకుండా ప్రాసెస్ పూర్తి చేశారు.`,
          `లోన్ అమౌంట్ సెటిల్ చేసి, మిగిలిన బ్యాలెన్స్ ని లైవ్ బులియన్ రేటు ప్రకారం కరెక్ట్ గా ఇచ్చారు.`,
          `ఎలాంటి హిడెన్ ఛార్జీలు లేకుండా ట్రాన్స్‌పరెంట్ గా లెక్క కట్టి స్పాట్ లో బ్యాంక్ ట్రాన్స్‌ఫర్ చేశారు.`,
        ]);
        closer = pickRandom([
          `తాకట్టు బంగారం విడిపించడానికి కడపలో అత్యంత నమ్మకమైన సర్వీస్!`,
          `చాలా రిలీఫ్ అనిపించింది, థాంక్యూ ${bName} టీమ్!`,
          `మంచి జెన్యూన్ సర్వీస్, definitely recommend!`,
        ]);
      } else if (intent.isPurity) {
        opener = pickRandom([
          `మా గోల్డ్ ఆర్నమెంట్స్ ప్యూరిటీ చెక్ చేయడానికి ${bName} కి వెళ్ళాము.`,
          `కంప్యూటరైజ్డ్ గోల్డ్ ప్యూరిటీ టెస్టింగ్ కోసం ${bName} ని విజిట్ చేశాము.`,
          `బంగారం కరిగించకుండా కరెక్ట్ ప్యూరిటీ తెలుసుకోవడానికి ఇక్కడికి వెళ్ళాము.`,
        ]);
        middle = pickRandom([
          `జర్మన్ ఎక్స్-ఆర్-ఎఫ్ మెషిన్ లో కంటి ముందే ప్యూరిటీ టెస్ట్ చేసి కరెక్ట్ క్యారట్ రీడింగ్ చూపించారు.`,
          `ఆర్నమెంట్స్ కి ఎలాంటి డ్యామేజ్ లేకుండా 2 నిమిషాల్లో కచ్చితమైన రిపోర్ట్ ఇచ్చారు.`,
          `స్టాఫ్ చాలా ఓపికగా డిజిటల్ రీడింగ్స్ ని వివరించారు, ఎక్కడా కంగారు పెట్టలేదు.`,
        ]);
        closer = pickRandom([
          `గోల్డ్ ప్యూరిటీ టెస్టింగ్ కి కడపలో బెస్ట్ ప్లేస్!`,
          `100% పారదర్శకమైన టెస్టింగ్, థాంక్యూ ${bName}!`,
          `చక్కటి సర్వీస్ మరియు నిజాయితీ గల స్టాఫ్.`,
        ]);
      } else {
        opener = pickRandom([
          `పాత బంగారం అమ్మడానికి ${bName} కి వెళ్ళాము, చాలా మంచి అనుభవం.`,
          `గోల్డ్ వాల్యుయేషన్ మరియు సెల్లింగ్ కోసం ${bName} ని సంప్రదించాము.`,
          `${bName} లో సర్వీస్ మరియు స్టాఫ్ రెస్పాన్స్ చాలా జెన్యూన్ గా ఉంది.`,
        ]);
        middle = pickRandom([
          `కంటి ముందే డిజిటల్ స్కేల్ మీద బరువు తూచి లైవ్ మార్కెట్ రేటు ఇచ్చారు.`,
          `లైవ్ మార్కెట్ రేటు ప్రకారం కరెక్ట్ గా క్యాలిక్యులేట్ చేసి స్పాట్ లో పేమెంట్ చేశారు.`,
          `డిజిటల్ వెయింగ్ లో ఎక్కడా వేస్టేజ్ లేదా కటింగ్స్ లేకుండా స్పష్టంగా లెక్క చెప్పారు.`,
        ]);
        closer = pickRandom([
          `బంగారం అమ్మడానికి కడపలో బెస్ట్ మరియు నమ్మకమైన గోల్డ్ బయర్స్!`,
          `100% సేఫ్ మరియు ట్రాన్స్‌పరెంట్ సర్వీస్, థాంక్యూ ${bName}!`,
          `కడపలో బెస్ట్ సర్వీస్ ఇచ్చే షాప్.`,
        ]);
      }
      break;
    }

    case "PRINTING_GRAPHICS": {
      if (intent.isFlexBanner) {
        opener = pickRandom([
          `మా ఈవెంట్ కోసం flex banner ప్రింటింగ్ ${bName} లో చేయించాము.`,
          `షాప్ ప్రమోషన్ కోసం ఫ్లెక్స్ బ్యానర్స్ ఆర్డర్ ఇచ్చాము.`,
          `${bName} లో ఫ్లెక్స్ బ్యానర్ ప్రింటింగ్ సర్వీస్ చాలా బాగుంది.`,
        ]);
        middle = pickRandom([
          `మంచి వాటర్‌ప్రూఫ్ మెటీరియల్ వాడారు, కలర్స్ చాలా వైబ్రంట్ గా వచ్చాయి.`,
          `ఎండకి కూడా రంగు తగ్గకుండా సూపర్ క్వాలిటీ ఫ్లెక్స్ ఇచ్చారు.`,
          `టైమ్‌కి రెడీ చేసి ఇచ్చారు, ప్రింట్ క్వాలిటీ లో ఎక్కడా రాజీ పడలేదు.`,
        ]);
        closer = pickRandom([
          `ఫ్లెక్స్ బ్యానర్స్ కి కడపలో బెస్ట్ షాప్!`,
          `థాంక్యూ ${bName}, క్వాలిటీ ప్రింటింగ్ కి బెస్ట్ ప్లేస్!`,
        ]);
      } else if (intent.isSignBoard) {
        opener = pickRandom([
          `మా షాప్ ఫ్రంట్ కోసం commercial sign board మరియు glow sign ${bName} లో చేయించాము.`,
          `షాప్ సైన్ బోర్డ్ డిజైనింగ్ మరియు ఇన్స్టాలేషన్ ఇక్కడ ఆర్డర్ ఇచ్చాము.`,
        ]);
        middle = pickRandom([
          `అక్రిలిక్ లెటరింగ్ మరియు లైటింగ్ చాలా గ్రాండ్‌గా అమర్చారు.`,
          `బోర్డ్ ఫినిషింగ్ చాలా ప్రీమియం గా వచ్చింది, నైట్ లుక్ సూపర్.`,
        ]);
        closer = pickRandom([
          `సైన్ బోర్డ్స్ కి కడపలో బెస్ట్ ప్రింటింగ్ షాప్!`,
          `వర్త్ ఎవ్రీ రూపీ, థాంక్యూ ${bName}!`,
        ]);
      } else if (intent.isVisitingCard) {
        opener = pickRandom([
          `బిజినెస్ ప్రమోషన్ కోసం విజిటింగ్ కార్డ్స్ మరియు బ్రోచర్స్ ఆర్డర్ ఇచ్చాము.`,
          `మా ఆఫీస్ కోసం విజిటింగ్ కార్డ్స్ ప్రింటింగ్ ${bName} లో చేయించాము.`,
        ]);
        middle = pickRandom([
          `కార్డ్ పేపర్ క్వాలిటీ మరియు ఫాంట్ క్లారిటీ చాలా షార్ప్‌గా వచ్చాయి.`,
          `డిజైన్ లేఅవుట్ చాలా ప్రొఫెషనల్ గా సెట్ చేసి ఇచ్చారు.`,
        ]);
        closer = pickRandom([
          `విజిటింగ్ కార్డ్స్ ప్రింటింగ్ కి బెస్ట్ ప్లేస్!`,
          `థాంక్యూ ${bName}!`,
        ]);
      } else {
        opener = pickRandom([
          `మా షాప్ ఓపెనింగ్ కోసం flex banner మరియు sign board ${bName} లో చేయించాము.`,
          `బిజినెస్ ప్రమోషన్ కోసం ప్రింటింగ్ వర్క్స్ ఇక్కడ ఆర్డర్ ఇచ్చాము.`,
          `${bName} లో ప్రింటింగ్ సర్వీస్ చాలా బాగుంది.`,
        ]);
        middle = pickRandom([
          `స్టాఫ్ చాలా ఓపికగా డిజైన్ ఆప్షన్స్ చూపించారు, ఎక్కడా కంగారు పెట్టలేదు.`,
          `టైమ్‌కి రెడీ చేసి ఇచ్చారు, ప్రింట్ క్వాలిటీ లో ఎక్కడా రాజీ పడలేదు.`,
          `కలర్ ప్రింటింగ్ మరియు బోర్డర్ అలైన్‌మెంట్ చాలా సాలిడ్‌గా వచ్చాయి.`,
        ]);
        closer = pickRandom([
          `ప్రింటింగ్ మరియు సైన్ బోర్డ్స్ కి కడపలో బెస్ట్ షాప్.`,
          `థాంక్యూ ${bName}, క్వాలిటీ ప్రింటింగ్ కి బెస్ట్ ప్లేస్!`,
          `మంచి షాప్, definitely recommend!`,
        ]);
      }
      break;
    }

    case "PHOTOGRAPHY_STUDIO": {
      if (intent.isWeddingShoots) {
        opener = pickRandom([
          `మా వెడ్డింగ్ ఫోటోగ్రఫీ మరియు సినిమాటిక్ ఫిల్మ్స్ కోసం ${bName} ని బుక్ చేసుకున్నాము.`,
          `ప్రీ-వెడ్డింగ్ షూట్ మరియు క్యాండిడ్ ఫోటోగ్రఫీ కోసం ${bName} ని సంప్రదించాము.`,
          `మా ఫ్యామిలీ వెడ్డింగ్ ఈవెంట్ కవరేజ్ చాలా గ్రాండ్‌గా చేశారు.`,
        ]);
        middle = pickRandom([
          `ఫోటోలలో ప్రతి ఎమోషన్‌ని మరియు నాచురల్ స్మైల్స్ ని చాలా అందంగా క్యాప్చర్ చేశారు.`,
          `సినిమాటిక్ యాంగిల్స్ మరియు లైటింగ్ చాలా రిచ్ గా వచ్చాయి.`,
          `స్టాఫ్ చాలా ఫ్రెండ్లీగా కోఆర్డినేట్ చేసుకుని మంచి అవుట్‌పుట్ ఇచ్చారు.`,
        ]);
        closer = pickRandom([
          `మా వెడ్డింగ్ మెమరీస్ ని స్పెషల్ చేశారు, థాంక్యూ ${bName}!`,
          `వెడ్డింగ్ ఫోటోగ్రఫీ కి కడపలో బెస్ట్ టీమ్!`,
        ]);
      } else if (intent.isCustomGifts) {
        opener = pickRandom([
          `బర్త్‌డే సర్ప్రైజ్ కోసం కస్టమైజ్డ్ కప్ ప్రింటింగ్ మరియు పిల్లో ప్రింటింగ్ చేయించాము.`,
          `కస్టమైజ్డ్ గిఫ్ట్స్ మరియు మ్యాజిక్ పిల్లోస్ ${bName} లో ఆర్డర్ ఇచ్చాము.`,
          `ఫోటో ప్రింటెడ్ కప్ మరియు కీచైన్స్ కోసం ఇక్కడికి వెళ్ళాము.`,
        ]);
        middle = pickRandom([
          `గిఫ్ట్స్ మీద ఫోటో క్లారిటీ ఏమాత్రం తగ్గకుండా చాలా అందంగా ప్రింట్ చేశారు.`,
          `మ్యాజిక్ పిల్లో మరియు కప్ క్వాలిటీ చాలా బాగుంది, కలర్స్ బ్రైట్ గా ఉన్నాయి.`,
          `సకాలంలో రెడీ చేసి సేఫ్ గా ప్యాక్ చేసి ఇచ్చారు.`,
        ]);
        closer = pickRandom([
          `పర్ఫెక్ట్ గిఫ్ట్ ఐడియా, ఇంట్లో అందరూ చాలా హ్యాపీగా ఫీల్ అయ్యారు!`,
          `కస్టమైజ్డ్ గిఫ్ట్స్ కి కడపలో బెస్ట్ ప్లేస్, థాంక్యూ ${bName}!`,
        ]);
      } else {
        opener = pickRandom([
          `మా ఫ్యామిలీ ఫంక్షన్ కోసం ఫోటో ఫ్రేమ్ మరియు ప్రింట్స్ ${bName} లో చేయించాము.`,
          `${bName} లో ఫోటోగ్రఫీ మరియు ఫ్రేమింగ్ సర్వీస్ చాలా బాగుంది.`,
          `మంచి ఫోటో స్టూడియో కోసం చూసి ఇక్కడికి వెళ్ళాము.`,
        ]);
        middle = pickRandom([
          `ఫోటో క్రాపింగ్ మరియు కలర్ కరెక్షన్ చాలా జాగ్రత్తగా చేశారు.`,
          `ఆల్బమ్ మరియు ఫ్రేమ్ క్వాలిటీ అనుకున్నదానికంటే చాలా బాగా వచ్చింది.`,
          `స్టాఫ్ చాలా ఫ్రెండ్లీగా రిసీవ్ చేసుకుని మంచి ఆప్షన్స్ సజెస్ట్ చేశారు.`,
        ]);
        closer = pickRandom([
          `మా ఫ్యామిలీ అందరికీ నచ్చింది, థాంక్యూ ${bName}!`,
          `ఖచ్చితంగా మళ్ళీ ఇక్కడే చేయించుకుంటాము.`,
          `ఫోటో వర్క్స్ కి బెస్ట్ ప్లేస్!`,
        ]);
      }
      break;
    }

    case "SOFTWARE_IT":
      opener = pickRandom([
        `మా ప్రాజెక్ట్ సాఫ్ట్‌వేర్ డెవలప్‌మెంట్ కోసం ${bName} ని సంప్రదించాము.`,
        `${bName} లో టెక్ సపోర్ట్ మరియు డెవలప్‌మెంట్ సర్వీస్ చాలా ప్రొఫెషనల్ గా ఉంది.`,
        `మంచి వెబ్ అండ్ మొబైల్ యాప్ డెవలపర్స్ కోసం చూసి ఇక్కడికి వెళ్ళాము.`,
      ]);
      middle = pickRandom([
        `డెవలప్‌మెంట్ టీమ్ చాలా ప్రొఫెషనల్ గా సకాలంలో ప్రాజెక్ట్ కంప్లీట్ చేశారు.`,
        `క్లీన్ కోడింగ్ మరియు రెస్పాన్సివ్ UI/UX తో చాలా చక్కగా బిల్డ్ చేశారు.`,
        `ఎప్పటికప్పుడు అప్‌డేట్స్ ఇస్తూ మా రిక్వైర్‌మెంట్స్ పర్ఫెక్ట్‌గా ఇంప్లిమెంట్ చేశారు.`,
      ]);
      closer = pickRandom([
        `సాఫ్ట్‌వేర్ మరియు టెక్ సర్వీసెస్ కి బెస్ట్ కంపెనీ!`,
        `థాంక్యూ ${bName} టీమ్, గ్రేట్ వర్క్!`,
        `హైలీ రికమండెడ్ ఐటీ సర్వీసెస్.`,
      ]);
      break;

    case "RESTAURANT_FOOD":
      opener = pickRandom([
        `ఫ్యామిలీ తో కలిసి డిన్నర్ కోసం ${bName} కి వెళ్ళాము.`,
        `${bName} లో ఫుడ్ టేస్ట్ మరియు బిర్యానీ చాలా బాగుంది.`,
        `ఫ్రెండ్స్ తో కలిసి లంచ్ కోసం ఈ రెస్టారెంట్ కి వెళ్ళాము.`,
      ]);
      middle = pickRandom([
        `ఫుడ్ టేస్ట్ మరియు క్వాలిటీ చాలా అద్భుతంగా ఉన్నాయి, సర్వీస్ కూడా ఫాస్ట్ గా ఉంది.`,
        `ఎక్కడా హెవీ ఆయిల్ లేకుండా తాజా పదార్థాలతో చాలా రుచిగా చేశారు.`,
        `టేబుల్ సర్వీస్ చాలా మర్యాదగా ఉంది మరియు వేడివేడిగా సర్వ్ చేశారు.`,
      ]);
      closer = pickRandom([
        `మంచి ఫుడ్ మరియు హాస్పిటాలిటీ, డెఫినెట్‌గా మళ్ళీ వస్తాము!`,
        `రుచికరమైన భోజనం, థాంక్యూ ${bName}!`,
        `కడపలో బెస్ట్ ఫుడ్ స్పాట్!`,
      ]);
      break;

    case "SALON_BEAUTY":
      opener = pickRandom([
        `హెయిర్‌కట్ మరియు గ్రూమింగ్ కోసం ${bName} సెలూన్ కి వెళ్ళాను.`,
        `${bName} లో స్టైలింగ్ మరియు సర్వీస్ చాలా బాగుంది.`,
        `మంత్లీ గ్రూమింగ్ కోసం ఈ సెలూన్ కి వెళ్ళాము.`,
      ]);
      middle = pickRandom([
        `హైజీన్ మరియు స్టైలింగ్ చాలా నీట్‌గా చేశారు, స్టైలిస్ట్ చాలా ఓపికగా ఉన్నారు.`,
        `క్లీన్ టూల్స్ వాడారు మరియు మా హెయిర్ స్టైల్ కి తగ్గట్టు మంచి లుక్ ఇచ్చారు.`,
        `ఎక్కడా కంగారు లేకుండా చాలా శ్రద్ధగా గ్రూమింగ్ చేశారు.`,
      ]);
      closer = pickRandom([
        `కడపలో బెస్ట్ సెలూన్ సర్వీస్!`,
        `మంచి స్టైలింగ్, థాంక్యూ ${bName}!`,
        `డెఫినెట్‌గా మళ్ళీ ఇక్కడికే వస్తాను.`,
      ]);
      break;

    case "HEALTHCARE_CLINIC":
      opener = pickRandom([
        `హెల్త్ కన్సల్టేషన్ కోసం ${bName} క్లినిక్ ని విజిట్ చేశాము.`,
        `${bName} లో డాక్టర్ మరియు క్లినిక్ కేర్ చాలా బాగుంది.`,
        `దంత సంరక్షణ మరియు చెకప్ కోసం ఇక్కడికి వెళ్ళాము.`,
      ]);
      middle = pickRandom([
        `డాక్టర్ చాలా ఓపికగా ప్రాబ్లమ్ విన్నారు మరియు సరైన సలహా ఇచ్చారు.`,
        `క్లినిక్ చాలా శుభ్రంగా, హైజీనిక్ గా ఉంది మరియు నొప్పి లేకుండా ట్రీట్మెంట్ చేశారు.`,
        `అనవసరమైన టెస్టులు లేకుండా చాలా నిజాయితీగా వైద్యం అందించారు.`,
      ]);
      closer = pickRandom([
        `మంచి డాక్టర్ మరియు నమ్మకమైన క్లినిక్!`,
        `చాలా సంతృప్తికరమైన వైద్య సేవలు, థాంక్యూ!`,
        `హైలీ రికమండెడ్ హెల్త్‌కేర్ క్లినిక్.`,
      ]);
      break;

    case "AUTO_GARAGE":
      opener = pickRandom([
        `మా వెహికల్ సర్వీసింగ్ కోసం ${bName} గ్యారేజ్ కి ఇచ్చాము.`,
        `${bName} లో మెకానిక్ వర్క్ మరియు రిపేర్ చాలా బాగుంది.`,
        `లాంగ్ జర్నీ కి వెళ్ళే ముందు బండి చెకప్ కోసం ఇక్కడికి ఇచ్చాము.`,
      ]);
      middle = pickRandom([
        `మెకానిక్స్ జెన్యూన్ పార్ట్స్ వేసి డ్రైవింగ్ చాలా స్మూత్ గా ఉండేలా రెడీ చేశారు.`,
        `ఎక్కడా అదనపు ఛార్జీలు లేకుండా ముందుగానే ఎస్టిమేట్ చెప్పి వర్క్ చేశారు.`,
        `సమయానికి వెహికల్ రెడీ చేసి ఇచ్చారు, పికప్ చాలా బాగుంది.`,
      ]);
      closer = pickRandom([
        `హానెస్ట్ మెకానిక్స్ మరియు రీజనబుల్ ప్రైస్!`,
        `నమ్మకమైన వెహికల్ సర్వీసింగ్ గ్యారేజ్, థాంక్యూ!`,
        `డ్రైవింగ్ చాలా స్మూత్ గా ఉంది, వర్త్ ఇట్!`,
      ]);
      break;

    case "TOURS_TRAVELS":
      if (intent.isSelfDrive) {
        opener = pickRandom([
          `వీకెండ్ ట్రిప్ కోసం ${bName} నుండి సెల్ఫ్ డ్రైవ్ కార్ తీసుకున్నాము.`,
          `${bName} లో ₹1,499/day కే ఫాస్ట్‌ట్యాగ్‌తో సెల్ఫ్ డ్రైవ్ కారు ఇచ్చారు.`,
        ]);
        middle = pickRandom([
          `కారు కండిషన్ చాలా బాగుంది, ఏసీ సూపర్ కూలింగ్ ఇచ్చింది, హ్యాండోవర్ చాలా ఫాస్ట్ గా జరిగింది.`,
          `రిటర్న్ చేసేటప్పుడు ఎటువంటి హిడెన్ ఛార్జెస్ వేయకుండా డిపాజిట్ వెంటనే ఇచ్చేశారు.`,
        ]);
        closer = pickRandom([
          `కడపలో సెల్ఫ్ డ్రైవ్ కార్లకి బెస్ట్ సర్వీస్!`,
          `థాంక్యూ ${bName}, కచ్చితంగా మళ్ళీ బుక్ చేస్తాము!`,
        ]);
      } else if (intent.isTirupati) {
        opener = pickRandom([
          `ఫ్యామిలీ తిరుపతి దర్శనం కోసం ${bName} క్యాబ్ బుక్ చేశాము.`,
          `తిరుపతి టెంపుల్ ట్రిప్ కోసం ఇన్నోవా క్రిస్టా బుక్ చేశాము.`,
        ]);
        middle = pickRandom([
          `డ్రైవర్ తెల్లవారుజామున సమయానికి వచ్చారు, ఘాట్ రోడ్ లో చాలా సేఫ్ గా డ్రైవ్ చేశారు.`,
          `రౌండ్ ట్రిప్ జస్ట్ ₹2,099 కే ఎలాంటి హిడెన్ కాస్ట్స్ లేకుండా సర్వీస్ ఇచ్చారు.`,
        ]);
        closer = pickRandom([
          `ఫ్యామిలీ అందరికీ జర్నీ చాలా కంఫర్టబుల్ గా ఉంది. థాంక్యూ ${bName}!`,
          `కడపలో బెస్ట్ ట్రావెల్స్ సర్వీస్!`,
        ]);
      } else {
        opener = pickRandom([
          `అర్జెంటు అవుట్‌స్టేషన్ ప్రయాణం కోసం ${bName} ని సంప్రదించాము.`,
          `${bName} లో క్యాబ్ సర్వీస్ చాలా నీట్‌గా మరియు సేఫ్‌గా ఉంది.`,
        ]);
        middle = pickRandom([
          `డ్రైవర్ చాలా మర్యాదగా మాట్లాడారు, హైవే లో జాగ్రత్తగా డ్రైవ్ చేశారు.`,
          `వాట్సాప్ లో కోట్ చేసిన రేటు మాత్రమే తీసుకున్నారు, ఎటువంటి ఎక్స్‌ట్రా అడగలేదు.`,
        ]);
        closer = pickRandom([
          `చాలా నమ్మకమైన ట్రావెల్స్ సర్వీస్. థాంక్యూ పవన్ గారు & జ్యోతి గారు!`,
          `కడపలో బెస్ట్ క్యాబ్స్. హ్యాపీ కస్టమర్!`,
        ]);
      }
      break;

    case "TATTOO_STUDIO":
      if (intent.isPiercing) {
        opener = pickRandom([
          `${bName} లో ఇయర్ మరియు నోస్ పియర్సింగ్ చేయించుకున్నాను.`,
          `నొప్పి లేకుండా సేఫ్ పియర్సింగ్ కోసం ${bName} స్టూడియోకి వెళ్లాము.`,
          `హైలీ హైజీనిక్ సెటప్‌తో పియర్సింగ్ సర్వీస్ తీసుకున్నాము.`,
        ]);
        middle = pickRandom([
          `డిస్పోజబుల్ సింగిల్-యూజ్ నీడిల్స్ వాడారు, ఏమాత్రం నొప్పి తెలియకుండా చాలా జెంటిల్ గా చేశారు.`,
          `స్టూడియో చాలా నీట్‌గా ఉంది, పియర్సింగ్ తర్వాత హీలింగ్ కేర్ టిప్స్ చాలా వివరంగా చెప్పారు.`,
          `ఎలాంటి వాపు లేదా ఇన్ఫెక్షన్ లేకుండా చాలా త్వరగా నయమైంది.`,
        ]);
        closer = pickRandom([
          `కడపలో బెస్ట్ పియర్సింగ్ స్టూడియో, థాంక్యూ కార్తీక్ గారు!`,
          `సేఫ్ అండ్ పెయిన్‌లెస్ సర్వీస్, డెఫినెట్‌గా రికమండ్ చేస్తాను!`,
          `హైజీన్ విషయంలో నంబర్ వన్!`,
        ]);
      } else {
        opener = pickRandom([
          `${bName} లో కస్టమ్ టాటూ వేయించుకున్నాను, ఫినిషింగ్ సూపర్బ్ గా వచ్చింది.`,
          `మంచి టాటూ ఆర్టిస్ట్ కోసం వెతికి ${bName} ని ఎంచుకున్నాను.`,
          `కడపలో బెస్ట్ టాటూ స్టూడియో ${bName}, చాలా గ్రేట్ ఎక్స్‌పీరియన్స్!`,
        ]);
        middle = pickRandom([
          `కంటి ముందే సీల్డ్ నీడిల్ ఓపెన్ చేసి చూపించారు, స్టూడియో హైజీన్ 100% పర్ఫెక్ట్ గా ఉంది.`,
          `వైర్‌లెస్ టాటూ మెషిన్ తో చాలా స్మూత్ గా వేశారు, షేడింగ్ మరియు లైన్ వర్క్ డీటెయిలింగ్ అదిరిపోయింది.`,
          `స్టెన్సిల్ డిజైన్ నాకిష్టమైనట్టు వచ్చే వరకు ఓపిగ్గా అడ్జస్ట్ చేసి వేశారు.`,
        ]);
        closer = pickRandom([
          `కడపలో నంబర్ వన్ టాటూ ఆర్టిస్ట్, థాంక్యూ ${bName}!`,
          `రీజనబుల్ ప్రైస్ మరియు వరల్డ్ క్లాస్ ఆర్ట్, ఫుల్లీ శాటిస్‌ఫైడ్!`,
          `నా ఫ్రెండ్స్ అందరికీ రికమండ్ చేస్తాను, వర్త్ ఎవ్రీ రూపీ!`,
        ]);
      }
      break;

    case "APPLIANCE_REPAIR":
      if (intent.isJetWash) {
        opener = pickRandom([
          `${bName} లో స్ప్లిట్ ఏసీ డీప్ జెట్ వాష్ సర్వీస్ చేయించుకున్నాము.`,
          `ఏసీ కూలింగ్ తగ్గిపోవడంతో ${bName} వారికి కాల్ చేసి జెట్ సర్వీస్ చేయించాము.`,
          `కడపలో బెస్ట్ ఏసీ జెట్ వాష్ సర్వీస్ ${bName}, సూపర్ రిజల్ట్!`,
        ]);
        middle = pickRandom([
          `ప్రొఫెషనల్ జాకెట్ కవర్ వేసి జెట్ పంప్‌తో డస్ట్ మొత్తం క్లీన్ చేశారు, గోడలపై ఒక్క నీటి చుక్క కూడా పడకుండా నీట్‌గా చేశారు.`,
          `కాయిల్స్ లోని చెత్త మొత్తం క్లియర్ అయి, ఇప్పుడు ఐస్ కూలింగ్ సూపర్బ్ గా వస్తోంది.`,
          `చాలా ప్రొఫెషనల్ టెక్నీషియన్, పని మొత్తం చాలా జాగ్రత్తగా పూర్తి చేశారు.`,
        ]);
        closer = pickRandom([
          `కడపలో బెస్ట్ ఏసీ సర్వీస్, థాంక్యూ ${bName}!`,
          `చల్లటి కూలింగ్ మళ్లీ వచ్చింది, ఫుల్లీ శాటిస్‌ఫైడ్!`,
          `చాలా రీజనబుల్ ప్రైస్, డెఫినెట్‌గా రికమండ్ చేస్తాను!`,
        ]);
      } else if (intent.isAcGasRefill) {
        opener = pickRandom([
          `ఏసీ లో కూలింగ్ ఆగిపోవడంతో ${bName} ని డోర్‌స్టెప్ చెకప్ కోసం పిలిచాము.`,
          `గ్యాస్ లీకేజ్ ప్రాబ్లమ్ సాల్వ్ చేసి రీఫిల్లింగ్ చేయడానికి ${bName} టీమ్ వచ్చారు.`,
        ]);
        middle = pickRandom([
          `గేజ్ మీటర్ తో ప్రెషర్ చెక్ చేసి, కచ్చితమైన లీక్ ఎక్కడుందో గుర్తించి బ్రేజింగ్ చేశారు.`,
          `ఒరిజినల్ గ్యాస్ ని సరైన ప్రెషర్ తో నింపారు, 15 నిమిషాల్లోనే గది మొత్తం చల్లగా మారింది.`,
          `ఎలాంటి ఫాల్స్ చార్జీలు లేకుండా నిజాయితీగా పని చేశారు.`,
        ]);
        closer = pickRandom([
          `కడపలో జెన్యూన్ ఏసీ మెకానిక్, చాలా నమ్మకమైన సర్వీస్!`,
          `రీజనబుల్ చార్జెస్ మరియు సూపర్ కూలింగ్!`,
        ]);
      } else {
        opener = pickRandom([
          `మా ఇంటి ఏసీ మరియు ఫ్రిజ్ రిపేర్ కోసం ${bName} ని సంప్రదించాము.`,
          `కడపలో నంబర్ వన్ హోమ్ అప్లయన్సెస్ రిపేర్ సర్వీస్ ${bName}.`,
          `అర్జెంట్ గా ఫ్రిజ్ కూలింగ్ ప్రాబ్లమ్ రావడంతో వీరికి కాల్ చేశాము, గంటలోనే వచ్చారు.`,
        ]);
        middle = pickRandom([
          `సమయానికి ఇంటికి వచ్చి ప్రాబ్లమ్ ఏంటో క్లియర్‌గా వివరించి జెన్యూన్ స్పేర్ పార్ట్ వేశారు.`,
          `టెక్నీషియన్ చాలా మర్యాదగా మాట్లాడారు, పని పూర్తయ్యాక చెక్ చేసి చూపించారు.`,
          `మార్కెట్ లో మిగతా వారికంటే చాలా రీజనబుల్ రేట్స్ కే బెస్ట్ సర్వీస్ ఇచ్చారు.`,
        ]);
        closer = pickRandom([
          `కడపలో బెస్ట్ అప్లయన్స్ రిపేర్ సర్వీస్, థాంక్యూ ${bName}!`,
          `నమ్మకమైన డోర్‌స్టెప్ సర్వీస్, అందరికీ రికమండ్ చేస్తాను!`,
        ]);
      }
      break;

    default:
      opener = pickRandom([
        `మా requirement ని అర్థం చేసుకుని ${item} చాలా neat గా చేశారు.`,
        `${bName} లో సర్వీస్ మరియు స్టాఫ్ రెస్పాన్స్ చాలా బాగుంది.`,
        `మంచి సర్వీస్ కోసం చూసి ${bName} ని సంప్రదించాము.`,
      ]);
      middle = pickRandom([
        `స్టాఫ్ చాలా ఓపికగా వివరాలు చెప్పారు, ఎక్కడా కంగారు పెట్టలేదు.`,
        `టైమ్‌కి వర్క్ కంప్లీట్ చేసి ఇచ్చారు, క్వాలిటీ చాలా బాగుంది.`,
        `మా అవసరానికి తగ్గట్టు సరైన సలహాలు ఇచ్చి సహాయం చేశారు.`,
      ]);
      closer = pickRandom([
        `మంచి సర్వీస్, definitely recommend ${bName}!`,
        `థాంక్యూ ${bName} టీమ్, చాలా సంతోషంగా ఉంది!`,
        `కడపలో బెస్ట్ సర్వీస్ ఇచ్చే షాప్.`,
      ]);
      break;
  }

  let review = `${opener} ${middle} ${closer}`;
  if (note) review += ` ${note} కూడా proper గా handle చేశారు.`;
  return review;
}

// Style 18: Telugu Craftsmanship & Quality Focus (Telugu Script)
function generateTeluguCraftsmanship(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  const intent = detectTagIntent(tags, ind);
  const item = tags[0] || pickRandom(lex.items);

  let opener = `${item} వర్క్ చాలా neat గా చేశారు, క్వాలిటీ నంబర్ వన్.`;
  let middle = `మంచి మన్నికైన మెటీరియల్ వాడారు, వర్క్ చాలా జెన్యూన్.`;
  let closer = `వర్త్ ఎవ్రీ రూపీ! హైలీ శాటిస్‌ఫైడ్ విత్ ది సర్వీస్.`;

  switch (ind) {
    case "GOLD_BUYERS": {
      if (intent.isPledged) {
        opener = pickRandom([
          `తాకట్టు బంగారం రిలీజ్ సర్వీస్ చాలా ప్రొఫెషనల్ గా మరియు సేఫ్ గా చేశారు.`,
          `బ్యాంకు లోన్ క్లోజ్ చేయడంలో ${bName} టీమ్ సర్వీస్ సూపర్బ్.`,
          `ప్లెడ్జ్డ్ గోల్డ్ క్లియరెన్స్ ప్రాసెస్ చాలా స్పీడ్‌గా మరియు క్లీన్‌గా పూర్తి చేశారు.`,
        ]);
        middle = pickRandom([
          `బ్యాంకులో తాకట్టు బంగారం విడిపించి మిగిలిన బ్యాలెన్స్ అమౌంట్ వెంటనే అకౌంట్ లో వేశారు.`,
          `ఎలాంటి ఇబ్బంది లేకుండా లోన్ అమౌంట్ క్లియర్ చేశారు, లెక్కలన్నీ చాలా క్లియర్.`,
          `మంచి గౌరవప్రదమైన వాతావరణంలో సేఫ్ గా ట్రాన్సాక్షన్ కంప్లీట్ అయ్యింది.`,
        ]);
        closer = pickRandom([
          `తాకట్టు బంగారం విడిపించడానికి కడపలో నంబర్ వన్ షాప్!`,
          `వర్త్ ఎవ్రీ రూపీ, థాంక్యూ ${bName}!`,
          `100% నమ్మకమైన గోల్డ్ బయర్స్.`,
        ]);
      } else if (intent.isPurity) {
        opener = pickRandom([
          `కంప్యూటరైజ్డ్ జర్మన్ మెషిన్ లో గోల్డ్ ప్యూరిటీ టెస్టింగ్ విధానం చాలా పర్ఫెక్ట్‌గా ఉంది.`,
          `బంగారం కరిగించకుండా ప్యూరిటీ టెస్ట్ చేయడం చాలా నచ్చింది.`,
          `ప్యూరిటీ టెస్టింగ్ లో 100% ట్రాన్స్‌పరెన్సీ చూపించారు.`,
        ]);
        middle = pickRandom([
          `కంప్యూటర్ టెస్టింగ్ తో బంగారం ప్యూరిటీని కంటి ముందే కరెక్ట్ గా నిర్ధారించారు.`,
          `డిజిటల్ రీడింగ్స్ చాలా అక్యూరేట్ గా వచ్చాయి, ఏమాత్రం వేస్టేజ్ లేదా డ్యామేజ్ లేదు.`,
          `ఎక్స్-ఆర్-ఎఫ్ మెషిన్ ద్వారా కచ్చితమైన క్యారట్స్ రిపోర్ట్ ఇచ్చారు.`,
        ]);
        closer = pickRandom([
          `గోల్డ్ టెస్టింగ్ కి కడపలో అత్యంత నమ్మకమైన షాప్!`,
          `100% నిజాయితీ గల సర్వీస్, థాంక్యూ ${bName}!`,
          `చాలా ప్రొఫెషనల్ వర్క్, థాంక్యూ!`,
        ]);
      } else {
        opener = pickRandom([
          `${item} టెస్టింగ్ మరియు వెయింగ్ లో 100% ట్రాన్స్‌పరెన్సీ చూపించారు.`,
          `${bName} లో గోల్డ్ వాల్యుయేషన్ మరియు లైవ్ మార్కెట్ రేటు చాలా జెన్యూన్ గా ఇచ్చారు.`,
          `పాత బంగారం అమ్మడానికి వెళ్ళినప్పుడు చాలా క్లీన్ గా ప్రాసెస్ చేశారు.`,
        ]);
        middle = pickRandom([
          `కంటి ముందే డిజిటల్ స్కేల్ మీద బరువు తూచారు, వేస్టేజ్ ఏమీ కట్ చేయలేదు.`,
          `లైవ్ గోల్డ్ రేట్ ఇచ్చి వెంటనే బ్యాంక్ ట్రాన్స్‌ఫర్ చేశారు.`,
          `ఎలాంటి హిడెన్ డిడక్షన్స్ లేకుండా బెస్ట్ మార్కెట్ ప్రైస్ ఇచ్చారు.`,
        ]);
        closer = pickRandom([
          `కడపలో బెస్ట్ మరియు జెన్యూన్ గోల్డ్ బయర్స్! వర్త్ ఎవ్రీ రూపీ.`,
          `100% నిజాయితీ గల సర్వీస్, థాంక్యూ ${bName}!`,
          `బంగారం అమ్మడానికి అత్యంత నమ్మకమైన షాప్.`,
        ]);
      }
      break;
    }

    case "PRINTING_GRAPHICS": {
      if (intent.isFlexBanner) {
        opener = pickRandom([
          `ఫ్లెక్స్ బ్యానర్ ప్రింటింగ్ క్వాలిటీ super rich గా వచ్చింది.`,
          `ఫ్లెక్స్ బోర్డ్స్ మరియు బ్యానర్స్ చాలా neat గా చేశారు.`,
        ]);
        middle = pickRandom([
          `కలర్స్ చాలా షార్ప్‌గా వచ్చాయి, మెటీరియల్ మన్నిక చాలా సాలిడ్‌గా ఉంది.`,
          `ఎండకి ఏమాత్రం రంగు తగ్గకుండా మంచి వాటర్ ప్రూఫ్ మెటీరియల్ వాడారు.`,
        ]);
        closer = pickRandom([
          `క్వాలిటీ ప్రింటింగ్ కోరుకునేవారికి ది బెస్ట్ ఛాయిస్!`,
          `కడపలో బెస్ట్ ప్రింటింగ్ షాప్, థాంక్యూ ${bName}!`,
        ]);
      } else if (intent.isSignBoard) {
        opener = pickRandom([
          `షాప్ సైన్ బోర్డ్ మరియు గ్లో సైన్ ఫినిషింగ్ చాలా రిచ్ గా వచ్చింది.`,
          `అక్రిలిక్ లెటరింగ్ బోర్డ్స్ చాలా పర్ఫెక్ట్ గా అమర్చారు.`,
        ]);
        middle = pickRandom([
          `నైట్ విజిబిలిటీ సూపర్ గా ఉంది, మంచి క్వాలిటీ ఎల్ఈడీ లైట్స్ వాడారు.`,
          `ఫ్రేమ్ వర్క్ చాలా సాలిడ్‌గా మరియు మన్నికగా ఉంది.`,
        ]);
        closer = pickRandom([
          `సైన్ బోర్డ్స్ కి కడపలో బెస్ట్ ప్లేస్!`,
          `వర్త్ ఎవ్రీ రూపీ, థాంక్యూ ${bName}!`,
        ]);
      } else {
        opener = pickRandom([
          `${item} క్వాలిటీ మరియు ప్రింట్ ఫినిషింగ్ super rich గా వచ్చింది.`,
          `ప్రింటింగ్ వర్క్ చాలా clean గా చేశారు, క్వాలిటీ నంబర్ వన్.`,
        ]);
        middle = pickRandom([
          `కలర్స్ చాలా షార్ప్‌గా వచ్చాయి, మెటీరియల్ మన్నిక చాలా సాలిడ్‌గా ఉంది.`,
          `డిజైనింగ్ మరియు కటింగ్ చాలా క్లీన్‌గా ఉన్నాయి.`,
        ]);
        closer = pickRandom([
          `క్వాలిటీ ప్రింటింగ్ కోరుకునేవారికి ది బెస్ట్ ఛాయిస్!`,
          `కడపలో బెస్ట్ ప్రింటింగ్ షాప్, థాంక్యూ ${bName}!`,
          `వర్త్ ఎవ్రీ రూపీ, సూపర్ వర్క్!`,
        ]);
      }
      break;
    }

    case "PHOTOGRAPHY_STUDIO": {
      if (intent.isWeddingShoots) {
        opener = pickRandom([
          `వెడ్డింగ్ ఫోటోగ్రఫీ మరియు సినిమాటిక్ ఫిల్మ్స్ క్వాలిటీ నంబర్ వన్.`,
          `ప్రీ-వెడ్డింగ్ షూట్ ప్రెజెంటేషన్ super rich గా వచ్చింది.`,
        ]);
        middle = pickRandom([
          `లైటింగ్ మరియు కలర్ గ్రేడింగ్ చాలా క్లీన్‌గా చేశారు.`,
          `ఆల్బమ్ లుక్ చాలా ఎలిగెంట్‌గా మరియు ప్రీమియం గా వచ్చింది.`,
        ]);
        closer = pickRandom([
          `వెడ్డింగ్ కవరేజ్ కి బెస్ట్ స్టూడియో!`,
          `మా ఈవెంట్ ని మెమరబుల్ చేశారు, థాంక్యూ ${bName}!`,
        ]);
      } else if (intent.isCustomGifts) {
        opener = pickRandom([
          `కస్టమైజ్డ్ గిఫ్ట్స్ మరియు మ్యాజిక్ పిల్లోస్ ఫినిషింగ్ super గా వచ్చింది.`,
          `కప్ ప్రింటింగ్ మరియు కీచైన్స్ చాలా neat గా చేశారు.`,
        ]);
        middle = pickRandom([
          `ఫోటో కలర్స్ చాలా బ్రైట్ గా మరియు షార్ప్‌గా ప్రింట్ అయ్యాయి.`,
          `మంచి మన్నికైన క్వాలిటీ తో రెడీ చేసి ఇచ్చారు.`,
        ]);
        closer = pickRandom([
          `పర్ఫెక్ట్ గిఫ్ట్ వర్క్, థాంక్యూ ${bName}!`,
          `వర్త్ ఎవ్రీ రూపీ, సూపర్ వర్క్!`,
        ]);
      } else {
        opener = pickRandom([
          `${item} ఫినిషింగ్ అయితే super rich గా వచ్చింది.`,
          `ఫొటో ప్రింట్స్ మరియు ఫ్రేమ్ వర్క్ చాలా neat గా చేశారు.`,
          `${bName} దగ్గర వర్క్‌మెన్‌షిప్ చాలా పర్ఫెక్ట్‌గా ఉంది.`,
        ]);
        middle = pickRandom([
          `కలర్స్ చాలా షార్ప్‌గా వచ్చాయి, ఫ్రేమ్ లుక్ చాలా ఎలిగెంట్‌గా ఉంది.`,
          `ప్రీమియం లుక్ వచ్చింది, వాల్ డెకరేషన్‌కి పర్ఫెక్ట్‌గా సెట్ అయ్యింది.`,
          `క్లారిటీ విషయంలో అస్సలు రాజీ పడలేదు, చాలా సాలిడ్ ఫినిష్.`,
        ]);
        closer = pickRandom([
          `క్వాలిటీ విషయంలో సూపర్బ్, థాంక్యూ ${bName}!`,
          `మంచి క్వాలిటీ వర్క్, ఇంట్లో అందరికీ నచ్చింది!`,
          `వర్త్ ఎవ్రీ రూపీ!`,
        ]);
      }
      break;
    }

    case "SOFTWARE_IT":
      opener = pickRandom([
        `${item} డెవలప్‌మెంట్ చాలా ప్రొఫెషనల్ గా ఎగ్జిక్యూట్ చేశారు.`,
        `${bName} లో కోడింగ్ మరియు ఆర్కిటెక్చర్ స్టాండర్డ్స్ చాలా హై లెవెల్ లో ఉన్నాయి.`,
      ]);
      middle = pickRandom([
        `రెస్పాన్సివ్ డిజైన్ మరియు ఫాస్ట్ పెర్ఫార్మెన్స్ తో ప్రాజెక్ట్ చాలా సాలిడ్ గా బిల్డ్ చేశారు.`,
        `ఎర్రర్-ఫ్రీ కోడ్ మరియు యూజర్-ఫ్రెండ్లీ ఇంటర్‌ఫేస్ తో రెడీ చేసి ఇచ్చారు.`,
      ]);
      closer = pickRandom([
        `టాప్-క్లాస్ టెక్నికల్ ఎక్సలెన్స్!`,
        `డిజిటల్ సొల్యూషన్స్ కి ది బెస్ట్ ఛాయిస్!`,
      ]);
      break;

    case "RESTAURANT_FOOD":
      opener = pickRandom([
        `ఇక్కడ ఫుడ్ ప్రిపరేషన్ మరియు టేస్ట్ చాలా బాగున్నాయి.`,
        `${bName} లో ఫుడ్ క్వాలిటీ మరియు స్పైస్ బ్యాలెన్స్ చాలా పర్ఫెక్ట్.`,
      ]);
      middle = pickRandom([
        `తాజా పదార్థాలు వాడారు, ఎక్కడా హెవీ ఆయిల్ లేకుండా కరెక్ట్ మసాలా తో చేశారు.`,
        `ప్రతి డిష్ చాలా రుచిగా మరియు వేడిగా సర్వ్ చేశారు.`,
      ]);
      closer = pickRandom([
        `టేస్ట్ లో నంబర్ వన్, వర్త్ ఎవ్రీ రూపీ!`,
        `ఫుడ్ లవర్స్ కి బెస్ట్ ప్లేస్, థాంక్యూ!`,
      ]);
      break;

    case "SALON_BEAUTY": {
      if (intent.isBridal) {
        opener = pickRandom([
          `${bName} లో బ్రైడల్ మేకప్ చాలా ఎలిగెంట్ గా మరియు పర్ఫెక్ట్ గా చేశారు.`,
          `పెళ్లి కోసం బ్రైడల్ మేకోవర్ చేయించుకున్నాను, చాలా మంచి అనుభవం.`,
          `${bName} బ్రైడల్ సర్వీస్ నిజంగా అద్భుతం.`,
        ]);
        middle = pickRandom([
          `ఫేస్ కి తగినట్లు పర్ఫెక్ట్ హెయిర్ డూ మరియు బ్యూటిఫుల్ మేకప్ లుక్ ఇచ్చారు.`,
          `హెవీగా లేకుండా నేచురల్ గ్లో వచ్చేలా చేశారు, సారీ డ్రాపింగ్ చాలా నీట్ గా ఉంది.`,
          `సమయానికి రెడీ చేసి చాలా ప్రొఫెషనల్ గా సర్వీస్ అందించారు.`,
        ]);
        closer = pickRandom([
          `ఫోటోస్ లో చాలా బ్యూటిఫుల్ గా వచ్చింది, అందరూ ప్రశంసించారు!`,
          `కడపలో బెస్ట్ బ్రైడల్ మేకప్ సెలూన్, థాంక్యూ!`,
        ]);
      } else if (intent.isAcademy) {
        opener = pickRandom([
          `${bName} అకాడమీ లో బ్యూటీషియన్ కోర్స్ ట్రైనింగ్ చాలా ఎక్సలెంట్ గా ఉంది.`,
          `బ్యూటీ మరియు ఫ్యాషన్ డిజైనింగ్ నేర్చుకోవడానికి ${bName} బెస్ట్ ఇన్స్టిట్యూట్.`,
          `${bName} అకాడమీ లో చేరినందుకు చాలా హ్యాపీగా ఉంది.`,
        ]);
        middle = pickRandom([
          `ప్రతి టెక్నిక్ ని ప్రాక్టికల్ గా లైవ్ మోడల్స్ తో వివరంగా నేర్పించారు.`,
          `హెయిర్ కట్స్, బ్రైడల్ వర్క్ మరియు స్కిన్ కేర్ చాలా ఓపిగ్గా నేర్పించారు.`,
          `ఫ్యాకల్టీ చాలా సపోర్టివ్ గా ఉండి అన్ని డౌట్స్ క్లియర్ చేశారు.`,
        ]);
        closer = pickRandom([
          `కడపలో లేడీస్ కి బెస్ట్ బ్యూటీ అకాడమీ!`,
          `వృత్తి నైపుణ్యాలు నేర్చుకోవడానికి నమ్మకమైన అకాడమీ!`,
        ]);
      } else if (intent.isSkinFacial || intent.isBodySpa) {
        opener = pickRandom([
          `${bName} లో ఫేషియల్ మరియు స్పా సర్వీస్ చాలా రిలాక్సింగ్ గా ఉంది.`,
          `బాడీ స్పా మరియు స్కిన్ కేర్ కోసం వెళ్ళాను, చాలా మంచి ఎక్స్‌పీరియన్స్.`,
        ]);
        middle = pickRandom([
          `క్లీన్ ప్రొడక్ట్స్ వాడారు మరియు చాలా ఓపిగ్గా మసాజ్ చేశారు.`,
          `మంచి ప్రైవసీ మరియు లేడీస్ కి కంఫర్టబుల్ వాతావరణం ఉంది.`,
        ]);
        closer = pickRandom([
          `స్కిన్ చాలా గ్లోయింగ్ గా మారింది, ఫుల్లీ రిలాక్స్డ్!`,
          `విశ్వనాథపురం లో లేడీస్ కి బెస్ట్ స్పా!`,
        ]);
      } else {
        opener = pickRandom([
          `${item} చాలా నీట్ గా మరియు ప్రొఫెషనల్ గా చేశారు.`,
          `${bName} లో లేడీస్ బ్యూటీ సర్వీసెస్ క్వాలిటీ అద్భుతం.`,
        ]);
        middle = pickRandom([
          `క్లీన్ టూల్స్ వాడారు మరియు హైజీన్ బాగా మెయింటైన్ చేశారు.`,
          `లేడీస్ కి పూర్తి కంఫర్ట్ మరియు ప్రైవసీ అందించారు.`,
        ]);
        closer = pickRandom([
          `సర్వీస్ లో బెస్ట్, ఫుల్లీ శాటిస్‌ఫైడ్!`,
          `కడపలో బెస్ట్ లేడీస్ సెలూన్ ఎక్స్‌పీరియన్స్!`,
        ]);
      }
      break;
    }

    case "HEALTHCARE_CLINIC":
      opener = pickRandom([
        `${bName} లో క్లినికల్ కేర్ మరియు ట్రీట్మెంట్ చాలా ప్రొఫెషనల్ గా ఉంది.`,
        `వైద్య సేవలు చాలా పరిశుభ్రంగా మరియు సున్నితంగా అందించారు.`,
      ]);
      middle = pickRandom([
        `శానిటైజ్ చేసిన పరికరాలు వాడారు మరియు పేషెంట్ కి నొప్పి లేకుండా చేశారు.`,
        `డాక్టర్ వివరణ చాలా స్పష్టంగా మరియు ధైర్యం ఇచ్చేలా ఉంది.`,
      ]);
      closer = pickRandom([
        `నమ్మకమైన క్లినిక్, చాలా థాంక్స్!`,
        `హైలీ శాటిస్‌ఫైడ్ విత్ ద ట్రీట్మెంట్!`,
      ]);
      break;

    case "AUTO_GARAGE":
      opener = pickRandom([
        `వెహికల్ రిపేర్ మరియు ఫిట్టింగ్ వర్క్ చాలా పర్ఫెక్ట్‌గా చేశారు.`,
        `${bName} లో మెకానికల్ వర్క్‌మెన్‌షిప్ చాలా నమ్మకంగా ఉంది.`,
      ]);
      middle = pickRandom([
        `ఓరిజినల్ స్పేర్ పార్ట్స్ వాడారు, ఇంజిన్ పికప్ చాలా స్మూత్ గా ఉంది.`,
        `అన్ని కంప్లయింట్స్ చెక్ చేసి నీట్‌గా టెస్ట్ డ్రైవ్ చేసి ఇచ్చారు.`,
      ]);
      closer = pickRandom([
        `నమ్మకమైన వర్క్‌మెన్‌షిప్, థాంక్యూ!`,
        `వెహికల్ సర్వీస్ కి బెస్ట్ గ్యారేజ్!`,
      ]);
      break;

    case "TOURS_TRAVELS": {
      if (intent.isSelfDrive) {
        opener = pickRandom([
          `${bName} లో తీసుకున్న సెల్ఫ్ డ్రైవ్ కారు కండిషన్ చాలా ఎక్సలెంట్ గా ఉంది.`,
          `సెల్ఫ్ డ్రైవ్ కార్ల నిర్వహణ మరియు క్లీన్‌నెస్ విషయంలో ${bName} నంబర్ వన్.`,
        ]);
        middle = pickRandom([
          `టైర్లు, బ్రేక్స్ మరియు ఏసీ పర్ఫెక్ట్ వర్కింగ్ లో ఉన్నాయి, జర్నీ చాలా స్మూత్ గా సాగింది.`,
          `ఇంటీరియర్ చాలా ఫ్రెష్ గా ఉంది, ఎలాంటి మెకానికల్ ఇష్యూస్ లేకుండా డ్రైవింగ్ చాలా ఎంజాయ్ చేశాము.`,
        ]);
        closer = pickRandom([
          `మెయింటెనెన్స్ సూపర్బ్, వర్త్ ఎవ్రీ రూపీ!`,
          `కడపలో బెస్ట్ సెల్ఫ్ డ్రైవ్ సర్వీస్, థాంక్యూ ${bName}!`,
        ]);
      } else if (intent.isCleanCab) {
        opener = pickRandom([
          `క్యాబ్ చాలా నీట్‌గా శానిటైజ్ చేసి టైమ్‌కి పంపించారు.`,
          `${bName} లో వెహికల్ మెయింటెనెన్స్ మరియు హైజీన్ చాలా బాగున్నాయి.`,
        ]);
        middle = pickRandom([
          `సీట్లు చాలా కంఫర్టబుల్ గా ఉన్నాయి, ఏసీ కూలింగ్ సూపర్ గా పనిచేసింది.`,
          `కారులో మంచి సువాసన మరియు క్లీన్ ఇంటీరియర్ ఉండటం వల్ల లాంగ్ జర్నీ చాలా హ్యాపీగా గడిచింది.`,
        ]);
        closer = pickRandom([
          `టాప్ క్లాస్ క్యాబ్ మెయింటెనెన్స్, థాంక్యూ ${bName}!`,
          `ఫ్యామిలీ తో ప్రయాణానికి బెస్ట్ ఛాయిస్!`,
        ]);
      } else {
        opener = pickRandom([
          `${bName} లో ట్రావెల్స్ సర్వీస్ మరియు వెహికల్ కండిషన్ టాప్ నాచ్.`,
          `కడప నుండి అవుట్‌స్టేషన్ ట్రిప్ కోసం క్యాబ్ బుక్ చేశాము, సర్వీస్ చాలా ప్రొఫెషనల్.`,
        ]);
        middle = pickRandom([
          `వెహికల్ పికప్ మరియు స్మూత్ డ్రైవింగ్ తో సేఫ్ గా గమ్యం చేర్చారు.`,
          `డ్రైవర్ రూట్స్ లో చాలా అనుభవం ఉన్నవారు, ఘాట్ రోడ్ లో కూడా చాలా జాగ్రత్తగా నడిపారు.`,
        ]);
        closer = pickRandom([
          `క్వాలిటీ సర్వీస్, వర్త్ ఎవ్రీ రూపీ!`,
          `నమ్మకమైన ట్రావెల్స్ సర్వీస్, థాంక్యూ ${bName}!`,
        ]);
      }
      break;
    }

    case "TATTOO_STUDIO": {
      if (intent.isPiercing) {
        opener = pickRandom([
          `${bName} లో పియర్సింగ్ చాలా జాగ్రత్తగా, సేఫ్ గా చేశారు.`,
          `ఇయర్ మరియు నోస్ పియర్సింగ్ కోసం ${bName} ని సంప్రదించాను, చాలా మంచి అనుభవం.`,
        ]);
        middle = pickRandom([
          `కొత్త నీడిల్స్ వాడారు, ఏమాత్రం నొప్పి లేకుండా సున్నితంగా పూర్తి చేశారు.`,
          `హైజీనిక్ మెయింటెనెన్స్ చాలా బాగుంది, ఆఫ్టర్‌కేర్ కేరింగ్ టిప్స్ వివరంగా చెప్పారు.`,
        ]);
        closer = pickRandom([
          `చాలా నమ్మకమైన పియర్సింగ్ స్టూడియో, థాంక్యూ ${bName}!`,
          `కడపలో పియర్సింగ్ కి బెస్ట్ ప్లేస్!`,
        ]);
      } else {
        opener = pickRandom([
          `${bName} లో టాటూ వేయించుకున్నాను, కార్తీక్ గారి ఆర్ట్ వర్క్ ఎక్సలెంట్ గా ఉంది.`,
          `కడపలో బెస్ట్ టాటూ డిజైనింగ్ మరియు ప్రొఫెషనల్ ఆర్టిస్ట్ అంటే ${bName}.`,
        ]);
        middle = pickRandom([
          `ఫైన్ లైన్స్ మరియు షేడింగ్ వర్క్ చాలా అద్భుతంగా వచ్చింది, స్టూడియో చాలా పరిశుభ్రంగా ఉంది.`,
          `వైర్‌లెస్ మెషిన్ తో నీట్ గా వేశారు, ఇన్ఫెక్షన్ రాకుండా చాలా జాగ్రత్తలు చెప్పారు.`,
        ]);
        closer = pickRandom([
          `వరల్డ్ క్లాస్ టాటూ వర్క్‌మెన్‌షిప్, వర్త్ ఎవ్రీ రూపీ!`,
          `టాప్ క్వాలిటీ టాటూ స్టూడియో, థాంక్యూ ${bName}!`,
        ]);
      }
      break;
    }

    case "APPLIANCE_REPAIR": {
      opener = pickRandom([
        `${bName} లో ఏసీ మరియు హోమ్ అప్లయన్సెస్ సర్వీసింగ్ చాలా పర్ఫెక్ట్ గా చేశారు.`,
        `డోర్‌స్టెప్ ఏసీ రిపేర్ కోసం ${bName} ని సంప్రదించాము, చాలా మంచి అనుభవం.`,
      ]);
      middle = pickRandom([
        `సమయానికి వచ్చి జెట్ వాష్ తో ఏసీ కాయిల్స్ నీట్‌గా క్లీన్ చేశారు, కూలింగ్ సూపర్బ్ గా వస్తోంది.`,
        `స్పేర్ పార్ట్స్ ఒరిజినల్ వేసి, ఫెయిర్ ప్రైస్ కే రిపేర్ పూర్తి చేశారు. టెక్నీషియన్ బిహేవియర్ చాలా బాగుంది.`,
      ]);
      closer = pickRandom([
        `చాలా నమ్మకమైన అప్లయన్స్ సర్వీస్, థాంక్యూ ${bName}!`,
        `కడపలో బెస్ట్ ఏసీ మెకానిక్, డెఫినెట్‌గా రికమండ్ చేస్తాను!`,
      ]);
      break;
    }

    default:
      opener = pickRandom([
        `${item} వర్క్ చాలా neat గా చేశారు, క్వాలిటీ నంబర్ వన్.`,
        `${bName} లో వర్క్‌మెన్‌షిప్ చాలా పర్ఫెక్ట్‌గా ఉంది.`,
      ]);
      middle = pickRandom([
        `మంచి మన్నికైన మెటీరియల్ వాడారు, వర్క్ చాలా జెన్యూన్.`,
        `ఎక్కడా లోపం లేకుండా ఫినిషింగ్ చాలా క్లీన్‌గా చేశారు.`,
      ]);
      closer = pickRandom([
        `వర్త్ ఎవ్రీ రూపీ! హైలీ శాటిస్‌ఫైడ్ విత్ ది సర్వీస్.`,
        `మంచి క్వాలిటీ వర్క్, థాంక్యూ ${bName}!`,
      ]);
      break;
  }

  let review = `${opener} ${middle} ${closer}`;
  if (note) review += ` ${note} వర్క్ కూడా బాగా చేశారు.`;
  return review;
}

// Style 19: Telugu Short & Punchy (Telugu Script)
function generateTeluguPunchy(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  const intent = detectTagIntent(tags, ind);
  const item = tags[0] || pickRandom(lex.items);

  let chosen = `మంచి క్వాలిటీ మరియు టైమ్‌కి సర్వీస్ ఇచ్చారు. ప్రైస్ కూడా రీజనబుల్. ${item} చాలా నీట్‌గా చేశారు.`;

  if (ind === "GOLD_BUYERS") {
    if (intent.isPledged) {
      chosen = pickRandom([
        `బ్యాంకులో తాకట్టు పెట్టిన బంగారం విడిపించి స్పాట్ లో బ్యాలెన్స్ పేమెంట్ చేశారు. సూపర్ సర్వీస్!`,
        `ప్లెడ్జ్డ్ గోల్డ్ చాలా ఫాస్ట్ గా క్లియర్ చేశారు. 10 నిమిషాల్లో ప్రొసీజర్ కంప్లీట్ అయ్యింది.`,
        `తాకట్టు బంగారం విడిపించడానికి కడపలో బెస్ట్ ప్లేస్. స్టాఫ్ చాలా హెల్ప్‌ఫుల్!`,
        `సేఫ్ అండ్ జెన్యూన్ సర్వీస్. లోన్ క్లియర్ చేసి మిగిలిన అమౌంట్ వెంటనే అకౌంట్ లో వేశారు.`,
      ]);
    } else if (intent.isPurity) {
      chosen = pickRandom([
        `కంప్యూటర్ జర్మన్ మెషిన్ లో ప్యూరిటీ టెస్ట్ చేశారు. 100% అక్యూరేట్ అండ్ ఫాస్ట్.`,
        `బంగారం కరిగించకుండా కరెక్ట్ ప్యూరిటీ చెక్ చేశారు. స్టాఫ్ రెస్పాన్స్ బాగుంది, థాంక్యూ ${bName}!`,
        `డిజిటల్ ప్యూరిటీ టెస్టింగ్ చాలా నీట్‌గా చేశారు. నమ్మకమైన సర్వీస్!`,
        `క్లీన్ వర్క్ మరియు పారదర్శకమైన ప్యూరిటీ టెస్టింగ్. వర్త్ ఇట్!`,
      ]);
    } else {
      chosen = pickRandom([
        `కంటి ముందే డిజిటల్ స్కేల్ టెస్టింగ్ మరియు లైవ్ రేట్ ఇచ్చారు. ప్రాసెస్ చాలా ఫాస్ట్.`,
        `పాత బంగారం అమ్మడానికి బెస్ట్ ప్లేస్. స్టాఫ్ రెస్పాన్స్ బాగుంది, థాంక్యూ ${bName}!`,
        `చక్కటి సర్వీస్. స్పాట్ లో బ్యాంక్ ట్రాన్స్‌ఫర్ చేశారు. వర్త్ ఇట్!`,
        `క్లీన్ వర్క్ మరియు నమ్మకమైన డీలింగ్స్. 10 నిమిషాల్లో కంప్లీట్ అయ్యింది.`,
        `మంచి రెస్పాన్స్, జెన్యూన్ గోల్డ్ రేట్. డెఫినెట్‌గా మళ్ళీ వస్తాము.`,
      ]);
    }
  } else if (ind === "PRINTING_GRAPHICS") {
    if (intent.isFlexBanner) {
      chosen = pickRandom([
        `ఫ్లెక్స్ బ్యానర్ ప్రింటింగ్ చాలా నీట్‌గా చేశారు. కలర్స్ సూపర్ షార్ప్!`,
        `వాటర్‌ప్రూఫ్ ఫ్లెక్స్ ప్రింటింగ్ టైమ్‌కి డెలివరీ ఇచ్చారు. వర్త్ ఇట్!`,
        `క్లీన్ వర్క్ మరియు ఫాస్ట్ డెలివరీ. బ్యానర్ కలర్స్ అదిరిపోయాయి.`,
      ]);
    } else if (intent.isSignBoard) {
      chosen = pickRandom([
        `షాప్ సైన్ బోర్డ్ వర్క్ చాలా గ్రాండ్‌గా చేశారు. నైట్ విజిబిలిటీ సూపర్.`,
        `అక్రిలిక్ లెటరింగ్ బోర్డ్ ఫినిషింగ్ చాలా ప్రీమియం గా వచ్చింది. థాంక్యూ ${bName}!`,
      ]);
    } else {
      chosen = pickRandom([
        `మంచి క్వాలిటీ ప్రింటింగ్ మరియు టైమ్‌కి డెలివరీ ఇచ్చారు. ప్రైస్ కూడా రీజనబుల్.`,
        `${item} చాలా నీట్‌గా చేశారు. స్టాఫ్ రెస్పాన్స్ బాగుంది, థాంక్యూ ${bName}!`,
        `చక్కటి సర్వీస్. ప్రింట్ అవుట్‌పుట్ చాలా బాగా వచ్చింది. వర్త్ ఇట్!`,
        `క్లీన్ వర్క్ మరియు ఫాస్ట్ డెలివరీ. బ్యానర్ కలర్స్ సూపర్.`,
        `మంచి రెస్పాన్స్, ప్రాంప్ట్ వర్క్. డెఫినెట్‌గా మళ్ళీ వస్తాము.`,
      ]);
    }
  } else if (ind === "PHOTOGRAPHY_STUDIO") {
    if (intent.isWeddingShoots) {
      chosen = pickRandom([
        `వెడ్డింగ్ ఫోటోగ్రఫీ చాలా నేచురల్ గా క్యాప్చర్ చేశారు. సూపర్ టీమ్!`,
        `సినిమాటిక్ వెడ్డింగ్ వీడియోస్ మరియు ఫొటోస్ చాలా గ్రాండ్‌గా వచ్చాయి.`,
        `మా ఈవెంట్ ని చాలా మెమరబుల్ చేశారు, థాంక్యూ ${bName}!`,
      ]);
    } else if (intent.isCustomGifts) {
      chosen = pickRandom([
        `కస్టమైజ్డ్ కప్ ప్రింటింగ్ మరియు మ్యాజిక్ పిల్లోస్ చాలా బాగా చేశారు!`,
        `గిఫ్ట్స్ మీద ఫోటో క్లారిటీ అదిరింది. సర్ప్రైజ్ గిఫ్ట్ సూపర్ గా నచ్చింది.`,
      ]);
    } else {
      chosen = pickRandom([
        `మంచి క్వాలిటీ మరియు టైమ్‌కి డెలివరీ ఇచ్చారు. ప్రైస్ రీజనబుల్.`,
        `${item} చాలా నీట్‌గా చేశారు. స్టాఫ్ రెస్పాన్స్ బాగుంది, థాంక్యూ ${bName}!`,
        `చక్కటి సర్వీస్. అవుట్‌పుట్ చాలా బాగా వచ్చింది. వర్త్ ఇట్!`,
        `క్లీన్ వర్క్ మరియు ఫాస్ట్ డెలివరీ. ఫ్యామిలీ అందరికీ బాగా నచ్చింది.`,
      ]);
    }
  } else if (ind === "TOURS_TRAVELS") {
    if (intent.isSelfDrive) {
      chosen = pickRandom([
        `సెల్ఫ్ డ్రైవ్ కారు కండిషన్ సూపర్. రీజనబుల్ ప్రైస్ మరియు ఈజీ ప్రాసెస్!`,
        `ఫాస్ట్‌ట్యాగ్ తో కార్ టైమ్‌కి ఇచ్చారు. ఏసీ సూపర్ కూలింగ్, నో హిడెన్ ఛార్జెస్!`,
        `కడపలో సెల్ఫ్ డ్రైవ్ కార్లకి బెస్ట్ ఛాయిస్. డిపాజిట్ కూడా వెంటనే రిఫండ్ చేశారు.`,
      ]);
    } else if (intent.isTirupati) {
      chosen = pickRandom([
        `తిరుపతి ట్రిప్ చాలా సేఫ్ గా సాగింది. డ్రైవర్ సకాలంలో వచ్చారు!`,
        `ఫ్యామిలీ తిరుపతి దర్శనం చాలా హ్యాపీగా జరిగింది. ఇన్నోవా క్రిస్టా సూపర్ కంఫర్ట్!`,
        `ఘాట్ రోడ్ లో సేఫ్ డ్రైవింగ్, రీజనబుల్ ఫేర్. థాంక్యూ ${bName}!`,
      ]);
    } else {
      chosen = pickRandom([
        `మంచి కండిషన్ ఉన్న క్యాబ్ మరియు టైమ్‌కి సర్వీస్ ఇచ్చారు. ప్రైస్ చాలా రీజనబుల్.`,
        `డ్రైవర్ రెస్పాన్స్ బాగుంది, డ్రైవింగ్ చాలా సేఫ్. థాంక్యూ ${bName}!`,
        `కడపలో బెస్ట్ ట్రావెల్స్ సర్వీస్. జర్నీ చాలా కంఫర్టబుల్ గా జరిగింది.`,
        `ఎయిర్‌పోర్ట్ డ్రాప్ సమయానికి చేశారు, నో టెన్షన్. వర్త్ ఇట్!`,
      ]);
    }
  } else if (ind === "TATTOO_STUDIO") {
    if (intent.isPiercing) {
      chosen = pickRandom([
        `పియర్సింగ్ చాలా సేఫ్ గా, నొప్పి లేకుండా చేశారు. హైజీన్ సూపర్బ్!`,
        `డిస్పోజబుల్ నీడిల్స్ వాడారు, చాలా కేరింగ్ గా పియర్సింగ్ చేశారు. థాంక్యూ ${bName}!`,
        `కడపలో బెస్ట్ పియర్సింగ్ సెటప్, హీలింగ్ కూడా చాలా ఫాస్ట్ గా అయ్యింది.`,
      ]);
    } else if (intent.isPortrait) {
      chosen = pickRandom([
        `పోర్ట్రెయిట్ టాటూ డీటెయిలింగ్ అదిరిపోయింది. కార్తీక్ గారి ఆర్ట్ వర్క్ ఎక్సలెంట్!`,
        `ఫోటోలో ఉన్నట్టే స్కిన్ మీద అద్భుతంగా వేశారు. రియలిస్టిక్ షేడింగ్ సూపర్!`,
        `కడపలో బెస్ట్ పోర్ట్రెయిట్ టాటూ ఆర్టిస్ట్! ఫుల్లీ శాటిస్‌ఫైడ్.`,
      ]);
    } else {
      chosen = pickRandom([
        `కస్టమ్ టాటూ ఫినిషింగ్ చాలా నీట్ గా వచ్చింది. ప్రైస్ చాలా రీజనబుల్.`,
        `స్టూడియో హైజీన్ 100% పర్ఫెక్ట్. లైన్ వర్క్ మరియు షేడింగ్ అదిరింది.`,
        `మంచి రెస్పాన్స్, పేషెంట్‌గా వేశారు. కడపలో బెస్ట్ టాటూ స్టూడియో!`,
        `టాటూ చాలా బ్యూటిఫుల్ గా వచ్చింది, నో ఇన్ఫెక్షన్. వర్త్ ఇట్!`,
      ]);
    }
  } else if (ind === "APPLIANCE_REPAIR") {
    chosen = pickRandom([
      `డీప్ ఏసీ జెట్ వాష్ చాలా నీట్‌గా చేశారు. కూలింగ్ సూపర్బ్ గా వస్తోంది, థాంక్యూ ${bName}!`,
      `కడపలో బెస్ట్ ఏసీ మెకానిక్. గంటలోనే ఇంటికి వచ్చి గ్యాస్ రీఫిల్ చేశారు, ప్రైస్ రీజనబుల్.`,
      `ఫ్రిజ్ కూలింగ్ సమస్య వెంటనే పరిష్కరించారు. డోర్‌స్టెప్ సర్వీస్ ఎక్సలెంట్!`,
      `వాషింగ్ మెషిన్ మరియు ఏసీ రిపేర్ కి బెస్ట్ ప్లేస్. 10/10 రికమండెడ్!`,
    ]);
  } else {
    chosen = pickRandom([
      `మంచి క్వాలిటీ మరియు సమయానికి సర్వీస్ ఇచ్చారు. ప్రైస్ కూడా రీజనబుల్.`,
      `${item} చాలా నీట్‌గా చేశారు. స్టాఫ్ రెస్పాన్స్ బాగుంది, థాంక్యూ ${bName}!`,
      `చక్కటి సర్వీస్, డెఫినెట్‌గా మళ్ళీ వస్తాము.`,
    ]);
  }

  if (note) chosen += ` ${note} బాగా చేశారు.`;
  return chosen;
}

// Style 20: Telugu Romanized Code-Mixing (Tanglish)
function generateTeluguRoman(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  const intent = detectTagIntent(tags, ind);
  const item = tags[0] || pickRandom(lex.items);

  let opener = `Chala baga chesaru, ${item} work aithe super neat ga vachindi.`;
  let middle = `Staff chala patient ga requirements vinnaaru, no unnecessary delays.`;
  let closer = `Thanks to ${bName} team, will visit again for sure!`;

  switch (ind) {
    case "GOLD_BUYERS": {
      if (intent.isPledged) {
        opener = pickRandom([
          `Bank lo unna pledged gold release cheyinchadaniki ${bName} approach ayyamu.`,
          `Gold loan close chesi pledged gold safe ga release chesi icharu.`,
          `Pledged gold assistance kosam vellamu, process chala quick ga complete chesaru.`,
        ]);
        middle = pickRandom([
          `Bank loan amount direct ga settle chesi, balance money instant ga transfer chesaru.`,
          `No hidden charges or delays, live market bullion rate prakaram fair settlement icharu.`,
          `Staff formalities anni transparent ga close chesaru, zero tension.`,
        ]);
        closer = pickRandom([
          `Kadapa lo best place to release pledged gold! Very trustworthy.`,
          `Thanks to ${bName} team. Worth it, relieved and satisfied!`,
          `Super service for pledged gold release, definitely recommend!`,
        ]);
      } else if (intent.isPurity) {
        opener = pickRandom([
          `Gold purity test cheyinchadaniki ${bName} visit ayyamu.`,
          `Computerized German XRF machine lo gold purity test chesaru.`,
          `Accurate purity report kosam ${bName} approach ayyamu.`,
        ]);
        middle = pickRandom([
          `German machine lo transparent ga testing chesi exact karat report icharu.`,
          `Without melting or damage, 2 minutes lo clear purity reading chupincharu.`,
          `Digital screen meeda live calculation clear ga explain chesaru.`,
        ]);
        closer = pickRandom([
          `Best place for gold purity testing in Kadapa!`,
          `Thanks to ${bName} team. Honest testing, satisfied!`,
          `Accurate testing and polite staff, very happy!`,
        ]);
      } else {
        opener = pickRandom([
          `Old gold sell cheyadaniki ${bName} visit ayyamu, pure transparent testing chesaru.`,
          `Kadapa lo best gold buyers, accurate weighing and live market bullion rate icharu.`,
          `${bName} lo work chala clean ga chesaru, staff kuda friendly ga unaru.`,
        ]);
        middle = pickRandom([
          `Digital scale meeda weighing transparent ga chesi live market rate icharu.`,
          `Spot payment direct ga bank transfer chesaru without any delay.`,
          `Live market bullion rate icharu, no unnecessary deductions.`,
        ]);
        closer = pickRandom([
          `Kadapa lo best place to sell old gold!`,
          `Thanks to ${bName} team. Worth it, satisfied customer!`,
          `Super service and genuine valuation!`,
        ]);
      }
      break;
    }

    case "PRINTING_GRAPHICS": {
      if (intent.isFlexBanner) {
        opener = pickRandom([
          `Shop event ki flex banners printing cheyinchamu, colors superb ga vachayi.`,
          `Flex banner material quality thick ga undi, rain or sun ki fade avvadhu.`,
        ]);
        middle = pickRandom([
          `Print colors chala vibrant ga unnai, safe packaging tho handover chesaru.`,
          `Time ki deliver chesaru without any delays.`,
        ]);
        closer = pickRandom([
          `Kadapa lo best place for flex banner printing!`,
          `Thanks to ${bName} team. Worth it, satisfied!`,
        ]);
      } else if (intent.isSignBoard) {
        opener = pickRandom([
          `Shop front ki commercial sign board and glow sign board cheyinchamu.`,
          `Acrylic lettering sign board chala grand ga design chesi fix chesaru.`,
        ]);
        middle = pickRandom([
          `Lighting and font visibility night time lo super sharp ga kanipistundi.`,
          `Solid material and neat installation work.`,
        ]);
        closer = pickRandom([
          `Best sign board makers in Kadapa!`,
          `Worth it, satisfied customer!`,
        ]);
      } else {
        opener = pickRandom([
          `Shop opening ki flex banner and sign board cheyinchamu, colors and clarity superb ga vachayi.`,
          `Visiting cards and brochures design chala professional ga chesi icharu.`,
          `Chala baga chesaru, ${item} printing aithe super neat ga vachindi.`,
          `${bName} lo work chala clean ga chesaru, staff kuda friendly ga unaru.`,
        ]);
        middle = pickRandom([
          `Flex banner material quality thick ga undi, rain or sun ki fade avvadhu.`,
          `Design layout and font alignment chala perfect ga set chesaru.`,
          `Print colors chala vibrant ga unnai, safe packaging tho handover chesaru.`,
        ]);
        closer = pickRandom([
          `Kadapa lo best place for printing and signage!`,
          `Thanks to ${bName} team. Worth it, satisfied customer!`,
          `Super service!`,
        ]);
      }
      break;
    }

    case "PHOTOGRAPHY_STUDIO": {
      if (intent.isWeddingShoots) {
        opener = pickRandom([
          `Wedding photography and cinematic video shoot kosam ${bName} book chesamu.`,
          `Pre-wedding shoot and candid photography chala grand ga teesaru.`,
        ]);
        middle = pickRandom([
          `Every emotion and candid smile ni super beautiful ga capture chesaru.`,
          `Cinematic lighting and color grading look aithe super rich ga vachindi.`,
        ]);
        closer = pickRandom([
          `Best wedding photography team in Kadapa, thanks to ${bName}!`,
          `Made our wedding truly memorable!`,
        ]);
      } else if (intent.isCustomGifts) {
        opener = pickRandom([
          `Birthday gift kosam customized cup printing and magic pillow cheyinchamu.`,
          `Photo printed customized gifts quality super ga vachindi.`,
        ]);
        middle = pickRandom([
          `Gift meeda photo clarity taggakunda chala neat ga print chesi icharu.`,
          `Finishing and packing chala safe ga chesaru.`,
        ]);
        closer = pickRandom([
          `Perfect surprise gift, everyone at home loved it!`,
          `Thanks to ${bName} team!`,
        ]);
      } else {
        opener = pickRandom([
          `Chala baga chesaru, ${item} finishing aithe super neat ga vachindi.`,
          `${bName} lo work chala clean ga chesaru, staff kuda friendly ga unaru.`,
          `${item} quality super ga vachindi, expected danikante better undi.`,
        ]);
        middle = pickRandom([
          `Staff chala patient ga requirements vinnaaru.`,
          `Family members andariki chala nachindi output.`,
          `Photo clarity taggakunda time ki ready chesi icharu.`,
        ]);
        closer = pickRandom([
          `Thanks to ${bName} team, will visit again for sure!`,
          `Worth it, satisfied customer!`,
          `Super service!`,
        ]);
      }
      break;
    }

    case "RESTAURANT_FOOD":
      opener = pickRandom([
        `${bName} lo food chala bagundi, taste super authentic ga undi.`,
        `Family tho dinner kosam ${bName} visit ayyamu, biryani and starters awesome ga unnai.`,
        `Friends tho kalisi lunch ki vellamu, food quality and hygiene top notch.`,
      ]);
      middle = pickRandom([
        `Service chala quick ga icharu, hot and fresh food serve chesaru.`,
        `Spices and masala blend chala balanced ga undi, not too oily.`,
        `Table service polite ga undi, portions kuda generous ga icharu.`,
      ]);
      closer = pickRandom([
        `Family tho visit avvadaniki best spot, definitely coming back!`,
        `Taste lo number one, thanks to ${bName} team!`,
        `Super food experience!`,
      ]);
      break;

    case "SALON_BEAUTY": {
      if (intent.isBridal) {
        opener = pickRandom([
          `${bName} lo bridal makeup and makeover cheyinchukunnanu.`,
          `Wedding function kosam bridal look ikkada set cheyinchanu, super experience.`,
          `${item} kosam ${bName} salon visit ayyanu, elegant styling.`,
        ]);
        middle = pickRandom([
          `Bridal artist chala patient ga unaru, makeup heavy kakunda natural glow vachindi.`,
          `Hairdo and saree draping time ki perfect ga complete chesaru.`,
          `Photos lo bridal look chala gorgeous ga vachindi, everyone praised.`,
        ]);
        closer = pickRandom([
          `Kadapa lo best bridal makeup salon, highly recommended!`,
          `Super happy with my bridal look, thanks to ${bName}!`,
          `10/10 bridal makeover experience!`,
        ]);
      } else if (intent.isAcademy) {
        opener = pickRandom([
          `${bName} academy lo beautician course training join ayyanu.`,
          `Fashion designing and beauty academy kosam ${bName} select chesukunnanu.`,
          `${item} kosam visit ayyanu, great academy for ladies.`,
        ]);
        middle = pickRandom([
          `Practical classes live models tho chala clear ga nerpincharu.`,
          `Faculty chala supportive ga unaru, individual attention icharu.`,
          `Career build cheskodaniki professional skills provide chesaru.`,
        ]);
        closer = pickRandom([
          `Best beautician training academy in Kadapa!`,
          `Ladies ki career start cheyadaniki best choice, highly satisfied!`,
          `10/10 academy coaching experience!`,
        ]);
      } else if (intent.isSkinFacial || intent.isBodySpa) {
        opener = pickRandom([
          `${bName} lo facial and body spa session teesukunnanu.`,
          `Skin care and relaxation kosam ${bName} salon ki vellanu.`,
          `${item} kosam visit ayyanu, peaceful ladies ambiance.`,
        ]);
        middle = pickRandom([
          `Gentle skin-friendly products vadaru, massage chala relaxing ga undi.`,
          `Ladies-only space lo complete comfort and privacy maintain chesaru.`,
          `Skin chala fresh, hydrated and glowing ga anipinchindi.`,
        ]);
        closer = pickRandom([
          `Fully relaxed, best ladies spa in Viswandhapuram!`,
          `Super refreshing experience, will visit again!`,
          `10/10 skincare and spa service!`,
        ]);
      } else {
        opener = pickRandom([
          `${bName} lo haircut and styling cheyinchukunnanu.`,
          `Ladies grooming kosam ${bName} salon ki vellanu, great ambiance.`,
          `${item} kosam visit ayyanu, very neat and professional setup.`,
        ]);
        middle = pickRandom([
          `Stylist chala patient ga unaru, clean and hygienic tools use chesaru.`,
          `Scissor work and styling finish chala sharp and neat ga vachindi.`,
          `Ladies staff polite ga coordinate chesaru, zero rush.`,
        ]);
        closer = pickRandom([
          `Super neat styling, highly satisfied!`,
          `Best ladies salon in the area, will visit again!`,
          `10/10 ladies grooming experience!`,
        ]);
      }
      break;
    }

    case "HEALTHCARE_CLINIC":
      opener = pickRandom([
        `Health consultation kosam ${bName} clinic visit chesamu.`,
        `Doctor checkup and treatment kosam ${bName} ki vellamu.`,
        `${item} kosam approach ayyamu, polite staff.`,
      ]);
      middle = pickRandom([
        `Doctor chala patient ga problem vinnaaru and reassuring ga explain chesaru.`,
        `Clinic hygienic ga undi, painless treatment and quick consultation.`,
        `Honest medical guidance icharu without unnecessary tests.`,
      ]);
      closer = pickRandom([
        `Very dependable clinic, highly satisfied!`,
        `Great doctor and caring staff!`,
        `Best healthcare service!`,
      ]);
      break;

    case "AUTO_GARAGE":
      opener = pickRandom([
        `Vehicle servicing kosam ${bName} ki ichamu.`,
        `Car / bike repair work kosam ${bName} approach ayyamu.`,
        `${item} requirement kosam visit ayyamu, skilled mechanics.`,
      ]);
      middle = pickRandom([
        `Mechanics transparent ga estimate cheppi genuine parts vesi deliver chesaru.`,
        `Smooth engine pickup and clear explanation of all repairs.`,
        `Time ki vehicle ready chesi icharu, driving chala comfortable ga undi.`,
      ]);
      closer = pickRandom([
        `Driving chala smooth ga undi, honest service!`,
        `Best garage for vehicle service!`,
        `Dependable mechanics, satisfied customer!`,
      ]);
      break;

    case "SOFTWARE_IT":
      opener = pickRandom([
        `Software development kosam ${bName} team ni consult chesamu.`,
        `Web and app project kosam ${bName} tho coordinate chesamu.`,
      ]);
      middle = pickRandom([
        `Technical team chala fast ga responsive UI and clean code deliver chesaru.`,
        `Sprint deadlines maintain chesi prompt support icharu.`,
      ]);
      closer = pickRandom([
        `Top tech partner, highly recommended!`,
        `Great software team!`,
      ]);
      break;

    case "TOURS_TRAVELS": {
      if (intent.isSelfDrive) {
        opener = pickRandom([
          `Weekend trip kosam ${bName} daggara self drive car rent ki teesukunnamu.`,
          `${bName} lo self drive car rental experience chala smooth ga undi.`,
          `Kadapa lo reasonable price ki self drive car kavali ante ${bName} best option.`,
        ]);
        middle = pickRandom([
          `Car condition super neat ga undi, AC chilling and pickup smooth.`,
          `FastTag and documentation quick ga complete chesi timely handover icharu.`,
          `Return time lo zero hassle, security deposit ventane refund chesaru.`,
        ]);
        closer = pickRandom([
          `Best self drive cars in Kadapa, highly recommended!`,
          `Thanks to ${bName} team, will book again for sure!`,
          `10/10 car rental service!`,
        ]);
      } else if (intent.isTirupati) {
        opener = pickRandom([
          `Family tho Tirupati darshan trip kosam ${bName} cab book chesamu.`,
          `Tirupati temple trip ki Innova Crysta book chesamu, great journey.`,
        ]);
        middle = pickRandom([
          `Driver early morning time ki reach ayyaru, ghat road lo chala safe driving chesaru.`,
          `Clean AC cab and polite driver behavior, family members andaru comfortable ga unnaru.`,
          `Round trip fare chala reasonable, no hidden extra charges.`,
        ]);
        closer = pickRandom([
          `Tirupati trip chala peaceful ga jarigindi, thanks to ${bName}!`,
          `Best outstation cabs in Kadapa, will book again!`,
        ]);
      } else {
        opener = pickRandom([
          `Outstation travel kosam ${bName} cabs book chesamu.`,
          `Airport drop kosam ${bName} ni approach ayyamu, on-time service.`,
          `${bName} travels service aithe chala professional and dependable ga undi.`,
        ]);
        middle = pickRandom([
          `Cab condition chala clean ga undi, driver chala respectful ga unnaru.`,
          `Safe highway driving and transparent pricing, extra charges emi adagaledu.`,
          `On-time pickup and drop made the whole journey full comfortable.`,
        ]);
        closer = pickRandom([
          `Best travels in Kadapa! Thanks to ${bName} team.`,
          `Worth every rupee, definitely recommend for outstation travel!`,
          `Super service and safe driving!`,
        ]);
      }
      break;
    }

    case "TATTOO_STUDIO": {
      if (intent.isPiercing) {
        opener = pickRandom([
          `${bName} lo ear and nose piercing cheyinchukunnanu, chala smooth ga aipoindi.`,
          `Painless piercing kosam ${bName} tattoo studio ki vellanu, great experience.`,
        ]);
        middle = pickRandom([
          `Disposal sterile needles use chesaru, zero pain and immediate care tips icharu.`,
          `Studio hygiene chala clean ga undi, aftercare advice clearly explain chesaru.`,
        ]);
        closer = pickRandom([
          `Kadapa lo best piercing studio, thanks to Karthik!`,
          `Super gentle hands and clean setup. 10/10 recommended!`,
        ]);
      } else {
        opener = pickRandom([
          `${bName} daggara custom tattoo vespinchaanu, detailing and linework super ga vachindi.`,
          `Kadapa lo best tattoo studio ante ${bName}, Karthik artistic skill top notch.`,
          `First tattoo experience ikkade, initially fear undindi but chala comfortable ga chesaru.`,
        ]);
        middle = pickRandom([
          `Fresh needle open chesi choopinchaaru, studio cleanliness 100% genuine.`,
          `Wireless tattoo machine tho smooth ga vesaru, shading and contrast aithe next level.`,
          `Stencil design perfect ga set chesi patient ga complete chesaru.`,
        ]);
        closer = pickRandom([
          `True artist in Kadapa, fully satisfied with my tattoo!`,
          `Reasonable price and world-class detailing, highly recommended!`,
          `Friends andaru tattoo choosi super antunnaru, thanks to ${bName}!`,
        ]);
      }
      break;
    }

    case "APPLIANCE_REPAIR": {
      if (intent.isJetWash) {
        opener = pickRandom([
          `${bName} lo split AC deep jet wash service cheyinchukunnamu, super result.`,
          `AC cooling taggipothe ${bName} ki call chesamu, jet pump tho coils deep clean chesaru.`,
          `Kadapa lo best AC jet wash service ante ${bName}, ice cold cooling vachindi.`,
        ]);
        middle = pickRandom([
          `Jacket cover vesi indoor wall and floor pai drop kuda padakunda chala neat ga chesaru.`,
          `Blower and cooling coils lo unna dust antha clean aipoindi, airflow full speed lo undi.`,
          `Technician chala professional, work complete ayyaka testing choopinchadu.`,
        ]);
        closer = pickRandom([
          `Kadapa lo best AC service, thanks to ${bName}!`,
          `Chilled cooling malli vachindi, fully satisfied!`,
          `Reasonable charges and doorstep turnaround super fast!`,
        ]);
      } else {
        opener = pickRandom([
          `Home appliances repair kosam ${bName} ni contact ayyamu in Kadapa.`,
          `Urgent ga AC and fridge repair kavalsi oste ${bName} ki call chesamu, 1 hour lo vacharu.`,
          `Kadapa lo number one doorstep AC & fridge repair team ${bName}.`,
        ]);
        middle = pickRandom([
          `Problem ni accurate ga diagnose chesi genuine parts vesaru.`,
          `Transparent pricing, unnecessary parts emi suggest cheyakunda honest ga repair chesaru.`,
          `Technician polite behavior and clean workmanship chala impress chesindi.`,
        ]);
        closer = pickRandom([
          `Kadapa lo trustworthy appliance service, thanks to ${bName}!`,
          `Doorstep service super prompt ga undi, definitely recommend chesthanu!`,
          `Worth every rupee, best AC mechanic in Kadapa!`,
        ]);
      }
      break;
    }

    default:
      opener = pickRandom([
        `Chala baga chesaru, ${item} work aithe super neat ga vachindi.`,
        `${bName} lo service and coordination chala smooth ga undi.`,
      ]);
      middle = pickRandom([
        `Staff chala patient ga requirements vinnaaru, no unnecessary delays.`,
        `Quality and finishing expected danikante better ga vachindi.`,
      ]);
      closer = pickRandom([
        `Thanks to ${bName} team, will visit again for sure!`,
        `Worth it, satisfied customer!`,
      ]);
      break;
  }

  let review = `${opener} ${middle} ${closer}`;
  if (note) {
    review += ` ${note} kuda chala baga manage chesaru.`;
  }
  return review;
}

// Style 21: Telugu Occasion Context (Telugu Script) - DOMAIN ISOLATED
function generateTeluguOccasion(
  bName: string,
  tags: string[],
  note: string,
  lex: DomainLexicon,
  ind: IndustryType
): string {
  const intent = detectTagIntent(tags, ind);
  const item = tags[0] || pickRandom(lex.items);

  let opener = `మా రిక్వైర్మెంట్ కోసం ${bName} ని సంప్రదించాము.`;
  let middle = `సకాలంలో వర్క్ పూర్తి చేసి ఇచ్చారు, చాలా హ్యాపీగా ఉంది.`;
  let closer = `థాంక్యూ ${bName}!`;

  switch (ind) {
    case "GOLD_BUYERS": {
      if (intent.isPledged) {
        opener = pickRandom([
          `బ్యాంక్ గోల్డ్ లోన్ క్లోజ్ చేసి ప్లెడ్జ్డ్ గోల్డ్ రిలీజ్ చేసుకోవడానికి ${bName} టీమ్ సహాయం తీసుకున్నాము.`,
          `తాకట్టు బంగారం విడిపించుకోవడానికి సరైన సమయానికి ${bName} ని సంప్రదించాము.`,
          `అర్జెంట్ గా ప్లెడ్జ్డ్ గోల్డ్ రిలీజ్ చేసి బ్యాలెన్స్ అమౌంట్ తీసుకోవడానికి ఇక్కడికి వెళ్ళాము.`,
        ]);
        middle = pickRandom([
          `లోన్ అమౌంట్ క్లియర్ చేసి మిగిలిన బ్యాలెన్స్ ని లైవ్ బులియన్ రేటు ప్రకారం స్పాట్ లో సెటిల్ చేశారు.`,
          `ఎలాంటి ఆలస్యం లేకుండా బ్యాంక్ డాక్యుమెంటేషన్ పూర్తి చేసి అకౌంట్ లో డబ్బులు వేశారు.`,
          `స్టాఫ్ చాలా మర్యాదగా మాట్లాడి పారదర్శకంగా మొత్తం ప్రక్రియ పూర్తి చేశారు.`,
        ]);
        closer = pickRandom([
          `కడపలో తాకట్టు బంగారం విడిపించడానికి ది బెస్ట్ సర్వీస్!`,
          `చాలా రిలీఫ్ ఇచ్చారు, థాంక్యూ ${bName}!`,
        ]);
      } else if (intent.isPurity) {
        opener = pickRandom([
          `మా ఆర్నమెంట్స్ ప్యూరిటీ చెక్ చేసుకోవడానికి ${bName} ని సంప్రదించాము.`,
          `బంగారం క్యారట్స్ కరెక్ట్ గా నిర్ధారించుకోవడానికి ఇక్కడికి వెళ్ళాము.`,
        ]);
        middle = pickRandom([
          `10 నిమిషాల్లో జర్మన్ కంప్యూటర్ మెషిన్ లో ప్యూరిటీ చెక్ పూర్తి చేసి రిపోర్ట్ ఇచ్చారు.`,
          `ఎక్కడా డ్యామేజ్ లేకుండా డిజిటల్ స్కేల్ మీద పారదర్శకంగా చూపించారు.`,
        ]);
        closer = pickRandom([
          `ప్యూరిటీ టెస్టింగ్ కి కడపలో 100% నమ్మకమైన షాప్, థాంక్యూ ${bName}!`,
          `మంచి నిజాయితీ గల సర్వీస్!`,
        ]);
      } else {
        opener = pickRandom([
          `అర్జెంట్ ఫైనాన్షియల్ అవసరం కోసం పాత బంగారం అమ్మడానికి ${bName} కి వెళ్ళాము.`,
          `పాత గోల్డ్ ఆర్నమెంట్స్ సేల్ చేయడానికి ${bName} కి వెళ్ళాము, ప్రాసెస్ చాలా స్పీడ్‌గా జరిగింది.`,
        ]);
        middle = pickRandom([
          `10 నిమిషాల్లో టెస్టింగ్ పూర్తి చేసి లైవ్ బులియన్ రేటు ప్రకారం అమౌంట్ సెటిల్ చేశారు.`,
          `డిజిటల్ స్కేల్ మీద మా కంటి ముందే తూకం వేసి స్పాట్ లో బ్యాంక్ ట్రాన్స్‌ఫర్ చేశారు.`,
        ]);
        closer = pickRandom([
          `బంగారం అమ్మడానికి కడపలో 100% నమ్మకమైన షాప్, థాంక్యూ ${bName}!`,
          `మంచి సర్వీస్ ఇచ్చే టీమ్!`,
        ]);
      }
      break;
    }

    case "PRINTING_GRAPHICS": {
      if (intent.isFlexBanner) {
        opener = pickRandom([
          `మా షాప్ ఓపెనింగ్ కోసం flex banner ${bName} లో చేయించాము.`,
          `ఈవెంట్ ప్రమోషన్ కోసం flex banners ఆర్డర్ ఇచ్చాము.`,
        ]);
        middle = pickRandom([
          `ఫ్లెక్స్ ప్రింట్ చాలా షార్ప్‌గా వచ్చింది, ఎండలో కూడా కలర్స్ ఏమాత్రం డల్ అవ్వలేదు.`,
          `మంచి మన్నికైన వాటర్‌ప్రూఫ్ మెటీరియల్ వాడారు.`,
        ]);
        closer = pickRandom([
          `ఫ్లెక్స్ ప్రింటింగ్ కి కడపలో బెస్ట్ షాప్!`,
          `థాంక్యూ ${bName}, క్వాలిటీ వర్క్ కి బెస్ట్ ప్లేస్!`,
        ]);
      } else if (intent.isSignBoard) {
        opener = pickRandom([
          `మా షాప్ ఫ్రంట్ కోసం commercial sign board మరియు glow sign ${bName} లో చేయించాము.`,
          `షాప్ సైన్ బోర్డ్ ఆర్డర్ ఇచ్చాము.`,
        ]);
        middle = pickRandom([
          `అక్రిలిక్ లెటరింగ్ చాలా చక్కగా అమర్చారు, నైట్ లుక్ అదిరింది.`,
          `బోర్డ్ ఫినిషింగ్ చాలా రిచ్ గా వచ్చింది.`,
        ]);
        closer = pickRandom([
          `సైన్ బోర్డ్స్ కి కడపలో బెస్ట్ షాప్!`,
          `థాంక్యూ ${bName}!`,
        ]);
      } else {
        opener = pickRandom([
          `మా షాప్ ఓపెనింగ్ కోసం flex banner మరియు sign board ${bName} లో చేయించాము.`,
          `బిజినెస్ ప్రమోషన్ కోసం విజిటింగ్ కార్డ్స్ మరియు బ్రోచర్స్ ఆర్డర్ ఇచ్చాము.`,
          `ఈవెంట్ ప్రమోషన్ కోసం flex banners ఆర్డర్ ఇచ్చాము.`,
        ]);
        middle = pickRandom([
          `ఫ్లెక్స్ ప్రింట్ చాలా షార్ప్‌గా వచ్చింది, ఎండలో కూడా కలర్స్ ఏమాత్రం డల్ అవ్వలేదు.`,
          `గ్రాఫిక్ డిజైనింగ్ చాలా క్రియేటివ్‌గా చేశారు, లేఅవుట్ చాలా నచ్చింది.`,
          `కలర్ క్వాలిటీ మరియు మెటీరియల్ మన్నిక చాలా బాగుంది.`,
        ]);
        closer = pickRandom([
          `ఫ్లెక్స్ ప్రింటింగ్ మరియు సైన్ బోర్డ్స్ కి కడపలో బెస్ట్ షాప్.`,
          `థాంక్యూ ${bName}, క్వాలిటీ వర్క్ కి బెస్ట్ ప్లేస్!`,
        ]);
      }
      break;
    }

    case "PHOTOGRAPHY_STUDIO": {
      if (intent.isWeddingShoots) {
        opener = pickRandom([
          `మా వెడ్డింగ్ ఈవెంట్ మరియు ఫోటోగ్రఫీ కోసం ${bName} ని బుక్ చేసుకున్నాము.`,
          `మా ఫ్యామిలీ వెడ్డింగ్ సినిమాటిక్ షూట్ ఇక్కడ చేయించుకున్నాము.`,
        ]);
        middle = pickRandom([
          `ఫోటోలలో నాచురల్ స్మైల్స్ మరియు ప్రతి క్షణాన్ని చాలా అందంగా క్యాప్చర్ చేశారు.`,
          `కలర్స్ చాలా నేచురల్‌గా వచ్చాయి, లుక్ చాలా ఎలిగెంట్‌గా ఉంది.`,
        ]);
        closer = pickRandom([
          `థాంక్యూ ${bName}, మా ఈవెంట్‌ని స్పెషల్ చేశారు!`,
          `ఖచ్చితంగా రాబోయే ఫంక్షన్లకి కూడా ఇక్కడికే వస్తాము.`,
        ]);
      } else if (intent.isCustomGifts) {
        opener = pickRandom([
          `బర్త్‌డే సర్ప్రైజ్ గిఫ్ట్ కోసం కస్టమైజ్డ్ కప్ మరియు పిల్లో ప్రింటింగ్ చేయించాము.`,
          `గిఫ్ట్స్ కోసం ఫోటో ప్రింటింగ్ ఆర్డర్ ఇచ్చాము.`,
        ]);
        middle = pickRandom([
          `గిఫ్ట్ ఫినిషింగ్ చూసి ఇంట్లో అందరూ చాలా హ్యాపీగా ఫీల్ అయ్యారు.`,
          `కలర్స్ చాలా బ్రైట్ గా వచ్చాయి.`,
        ]);
        closer = pickRandom([
          `పర్ఫెక్ట్ గిఫ్ట్ వర్క్, థాంక్యూ ${bName}!`,
          `చాలా సంతోషంగా ఉంది!`,
        ]);
      } else {
        opener = pickRandom([
          `మా ఫ్యామిలీ ఈవెంట్ మరియు ఫోటో వర్క్ కోసం ${bName} ని బుక్ చేసుకున్నాము.`,
          `ఫ్యామిలీ ఫోటో ఫ్రేమ్ ${bName} లో చేయించాము.`,
        ]);
        middle = pickRandom([
          `ఫోటోలలో నాచురల్ స్మైల్స్ మరియు ప్రతి క్షణాన్ని చాలా అందంగా క్యాప్చర్ చేశారు.`,
          `ఫినిషింగ్ చూసి ఇంట్లో అందరూ చాలా హ్యాపీగా ఫీల్ అయ్యారు.`,
          `కలర్స్ చాలా నేచురల్‌గా వచ్చాయి, లుక్ చాలా ఎలిగెంట్‌గా ఉంది.`,
        ]);
        closer = pickRandom([
          `థాంక్యూ ${bName}, మా ఈవెంట్‌ని స్పెషల్ చేశారు!`,
          `ఖచ్చితంగా రాబోయే ఫంక్షన్లకి కూడా ఇక్కడికే వస్తాము.`,
        ]);
      }
      break;
    }

    case "RESTAURANT_FOOD":
      opener = pickRandom([
        `ఫ్యామిలీ సెలెబ్రేషన్ కోసం ${bName} రెస్టారెంట్ కి వెళ్ళాము.`,
        `బర్త్‌డే డిన్నర్ కోసం ఇక్కడికి వచ్చాము, ఫుడ్ చాలా బాగుంది.`,
      ]);
      middle = pickRandom([
        `టేబుల్ అరేంజ్‌మెంట్స్ మరియు హాస్పిటాలిటీ చాలా చక్కగా ఉన్నాయి.`,
        `రుచికరమైన బిర్యానీ మరియు స్టార్టర్స్ తో ఈవెంట్ చాలా మెమరబుల్ గా మారింది.`,
      ]);
      closer = pickRandom([
        `ఫ్యామిలీ అందరికీ బాగా నచ్చింది, థాంక్యూ ${bName}!`,
        `మంచి డైనింగ్ అనుభవం!`,
      ]);
      break;

    case "SALON_BEAUTY": {
      if (intent.isBridal) {
        opener = pickRandom([
          `పెళ్లి మరియు రిసెప్షన్ కోసం బ్రైడల్ మేకోవర్ ${bName} లో చేయించుకున్నాను.`,
          `స్పెషల్ మ్యారేజ్ ఫంక్షన్ కి బ్రైడల్ మేకప్ కోసం ఇక్కడికి వచ్చాను.`,
        ]);
        middle = pickRandom([
          `ఫంక్షన్ కి తగ్గట్టు రాయల్ మరియు ఎలిగెంట్ లుక్ ఇచ్చారు, సారీ డ్రాపింగ్ చాలా బాగుంది.`,
          `ఫేస్ కి తగినట్లు పర్ఫెక్ట్ హెయిర్ డూ మరియు బ్యూటిఫుల్ మేకప్ లుక్ సెట్ చేశారు.`,
        ]);
        closer = pickRandom([
          `ఫంక్షన్ లో అందరూ చాలా మెచ్చుకున్నారు, థాంక్యూ!`,
          `కడపలో బెస్ట్ బ్రైడల్ సర్వీస్, ఫుల్లీ శాటిస్‌ఫైడ్!`,
        ]);
      } else if (intent.isAcademy) {
        opener = pickRandom([
          `కెరీర్ డెవలప్మెంట్ కోసం ${bName} లో బ్యూటీషియన్ మరియు ఫ్యాషన్ డిజైనింగ్ కోర్స్ లో చేరాను.`,
          `ప్రొఫెషనల్ బ్యూటీ ట్రైనింగ్ నేర్చుకోవడానికి ఈ అకాడమీని ఎంచుకున్నాను.`,
        ]);
        middle = pickRandom([
          `క్లాసెస్ చాలా చక్కగా ప్రాక్టికల్ గా లైవ్ మోడల్స్ తో వివరించారు.`,
          `ఫ్యాకల్టీ చాలా ఓపిగ్గా ప్రతి సందేహాన్ని నివృత్తి చేశారు.`,
        ]);
        closer = pickRandom([
          `లేడీస్ కి వృత్తి నైపుణ్యాలు నేర్పించే బెస్ట్ అకాడమీ!`,
          `థాంక్యూ ${bName} అకాడమీ టీమ్!`,
        ]);
      } else if (intent.isSkinFacial || intent.isBodySpa) {
        opener = pickRandom([
          `ఫ్యామిలీ ఫంక్షన్ కి ముందు ఫేషియల్ మరియు బాడీ స్పా కోసం ${bName} కి వెళ్ళాను.`,
          `స్ట్రెస్ రిలీఫ్ మరియు స్కిన్ గ్లో కోసం ఇక్కడికి వచ్చాను.`,
        ]);
        middle = pickRandom([
          `చాలా ప్రశాంతమైన వాతావరణంలో రిలాక్సింగ్ మసాజ్ మరియు ఫేషియల్ చేశారు.`,
          `స్కిన్ కి సరిపడే జెంటిల్ ప్రొడక్ట్స్ వాడారు, మంచి ఫలితం కనిపించింది.`,
        ]);
        closer = pickRandom([
          `స్కిన్ చాలా ఫ్రెష్ గా మరియు గ్లోయింగ్ గా మారింది!`,
          `విశ్వనాథపురం లో లేడీస్ కి బెస్ట్ స్పా ఎక్స్‌పీరియన్స్!`,
        ]);
      } else {
        opener = pickRandom([
          `ఫ్యామిలీ ఫంక్షన్ కి ముందు లేడీస్ హెయిర్ స్టైలింగ్ కోసం ${bName} కి వెళ్ళాను.`,
          `స్పెషల్ ఈవెంట్ కోసం బ్యూటీ సర్వీసెస్ ఇక్కడ చేయించుకున్నాను.`,
        ]);
        middle = pickRandom([
          `ఫంక్షన్ కి తగ్గట్టు చాలా పర్ఫెక్ట్ గా మరియు నీట్ గా మేకోవర్ చేశారు.`,
          `లేడీస్ స్టాఫ్ చాలా ప్రొఫెషనల్ గా మరియు మర్యాదగా సర్వీస్ ఇచ్చారు.`,
        ]);
        closer = pickRandom([
          `అందరూ కాంప్లిమెంట్స్ ఇచ్చారు, థాంక్యూ!`,
          `కడపలో లేడీస్ కి బెస్ట్ సెలూన్!`,
        ]);
      }
      break;
    }

    case "HEALTHCARE_CLINIC":
      opener = pickRandom([
        `ఫ్యామిలీ హెల్త్ చెకప్ కోసం ${bName} క్లినిక్ కి వెళ్ళాము.`,
        `దంత పరీక్ష మరియు ట్రీట్మెంట్ కోసం ఇక్కడికి వచ్చాము.`,
      ]);
      middle = pickRandom([
        `డాక్టర్ చాలా ఆప్యాయంగా మాట్లాడి పేషెంట్ కి ధైర్యం చెప్పారు.`,
        `ఎలాంటి నొప్పి లేకుండా చాలా స్మూత్ గా ట్రీట్మెంట్ పూర్తి చేశారు.`,
      ]);
      closer = pickRandom([
        `మంచి రెస్పాన్స్ మరియు బెస్ట్ ట్రీట్మెంట్!`,
        `థాంక్యూ డాక్టర్!`,
      ]);
      break;

    case "AUTO_GARAGE":
      opener = pickRandom([
        `ఫ్యామిలీ టూర్ కి వెళ్ళే ముందు వెహికల్ సర్వీసింగ్ ఇక్కడ చేయించాము.`,
        `లాంగ్ డ్రైవ్ సేఫ్టీ కోసం కారు చెకప్ ఇక్కడ చేయించాము.`,
      ]);
      middle = pickRandom([
        `బ్రేక్స్, ఇంజిన్ ఆయిల్ మరియు సస్పెన్షన్ పర్ఫెక్ట్‌గా సెట్ చేశారు.`,
        `జర్నీ మొత్తం ఎక్కడా ఎలాంటి ప్రాబ్లమ్ లేకుండా స్మూత్ గా జరిగింది.`,
      ]);
      closer = pickRandom([
        `సేఫ్ డ్రైవింగ్ కి బెస్ట్ సర్వీసింగ్ ఇచ్చారు!`,
        `థాంక్యూ ${bName} గ్యారేజ్!`,
      ]);
      break;

    case "TOURS_TRAVELS": {
      if (intent.isTirupati) {
        opener = pickRandom([
          `మా ఫ్యామిలీ తిరుపతి దర్శనం ట్రిప్ కోసం ${bName} లో క్యాబ్ బుక్ చేసుకున్నాము.`,
          `తిరుమల శ్రీవారి దర్శనం కోసం కడప నుండి క్యాబ్ బుకింగ్ ${bName} లో చేశాము.`,
        ]);
        middle = pickRandom([
          `డ్రైవర్ తెల్లవారుజామునే సమయానికి వచ్చి ఘాట్ రోడ్ లో చాలా సేఫ్ గా డ్రైవ్ చేశారు.`,
          `ఇన్నోవా క్రిస్టా చాలా నీట్‌గా శానిటైజ్ చేసి తెచ్చారు, పెద్దవాళ్లతో ప్రయాణం చాలా సుఖంగా సాగింది.`,
          `దర్శనం పూర్తయ్యే వరకు ఓపికగా వెయిట్ చేసి సాయంత్రం సేఫ్ గా ఇంటికి చేర్చారు.`,
        ]);
        closer = pickRandom([
          `తిరుపతి యాత్ర చాలా ప్రశాంతంగా జరిగింది, థాంక్యూ ${bName}!`,
          `ఫ్యామిలీ ట్రిప్స్ కి కడపలో నంబర్ వన్ ట్రావెల్స్!`,
        ]);
      } else if (intent.isGandikota) {
        opener = pickRandom([
          `ఫ్రెండ్స్‌తో కలిసి గండికోట మరియు బెలుం గుహల టూర్ కోసం ${bName} ని బుక్ చేసుకున్నాము.`,
          `వీకెండ్ గండికోట గ్రాండ్ కాన్యన్ ట్రిప్ కోసం ఇక్కడి నుండి కారు తీసుకున్నాము.`,
        ]);
        middle = pickRandom([
          `రూట్ ప్లానింగ్ మరియు సైట్‌సీయింగ్ స్పాట్స్ చాలా బాగా గైడ్ చేశారు.`,
          `జర్నీ అంతా ఏసీ కూలింగ్ మరియు మ్యూజిక్ సిస్టమ్ తో చాలా ఎంజాయ్ చేశాము.`,
        ]);
        closer = pickRandom([
          `ట్రిప్ సూపర్ మెమరబుల్ గా మారింది, థాంక్యూ ${bName}!`,
          `కడపలో టూర్ ప్యాకేజీలకి బెస్ట్ ఛాయిస్!`,
        ]);
      } else if (intent.isAirport) {
        opener = pickRandom([
          `బెంగళూరు ఎయిర్‌పోర్ట్ డ్రాప్ కోసం ${bName} లో అర్జెంట్ గా క్యాబ్ బుక్ చేసుకున్నాము.`,
          `ఫ్లైట్ టైమింగ్స్ కి తగ్గట్టు ఎయిర్‌పోర్ట్ పికప్ సర్వీస్ ఇక్కడ తీసుకున్నాము.`,
        ]);
        middle = pickRandom([
          `రాత్రి సమయమైనా డ్రైవర్ చాలా అలర్ట్ గా మరియు జాగ్రత్తగా డ్రైవ్ చేసి సమయానికి చేర్చారు.`,
          `టోల్ గేట్లు మరియు రూట్ లో ఎక్కడా టైమ్ వేస్ట్ కాకుండా చూసుకున్నారు.`,
        ]);
        closer = pickRandom([
          `ఆన్-టైమ్ ఎయిర్‌పోర్ట్ డ్రాప్, ఫుల్లీ రిలాక్స్డ్! థాంక్యూ ${bName}!`,
          `అత్యవసర ప్రయాణాలకి నమ్మకమైన సర్వీస్!`,
        ]);
      } else {
        opener = pickRandom([
          `మా ఫ్యామిలీ ఫంక్షన్ మరియు అవుట్‌స్టేషన్ ట్రిప్ కోసం ${bName} ని బుక్ చేసుకున్నాము.`,
          `సెలవుల్లో టూర్ వెళ్ళడానికి ${bName} ట్రావెల్స్ సర్వీస్ తీసుకున్నాము.`,
        ]);
        middle = pickRandom([
          `వెహికల్ కండిషన్ చాలా బాగుంది, డ్రైవర్ చాలా మర్యాదగా మాట్లాడి సహకరించారు.`,
          `ముందు చెప్పిన ఫేర్ ప్రకారమే తీసుకున్నారు, ఎలాంటి ఎక్స్‌ట్రా ఛార్జీలు వేయలేదు.`,
        ]);
        closer = pickRandom([
          `ప్రయాణం చాలా సురక్షితంగా మరియు హాయిగా సాగింది, థాంక్యూ ${bName}!`,
          `కడపలో బెస్ట్ ట్రావెల్స్ సర్వీస్!`,
        ]);
      }
      break;
    }

    case "TATTOO_STUDIO": {
      if (intent.isPiercing) {
        opener = pickRandom([
          `నా ఫేవరెట్ ఇయర్ పియర్సింగ్ కోసం ${bName} స్టూడియోకి వెళ్లాను.`,
          `నొప్పి లేకుండా ముక్కుపుడక లేదా చెవి పియర్సింగ్ కోసం ఇక్కడికి వచ్చాము.`,
        ]);
        middle = pickRandom([
          `డిస్పోజబుల్ నీడిల్స్ వాడారు, చాలా స్మూత్ గా మరియు శ్రద్ధగా పూర్తి చేశారు.`,
          `హైజీన్ చాలా చక్కగా మెయింటైన్ చేశారు, ఇన్ఫెక్షన్ రాకుండా జాగ్రత్తలు చెప్పారు.`,
        ]);
        closer = pickRandom([
          `సూపర్ జెంటిల్ సర్వీస్, థాంక్యూ ${bName}!`,
          `కడపలో బెస్ట్ పియర్సింగ్ సెటప్!`,
        ]);
      } else {
        opener = pickRandom([
          `నా ఫస్ట్ పర్మనెంట్ టాటూ కోసం ${bName} ని ఎంచుకున్నాను.`,
          `స్పెషల్ మెమోరియల్ టాటూ వేయించుకోవడానికి ${bName} స్టూడియోకి వెళ్లాను.`,
        ]);
        middle = pickRandom([
          `కార్తీక్ గారు డిజైన్ ని చాలా డీటెయిల్డ్‌గా స్కిన్ మీద పర్ఫెక్ట్ గా వేశారు.`,
          `లైన్స్ మరియు షేడింగ్ క్వాలిటీ నెక్స్ట్ లెవెల్ లో ఉంది, స్టూడియో చాలా పరిశుభ్రంగా ఉంది.`,
        ]);
        closer = pickRandom([
          `టాటూ ఆర్ట్ సూపర్ గా కుదిరింది, థాంక్యూ కార్తీక్ గారు!`,
          `కడపలో బెస్ట్ టాటూ స్టూడియో, హైలీ రికమండెడ్!`,
        ]);
      }
      break;
    }

    case "APPLIANCE_REPAIR": {
      opener = pickRandom([
        `మా ఇంట్లో ఏసీ కూలింగ్ ఆగిపోవడంతో ${bName} ని డోర్‌స్టెప్ రిపేర్ కోసం పిలిచాము.`,
        `వేసవి వేడి తట్టుకోలేక ఏసీ డీప్ జెట్ సర్వీసింగ్ కోసం ${bName} కి కాల్ చేశాము.`,
      ]);
      middle = pickRandom([
        `టెక్నీషియన్ సమయానికి వచ్చి వాటర్‌ప్రూఫ్ కవర్స్ వాడి చాలా జాగ్రత్తగా జెట్ వాష్ పూర్తి చేశారు.`,
        `గ్యాస్ ప్రెషర్ కరెక్ట్ గా చెక్ చేసి, వెంటనే చల్లటి కూలింగ్ వచ్చేలా సెట్ చేశారు.`,
      ]);
      closer = pickRandom([
        `డోర్‌స్టెప్ సర్వీస్ ఎక్సలెంట్, థాంక్యూ ${bName}!`,
        `కడపలో బెస్ట్ ఏసీ మెకానిక్!`,
      ]);
      break;
    }

    default:
      opener = pickRandom([
        `మా ఈవెంట్ రిక్వైర్మెంట్ కోసం ${bName} లో సర్వీస్ తీసుకున్నాము.`,
        `స్పెషల్ ఆర్డర్ కోసం ${bName} ని సంప్రదించాము.`,
      ]);
      middle = pickRandom([
        `క్వాలిటీ మరియు టైమ్‌కి పూర్తి చేయడం చాలా నచ్చింది.`,
        `స్టాఫ్ కోఆర్డినేషన్ మరియు అవుట్‌పుట్ చాలా బాగున్నాయి.`,
      ]);
      closer = pickRandom([
        `థాంక్యూ ${bName}, గుడ్ సర్వీస్!`,
        `చాలా తృప్తిగా ఉంది!`,
      ]);
      break;
  }

  let review = `${opener} ${middle} ${closer}`;
  if (note) review += ` ${note} వర్క్ కూడా పర్ఫెక్ట్‌గా చేశారు.`;
  return review;
}

// ─── HEADLINE GENERATOR (Domain-Isolated) ────────────────────────────────────
export function buildDynamicHeadline(text: string, lang: string, ind: IndustryType): string {
  if (lang === "TELUGU_SCRIPT") {
    switch (ind) {
      case "GOLD_BUYERS":
        return pickRandom([
          "100% Genuine Gold Rate & Instant Cash",
          "Spot Bank Transfer & Best Valuation",
          "కంప్యూటర్ టెస్టింగ్ & పారదర్శక సర్వీస్",
          "కడపలో బెస్ట్ గోల్డ్ బయర్స్",
        ]);
      case "PRINTING_GRAPHICS":
        return pickRandom([
          "Super Flex Printing & Great Design",
          "కలర్ క్లారిటీ & టైమ్‌కి డెలివరీ",
          "సైన్ బోర్డ్స్ & విజిటింగ్ కార్డ్స్ కి బెస్ట్",
          "చక్కటి ప్రింటింగ్ క్వాలిటీ",
        ]);
      case "PHOTOGRAPHY_STUDIO":
        return pickRandom([
          "చాలా మంచి అనుభవం & Super Quality",
          "ఫోటో ఫ్రేమ్స్ & గిఫ్ట్స్ కి బెస్ట్ ప్లేస్",
          "Neat Finishing & Time కి Delivery",
          "మంచి సర్వీస్ & సాలిడ్ క్వాలిటీ",
        ]);
      case "SALON_BEAUTY":
        if (/బ్రైడల్|మేకప్|మేకోవర్|పెళ్లి/i.test(text)) {
          return pickRandom([
            "పర్ఫెక్ట్ బ్రైడల్ మేకోవర్ & బ్యూటిఫుల్ లుక్",
            "కడపలో బెస్ట్ బ్రైడల్ సర్వీస్",
            "ఎలిగెంట్ మేకప్ & ప్రొఫెషనల్ కేర్",
          ]);
        }
        if (/అకాడమీ|కోర్స్|ట్రైనింగ్|డిజైనింగ్/i.test(text)) {
          return pickRandom([
            "బెస్ట్ బ్యూటీ అకాడమీ & ప్రాక్టికల్ ట్రైనింగ్",
            "లేడీస్ కి బెస్ట్ కెరీర్ ట్రైనింగ్ ఇన్స్టిట్యూట్",
            "ఎక్సలెంట్ బ్యూటీషియన్ కోర్స్ ఇన్ కడప",
          ]);
        }
        if (/స్పా|ఫేషియల్|స్కిన్|మసాజ్/i.test(text)) {
          return pickRandom([
            "రిలాక్సింగ్ బాడీ స్పా & గ్లోయింగ్ ఫేషియల్",
            "లేడీస్ కి బెస్ట్ స్పా ఎక్స్‌పీరియన్స్",
            "క్లీన్ అండ్ హైజీనిక్ స్కిన్ కేర్",
          ]);
        }
        return pickRandom([
          "బెస్ట్ లేడీస్ సెలూన్ & ప్రొఫెషనల్ సర్వీస్",
          "హైజీనిక్ అంబియన్స్ & ఎక్సలెంట్ స్టైలింగ్",
          "ఫుల్లీ శాటిస్‌ఫైడ్ & నమ్మకమైన సెలూన్",
        ]);
      case "TOURS_TRAVELS":
        return pickRandom([
          "సేఫ్ జర్నీ & సమయానికి సర్వీస్",
          "కడపలో బెస్ట్ ట్రావెల్స్ & క్లీన్ క్యాబ్స్",
          "తిరుపతి & గండికోట ట్రిప్స్ కి బెస్ట్",
          "రీజనబుల్ ప్రైస్ & సూపర్ కండిషన్ కార్లు",
        ]);
      case "TATTOO_STUDIO":
        return pickRandom([
          "పర్ఫెక్ట్ టాటూ వర్క్ & హైజీనిక్ స్టూడియో",
          "కడపలో బెస్ట్ టాటూ ఆర్టిస్ట్ & సేఫ్ పియర్సింగ్",
          "అద్భుతమైన షేడింగ్ & లైన్ వర్క్",
          "నొప్పి లేని పియర్సింగ్ & సూపర్ కేర్",
        ]);
      case "APPLIANCE_REPAIR":
        return pickRandom([
          "ఐస్ కోల్డ్ ఏసీ కూలింగ్ & జెట్ వాష్",
          "కడపలో బెస్ట్ ఏసీ & ఫ్రిజ్ రిపేర్ సర్వీస్",
          "డోర్‌స్టెప్ సర్వీస్ & రీజనబుల్ ప్రైస్",
          "సకాలంలో సర్వీస్ & జెన్యూన్ స్పేర్ పార్ట్స్",
        ]);
      default:
        return pickRandom([
          "చాలా మంచి అనుభవం & Super Quality",
          "Excellent Service & Friendly Staff",
          "Great Work, Family కి బాగా నచ్చింది",
          "Super Quality & Reasonable Price",
          "మంచి సర్వీస్ & సాలిడ్ క్వాలిటీ",
        ]);
    }
  }

  if (lang === "TELUGU_ROMAN") {
    switch (ind) {
      case "GOLD_BUYERS":
        return pickRandom([
          "Instant Bank Transfer & Best Gold Rate",
          "Honest Testing & Quick Cash in Kadapa",
          "100% Transparent & Safe Service",
        ]);
      case "PRINTING_GRAPHICS":
        return pickRandom([
          "Top Printing Quality in Kadapa",
          "Super Neat Work & Timely Delivery",
          "Vibrant Colors & Solid Material",
        ]);
      case "PHOTOGRAPHY_STUDIO":
        return pickRandom([
          "Super Neat Work & Timely Delivery",
          "Chala Baga Chesaru, Good Service",
          "Solid Quality & Friendly Staff",
        ]);
      case "SALON_BEAUTY":
        if (/bridal|wedding|makeover/i.test(text)) {
          return pickRandom([
            "Flawless Bridal Makeup & Elegance",
            "Best Bridal Makeover in Kadapa",
            "Stunning Wedding Look & Great Care",
          ]);
        }
        if (/academy|course|training/i.test(text)) {
          return pickRandom([
            "Best Beautician Academy in Kadapa",
            "Practical Salon Training & Mentorship",
            "Top Beauty & Fashion Academy",
          ]);
        }
        if (/spa|facial|skin/i.test(text)) {
          return pickRandom([
            "Deeply Relaxing Spa & Radiant Facial",
            "Top Ladies Spa in Kadapa",
            "Hygienic Skincare & Peaceful Ambiance",
          ]);
        }
        return pickRandom([
          "Top Ladies Salon in Kadapa",
          "Neat Styling & Hygienic Care",
          "Professional Ladies Beauty Care",
        ]);
      case "TOURS_TRAVELS":
        return pickRandom([
          "Safe Highway Journey & On-Time Service",
          "Best Outstation Cabs in Kadapa",
          "Top Self Drive Cars & Clean Cabs",
          "Reasonable Pricing & Courteous Drivers",
        ]);
      case "TATTOO_STUDIO":
        return pickRandom([
          "Top Tattoo Studio & Clean Setup in Kadapa",
          "Master Linework & Smooth Shading",
          "Painless Piercing & Great Aftercare",
          "100% Sterile & Authentic Art",
        ]);
      case "APPLIANCE_REPAIR":
        return pickRandom([
          "Best AC & Appliance Repair in Kadapa",
          "Chilled AC Cooling & Deep Jet Wash",
          "Prompt Doorstep Service & Honest Rates",
          "Quick Fridge & Washing Machine Fix",
        ]);
      default:
        return pickRandom([
          "Super Neat Work & Timely Delivery",
          "Chala Baga Chesaru, Good Service",
          "Solid Quality & Friendly Staff",
          "Worth It & Happy with Output",
        ]);
    }
  }

  if (text.length < 80) {
    return pickRandom([
      "Quick & Crisp",
      "Neat Work, On Time",
      "Simple & Dependable",
      "Prompt Service",
      "Spot On",
    ]);
  }

  switch (ind) {
    case "GOLD_BUYERS":
      return pickRandom([
        "Instant Payment & Best Market Rate",
        "100% Transparent Purity Testing",
        "Quick & Honest Gold Valuation",
        "Smooth Pledged Gold Release",
        "Spot Bank Transfer & Genuine Rate",
        "Hassle-Free 10-Minute Process",
      ]);

    case "PRINTING_GRAPHICS":
      return pickRandom([
        "Vibrant Colors & Sharp Printing",
        "Top Class Flex & Sign Board Work",
        "Punctual Delivery & Great Graphics",
        "Crisp Visiting Cards & Quality Finish",
        "Weather-Proof Durable Printing",
      ]);

    case "PHOTOGRAPHY_STUDIO":
      return pickRandom([
        "Super Quality on Photo Frames",
        "Candid Moments Captured Beautifully",
        "Neat Finishing & Timely Delivery",
        "Delightful Custom Gift Work",
        "Vibrant Resolution & Studio Clarity",
      ]);

    case "SOFTWARE_IT":
      return pickRandom([
        "Top-Tier Tech Engineering",
        "Highly Skilled & Reliable Dev Team",
        "Clean Code Architecture & Prompt Support",
        "Robust Software Delivery",
      ]);

    case "RESTAURANT_FOOD":
      return pickRandom([
        "Superb Flavors & Welcoming Service",
        "Delicious Food & Quick Table Service",
        "Authentic Taste & Fresh Ingredients",
        "Delightful Dining Experience",
      ]);

    case "SALON_BEAUTY": {
      if (/bridal|wedding|makeover/i.test(text)) {
        return pickRandom([
          "Stunning Bridal Makeover & Styling",
          "Flawless Bridal Makeup & Elegance",
          "Perfect Wedding Look & Courteous Care",
          "Exquisite Bridal Grooming & Hairdo",
        ]);
      }
      if (/academy|course|training|design/i.test(text)) {
        return pickRandom([
          "Excellent Beautician Academy & Training",
          "Professional Beauty & Fashion Academy",
          "Comprehensive Practical Salon Training",
          "Top-Tier Coaching & Skill Mentorship",
        ]);
      }
      if (/spa|facial|skin|relax/i.test(text)) {
        return pickRandom([
          "Deeply Relaxing Spa & Radiant Facial",
          "Refreshing Skincare & Soothing Ambiance",
          "Pure Relaxation & Rejuvenating Therapy",
          "Gentle Skincare & Hygienic Care",
        ]);
      }
      return pickRandom([
        "Masterful Styling & Relaxing Vibe",
        "Stylish Haircut & Skilled Stylists",
        "Neat Ladies Grooming & Polite Staff",
        "Hygienic Setup & Professional Care",
      ]);
    }

    case "HEALTHCARE_CLINIC":
      return pickRandom([
        "Exceptional Patient Care",
        "Compassionate & Painless Treatment",
        "Hygienic Clinic & Caring Doctor",
        "Clear Medical Guidance",
      ]);

    case "AUTO_GARAGE":
      return pickRandom([
        "Fast, Honest & Reliable Servicing",
        "Smooth Drive & Genuine Spare Parts",
        "Professional Diagnostics & Fair Pricing",
        "Skilled Mechanics & Quality Work",
      ]);

    case "FITNESS_GYM":
      return pickRandom([
        "Motivating Atmosphere & Modern Equipment",
        "Certified Trainers & Great Energy",
        "Clean Gym Floor & Solid Guidance",
        "Top-Tier Fitness Experience",
      ]);

    case "RETAIL_SHOP":
      return pickRandom([
        "Wonderful Collection & Quality Fabric",
        "Great Shopping Experience & Polite Staff",
        "Latest Trends & Fair Pricing",
        "Pleasant In-Store Experience",
      ]);

    case "HOTEL_HOSPITALITY":
      return pickRandom([
        "Extremely Comfortable Stay",
        "Spotless Rooms & Courteous Staff",
        "Warm Hospitality & Peaceful Ambiance",
      ]);

    case "PROFESSIONAL_SERVICES":
      return pickRandom([
        "Trustworthy & Highly Professional",
        "Clear Guidance & Seamless Execution",
        "Honest Advisory & Prompt Documentation",
      ]);

    case "TOURS_TRAVELS":
      return pickRandom([
        "Punctual, Safe & Clean Cabs",
        "Hassle-Free Self Drive Car Rental",
        "Smooth Outstation Trip & Polite Driver",
        "Best Tirupati Darshan & Airport Service",
        "Transparent Fares & Well-Maintained Fleet",
      ]);

    case "TATTOO_STUDIO":
      return pickRandom([
        "Flawless Tattoo Linework & Sterile Studio",
        "Master Tattoo Artist & Smooth Shading",
        "Virtually Painless Piercing & Great Aftercare",
        "Best Custom Tattoo & Piercing Studio in Kadapa",
        "Hospital-Grade Hygiene & Precision Art",
      ]);

    case "APPLIANCE_REPAIR":
      return pickRandom([
        "Ice-Cold Cooling Restored & Deep Jet Wash",
        "Top #1 AC Repair & Service in Kadapa",
        "Prompt Same-Day Doorstep Appliance Fix",
        "Honest Diagnosis & Fair Repair Charges",
        "Expert Refrigerator & Washing Machine Repair",
      ]);

    default:
      return pickRandom([
        "Genuine & Dependable Service",
        "Great Experience Overall",
        "Polite Staff & Prompt Response",
        "Fair Pricing & Solid Output",
        "Helpful & Attentive Team",
      ]);
  }
}

// ─── PROCEDURAL ENTROPY SAFEGUARD (Strictly Domain Gated) ───────────────────
function generateProceduralFallback(
  bName: string,
  tag: string,
  lex: DomainLexicon,
  ind: IndustryType,
  roundSeed: number,
  isTelugu: boolean
): string {
  const intent = detectTagIntent([tag], ind);
  if (isTelugu) {
    let starters: string[];
    let middles: string[];

    switch (ind) {
      case "GOLD_BUYERS": {
        if (intent.isPledged) {
          starters = [
            `బ్యాంకులో తాకట్టు పెట్టిన బంగారం విడిపించడానికి సహాయం చేశారు.`,
            `ప్లెడ్జ్డ్ గోల్డ్ రిలీజ్ చేసి వెంటనే బ్యాలెన్స్ బ్యాంక్ ట్రాన్స్‌ఫర్ చేశారు.`,
            `గోల్డ్ లోన్ సెటిల్మెంట్ చాలా ఫాస్ట్‌గా పూర్తి చేశారు.`,
            `${bName} లో తాకట్టు బంగారం రిలీజ్ సర్వీస్ చాలా genuine గా ఉంది.`,
            `కడపలో తాకట్టు బంగారం విడిపించడానికి నమ్మకమైన సర్వీస్.`,
          ];
          middles = [
            `లోన్ క్లియర్ చేసి మిగిలిన అమౌంట్ లైవ్ బులియన్ రేటు ప్రకారం ఇచ్చారు.`,
            `అనవసరమైన కటింగ్స్ లేదా డిడక్షన్స్ ఏమీ లేకుండా క్లియర్ చేశారు.`,
            `వెంటనే బ్యాంక్ ఖాతాకి బ్యాలెన్స్ అమౌంట్ క్రెడిట్ అయిపోయింది.`,
            `స్టాఫ్ చాలా సపోర్టివ్ గా ఉండి ప్రాసెస్ పూర్తి చేశారు.`,
          ];
        } else if (intent.isPurity) {
          starters = [
            `బంగారం ప్యూరిటీని కంప్యూటరైజ్డ్ మెషిన్‌లో పారదర్శకంగా చెక్ చేశారు.`,
            `జర్మన్ ఎక్స్-ఆర్-ఎఫ్ మెషిన్ లో కంటి ముందే ప్యూరిటీ టెస్ట్ చేశారు.`,
            `ఆర్నమెంట్స్ కి ఎలాంటి డ్యామేజ్ లేకుండా ప్యూరిటీ నిర్ధారించారు.`,
            `${bName} లో ప్యూరిటీ టెస్టింగ్ చాలా accurate గా ఉంది.`,
            `కడపలో కంప్యూటరైజ్డ్ గోల్డ్ ప్యూరిటీ టెస్టింగ్ కి బెస్ట్ ప్లేస్.`,
          ];
          middles = [
            `కంప్యూటర్ టెస్టింగ్ లో 100% పారదర్శకత చూపించారు.`,
            `ఎలాంటి కరిగించడం లేదా డ్యామేజ్ లేకుండా రీడింగ్ ఇచ్చారు.`,
            `డిజిటల్ రిపోర్ట్ చాలా క్లియర్ గా అర్థమయ్యేలా చెప్పారు.`,
            `రెండు నిమిషాల్లో ఖచ్చితమైన క్యారట్ శాతాన్ని చూపించారు.`,
          ];
        } else {
          starters = [
            `కంటి ముందే డిజిటల్ స్కేల్‌లో తూకం వేసి కరెక్ట్ రేటు ఇచ్చారు.`,
            `పాత బంగారం అమ్మడానికి వెళ్తే చాలా బాగా రెస్పాండ్ అయ్యారు.`,
            `${bName} లో గోల్డ్ వాల్యుయేషన్ చాలా genuine గా ఉంది.`,
            `కడపలో బెస్ట్ గోల్డ్ బయర్స్ మరియు జెన్యూన్ లైవ్ రేట్.`,
            `10 నిమిషాల్లో ప్రొసీజర్ మొత్తం కంప్లీట్ చేశారు.`,
          ];
          middles = [
            `లైవ్ మార్కెట్ బులియన్ రేటు ప్రకారం అమౌంట్ సెటిల్ చేశారు.`,
            `అనవసరమైన కటింగ్స్ లేదా వేస్టేజ్ ఏమీ లేకుండా లెక్క చెప్పారు.`,
            `వెంటనే బ్యాంక్ ఖాతాకి అమౌంట్ క్రెడిట్ అయిపోయింది.`,
            `డిజిటల్ వెయింగ్ లో 100% పారదర్శకత చూపించారు.`,
          ];
        }
        break;
      }

      case "PRINTING_GRAPHICS":
        starters = [
          `ప్రింటింగ్ వర్క్ ఫినిషింగ్ చాలా neat గా ఉంది.`,
          `మా ఆర్డర్ ని టైమ్‌కి రెడీ చేసి ఇచ్చారు.`,
          `${tag} క్వాలిటీ అనుకున్నదానికంటే బాగుంది.`,
          `${bName} లో వర్క్ చాలా genuine గా చేశారు.`,
          `ఫ్లెక్స్ మరియు బోర్డ్స్ డిజైనింగ్ చాలా చక్కగా అమర్చారు.`,
          `ప్రింట్ కలర్స్ ఏమాత్రం తగ్గకుండా చూసుకున్నారు.`,
          `కడపలో మంచి ప్రింటింగ్ మరియు సైనేజ్ సర్వీస్.`,
        ];
        middles = [
          `కలర్ ప్రింటింగ్ మరియు బోర్డర్ నీట్‌గా వచ్చాయి.`,
          `ప్రైస్ కూడా చాలా రీజనబుల్ గా అనిపించింది.`,
          `కలర్స్ చాలా వైబ్రంట్ గా మరియు షార్ప్‌గా ఉన్నాయి.`,
          `మంచి మన్నికైన మెటీరియల్ వాడారు.`,
          `ప్యాకింగ్ చాలా సేఫ్ గా చేసి ఇచ్చారు.`,
        ];
        break;

      case "PHOTOGRAPHY_STUDIO":
        starters = [
          `ఫోటో వర్క్ ఫినిషింగ్ చాలా neat గా ఉంది.`,
          `మా ఆర్డర్ ని టైమ్‌కి రెడీ చేసి ఇచ్చారు.`,
          `${tag} క్వాలిటీ అనుకున్నదానికంటే బాగుంది.`,
          `${bName} లో వర్క్ చాలా genuine గా చేశారు.`,
          `కస్టమైజ్డ్ ${tag} చాలా చక్కగా అమర్చారు.`,
          `మంచి క్వాలిటీ ప్రింట్స్ మరియు ఫ్రేమింగ్ ఇచ్చారు.`,
          `ఫోటో క్లారిటీ ఏమాత్రం తగ్గకుండా చూసుకున్నారు.`,
        ];
        middles = [
          `కలర్ ప్రింటింగ్ మరియు అవుట్‌పుట్ నీట్‌గా వచ్చాయి.`,
          `ప్రైస్ కూడా చాలా రీజనబుల్ గా అనిపించింది.`,
          `ఫ్యామిలీ అందరూ చాలా హ్యాపీగా ఫీల్ అయ్యారు.`,
          `ఫోటో కలర్స్ చాలా నేచురల్‌గా అనిపించాయి.`,
        ];
      case "SALON_BEAUTY": {
        if (intent.isBridal) {
          starters = [
            `పెళ్లి కోసం బ్రైడల్ మేకప్ చాలా ఎలిగెంట్ గా చేశారు.`,
            `${bName} లో బ్రైడల్ మేకోవర్ మరియు హెయిర్ స్టైలింగ్ సూపర్ గా వచ్చింది.`,
            `స్పెషల్ ఈవెంట్ కోసం బ్రైడల్ సర్వీస్ బుక్ చేసుకున్నాము.`,
            `కడపలో బెస్ట్ బ్రైడల్ మేకప్ స్టూడియో.`,
          ];
          middles = [
            `సమయానికి పూర్తి చేసి చాలా ప్రొఫెషనల్ గా లుక్ సెట్ చేశారు.`,
            `సారీ డ్రాపింగ్ మరియు జుట్టు అలంకరణ చాలా పద్ధతిగా చేశారు.`,
            `హెవీగా లేకుండా నేచురల్ గ్లో వచ్చేలా చేశారు.`,
            `ఫోటోస్ లో చాలా బ్యూటిఫుల్ గా కనిపించింది.`,
          ];
        } else if (intent.isAcademy) {
          starters = [
            `${bName} అకాడమీ లో బ్యూటీషియన్ కోర్స్ ట్రైనింగ్ తీసుకున్నాను.`,
            `ఫ్యాషన్ డిజైనింగ్ మరియు బ్యూటీ కోర్సులకి చాలా మంచి ఇన్స్టిట్యూట్.`,
            `లేడీస్ కి ప్రొఫెషనల్ కెరీర్ నేర్పించడానికి బెస్ట్ అకాడమీ.`,
          ];
          middles = [
            `ప్రతి టెక్నిక్ ని ప్రాక్టికల్ గా చాలా ఓపిగ్గా నేర్పించారు.`,
            `ఫ్యాకల్టీ చాలా సపోర్టివ్ గా ఉండి అన్ని మెళకువలు నేర్పించారు.`,
            `లైవ్ మోడల్స్ తో హ్యాండ్స్-ఆన్ ప్రాక్టీస్ చేయించారు.`,
            `విలువైన వృత్తి విద్య నేర్పించారు.`,
          ];
        } else if (intent.isSkinFacial || intent.isBodySpa) {
          starters = [
            `బాడీ స్పా మరియు ఫేషియల్ సర్వీస్ చాలా రిలాక్సింగ్ గా అనిపించింది.`,
            `${bName} లో స్కిన్ కేర్ మరియు స్పా చాలా పరిశుభ్రంగా చేశారు.`,
            `స్ట్రెస్ రిలీఫ్ కోసం స్పా సెషన్ తీసుకున్నాను, చాలా మంచి అనుభవం.`,
          ];
          middles = [
            `హైజీనిక్ ప్రొడక్ట్స్ వాడారు మరియు చాలా ఓపిగ్గా మసాజ్ చేశారు.`,
            `లేడీస్ కి పూర్తి ప్రైవసీ మరియు ప్రశాంతమైన వాతావరణం ఉంది.`,
            `స్కిన్ చాలా ఫ్రెష్ గా మరియు గ్లోయింగ్ గా మారింది.`,
          ];
        } else {
          starters = [
            `${tag} సర్వీస్ చాలా నీట్ గా మరియు ప్రొఫెషనల్ గా చేశారు.`,
            `${bName} లో లేడీస్ బ్యూటీ సర్వీసెస్ చాలా బాగున్నాయి.`,
            `హెయిర్ కట్ మరియు స్టైలింగ్ చాలా పర్ఫెక్ట్ గా వచ్చింది.`,
            `కడపలో లేడీస్ కి నమ్మకమైన సెలూన్.`,
          ];
          middles = [
            `క్లీన్ టూల్స్ వాడారు మరియు హైజీన్ బాగా మెయింటైన్ చేశారు.`,
            `లేడీస్ కి అనుకూలమైన వాతావరణం మరియు మర్యాదపూర్వక స్టాఫ్.`,
            `మాకు కావాల్సిన స్టైల్ ని చాలా ఓపిగ్గా చేసి ఇచ్చారు.`,
          ];
        }
        break;
      }

      case "TOURS_TRAVELS": {
        if (intent.isSelfDrive) {
          starters = [
            `సెల్ఫ్ డ్రైవ్ కారు కండిషన్ చాలా బాగుంది.`,
            `${bName} లో సెల్ఫ్ డ్రైవ్ కార్ల సర్వీస్ చాలా నమ్మకంగా ఉంది.`,
            `కడపలో రీజనబుల్ ప్రైస్ కి మంచి సెల్ఫ్ డ్రైవ్ కారు ఇచ్చారు.`,
            `హ్యాండోవర్ ప్రాసెస్ చాలా ఫాస్ట్‌గా మరియు ఈజీగా జరిగింది.`,
          ];
          middles = [
            `ఏసీ కూలింగ్ మరియు టైర్ కండిషన్ పర్ఫెక్ట్‌గా ఉన్నాయి.`,
            `ఎలాంటి హిడెన్ ఛార్జీలు లేకుండా డిపాజిట్ వెంటనే ఇచ్చేశారు.`,
            `లాంగ్ జర్నీ లో ఎక్కడా ఎలాంటి ప్రాబ్లమ్ రాలేదు.`,
            `ఫాస్ట్‌ట్యాగ్ తో కార్ ఇవ్వడం వల్ల టోల్ గేట్స్ దగ్గర టైమ్ సేవ్ అయ్యింది.`,
          ];
        } else {
          starters = [
            `క్యాబ్ సమయానికి వచ్చి సేఫ్ గా డ్రాప్ చేశారు.`,
            `${bName} లో డ్రైవర్ చాలా మర్యాదగా మరియు జాగ్రత్తగా డ్రైవ్ చేశారు.`,
            `అవుట్‌స్టేషన్ ప్రయాణానికి క్లీన్ ఏసీ క్యాబ్ పంపించారు.`,
            `కడపలో నమ్మకమైన ట్రావెల్స్ మరియు క్యాబ్ సర్వీస్.`,
          ];
          middles = [
            `హైవే లో చాలా సురక్షితంగా మరియు హాయిగా డ్రైవ్ చేశారు.`,
            `చెప్పిన రేటు ప్రకారమే తీసుకున్నారు, ఎక్స్‌ట్రా ఏమీ అడగలేదు.`,
            `కారు ఇంటీరియర్ చాలా పరిశుభ్రంగా ఉంది.`,
            `ఫ్యామిలీ తో ప్రయాణం చాలా సంతోషంగా సాగింది.`,
          ];
        }
        break;
      }

      case "TATTOO_STUDIO": {
        if (intent.isPiercing) {
          starters = [
            `పియర్సింగ్ చాలా సేఫ్ గా మరియు సున్నితంగా చేశారు.`,
            `${bName} లో ఇయర్ మరియు నోస్ పియర్సింగ్ చాలా నీట్ గా అయ్యింది.`,
            `కడపలో హైజీనిక్ పియర్సింగ్ కి బెస్ట్ ప్లేస్.`,
          ];
          middles = [
            `డిస్పోజబుల్ నీడిల్స్ వాడారు, ఎలాంటి నొప్పి లేకుండా చేశారు.`,
            `స్టూడియో చాలా పరిశుభ్రంగా ఉంది, హీలింగ్ కేర్ టిప్స్ చెప్పారు.`,
            `ఎలాంటి ఇన్ఫెక్షన్ లేకుండా చాలా త్వరగా నయమైంది.`,
          ];
        } else {
          starters = [
            `టాటూ వర్క్ ఫినిషింగ్ చాలా neat గా వచ్చింది.`,
            `కస్టమ్ టాటూ డిజైన్ చాలా చక్కగా స్కిన్ మీద వేశారు.`,
            `${bName} లో ఆర్టిస్ట్ వర్క్ చాలా genuine గా ఉంది.`,
            `కడపలో బెస్ట్ టాటూ స్టూడియో.`,
          ];
          middles = [
            `లైన్ వర్క్ మరియు షేడింగ్ డీటెయిలింగ్ సూపర్బ్ గా ఉంది.`,
            `కంటి ముందే సీల్డ్ నీడిల్స్ ఓపెన్ చేసి వాడారు.`,
            `వైర్‌లెస్ మెషిన్ తో చాలా స్మూత్ గా వేశారు.`,
            `డిజైన్ కలర్స్ చాలా బ్రైట్ గా మరియు షార్ప్‌గా ఉన్నాయి.`,
          ];
        }
        break;
      }

      case "APPLIANCE_REPAIR": {
        if (intent.isJetWash) {
          starters = [
            `ఏసీ డీప్ జెట్ వాష్ చాలా ప్రొఫెషనల్ గా చేశారు.`,
            `${bName} లో ఏసీ సర్వీసింగ్ చేయించాము, రిజల్ట్ సూపర్బ్.`,
            `కడపలో బెస్ట్ ఏసీ జెట్ సర్వీస్.`,
          ];
          middles = [
            `జాకెట్ కవర్ వేసి గోడలకి మరకలు పడకుండా నీట్‌గా చేశారు.`,
            `కాయిల్స్ లోని డస్ట్ అంతా క్లీన్ అయి ఐస్ కూలింగ్ వస్తోంది.`,
            `టెక్నీషియన్ చాలా జాగ్రత్తగా మొత్తం చెక్ చేసి చూపించారు.`,
          ];
        } else {
          starters = [
            `డోర్‌స్టెప్ అప్లయన్స్ రిపేర్ చాలా ఫాస్ట్ గా చేశారు.`,
            `${bName} లో సర్వీస్ మరియు రెస్పాన్స్ చాలా జెన్యూన్ గా ఉంది.`,
            `కడపలో బెస్ట్ ఏసీ & ఫ్రిజ్ టెక్నీషియన్.`,
          ];
          middles = [
            `సమయానికి వచ్చి సమస్యను వెంటనే పరిష్కరించారు.`,
            `ఒరిజినల్ స్పేర్ పార్ట్స్ వాడారు, ప్రైస్ రీజనబుల్.`,
            `గ్యాస్ ప్రెషర్ చెక్ చేసి సూపర్ కూలింగ్ సెట్ చేశారు.`,
          ];
        }
        break;
      }

      default:
        starters = [
          `సర్వీస్ ఫినిషింగ్ చాలా neat గా ఉంది.`,
          `మా ఆర్డర్ ని టైమ్‌కి రెడీ చేసి ఇచ్చారు.`,
          `${tag} క్వాలిటీ అనుకున్నదానికంటే బాగుంది.`,
          `స్టాఫ్ చాలా పద్ధతిగా మాట్లాడారు.`,
          `${bName} లో వర్క్ చాలా genuine గా చేశారు.`,
        ];
        middles = [
          `ప్రైస్ కూడా చాలా రీజనబుల్ గా అనిపించింది.`,
          `ఎక్కడా అనవసర ఆలస్యం చేయలేదు.`,
          `మా రిక్వైర్మెంట్‌కి సరిపోయే ఆప్షన్స్ చూపించారు.`,
        ];
        break;
    }

    const ends = [
      `Thank you team!`,
      `ఖచ్చితంగా మళ్ళీ వస్తాము.`,
      `Good experience overall.`,
      `Worth every rupee.`,
      `హైలీ రికమండెడ్!`,
      `చాలా సంతోషంగా ఉంది.`,
      `థాంక్యూ ${bName}!`,
    ];

    const s = pickRandom(starters);
    const m = pickRandom(middles);
    const e = pickRandom(ends);

    const form = (roundSeed + Math.floor(Math.random() * 4)) % 4;
    if (form === 0) return `${s} ${m} ${e}`;
    if (form === 1) return `${s} ${e}`;
    if (form === 2) return `${m} ${e}`;
    return `${s} ${m}`;
  }

  // English procedural
  let starters: string[];
  let middles: string[];

  switch (ind) {
    case "GOLD_BUYERS": {
      if (intent.isPledged) {
        starters = [
          `Smooth assistance to release pledged gold from the bank.`,
          `Got my bank gold loan cleared and balance payout settled promptly.`,
          `Very transparent and helpful with releasing pledged gold at ${bName}.`,
          `Hassle-free process to close my gold loan and receive immediate funds.`,
          `Safe and dependable pledged gold service at ${bName}.`,
        ];
        middles = [
          `They assisted throughout the bank formalities with total transparency.`,
          `The loan dues were cleared directly and balance was transferred within minutes.`,
          `Settled the transaction using live bullion rates with zero hidden deductions.`,
          `Staff was respectful, supportive, and handled everything confidentially.`,
        ];
      } else if (intent.isPurity) {
        starters = [
          `100% transparent testing for gold purity.`,
          `Computerized German XRF testing with complete precision.`,
          `Accurate karat measurement without melting or damaging ornaments.`,
          `Scientific and transparent purity check at ${bName}.`,
          `Prompt testing and clear digital reports.`,
        ];
        middles = [
          `Purity was checked right in front of me on their computerized German machine.`,
          `They showed the exact karat percentage without any melting loss.`,
          `The staff was patient, polite, and explained the digital readings clearly.`,
          `Complete peace of mind knowing the true purity of my ornaments.`,
        ];
      } else {
        starters = [
          `Instant bank transfer and fair live rate for ${tag}.`,
          `Accurate digital weighing and honest valuation at ${bName}.`,
          `Smooth and confidential process for ${tag}.`,
          `Highest market rate and polite coordination at ${bName}.`,
          `Quick 10-minute transaction for ${tag}.`,
        ];
        middles = [
          `Weighed right in front of me on a certified digital scale with zero wastage.`,
          `The valuation was 100% transparent with zero unfair deductions.`,
          `Payment was credited to my bank account via IMPS in less than 2 minutes.`,
          `The staff was patient, polite, and handled everything with complete confidentiality.`,
        ];
      }
      break;
    }

    case "PRINTING_GRAPHICS":
      starters = [
        `Cleanly executed ${tag} work.`,
        `Got my ${tag} done without any delays.`,
        `Appreciated the prompt turnaround for the ${tag}.`,
        `Solid material and accurate colors on the ${tag}.`,
        `Fair pricing and polite coordination at ${bName}.`,
      ];
      middles = [
        `The staff was patient and listened to the exact preferences.`,
        `The banner finishing is crisp with great attention to borders.`,
        `Print resolution came out sharp without any dullness in colors.`,
        `Pricing was transparent with zero unexpected extra charges.`,
      ];
      break;

    case "PHOTOGRAPHY_STUDIO":
      starters = [
        `Cleanly executed ${tag} work.`,
        `Got my ${tag} done without any delays.`,
        `Appreciated the prompt turnaround for the ${tag}.`,
        `High precision on the ${tag} presentation.`,
        `Delighted with how the ${tag} turned out.`,
      ];
      middles = [
        `The staff was patient and listened to the exact preferences.`,
        `The finishing is crisp with great attention to detail.`,
        `Photo clarity came out sharp without any dullness in colors.`,
        `Pricing was transparent with zero unexpected extra charges.`,
      ];
    case "SALON_BEAUTY": {
      if (intent.isBridal) {
        starters = [
          `Exceptional bridal makeup and styling experience.`,
          `Booked bridal makeover services at ${bName} for our wedding.`,
          `Flawless bridal transformation and saree draping at ${bName}.`,
          `Punctual, elegant, and picture-perfect bridal service.`,
        ];
        middles = [
          `The bridal team listened patiently and delivered an elegant, radiant look.`,
          `Hair styling, makeup, and saree draping were completely on point.`,
          `Used premium skin-friendly cosmetics with a flawless natural glow.`,
          `Everything was completed right on schedule without any rush.`,
        ];
      } else if (intent.isAcademy) {
        starters = [
          `Enrolled in the professional beautician course at ${bName} Academy.`,
          `Top-rated beauty and fashion designing academy for women in Kadapa.`,
          `Comprehensive hands-on training and skill development.`,
          `Learned professional salon and styling techniques at ${bName}.`,
        ];
        middles = [
          `The instructors are patient, experienced, and provide live practical training.`,
          `Covered everything from advanced hair styling to bridal makeovers systematically.`,
          `Supportive guidance and career mentorship throughout the course.`,
          `Great learning environment and practical exposure on real clients.`,
        ];
      } else if (intent.isSkinFacial || intent.isBodySpa) {
        starters = [
          `Deeply soothing body spa and facial experience.`,
          `Visited ${bName} for refreshing skincare and spa therapy.`,
          `Peaceful, hygienic, and relaxing ladies-only spa ambiance.`,
          `Gentle skincare treatment with visible post-treatment radiance.`,
        ];
        middles = [
          `The therapist maintained top hygiene and gentle technique throughout.`,
          `Soothing ambiance with complete privacy for women.`,
          `Skin feels rejuvenated, hydrated, and deeply revitalized.`,
          `Extremely relaxing session that melted away all daily fatigue.`,
        ];
      } else {
        starters = [
          `Cleanly executed ${tag} service in a ladies-only ambiance.`,
          `Got my ${tag} requirement done with great care at ${bName}.`,
          `Delighted with the styling and courteous service at ${bName}.`,
          `Polite ladies staff and sanitized equipment.`,
        ];
        middles = [
          `The stylist was patient, attentive, and understood the exact styling requested.`,
          `Maintained strict hygiene standards with clean, sanitized tools.`,
          `Welcoming atmosphere exclusively for women in Viswandhapuram, Kadapa.`,
          `Affordable pricing with genuine, courteous care.`,
        ];
      }
      break;
    }

    case "TOURS_TRAVELS": {
      if (intent.isSelfDrive) {
        starters = [
          `Seamless self drive car rental experience at ${bName}.`,
          `Got a well-maintained car with full documentation.`,
          `Very reasonable daily rate and quick vehicle handover.`,
          `Top-notch self drive service in Kadapa.`,
        ];
        middles = [
          `The car AC, engine pickup, and tires were in flawless condition.`,
          `FastTag was active and documentation took barely 5 minutes.`,
          `Security deposit was refunded promptly upon return without hassles.`,
          `Clean interior and reliable performance throughout our outstation trip.`,
        ];
      } else {
        starters = [
          `Punctual, safe, and dependable cab service from ${bName}.`,
          `Hired an outstation cab for our family trip with complete peace of mind.`,
          `Courteous driver and spotless AC cab provided on time.`,
          `Highly reliable travel agency in Kadapa.`,
        ];
        middles = [
          `The chauffeur drove very safely on the highways and ghat roads.`,
          `Pricing was totally transparent with zero unexpected demands.`,
          `Vehicle interior was sanitized, fragrant, and extremely comfortable.`,
          `On-time pickup and drop made our journey stress-free.`,
        ];
      }
      break;
    }

    case "TATTOO_STUDIO": {
      if (intent.isPiercing) {
        starters = [
          `Gentle, safe, and sterile piercing service at ${bName}.`,
          `Got ear and nose piercing done with virtually zero discomfort.`,
          `Highly hygienic piercing studio in Kadapa.`,
          `Clean and swift piercing with fresh disposable needles.`,
        ];
        middles = [
          `The piercer opened disposable single-use needles right in front of me.`,
          `They sanitized the area thoroughly and guided my breathing calmly.`,
          `Healed quickly without swelling or infection thanks to their aftercare advice.`,
          `Very gentle technique and spotless studio cleanliness.`,
        ];
      } else {
        starters = [
          `Flawlessly executed custom tattoo artwork at ${bName}.`,
          `Got inked with top precision and hospital-grade hygiene.`,
          `Karthik delivered incredible tattoo detailing at ${bName}.`,
          `Crisp line work and smooth shading on my tattoo.`,
          `Best professional tattoo studio in Kadapa.`,
        ];
        middles = [
          `The artist opened fresh sealed needles in front of me with zero shortcuts.`,
          `The linework is laser-sharp and the shading has great contrast and depth.`,
          `Modern wireless tattoo machine made the session remarkably comfortable.`,
          `Clear day-by-day healing instructions ensured perfect recovery.`,
        ];
      }
      break;
    }

    case "APPLIANCE_REPAIR": {
      if (intent.isJetWash) {
        starters = [
          `Professional AC deep jet wash service at ${bName}.`,
          `Got AC foam and jet cleaning done with zero indoor mess.`,
          `Ice-cold cooling restored after jet servicing by ${bName}.`,
          `Clean and swift AC maintenance at our home in Kadapa.`,
        ];
        middles = [
          `The technician fitted waterproof jackets to protect walls and furniture.`,
          `All muck and grime were flushed out under high pressure, restoring strong airflow.`,
          `The unit cools rapidly now and runs smoothly with zero odor.`,
          `Courteous technicians who cleaned up thoroughly before leaving.`,
        ];
      } else {
        starters = [
          `Prompt and dependable doorstep appliance repair at ${bName}.`,
          `Fast AC and refrigerator repair visit in Kadapa.`,
          `Accurate cooling troubleshooting and honest service by ${bName}.`,
          `Genuine replacement parts and fair repair rates.`,
          `Top #1 appliance repair team in Kadapa.`,
        ];
        middles = [
          `The technician diagnosed the exact issue without inflated estimates.`,
          `They carried genuine spares and tested temperature and gas levels properly.`,
          `Arrived within an hour of our service call and resolved it on the spot.`,
          `Very polite conduct and transparent billing throughout.`,
        ];
      }
      break;
    }

    default:
      starters = [
        `Cleanly executed ${tag} service.`,
        `Got my ${tag} requirement addressed without delays.`,
        `Appreciated the prompt turnaround for the ${tag}.`,
        `Fair pricing and polite coordination at ${bName}.`,
        `Very smooth transaction for the ${tag}.`,
      ];
      middles = [
        `The staff was patient and listened to the exact preferences.`,
        `Workmanship is dependable and looks very professional.`,
        `Pricing was transparent with zero unexpected extra charges.`,
        `Turnaround was prompt and communication was spot on.`,
      ];
      break;
  }

  const ends = [
    `Satisfied with the service.`,
    `Will certainly come back for future needs.`,
    `A trustworthy place for this kind of work.`,
    `Glad I chose them.`,
    `Dependable team all around.`,
    `Much appreciated!`,
    `Great local business to support.`,
    `No complaints whatsoever.`,
  ];

  const s = pickRandom(starters);
  const m = pickRandom(middles);
  const e = pickRandom(ends);

  const form = (roundSeed + Math.floor(Math.random() * 4)) % 4;
  if (form === 0) return `${s} ${m} ${e}`;
  if (form === 1) return `${s} ${e}`;
  if (form === 2) return `${m} ${e}`;
  return `${s} ${m}`;
}

// ─── MASTER ZERO-REPETITION & ZERO-POLLUTION SYNTHESIZER ────────────────────

export function synthesizeUniqueReviews(params: SynthesizerParams): SynthesizedReview[] {
  const {
    businessName,
    category = "Local Business",
    tagline = "",
    location = "",
    keywords = "",
    tagChips = "",
    selectedTags = [],
    customNote = "",
    languageMode = "AUTO",
    history = [],
  } = params;

  // 1. Detect deterministic industry & domain fence
  const industry = detectIndustry(businessName, category, tagline || "");

  // Active tags: prioritize customer selected tags, then business tagChips, then domain items
  let activeTags = selectedTags.length > 0 ? selectedTags : [];
  if (activeTags.length === 0 && tagChips) {
    activeTags = tagChips.split(",").map((t) => t.trim()).filter(Boolean);
  }
  if (activeTags.length === 0) {
    activeTags = industry.tags.slice(0, 3);
  }

  const profileContext = `${tagChips} ${keywords} ${category} ${tagline}`;
  const lexicon = getDomainLexicon(industry.type, activeTags, profileContext);

  // 2. Business profile for domain validation
  const profile: BusinessProfile = {
    name: businessName,
    category: category || industry.label,
    tagline,
    location,
    keywords,
    tagChips,
    selectedTags: activeTags,
    customNote,
  };

  // 3. Location & language context
  const detectedCity = extractBusinessLocation(profile);
  const combinedContext = (
    businessName + " " + category + " " + (tagline || "") + " " + (location || "")
  ).toLowerCase();

  const isTeluguContext =
    languageMode === "TELUGU_SCRIPT" ||
    languageMode === "TELUGU_ROMAN" ||
    languageMode === "TELUGU_ENGLISH" ||
    combinedContext.includes("kadapa") ||
    combinedContext.includes("andhra") ||
    combinedContext.includes("telangana") ||
    combinedContext.includes("hyderabad") ||
    combinedContext.includes("tirupati") ||
    combinedContext.includes("vijayawada") ||
    Boolean(detectedCity);

  const acceptedReviews: SynthesizedReview[] = [];
  const acceptedTexts: string[] = [];

  interface StyleDefinition {
    structure: string;
    style: string;
    lang: string;
    generator: () => string;
  }

  // 21 distinct style definitions - ALL DOMAIN PARAMETERIZED
  const allStyles: StyleDefinition[] = [
    {
      structure: "STRUCTURE_F",
      style: "short_human",
      lang: "ENGLISH",
      generator: () => generateShortDirect(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_B",
      style: "product_quality",
      lang: "ENGLISH",
      generator: () => generateProductQuality(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_C",
      style: "problem_solution",
      lang: "ENGLISH",
      generator: () => generateProblemSolution(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_A",
      style: "conversational_flow",
      lang: "ENGLISH",
      generator: () => generateConversationalFlow(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_D",
      style: "calm_personal",
      lang: "ENGLISH",
      generator: () => generateCalmPersonal(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_E",
      style: "occasion_context",
      lang: "ENGLISH",
      generator: () => generateOccasionContext(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_G",
      style: "detailed_helpful",
      lang: "ENGLISH",
      generator: () => generateDetailedReview(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_LOCAL",
      style: "casual_local",
      lang: "ENGLISH",
      generator: () => generateCasualLocal(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_MINIMAL",
      style: "minimalist_punchy",
      lang: "ENGLISH",
      generator: () => generateMinimalist(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_ENTHUSIASTIC",
      style: "delighted",
      lang: "ENGLISH",
      generator: () => generateEnthusiastic(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_FIRST_TIME",
      style: "first_time_visitor",
      lang: "ENGLISH",
      generator: () => generateFirstTime(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_REPEAT",
      style: "repeat_customer",
      lang: "ENGLISH",
      generator: () => generateRepeatCustomer(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_RELIEF",
      style: "question_relief",
      lang: "ENGLISH",
      generator: () => generateRelief(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_FAMILY",
      style: "family_context",
      lang: "ENGLISH",
      generator: () => generateFamilyContext(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_STAFF_SERVICE",
      style: "staff_service",
      lang: "ENGLISH",
      generator: () => generateStaffService(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_VALUE",
      style: "value_pricing",
      lang: "ENGLISH",
      generator: () => generateValuePricing(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_TELUGU_CONVERSATIONAL",
      style: "telugu_conversational",
      lang: "TELUGU_SCRIPT",
      generator: () => generateTeluguConversational(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_TELUGU_CRAFT",
      style: "telugu_craftsmanship",
      lang: "TELUGU_SCRIPT",
      generator: () => generateTeluguCraftsmanship(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_TELUGU_PUNCHY",
      style: "telugu_punchy",
      lang: "TELUGU_SCRIPT",
      generator: () => generateTeluguPunchy(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_TELUGU_OCCASION",
      style: "telugu_occasion",
      lang: "TELUGU_SCRIPT",
      generator: () => generateTeluguOccasion(businessName, activeTags, customNote, lexicon, industry.type),
    },
    {
      structure: "STRUCTURE_TELUGU_ROMAN",
      style: "telugu_roman",
      lang: "TELUGU_ROMAN",
      generator: () => generateTeluguRoman(businessName, activeTags, customNote, lexicon, industry.type),
    },
  ];

  // Filter based on explicit languageMode:
  let eligibleStyles = allStyles;
  if (languageMode === "TELUGU_SCRIPT") {
    eligibleStyles = allStyles.filter((s) => s.lang === "TELUGU_SCRIPT");
  } else if (languageMode === "TELUGU_ROMAN" || languageMode === "TELUGU_ENGLISH") {
    eligibleStyles = allStyles.filter((s) => s.lang === "TELUGU_ROMAN");
  } else if (languageMode === "ENGLISH") {
    eligibleStyles = allStyles.filter((s) => s.lang === "ENGLISH");
  } else if (!isTeluguContext) {
    eligibleStyles = allStyles.filter((s) => s.lang === "ENGLISH");
  }

  // Shuffle styles
  const shuffledStyles = [...eligibleStyles].sort(() => 0.5 - Math.random());

  let styleIndex = 0;
  let attempts = 0;
  const maxAttempts = 100;

  while (acceptedReviews.length < 3 && attempts < maxAttempts) {
    attempts++;
    const slot = shuffledStyles[styleIndex % shuffledStyles.length];
    styleIndex++;

    const candidateText = slot.generator().trim();

    // 1. Uniqueness check (zero duplicate, zero sibling collision, zero cliché)
    const uniqueness = validateReviewUniqueness(candidateText, history, acceptedTexts, businessName);
    if (!uniqueness.valid) continue;

    // 2. DOMAIN FENCE CHECK (Zero cross-business pollution)
    const relevance = validateBusinessRelevance(candidateText, profile, industry.type);
    if (!relevance.valid) continue;

    // Passed both checks!
    acceptedTexts.push(candidateText);
    acceptedReviews.push({
      id: acceptedReviews.length + 1,
      headline: buildDynamicHeadline(candidateText, slot.lang, industry.type),
      text: candidateText,
      tone: slot.style,
      structureTag: slot.structure,
      writingStyle: slot.style,
      languageMix: slot.lang,
    });
  }

  // High-entropy fallback safeguard if historical memory is dense:
  let fallbackSeed = 0;
  while (acceptedReviews.length < 3 && fallbackSeed < 60) {
    fallbackSeed++;
    const tag = activeTags[fallbackSeed % activeTags.length] || "service";
    const wantsTelugu = languageMode === "TELUGU_SCRIPT" || (isTeluguContext && acceptedReviews.length === 2);
    const proceduralText = generateProceduralFallback(
      businessName,
      tag,
      lexicon,
      industry.type,
      fallbackSeed + Date.now(),
      wantsTelugu
    );

    const val = validateReviewUniqueness(proceduralText, history, acceptedTexts, businessName);
    if (val.valid) {
      const rel = validateBusinessRelevance(proceduralText, profile, industry.type);
      if (rel.valid) {
        const lang = wantsTelugu ? "TELUGU_SCRIPT" : "ENGLISH";
        acceptedTexts.push(proceduralText);
        acceptedReviews.push({
          id: acceptedReviews.length + 1,
          headline: buildDynamicHeadline(proceduralText, lang, industry.type),
          text: proceduralText,
          tone: "Natural & Direct",
          structureTag: "STRUCTURE_PROCEDURAL",
          writingStyle: "conversational",
          languageMix: lang,
        });
      }
    }
  }

  return acceptedReviews;
}
