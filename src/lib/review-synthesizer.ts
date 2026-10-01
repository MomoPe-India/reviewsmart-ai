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

export function getDomainLexicon(industryType: IndustryType): DomainLexicon {
  return DOMAIN_LEXICONS[industryType] || DOMAIN_LEXICONS.GENERAL;
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
  const item = tags[0] || pickRandom(lex.items);
  const openers = [
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
  const closers = [
    `Output was crisp.`,
    `Delivered as promised.`,
    `Totally satisfied.`,
    `Thank you team!`,
    `Will visit again.`,
    `Worth every penny.`,
    `No delays at all.`,
    `Definitely coming back.`,
  ];
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
  const item = tags[0] || pickRandom(lex.items);
  const quality = pickRandom(lex.qualities);
  const adj = pickRandom(lex.adjectives);
  const openers = [
    `The ${quality} on the ${item} is ${adj}.`,
    `Took their service for ${item} and the result is ${adj}.`,
    `Noticeable attention to ${quality} here.`,
    `Chose ${bName} specifically for ${item}.`,
    `Checked out their ${item} work recently.`,
  ];
  const middles = [
    `Everything was done cleanly without cutting any corners.`,
    `The detailing and execution are very well maintained.`,
    `You can clearly tell they value professional standards.`,
    `Output matched exactly what was discussed before confirming.`,
    `Turnaround was swift and communication was clear.`,
  ];
  const closers = [
    `Reliable service and execution.`,
    `Happy with the final outcome.`,
    `Quality speaks for itself.`,
    `Great value for the price charged.`,
    `A solid place to get ${item} done.`,
  ];
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
  const item = tags[0] || pickRandom(lex.items);
  const occasion = pickRandom(lex.occasions);
  const action = pickRandom(lex.actions);

  const problem = pickRandom([
    `Was searching for a trustworthy place for ${item} ${occasion}.`,
    `Needed ${item} on relatively short notice.`,
    `Was looking for someone who could handle ${item} with proper care and honesty.`,
    `Had a specific requirement for ${item} and walked in here.`,
    `Needed reliable assistance to finalize our ${item}.`,
  ]);

  let solution = "";
  let result = "";

  switch (ind) {
    case "GOLD_BUYERS":
      solution = pickRandom([
        `The team at ${bName} tested purity right in front of me on their computerized German XRF machine without melting or damage.`,
        `Staff walked me through the live market bullion rate clearly and weighed everything transparently on a digital scale.`,
        `They handled the entire verification and paperwork with genuine care, confidentiality, and zero hidden deductions.`,
      ]);
      result = pickRandom([
        `Transaction was completed in 10 minutes with instant bank transfer credited right away.`,
        `Received the full fair payout with complete peace of mind.`,
        `Very satisfied with the quick turnaround and transparent outcome.`,
      ]);
      break;

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
      solution = pickRandom([
        `The stylist listened patiently to the exact cut and styling preferences before starting.`,
        `They used sanitized tools, clean towels, and gave genuine grooming suggestions without rushing.`,
        `The haircut and grooming were carried out with great skill and attention to detail.`,
      ]);
      result = pickRandom([
        `The final look turned out sharp, clean, and exactly what I wanted.`,
        `Walked out feeling refreshed and confident with the haircut.`,
        `Top notch styling, highly satisfied with the experience.`,
      ]);
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
  const item = tags[0] || pickRandom(lex.items);
  const occasion = pickRandom(lex.occasions);
  const openers = [
    `Got ${item} done ${occasion}.`,
    `Approached ${bName} ${occasion} for ${item}.`,
    `Needed reliable ${item} ${occasion}.`,
  ];
  const middles = [
    `Everything was ready on time and executed with high standards.`,
    `The coordination and finish made the experience completely hassle-free.`,
    `Quality and service came out top notch as promised.`,
  ];
  const closers = [
    `Truly grateful for the prompt assistance.`,
    `Made the entire experience so much smoother!`,
    `Will surely rely on them again.`,
    `Much appreciated!`,
  ];
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
  const item1 = tags[0] || pickRandom(lex.items);
  const remaining = lex.items.filter((i) => i.toLowerCase() !== item1.toLowerCase());
  const item2 = tags[1] && tags[1].toLowerCase() !== item1.toLowerCase() ? tags[1] : pickRandom(remaining.length > 0 ? remaining : lex.items);

  let opener = `Coordinated with ${bName} for ${item1}.`;
  let middle = `Communication was clear from the start and they didn't try to rush any stage of the work.`;

  switch (ind) {
    case "GOLD_BUYERS":
      opener = pickRandom([
        `Visited ${bName} specifically for ${item1} and valuation.`,
        `Coordinated with ${bName} to handle our ${item1}.`,
        `Needed a transparent and reliable service for ${item1} and stopped by here.`,
      ]);
      middle = pickRandom([
        `First, the team patiently tested purity on their German XRF machine. Second, bank payment was immediate.`,
        `The accuracy of digital weighing and fair live market rate on ${item2} exceeded expectations.`,
        `Charges and live bullion rates were explained clearly upfront with zero hidden deductions.`,
      ]);
      break;

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
  const item = tags[0] || pickRandom(lex.items);
  const fragments = [
    `Super neat ${item}. Fair price, on-time service.`,
    `Clean work on ${item}. Polite staff. Happy with the result.`,
    `Fast service. Crisp output. Dependable team at ${bName}.`,
    `Great quality ${item}. No delays. 10/10 experience.`,
    `Good outcome on the ${item}. Worth the money.`,
  ];
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
  const item = tags[0] || pickRandom(lex.items);
  const openers = [
    `Was initially wondering about the turnaround on the ${item}.`,
    `Was slightly skeptical whether they could deliver ${item} on time.`,
    `Had high expectations for this ${item} requirement.`,
  ];
  const middles = [
    `Thankfully, the team at ${bName} proved my doubts completely wrong.`,
    `When I inspected the final outcome, the quality was spotless.`,
    `They actually delivered right on schedule with zero compromises.`,
  ];
  const closers = [
    `Relieved and very satisfied!`,
    `Exceeded expectations in the best way possible.`,
    `Great work by the team.`,
  ];
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
  const item = tags[0] || pickRandom(lex.items);
  const occasion = pickRandom(lex.occasions);

  let opener = `Needed ${item} for our family ${occasion}.`;
  let middle = `Everyone was genuinely pleased with the polite coordination and solid outcome.`;

  if (ind === "GOLD_BUYERS") {
    opener = `Approached ${bName} to release pledged gold and sell old family ornaments.`;
    middle = `The staff was respectful, confidential, and completed the digital weighing right before our eyes.`;
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
  const item = tags[0] || pickRandom(lex.items);

  let opener = `మా requirement ని అర్థం చేసుకుని ${item} చాలా neat గా చేశారు.`;
  let middle = `స్టాఫ్ చాలా ఓపికగా వివరాలు చెప్పారు, ఎక్కడా కంగారు పెట్టలేదు.`;
  let closer = `Thank you ${bName}! మంచి సర్వీస్ ఇచ్చే షాప్.`;

  switch (ind) {
    case "GOLD_BUYERS":
      opener = pickRandom([
        `పాత బంగారం అమ్మడానికి ${bName} కి వెళ్ళాము, చాలా మంచి అనుభవం.`,
        `బ్యాంకులో తాకట్టు పెట్టిన బంగారం విడిపించడానికి ${bName} ని సంప్రదించాము.`,
        `గోల్డ్ వాల్యుయేషన్ మరియు సెల్లింగ్ ప్రాసెస్ ${bName} లో చాలా ఫాస్ట్‌గా జరిగింది.`,
        `${bName} లో సర్వీస్ మరియు స్టాఫ్ రెస్పాన్స్ చాలా జెన్యూన్ గా ఉంది.`,
      ]);
      middle = pickRandom([
        `కంప్యూటరైజ్డ్ జర్మన్ మెషిన్ లో ప్యూరిటీ చెక్ చేసి ట్రాన్స్‌పరెంట్ గా రేట్ ఇచ్చారు.`,
        `లైవ్ మార్కెట్ రేటు ప్రకారం కరెక్ట్ గా క్యాలిక్యులేట్ చేసి స్పాట్ లో పేమెంట్ చేశారు.`,
        `డిజిటల్ వెయింగ్ లో ఎక్కడా తేడా లేకుండా కరెక్ట్ గా తూకం వేశారు.`,
      ]);
      closer = pickRandom([
        `బంగారం అమ్మడానికి కడపలో బెస్ట్ మరియు నమ్మకమైన గోల్డ్ బయర్స్!`,
        `100% సేఫ్ మరియు ట్రాన్స్‌పరెంట్ సర్వీస్, థాంక్యూ ${bName}!`,
        `కడపలో బెస్ట్ సర్వీస్ ఇచ్చే షాప్.`,
      ]);
      break;

    case "PRINTING_GRAPHICS":
      opener = pickRandom([
        `మా షాప్ ఓపెనింగ్ కోసం flex banner మరియు sign board ${bName} లో చేయించాము.`,
        `బిజినెస్ ప్రమోషన్ కోసం విజిటింగ్ కార్డ్స్ మరియు బ్రోచర్స్ ఆర్డర్ ఇచ్చాము.`,
        `${bName} లో ఫ్లెక్స్ ప్రింటింగ్ మరియు సైనేజ్ సర్వీస్ చాలా బాగుంది.`,
      ]);
      middle = pickRandom([
        `స్టాఫ్ చాలా ఓపికగా డిజైన్ ఆప్షన్స్ చూపించారు, ఎక్కడా కంగారు పెట్టలేదు.`,
        `టైమ్‌కి రెడీ చేసి ఇచ్చారు, ప్రింట్ క్వాలిటీ లో ఎక్కడా రాజీ పడలేదు.`,
        `కలర్ ప్రింటింగ్ మరియు బోర్డర్ అలైన్‌మెంట్ చాలా సాలిడ్‌గా వచ్చాయి.`,
      ]);
      closer = pickRandom([
        `ఫ్లెక్స్ ప్రింటింగ్ మరియు సైన్ బోర్డ్స్ కి కడపలో బెస్ట్ షాప్.`,
        `థాంక్యూ ${bName}, క్వాలిటీ ప్రింటింగ్ కి బెస్ట్ ప్లేస్!`,
        `మంచి షాప్, definitely recommend!`,
      ]);
      break;

    case "PHOTOGRAPHY_STUDIO":
      opener = pickRandom([
        `మా ఫ్యామిలీ ఫంక్షన్ కోసం ఫోటో ఫ్రేమ్ మరియు ప్రింట్స్ ${bName} లో చేయించాము.`,
        `${bName} లో ఫోటోగ్రఫీ మరియు కస్టమైజ్డ్ గిఫ్ట్స్ సర్వీస్ చాలా బాగుంది.`,
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
      break;

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
  const item = tags[0] || pickRandom(lex.items);

  let opener = `${item} వర్క్ చాలా neat గా చేశారు, క్వాలిటీ నంబర్ వన్.`;
  let middle = `మంచి మన్నికైన మెటీరియల్ వాడారు, వర్క్ చాలా జెన్యూన్.`;
  let closer = `వర్త్ ఎవ్రీ రూపీ! హైలీ శాటిస్‌ఫైడ్ విత్ ది సర్వీస్.`;

  switch (ind) {
    case "GOLD_BUYERS":
      opener = pickRandom([
        `${item} టెస్టింగ్ మరియు వెయింగ్ లో 100% ట్రాన్స్‌పరెన్సీ చూపించారు.`,
        `${bName} లో గోల్డ్ వాల్యుయేషన్ మరియు లైవ్ మార్కెట్ రేటు చాలా జెన్యూన్ గా ఇచ్చారు.`,
        `ప్యూరిటీ టెస్టింగ్ విధానం చాలా పర్ఫెక్ట్‌గా మరియు శాస్త్రీయంగా ఉంది.`,
      ]);
      middle = pickRandom([
        `కంటి ముందే డిజిటల్ స్కేల్ మీద బరువు తూచారు, వేస్టేజ్ ఏమీ కట్ చేయలేదు.`,
        `కంప్యూటర్ టెస్టింగ్ తో బంగారం ప్యూరిటీ కరెక్ట్ గా నిర్ధారించారు.`,
        `లైవ్ గోల్డ్ రేట్ ఇచ్చి వెంటనే బ్యాంక్ ట్రాన్స్‌ఫర్ చేశారు.`,
      ]);
      closer = pickRandom([
        `కడపలో బెస్ట్ మరియు జెన్యూన్ గోల్డ్ బయర్స్! వర్త్ ఎవ్రీ రూపీ.`,
        `100% నిజాయితీ గల సర్వీస్, థాంక్యూ ${bName}!`,
        `బంగారం అమ్మడానికి అత్యంత నమ్మకమైన షాప్.`,
      ]);
      break;

    case "PRINTING_GRAPHICS":
      opener = pickRandom([
        `${item} క్వాలిటీ మరియు ప్రింట్ ఫినిషింగ్ super rich గా వచ్చింది.`,
        `ఫ్లెక్స్ బోర్డ్స్ మరియు విజిటింగ్ కార్డ్స్ చాలా neat గా చేశారు.`,
        `వర్క్ చాలా clean గా చేశారు, ప్రింటింగ్ క్వాలిటీ నంబర్ వన్.`,
      ]);
      middle = pickRandom([
        `కలర్స్ చాలా షార్ప్‌గా వచ్చాయి, మెటీరియల్ మన్నిక చాలా సాలిడ్‌గా ఉంది.`,
        `ఎండకి ఏమాత్రం రంగు తగ్గకుండా మంచి వాటర్ ప్రూఫ్ మెటీరియల్ వాడారు.`,
        `డిజైనింగ్ మరియు కటింగ్ చాలా క్లీన్‌గా ఉన్నాయి.`,
      ]);
      closer = pickRandom([
        `క్వాలిటీ ప్రింటింగ్ కోరుకునేవారికి ది బెస్ట్ ఛాయిస్!`,
        `కడపలో బెస్ట్ ప్రింటింగ్ షాప్, థాంక్యూ ${bName}!`,
        `వర్త్ ఎవ్రీ రూపీ, సూపర్ వర్క్!`,
      ]);
      break;

    case "PHOTOGRAPHY_STUDIO":
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
      break;

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

    case "SALON_BEAUTY":
      opener = pickRandom([
        `${item} ఫినిషింగ్ చాలా ప్రొఫెషనల్ గా వచ్చింది.`,
        `${bName} లో హెయిర్ స్టైలింగ్ మరియు గ్రూమింగ్ క్వాలిటీ అద్భుతం.`,
      ]);
      middle = pickRandom([
        `క్లీన్ టూల్స్ వాడారు మరియు హైజీన్ బాగా మెయింటైన్ చేశారు.`,
        `స్టైలిస్ట్ చాలా శ్రద్ధగా కట్ చేశారు, హెయిర్‌లైన్ చాలా షార్ప్‌గా వచ్చింది.`,
      ]);
      closer = pickRandom([
        `స్టైలింగ్ లో బెస్ట్, ఫుల్లీ శాటిస్‌ఫైడ్!`,
        `కడపలో బెస్ట్ సెలూన్ ఎక్స్‌పీరియన్స్!`,
      ]);
      break;

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
  const item = tags[0] || pickRandom(lex.items);

  let chosen = `మంచి క్వాలిటీ మరియు టైమ్‌కి సర్వీస్ ఇచ్చారు. ప్రైస్ కూడా రీజనబుల్. ${item} చాలా నీట్‌గా చేశారు.`;

  if (ind === "GOLD_BUYERS") {
    chosen = pickRandom([
      `కంప్యూటర్ టెస్టింగ్ మరియు లైవ్ రేట్ ఇచ్చారు. ప్రాసెస్ చాలా ఫాస్ట్.`,
      `${item} చాలా జెన్యూన్‌గా చేశారు. స్టాఫ్ రెస్పాన్స్ బాగుంది, థాంక్యూ ${bName}!`,
      `చక్కటి సర్వీస్. స్పాట్ లో బ్యాంక్ ట్రాన్స్‌ఫర్ చేశారు. వర్త్ ఇట్!`,
      `క్లీన్ వర్క్ మరియు నమ్మకమైన డీలింగ్స్. 10 నిమిషాల్లో కంప్లీట్ అయ్యింది.`,
      `మంచి రెస్పాన్స్, జెన్యూన్ గోల్డ్ రేట్. డెఫినెట్‌గా మళ్ళీ వస్తాము.`,
    ]);
  } else if (ind === "PRINTING_GRAPHICS") {
    chosen = pickRandom([
      `మంచి క్వాలిటీ ప్రింటింగ్ మరియు టైమ్‌కి డెలివరీ ఇచ్చారు. ప్రైస్ కూడా రీజనబుల్.`,
      `${item} చాలా నీట్‌గా చేశారు. స్టాఫ్ రెస్పాన్స్ బాగుంది, థాంక్యూ ${bName}!`,
      `చక్కటి సర్వీస్. ప్రింట్ అవుట్‌పుట్ చాలా బాగా వచ్చింది. వర్త్ ఇట్!`,
      `క్లీన్ వర్క్ మరియు ఫాస్ట్ డెలివరీ. బ్యానర్ కలర్స్ సూపర్.`,
      `మంచి రెస్పాన్స్, ప్రాంప్ట్ వర్క్. డెఫినెట్‌గా మళ్ళీ వస్తాము.`,
    ]);
  } else if (ind === "PHOTOGRAPHY_STUDIO") {
    chosen = pickRandom([
      `మంచి క్వాలిటీ మరియు టైమ్‌కి డెలివరీ ఇచ్చారు. ప్రైస్ రీజనబుల్.`,
      `${item} చాలా నీట్‌గా చేశారు. స్టాఫ్ రెస్పాన్స్ బాగుంది, థాంక్యూ ${bName}!`,
      `చక్కటి సర్వీస్. అవుట్‌పుట్ చాలా బాగా వచ్చింది. వర్త్ ఇట్!`,
      `క్లీన్ వర్క్ మరియు ఫాస్ట్ డెలివరీ. ఫ్యామిలీ అందరికీ బాగా నచ్చింది.`,
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
  const item = tags[0] || pickRandom(lex.items);

  let opener = `Chala baga chesaru, ${item} work aithe super neat ga vachindi.`;
  let middle = `Staff chala patient ga requirements vinnaaru, no unnecessary delays.`;
  let closer = `Thanks to ${bName} team, will visit again for sure!`;

  switch (ind) {
    case "GOLD_BUYERS":
      opener = pickRandom([
        `Old gold sell cheyadaniki ${bName} visit ayyamu, pure transparent testing chesaru.`,
        `Bank lo unna pledged gold release cheyinchamu, instant ga account lo money transfer ayyindi.`,
        `Kadapa lo best gold buyers, accurate weighing and live market bullion rate icharu.`,
        `${bName} lo work chala clean ga chesaru, staff kuda friendly ga unaru.`,
      ]);
      middle = pickRandom([
        `German machine lo purity test chesi clear ga explain chesaru.`,
        `Spot payment direct ga bank transfer chesaru without any delay.`,
        `Live market bullion rate icharu, no unnecessary deductions.`,
      ]);
      closer = pickRandom([
        `Kadapa lo best place to sell old gold and release pledged gold!`,
        `Thanks to ${bName} team. Worth it, satisfied customer!`,
        `Super service and genuine valuation!`,
      ]);
      break;

    case "PRINTING_GRAPHICS":
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
      break;

    case "PHOTOGRAPHY_STUDIO":
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
      break;

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

    case "SALON_BEAUTY":
      opener = pickRandom([
        `${bName} lo haircut and grooming cheyinchukunnanu.`,
        `Monthly styling kosam ${bName} salon ki vellanu, great ambiance.`,
        `${item} kosam visit ayyanu, very neat and professional setup.`,
      ]);
      middle = pickRandom([
        `Stylist chala patient ga unaru, clean and hygienic tools use chesaru.`,
        `Scissor work and styling finish chala sharp ga vachindi.`,
        `Unrushed and relaxing experience, polite staff.`,
      ]);
      closer = pickRandom([
        `Super neat haircut, highly satisfied!`,
        `Best salon in the area, will visit again!`,
        `10/10 grooming experience!`,
      ]);
      break;

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
  const item = tags[0] || pickRandom(lex.items);

  let opener = `మా రిక్వైర్మెంట్ కోసం ${bName} ని సంప్రదించాము.`;
  let middle = `సకాలంలో వర్క్ పూర్తి చేసి ఇచ్చారు, చాలా హ్యాపీగా ఉంది.`;
  let closer = `థాంక్యూ ${bName}!`;

  switch (ind) {
    case "GOLD_BUYERS":
      opener = pickRandom([
        `అర్జెంట్ ఫైనాన్షియల్ అవసరం కోసం పాత బంగారం అమ్మడానికి ${bName} కి వెళ్ళాము.`,
        `బ్యాంక్ గోల్డ్ లోన్ క్లోజ్ చేసి ప్లెడ్జ్డ్ గోల్డ్ రిలీజ్ చేసుకోవడానికి ${bName} టీమ్ సహాయం తీసుకున్నాము.`,
        `పాత గోల్డ్ ఆర్నమెంట్స్ సేల్ చేయడానికి ${bName} కి వెళ్ళాము, ప్రాసెస్ చాలా స్పీడ్‌గా జరిగింది.`,
      ]);
      middle = pickRandom([
        `10 నిమిషాల్లో ప్యూరిటీ చెక్ పూర్తి చేసి లైవ్ బులియన్ రేటు ప్రకారం అమౌంట్ సెటిల్ చేశారు.`,
        `కంప్యూటరైజ్డ్ జర్మన్ మెషిన్ లో ప్యూరిటీ చెక్ చేసి ఎక్కడా వేస్టేజ్ లేకుండా రేట్ ఇచ్చారు.`,
        `డిజిటల్ స్కేల్ మీద మా కంటి ముందే తూకం వేసి స్పాట్ లో బ్యాంక్ ట్రాన్స్‌ఫర్ చేశారు.`,
      ]);
      closer = pickRandom([
        `కడపలో తాకట్టు బంగారం విడిపించడానికి మరియు అమ్మడానికి ది బెస్ట్ సర్వీస్!`,
        `బంగారం అమ్మడానికి కడపలో 100% నమ్మకమైన షాప్, థాంక్యూ ${bName}!`,
      ]);
      break;

    case "PRINTING_GRAPHICS":
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
      break;

    case "PHOTOGRAPHY_STUDIO":
      opener = pickRandom([
        `మా ఫ్యామిలీ ఈవెంట్ మరియు ఫోటో వర్క్ కోసం ${bName} ని బుక్ చేసుకున్నాము.`,
        `బర్త్‌డే సర్ప్రైజ్ గిఫ్ట్ కోసం ${item} చేయించాము.`,
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
      break;

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

    case "SALON_BEAUTY":
      opener = pickRandom([
        `ఫ్యామిలీ ఫంక్షన్ కి ముందు హెయిర్ స్టైలింగ్ కోసం ${bName} కి వెళ్ళాను.`,
        `మ్యారేజ్ ఈవెంట్ కోసం స్పెషల్ గ్రూమింగ్ ఇక్కడ చేయించుకున్నాను.`,
      ]);
      middle = pickRandom([
        `ఫంక్షన్ కి తగ్గట్టు చాలా పర్ఫెక్ట్ గా మేకోవర్ చేశారు.`,
        `స్టైలిస్ట్ చాలా ప్రొఫెషనల్ గా లుక్ సెట్ చేశారు.`,
      ]);
      closer = pickRandom([
        `అందరూ కాంప్లిమెంట్స్ ఇచ్చారు, థాంక్యూ!`,
        `ఫుల్లీ శాటిస్‌ఫైడ్!`,
      ]);
      break;

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

    case "SALON_BEAUTY":
      return pickRandom([
        "Masterful Styling & Relaxing Vibe",
        "Great Haircut & Skilled Stylists",
        "Neat Grooming & Polite Staff",
        "Hygienic Setup & Professional Care",
      ]);

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
  if (isTelugu) {
    let starters: string[];
    let middles: string[];

    switch (ind) {
      case "GOLD_BUYERS":
        starters = [
          `బంగారం ప్యూరిటీని కంప్యూటరైజ్డ్ మెషిన్‌లో పారదర్శకంగా చెక్ చేశారు.`,
          `కంటి ముందే డిజిటల్ స్కేల్‌లో తూకం వేసి కరెక్ట్ రేటు ఇచ్చారు.`,
          `ప్లెడ్జ్డ్ గోల్డ్ రిలీజ్ చేసి వెంటనే బ్యాంక్ ట్రాన్స్‌ఫర్ చేశారు.`,
          `${bName} లో సర్వీస్ చాలా genuine గా ఉంది.`,
          `కడపలో బెస్ట్ గోల్డ్ బయర్స్ మరియు తాకట్టు బంగారం రిలీజ్ సర్వీస్.`,
          `10 నిమిషాల్లో ప్రొసీజర్ మొత్తం కంప్లీట్ చేశారు.`,
        ];
        middles = [
          `లైవ్ మార్కెట్ బులియన్ రేటు ప్రకారం అమౌంట్ సెటిల్ చేశారు.`,
          `అనవసరమైన కటింగ్స్ లేదా డిడక్షన్స్ ఏమీ లేవు.`,
          `వెంటనే బ్యాంక్ ఖాతాకి అమౌంట్ క్రెడిట్ అయిపోయింది.`,
          `కంప్యూటర్ టెస్టింగ్ లో 100% పారదర్శకత చూపించారు.`,
        ];
        break;

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
        break;

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
    case "GOLD_BUYERS":
      starters = [
        `100% transparent testing for ${tag}.`,
        `Got immediate bank transfer for ${tag}.`,
        `Accurate weighing and live bullion rate for ${tag}.`,
        `Smooth and confidential process for ${tag}.`,
        `Fair valuation and polite coordination at ${bName}.`,
      ];
      middles = [
        `Purity was checked right in front of me on their computerized German machine.`,
        `The valuation was 100% transparent with zero unfair deductions.`,
        `Payment was credited to my bank account in less than 2 minutes.`,
        `The staff was patient, polite, and handled everything with complete confidentiality.`,
      ];
      break;

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
      break;

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
  const lexicon = getDomainLexicon(industry.type);

  // Active tags: prioritize customer selected tags, then business tagChips, then domain items
  let activeTags = selectedTags.length > 0 ? selectedTags : [];
  if (activeTags.length === 0 && tagChips) {
    activeTags = tagChips.split(",").map((t) => t.trim()).filter(Boolean);
  }
  if (activeTags.length === 0) {
    activeTags = lexicon.items.slice(0, 3);
  }

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
