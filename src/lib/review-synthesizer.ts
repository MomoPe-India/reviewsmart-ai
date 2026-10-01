import {
  validateReviewUniqueness,
  MemoryReviewItem,
} from "./review-memory";

export type LanguageMode = "ENGLISH" | "TELUGU_SCRIPT" | "TELUGU_ENGLISH" | "TELUGU_ROMAN" | "AUTO";

export interface SynthesizerParams {
  businessName: string;
  category?: string;
  tagline?: string | null;
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
interface DomainLexicon {
  items: string[];
  qualities: string[];
  adjectives: string[];
  actions: string[];
  occasions: string[];
}

const DOMAIN_LEXICONS: Record<string, DomainLexicon> = {
  photography: {
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
      "family collage frame",
      "matte finish frame",
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
      "prompt delivery of the edited teaser, highlights, and full album",
    ],
    adjectives: [
      "sharp and vibrant",
      "cinematic and breathtaking",
      "super neat and professional",
      "high quality and natural",
      "clean and premium",
      "very crisp",
      "flawless and creative",
      "solid and well executed",
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
  restaurant: {
    items: [
      "biryani and starters",
      "thali meals",
      "tandoori items",
      "evening snacks",
      "curries and rotis",
      "refreshing mocktails",
      "desserts and ice creams",
      "breakfast combo",
    ],
    qualities: [
      "aroma and fresh spices",
      "portion size and taste consistency",
      "quick hot serving",
      "kitchen hygiene and neat seating",
      "balanced masala without heavy oil",
      "prompt table service",
    ],
    adjectives: [
      "flavorful and piping hot",
      "delicious and authentic",
      "freshly prepared",
      "generous and satisfying",
      "rich in taste",
    ],
    actions: ["tried", "ordered", "visited for", "enjoyed", "stopped by for"],
    occasions: [
      "with family for dinner",
      "during lunch break",
      "for a weekend treat",
      "with friends yesterday",
      "while passing by the area",
    ],
  },
  salon: {
    items: [
      "haircut and styling",
      "beard grooming",
      "facial cleanup",
      "hair spa treatment",
      "head massage",
      "bridal / party makeup",
    ],
    qualities: [
      "patient listening by the stylist",
      "sterilized tools and clean towels",
      "attention to styling detail",
      "relaxing environment",
      "unrushed personalized service",
    ],
    adjectives: [
      "very neat and professional",
      "hygienic and relaxing",
      "well finished",
      "sharp and clean",
    ],
    actions: ["got a", "went for", "booked a session for", "tried their"],
    occasions: [
      "before a family function",
      "for monthly grooming",
      "over the weekend",
      "yesterday afternoon",
    ],
  },
  health: {
    items: [
      "health consultation",
      "routine checkup",
      "diagnostic service",
      "dental cleaning",
      "physiotherapy session",
    ],
    qualities: [
      "doctor's detailed explanation",
      "hygienic clinical care",
      "friendly clinic staff",
      "minimal wait time",
      "honest medical advice without unnecessary tests",
    ],
    adjectives: [
      "thorough and reassuring",
      "very professional",
      "caring and attentive",
      "patient and transparent",
    ],
    actions: ["visited for", "consulted for", "had an appointment for"],
    occasions: ["for a routine check", "earlier this week", "recently"],
  },
  general: {
    items: [
      "service",
      "order",
      "work requested",
      "product purchase",
      "custom requirement",
      "support",
    ],
    qualities: [
      "smooth coordination",
      "solid build and finishing",
      "clear explanation of options",
      "timely completion",
      "polite and supportive staff behavior",
    ],
    adjectives: [
      "very dependable",
      "neat and prompt",
      "well handled",
      "fair and transparent",
      "solid quality",
    ],
    actions: ["availed", "purchased", "ordered", "took", "went for"],
    occasions: ["recently", "a couple days back", "this week"],
  },
  printing: {
    items: [
      "flex banner printing",
      "commercial sign board",
      "visiting cards",
      "vinyl stickers",
      "glow sign board",
      "pamphlets and brochures",
      "customized mug printing",
      "customized t-shirt printing",
      "book printing",
      "acrylic lettering board",
      "roll-up standee",
      "offset printing",
      "graphic design work",
    ],
    qualities: [
      "sharp color printing, clean edges, and weather-proof outdoor flex durability",
      "high-resolution vector graphics, accurate typography, and vibrant banner colors",
      "thick card stock, premium matte laminate, and crisp font readability on visiting cards",
      "strong frame structure, bright LED illumination, and clean installation on the sign board",
      "ceramic mug print vibrancy and dishwasher-safe gloss",
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
      "flawless and creative",
      "very crisp",
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
      "for a personal surprise gift mug",
      "for our new office sign board",
      "recently",
      "last week",
    ],
  },
  gold: {
    items: [
      "selling old gold jewellery",
      "releasing pledged gold from bank",
      "purity testing on German XRF machine",
      "instant bank transfer",
      "gold valuation",
      "gold coin sale",
      "releasing gold loan from pawn broker",
      "old broken gold ornaments",
      "transparent digital weighing",
      "live market gold rate",
    ],
    qualities: [
      "German computerized XRF purity testing without damaging ornaments",
      "100% transparent digital weighing right before our eyes",
      "live bullion market gold rate without unnecessary melting deduction",
      "quick 10-minute hassle-free verification process",
      "spot IMPS / RTGS bank transfer credited within 2 minutes",
      "friendly, respectful, and confidential handling of pledged gold release",
      "releasing pledged gold from Muthoot / Manappuram / bank directly with complete paperwork",
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
      "visited for",
      "sold our",
      "released our",
      "got our",
      "approached them for",
      "checked gold valuation for",
    ],
    occasions: [
      "for an urgent financial need",
      "to close an existing gold loan",
      "to sell old unused jewellery",
      "for a quick bank transfer",
      "recently",
      "last week",
      "yesterday",
    ],
  },
};

function getDomainLexicon(category = "", businessName = ""): DomainLexicon {
  const text = (category + " " + businessName).toLowerCase();
  if (
    text.includes("gold") ||
    text.includes("pledge") ||
    text.includes("bullion") ||
    text.includes("jewel")
  ) {
    return DOMAIN_LEXICONS.gold;
  }
  if (
    text.includes("grafix") ||
    text.includes("graphic") ||
    text.includes("flex") ||
    text.includes("banner") ||
    text.includes("sign board") ||
    text.includes("visiting card") ||
    text.includes("offset") ||
    (text.includes("print") && !text.includes("photo") && !text.includes("wedding"))
  ) {
    return DOMAIN_LEXICONS.printing;
  }
  if (
    text.includes("photo") ||
    text.includes("studio") ||
    text.includes("gift") ||
    text.includes("frame") ||
    text.includes("print")
  ) {
    return DOMAIN_LEXICONS.photography;
  }
  if (
    text.includes("food") ||
    text.includes("restaurant") ||
    text.includes("cafe") ||
    text.includes("bakes") ||
    text.includes("kitchen") ||
    text.includes("hotel") ||
    text.includes("biryani")
  ) {
    return DOMAIN_LEXICONS.restaurant;
  }
  if (
    text.includes("salon") ||
    text.includes("beauty") ||
    text.includes("spa") ||
    text.includes("hair") ||
    text.includes("parlour")
  ) {
    return DOMAIN_LEXICONS.salon;
  }
  if (
    text.includes("clinic") ||
    text.includes("dental") ||
    text.includes("hospital") ||
    text.includes("health") ||
    text.includes("care") ||
    text.includes("dr")
  ) {
    return DOMAIN_LEXICONS.health;
  }
  return DOMAIN_LEXICONS.general;
}

// ─── DOMAIN IDENTIFIER HELPERS ─────────────────────────────────────────────
function isGoldDomain(bName: string, lex: DomainLexicon): boolean {
  return (
    bName.toLowerCase().includes("gold") ||
    lex.items.some((i) => i.includes("gold") || i.includes("bullion") || i.includes("pledge"))
  );
}

function isPrintingDomain(bName: string, lex: DomainLexicon): boolean {
  return (
    bName.toLowerCase().includes("grafix") ||
    bName.toLowerCase().includes("flex") ||
    lex.items.some((i) => i.includes("flex") || i.includes("banner") || i.includes("sign board"))
  );
}

// ─── 18 HIGH-ENTROPY GENERATIVE WRITING STYLES ──────────────────────────────

// Style 1: Short & Direct Punchy (Structure F)
function generateShortDirect(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
  const item = tags[0] || pickRandom(lex.items);
  const openers = [
    `Neat work on the ${item}.`,
    `Quick delivery and clean finishing for ${item}.`,
    `Very pleased with the ${item} from ${bName}.`,
    `Prompt work and polite staff at ${bName}.`,
    `Solid quality ${item}, delivered right on time.`,
    `Good service and fair rates here.`,
    `Smooth experience getting ${item} done.`,
    `Got my ${item} ready in no time.`,
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
function generateProductQuality(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
  const item = tags[0] || pickRandom(lex.items);
  const quality = pickRandom(lex.qualities);
  const adj = pickRandom(lex.adjectives);
  const openers = [
    `The ${quality} on the ${item} is ${adj}.`,
    `Took their service for ${item} and the result is ${adj}.`,
    `Noticeable attention to ${quality} here.`,
    `Got a ${item} customized at ${bName}.`,
    `Checked out their ${item} work recently.`,
  ];
  const middles = [
    `Finishing came out clean without any rough spots.`,
    `The detailing and alignment are very well maintained.`,
    `You can clearly tell they don't compromise on materials.`,
    `Output matched exactly what was discussed before placing the order.`,
    `Turnaround was swift and the packing was secure.`,
  ];
  const closers = [
    `Reliable craftsmanship.`,
    `Happy with the final product.`,
    `Quality speaks for itself.`,
    `Great value for the price charged.`,
    `A solid shop to get ${item} done.`,
  ];
  const notePart = note ? ` Also took good care of ${note.toLowerCase()}.` : "";
  return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
}

// Style 3: Problem -> Solution -> Result (Structure C)
function generateProblemSolution(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
  const item = tags[0] || pickRandom(lex.items);
  const occasion = pickRandom(lex.occasions);
  const gold = isGoldDomain(bName, lex);

  const problems = gold
    ? [
        `Was searching for a trustworthy place for ${item} ${occasion}.`,
        `Needed ${item} on relatively short notice.`,
        `Was looking for someone who could handle ${item} with proper care and honesty.`,
        `Had an urgent requirement for ${item} and walked in here.`,
        `Needed reliable assistance to finalize our ${item}.`,
        `Wanted genuine live rate and transparent valuation for our ${item}.`,
      ]
    : [
        `Was searching for a trustworthy place for ${item} ${occasion}.`,
        `Needed ${item} on relatively short notice.`,
        `Had specific custom requirements for our ${item}.`,
        `Was looking for someone who could do ${item} with proper care.`,
        `Had an urgent order for ${item} and walked in here.`,
        `Was looking around seven roads for good quality ${item}.`,
        `Needed reliable assistance to finalize our ${item}.`,
        `Wanted a custom ${item} done with high attention to detail.`,
      ];

  const solutions = gold
    ? [
        `The team at ${bName} patiently understood the requirement and explained the valuation steps.`,
        `They tested purity right in front of me on German computerized equipment without any damage.`,
        `Staff walked me through the live market bullion rate clearly and gave an accurate quote.`,
        `They accommodated my preferences without making any fuss.`,
        `Everything was weighed transparently on a digital scale with zero deductions.`,
        `Everything was handled transparently with immediate bank transfer.`,
      ]
    : [
        `The team at ${bName} patiently understood the requirement and suggested the right options.`,
        `They showed samples upfront and helped finalize the size and finish without rushing.`,
        `Staff walked me through the choices clearly and gave a realistic delivery timeframe.`,
        `They accommodated my preferences without making a fuss.`,
        `The designer spent time showing multiple layouts before confirming.`,
        `They guided me on the right finish and frame thickness without overselling.`,
        `Team was quick to respond and gave honest feedback on photo resolution.`,
        `Everything was handled transparently with clear delivery timing.`,
      ];

  const results = gold
    ? [
        `Transaction was completed in 10 minutes with instant payment.`,
        `The payout exceeded what other local shops were offering.`,
        `Everything was handed over smoothly with proper paperwork.`,
        `Very satisfied with the quick turnaround and transparent outcome.`,
        `Received the full amount directly in my bank account via IMPS.`,
        `Great honesty and courteous staff behavior throughout.`,
      ]
    : [
        `Delivered right on time with flawless finishing.`,
        `The final output exceeded what I anticipated.`,
        `Everything was handed over smoothly in secure packaging.`,
        `Very satisfied with the quick turnaround and neat outcome.`,
        `The print clarity and frame border turned out spotless.`,
        `Received the finished piece in pristine condition.`,
        `Output matched the preview exactly, great workmanship.`,
        `Turned out super crisp, happy with the choice.`,
      ];

  const notePart = note ? ` Handled ${note.toLowerCase()} seamlessly.` : "";
  return `${pickRandom(problems)} ${pickRandom(solutions)}${notePart} ${pickRandom(results)}`;
}

// Style 4: Conversational Flow (Structure A)
function generateConversationalFlow(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
  const item = tags[0] || pickRandom(lex.items);
  const openers = [
    `Dropped in at ${bName} to get ${item}.`,
    `Visited ${bName} earlier this week for ${item}.`,
    `Decided to try ${bName} after hearing good things.`,
    `Went to this place for some ${item} work.`,
  ];
  const middles = [
    `Staff was welcoming and coordinated the entire order smoothly.`,
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
function generateCalmPersonal(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
  const item = tags[0] || pickRandom(lex.items);
  const reactions = [
    `Really appreciated the polite approach at ${bName}.`,
    `Clean work and honest communication on the ${item}.`,
    `Calm, professional, and dependable service.`,
    `Quite content with the ${item} I received from ${bName}.`,
  ];
  const observations = [
    `Charges were transparent and the quality turned out very solid.`,
    `They didn't push for expensive upgrades and gave genuine suggestions.`,
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
function generateOccasionContext(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
  const item = tags[0] || pickRandom(lex.items);
  const occasion = pickRandom(lex.occasions);
  const openers = [
    `Got a ${item} done ${occasion}.`,
    `Visited ${bName} ${occasion} to order ${item}.`,
    `Needed a special ${item} ${occasion}.`,
  ];
  const middles = [
    `The final piece was ready on time and everyone at home loved it.`,
    `The presentation and finish made the occasion even more memorable.`,
    `Colors and materials came out rich and neatly assembled.`,
  ];
  const closers = [
    `Truly grateful for the prompt assistance.`,
    `Made the surprise so much better!`,
    `Will surely order from here again.`,
    `Much appreciated!`,
  ];
  const notePart = note ? ` Handled ${note.toLowerCase()} very nicely.` : "";
  return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
}

// Style 7: Detailed Multi-Angle Review (Structure G)
function generateDetailedReview(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
  const item1 = tags[0] || pickRandom(lex.items);
  const remaining = lex.items.filter((i) => i.toLowerCase() !== item1.toLowerCase());
  const item2 = tags[1] && tags[1].toLowerCase() !== item1.toLowerCase() ? tags[1] : pickRandom(remaining.length > 0 ? remaining : lex.items);
  const gold = isGoldDomain(bName, lex);

  const openers = gold
    ? [
        `Coordinated with ${bName} for our ${item1}.`,
        `Had service done here for ${item1}.`,
        `Visited ${bName} specifically for ${item1} and gold valuation.`,
        `Went to ${bName} after a colleague recommended their ${item1}.`,
        `Needed a transparent and reliable service for ${item1} and stopped by here.`,
      ]
    : [
        `Coordinated with ${bName} for our ${item1} order.`,
        `Had customized work done here for ${item1}.`,
        `Visited ${bName} specifically for ${item1} and framing.`,
        `Went to ${bName} after a colleague recommended their ${item1}.`,
        `Needed a high quality finish for ${item1} and stopped by here.`,
      ];

  const middles = gold
    ? [
        `First, the team patiently tested purity on their German machine. Second, bank payment was immediate.`,
        `Communication was clear from the start and they didn't try to rush any stage of the valuation.`,
        `The accuracy of digital weighing and fair live market rate on ${item2} exceeded expectations.`,
        `Charges and live bullion rates were explained clearly upfront with zero hidden deductions.`,
        `They handled the verification and paperwork with genuine care, safety, and complete confidentiality.`,
      ]
    : [
        `First, the team patiently helped choose the right border and dimensions. Second, delivery was prompt.`,
        `Communication was clear from the start and they didn't try to rush any stage of the work.`,
        `The sharpness of the output and clean alignment on ${item2} exceeded expectations.`,
        `Charges were explained clearly upfront and the final output looks really premium.`,
        `They handled the color grading and packaging with genuine care and precision.`,
      ];

  const closers = [
    `A well-managed spot that takes pride in quality.`,
    `Dependable service from start to finish.`,
    `Five stars for reliability and neat execution.`,
    `Completely satisfied with both the process and service.`,
    `Will certainly be coming back for future requirements.`,
  ];
  const notePart = note ? ` Especially liked how they handled ${note.toLowerCase()}.` : "";
  return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
}

// Style 8: Casual Local Recommendation
function generateCasualLocal(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
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

// Style 9: Minimalist Punchy (3 short fragments)
function generateMinimalist(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
  const item = tags[0] || pickRandom(lex.items);
  const fragments = [
    `Super neat ${item}. Fair price, on-time delivery.`,
    `Clean work on ${item}. Polite staff. Happy with the result.`,
    `Fast service. Crisp output. Dependable team at ${bName}.`,
    `Great quality ${item}. No delays. 10/10 experience.`,
    `Good finish on the ${item}. Worth the money.`,
  ];
  let base = pickRandom(fragments);
  if (note) base += ` Handled ${note.toLowerCase()} properly.`;
  return base;
}

// Style 10: Enthusiastic & Delighted
function generateEnthusiastic(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
  const item = tags[0] || pickRandom(lex.items);
  const openers = [
    `Absolutely loved what ${bName} did with our ${item}!`,
    `So glad I got the ${item} done here!`,
    `Such a delightful experience getting ${item} customized.`,
  ];
  const middles = [
    `The colors and finish turned out so much brighter and neater than I hoped.`,
    `They delivered it right when promised and the packaging was super safe.`,
    `The staff was so courteous throughout the process.`,
  ];
  const closers = [
    `Big thumbs up to the team!`,
    `Will definitely recommend to friends and family.`,
    `Thank you for making it so special!`,
  ];
  const notePart = note ? ` ${note} was executed to perfection.` : "";
  return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
}

// Style 11: First-Time Visitor Perspective
function generateFirstTime(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
  const item = tags[0] || pickRandom(lex.items);
  const openers = [
    `First time trying ${bName} for ${item}.`,
    `Walked in here for the first time needing ${item}.`,
    `Was my first visit to ${bName}.`,
  ];
  const middles = [
    `The staff made me feel comfortable and guided me through options patiently.`,
    `Impression was very positive from the initial discussion to the final handover.`,
    `The output quality immediately gave me confidence in their work.`,
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
function generateRepeatCustomer(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
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
function generateRelief(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
  const item = tags[0] || pickRandom(lex.items);
  const openers = [
    `Was initially worried about the finishing on the ${item}.`,
    `Was slightly skeptical whether they could deliver ${item} on time.`,
    `Had high expectations for this ${item} order.`,
  ];
  const middles = [
    `Thankfully, the team at ${bName} proved my doubts completely wrong.`,
    `When I inspected the final piece, the quality was spotless.`,
    `They actually delivered ahead of schedule with zero compromises.`,
  ];
  const closers = [
    `Relieved and very satisfied!`,
    `Exceeded expectations in the best way possible.`,
    `Great work by the team.`,
  ];
  const notePart = note ? ` Handled ${note.toLowerCase()} exceptionally well.` : "";
  return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
}

// Style 14: Family / Gift Giver Perspective
function generateFamilyGift(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
  const item = tags[0] || pickRandom(lex.items);
  const occasion = pickRandom(lex.occasions);
  const openers = [
    `Ordered ${item} as a surprise gift ${occasion}.`,
    `Got this ${item} made for a family occasion.`,
    `Wanted a meaningful ${item} for our family.`,
  ];
  const middles = [
    `Everyone at home loved the neat finishing and color balance.`,
    `The recipient was genuinely thrilled with the quality and presentation.`,
    `The craftsmanship brought a big smile to everyone's face.`,
  ];
  const closers = [
    `Thanks to ${bName} for making it memorable.`,
    `Worth every rupee for a special gift.`,
    `Will definitely order more gifts from here.`,
  ];
  const notePart = note ? ` Attention to ${note.toLowerCase()} made a big difference.` : "";
  return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
}

// Style 15: Staff & Service Behavior Focus
function generateStaffService(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
  const item = tags[0] || pickRandom(lex.items);
  const openers = [
    `Really appreciated the respectful behavior of the staff at ${bName}.`,
    `The people running ${bName} are genuinely polite and helpful.`,
    `Customer service here is top notch.`,
  ];
  const middles = [
    `They took the time to answer every question and showed sample designs patiently.`,
    `No rushing or pushing unnecessary upgrades, just honest guidance on ${item}.`,
    `Handled the handover with a friendly attitude.`,
  ];
  const closers = [
    `Good people doing honest business.`,
    `Rare to find such courteous customer support nowadays.`,
    `Great service culture.`,
  ];
  const notePart = note ? ` They took care of ${note.toLowerCase()} smoothly.` : "";
  return `${pickRandom(openers)} ${pickRandom(middles)}${notePart} ${pickRandom(closers)}`;
}

// Style 16: Telugu Conversational Experience (Telugu Script)
function generateTeluguConversational(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
  const item = tags[0] || pickRandom(lex.items);
  const gold = isGoldDomain(bName, lex);
  const printing = isPrintingDomain(bName, lex);

  const openers = gold
    ? [
        `పాత బంగారం అమ్మడానికి ${bName} కి వెళ్ళాము, చాలా మంచి అనుభవం.`,
        `బ్యాంకులో తాకట్టు పెట్టిన బంగారం విడిపించడానికి ${bName} ని సంప్రదించాము.`,
        `గోల్డ్ వాల్యుయేషన్ మరియు సెల్లింగ్ ప్రాసెస్ ${bName} లో చాలా ఫాస్ట్‌గా జరిగింది.`,
        `${bName} లో సర్వీస్ మరియు స్టాఫ్ రెస్పాన్స్ చాలా బాగుంది.`,
        `మా requirement ని అర్థం చేసుకుని ${item} చాలా genuine గా చేశారు.`,
      ]
    : printing
    ? [
        `మా షాప్ ఓపెనింగ్ కోసం flex banner మరియు sign board ${bName} లో చేయించాము.`,
        `బిజినెస్ ప్రమోషన్ కోసం విజిటింగ్ కార్డ్స్ మరియు బ్రోచర్స్ ఆర్డర్ ఇచ్చాము.`,
        `${bName} లో ఫ్లెక్స్ ప్రింటింగ్ సర్వీస్ చాలా బాగుంది.`,
        `మా requirement ని అర్థం చేసుకుని ${item} చాలా neat గా చేశారు.`,
      ]
    : [
        `మా requirement ని అర్థం చేసుకుని ${item} చాలా neat గా చేశారు.`,
        `${bName} లో సర్వీస్ చాలా బాగుంది.`,
        `రీసెంట్‌గా ఇక్కడ ${item} ఆర్డర్ ఇచ్చాను.`,
        `ఫ్యామిలీ ఫంక్షన్ కోసం ${item} చేయించాము.`,
        `స్టాఫ్ చాలా ఫ్రెండ్లీగా రిసీవ్ చేసుకున్నారు.`,
        `${bName} లో మొదటిసారి ${item} చేయించాము.`,
        `మంచి ఫోటో స్టూడియో కోసం చూసి ఇక్కడికి వెళ్ళాము.`,
        `కస్టమైజ్డ్ ${item} కోసం ఇక్కడికి వెళ్ళాము, చాలా మంచి అనుభవం.`,
      ];

  const middles = gold
    ? [
        `స్టాఫ్ చాలా ఓపికగా వివరాలు చెప్పారు, ఎక్కడా కంగారు పెట్టలేదు.`,
        `కంప్యూటరైజ్డ్ జర్మన్ మెషిన్ లో ప్యూరిటీ చెక్ చేసి ట్రాన్స్‌పరెంట్ గా రేట్ ఇచ్చారు.`,
        `లైవ్ మార్కెట్ రేటు ప్రకారం కరెక్ట్ గా క్యాలిక్యులేట్ చేసి స్పాట్ లో పేమెంట్ చేశారు.`,
        `డిజిటల్ వెయింగ్ లో ఎక్కడా తేడా లేకుండా కరెక్ట్ గా తూకం వేశారు.`,
      ]
    : printing
    ? [
        `స్టాఫ్ చాలా ఓపికగా ఆప్షన్స్ చూపించారు, ఎక్కడా కంగారు పెట్టలేదు.`,
        `వర్క్ చాలా ప్రొఫెషనల్‌గా చేశారు, మాకు చాలా బాగా నచ్చింది.`,
        `టైమ్‌కి రెడీ చేసి ఇచ్చారు, క్వాలిటీ లో ఎక్కడా రాజీ పడలేదు.`,
        `కలర్ ప్రింటింగ్ మరియు బోర్డర్ అలైన్‌మెంట్ చాలా సాలిడ్‌గా వచ్చాయి.`,
      ]
    : [
        `స్టాఫ్ చాలా ఓపికగా ఆప్షన్స్ చూపించారు, ఎక్కడా కంగారు పెట్టలేదు.`,
        `వర్క్ చాలా ప్రొఫెషనల్‌గా చేశారు, మాకు చాలా బాగా నచ్చింది.`,
        `టైమ్‌కి రెడీ చేసి ఇచ్చారు, క్వాలిటీ లో ఎక్కడా రాజీ పడలేదు.`,
        `మా బడ్జెట్‌కి తగినట్లు మంచి సలహాలు ఇచ్చి చాలా చక్కగా చేశారు.`,
        `ఫోటో క్రాపింగ్ మరియు కలర్ కరెక్షన్ చాలా జాగ్రత్తగా చేశారు.`,
        `కమ్యూనికేషన్ చాలా బాగుంది, ఆర్డర్ స్టేటస్ కూడా క్లియర్ గా చెప్పారు.`,
      ];

  const closers = gold
    ? [
        `బంగారం అమ్మడానికి కడపలో బెస్ట్ మరియు నమ్మకమైన గోల్డ్ బయర్స్!`,
        `100% సేఫ్ మరియు ట్రాన్స్‌పరెంట్ సర్వీస్, థాంక్యూ ${bName}!`,
        `Thank you ${bName}!`,
        `కడపలో బెస్ట్ సర్వీస్ ఇచ్చే షాప్.`,
      ]
    : printing
    ? [
        `ఫ్లెక్స్ ప్రింటింగ్ మరియు సైన్ బోర్డ్స్ కి కడపలో బెస్ట్ షాప్.`,
        `Thank you ${bName}!`,
        `మంచి షాప్, definitely recommend!`,
        `కడపలో బెస్ట్ సర్వీస్ ఇచ్చే షాప్.`,
      ]
    : [
        `Thank you ${bName}!`,
        `ఖచ్చితంగా మళ్ళీ ఇక్కడే చేయించుకుంటాము.`,
        `మంచి షాప్, definitely recommend!`,
        `చాలా సంతోషంగా ఉంది.`,
        `మా ఫ్యామిలీ అందరికీ నచ్చింది, ధన్యవాదాలు!`,
        `కడపలో బెస్ట్ సర్వీస్ ఇచ్చే షాప్.`,
      ];

  let review = `${pickRandom(openers)} ${pickRandom(middles)} ${pickRandom(closers)}`;
  if (note) review += ` ${note} కూడా proper గా handle చేశారు.`;
  return review;
}

// Style 17: Telugu Craftsmanship & Quality Focus (Telugu Script)
function generateTeluguCraftsmanship(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
  const item = tags[0] || pickRandom(lex.items);
  const gold = isGoldDomain(bName, lex);
  const printing = isPrintingDomain(bName, lex);

  const openers = gold
    ? [
        `${item} టెస్టింగ్ మరియు వెయింగ్ లో 100% ట్రాన్స్‌పరెన్సీ చూపించారు.`,
        `${bName} లో గోల్డ్ వాల్యుయేషన్ మరియు లైవ్ మార్కెట్ రేటు చాలా జెన్యూన్ గా ఇచ్చారు.`,
        `ప్యూరిటీ టెస్టింగ్ విధానం చాలా పర్ఫెక్ట్‌గా మరియు శాస్త్రీయంగా ఉంది.`,
      ]
    : printing
    ? [
        `${item} క్వాలిటీ మరియు ప్రింట్ ఫినిషింగ్ super rich గా వచ్చింది.`,
        `ఫ్లెక్స్ బోర్డ్స్ మరియు విజిటింగ్ కార్డ్స్ చాలా neat గా చేశారు.`,
        `వర్క్ చాలా clean గా చేశారు, క్వాలిటీ నంబర్ వన్.`,
      ]
    : [
        `${item} ఫినిషింగ్ అయితే super rich గా వచ్చింది.`,
        `ఫొటో ప్రింట్స్ మరియు ఫ్రేమ్ వర్క్ చాలా neat గా చేశారు.`,
        `వర్క్ చాలా clean గా చేశారు, క్వాలిటీ నంబర్ వన్.`,
        `${bName} దగ్గర వర్క్‌మెన్‌షిప్ చాలా పర్ఫెక్ట్‌గా ఉంది.`,
        `${item} క్లారిటీ విషయంలో అస్సలు రాజీ పడలేదు.`,
        `ప్రింట్ క్వాలిటీ మరియు బోర్డర్ అలైన్‌మెంట్ చాలా సాలిడ్.`,
      ];

  const middles = gold
    ? [
        `కంటి ముందే డిజిటల్ స్కేల్ మీద బరువు తూచారు, వేస్టేజ్ ఏమీ కట్ చేయలేదు.`,
        `కంప్యూటర్ టెస్టింగ్ తో బంగారం ప్యూరిటీ కరెక్ట్ గా నిర్ధారించారు.`,
        `లైవ్ గోల్డ్ రేట్ ఇచ్చి వెంటనే బ్యాంక్ ట్రాన్స్‌ఫర్ చేశారు.`,
      ]
    : printing
    ? [
        `కలర్స్ చాలా షార్ప్‌గా వచ్చాయి, ఎండకి ఏమాత్రం ఫేడ్ అవ్వవు.`,
        `మెటీరియల్ మన్నిక మరియు ప్రింటింగ్ క్వాలిటీ చాలా సాలిడ్‌గా ఉన్నాయి.`,
        `డిజైనింగ్ మరియు కటింగ్ చాలా క్లీన్‌గా ఉన్నాయి.`,
      ]
    : [
        `కలర్స్ చాలా షార్ప్‌గా వచ్చాయి, ఎక్కడా బ్లర్ లేదు.`,
        `ఫ్రేమ్ క్వాలిటీ మరియు బ్యాకింగ్ చాలా సాలిడ్‌గా ఉంది.`,
        `ఫినిషింగ్ మరియు గ్లాస్ వర్క్ చాలా క్లీన్‌గా ఉన్నాయి.`,
        `ప్రీమియం లుక్ వచ్చింది, వాల్ డెకరేషన్‌కి పర్ఫెక్ట్‌గా సెట్ అయ్యింది.`,
        `మంచి మన్నికైన మెటీరియల్ వాడారు, వర్క్ చాలా జెన్యూన్.`,
      ];

  const closers = gold
    ? [
        `వర్త్ ఎవ్రీ రూపీ!`,
        `కడపలో బెస్ట్ మరియు జెన్యూన్ గోల్డ్ బయర్స్.`,
        `హైలీ శాటిస్‌ఫైడ్ విత్ ది సర్వీస్!`,
      ]
    : printing
    ? [
        `వర్త్ ఎవ్రీ రూపీ!`,
        `క్వాలిటీ ప్రింటింగ్ కోరుకునేవారికి ది బెస్ట్ ఛాయిస్.`,
        `హైలీ శాటిస్‌ఫైడ్ విత్ ది అవుట్‌పుట్!`,
      ]
    : [
        `వర్త్ ఎవ్రీ రూపీ!`,
        `క్వాలిటీ విషయంలో సూపర్బ్.`,
        `హైలీ శాటిస్‌ఫైడ్ విత్ ది అవుట్‌పుట్!`,
        `మంచి క్వాలిటీ వర్క్, థాంక్యూ.`,
        `క్వాలిటీ వర్క్ కోరుకునేవారికి ది బెస్ట్ ఛాయిస్.`,
      ];

  let review = `${pickRandom(openers)} ${pickRandom(middles)} ${pickRandom(closers)}`;
  if (note) review += ` ${note} వర్క్ కూడా బాగా చేశారు.`;
  return review;
}

// Style 18: Telugu Short & Punchy (Telugu Script)
function generateTeluguPunchy(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
  const item = tags[0] || pickRandom(lex.items);
  const gold = isGoldDomain(bName, lex);
  const printing = isPrintingDomain(bName, lex);

  const variations = gold
    ? [
        `కంప్యూటర్ టెస్టింగ్ మరియు లైవ్ రేట్ ఇచ్చారు. ప్రాసెస్ చాలా ఫాస్ట్.`,
        `${item} చాలా జెన్యూన్‌గా చేశారు. స్టాఫ్ రెస్పాన్స్ బాగుంది, థాంక్యూ ${bName}!`,
        `చక్కటి సర్వీస్. స్పాట్ లో బ్యాంక్ ట్రాన్స్‌ఫర్ చేశారు. వర్త్ ఇట్!`,
        `క్లీన్ వర్క్ మరియు నమ్మకమైన డీలింగ్స్. 10 నిమిషాల్లో కంప్లీట్ అయ్యింది.`,
        `మంచి రెస్పాన్స్, జెన్యూన్ గోల్డ్ రేట్. డెఫినెట్‌గా మళ్ళీ వస్తాము.`,
      ]
    : printing
    ? [
        `మంచి క్వాలిటీ ప్రింటింగ్ మరియు టైమ్‌కి డెలివరీ ఇచ్చారు. ప్రైస్ కూడా రీజనబుల్.`,
        `${item} చాలా నీట్‌గా చేశారు. స్టాఫ్ రెస్పాన్స్ బాగుంది, థాంక్యూ ${bName}!`,
        `చక్కటి సర్వీస్. ప్రింట్ అవుట్‌పుట్ చాలా బాగా వచ్చింది. వర్త్ ఇట్!`,
        `క్లీన్ వర్క్ మరియు ఫాస్ట్ డెలివరీ. బ్యానర్ కలర్స్ సూపర్.`,
        `మంచి రెస్పాన్స్, ప్రాంప్ట్ వర్క్. డెఫినెట్‌గా మళ్ళీ వస్తాము.`,
      ]
    : [
        `మంచి క్వాలిటీ మరియు టైమ్‌కి డెలివరీ ఇచ్చారు. ప్రైస్ కూడా రీజనబుల్.`,
        `${item} చాలా నీట్‌గా చేశారు. స్టాఫ్ రెస్పాన్స్ బాగుంది, థాంక్యూ ${bName}!`,
        `చక్కటి సర్వీస్. అవుట్‌పుట్ చాలా బాగా వచ్చింది. వర్త్ ఇట్!`,
        `క్లీన్ వర్క్ మరియు ఫాస్ట్ డెలివరీ. ఫ్యామిలీ అందరికీ బాగా నచ్చింది.`,
        `మంచి రెస్పాన్స్, ప్రాంప్ట్ వర్క్. డెఫినెట్‌గా మళ్ళీ వస్తాము.`,
      ];
  let chosen = pickRandom(variations);
  if (note) chosen += ` ${note} బాగా చేశారు.`;
  return chosen;
}

// Style 19: Telugu Romanized Code-Mixing (Tanglish)
function generateTeluguRoman(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
  const item = tags[0] || pickRandom(lex.items);
  const gold = isGoldDomain(bName, lex);
  const printing = isPrintingDomain(bName, lex);

  const openers = gold
    ? [
        `Old gold sell cheyadaniki ${bName} visit ayyamu, pure transparent testing chesaru.`,
        `Bank lo unna pledged gold release cheyinchamu, instant ga account lo money transfer ayyindi.`,
        `Kadapa lo best gold buyers, accurate weighing and live market bullion rate icharu.`,
        `${bName} lo work chala clean ga chesaru, staff kuda friendly ga unaru.`,
      ]
    : printing
    ? [
        `Shop opening ki flex banner and sign board cheyinchamu, colors and clarity superb ga vachayi.`,
        `Visiting cards and brochures design chala professional ga chesi icharu.`,
        `Chala baga chesaru, ${item} printing aithe super neat ga vachindi.`,
        `${bName} lo work chala clean ga chesaru, staff kuda friendly ga unaru.`,
      ]
    : [
        `Chala baga chesaru, ${item} finishing aithe super neat ga vachindi.`,
        `${bName} lo work chala clean ga chesaru, staff kuda friendly ga unaru.`,
        `${item} quality super ga vachindi, expected danikante better undi.`,
        `Time ki ready chesi icharu, photo clarity taggakunda chusukunnaru.`,
        `Kadapa lo good shop for ${item}, customized gifts and framing works.`,
        `Cup printing and magic pillow gift kosam visit ayyamu, quality awesome ga undi.`,
        `Big size photo frame print resolution and framing finish top notch undi.`,
      ];

  const middles = gold
    ? [
        `German machine lo purity test chesi clear ga explain chesaru.`,
        `Spot payment direct ga bank transfer chesaru without any delay.`,
        `Staff chala patient ga explain chesaru, 100% transparent.`,
        `Live market bullion rate icharu, no unnecessary deductions.`,
      ]
    : printing
    ? [
        `Flex banner material quality thick ga undi, rain or sun ki fade avvadhu.`,
        `Design layout and font alignment chala perfect ga set chesaru.`,
        `Print colors chala vibrant ga unnai, packaging kuda safe ga chesi icharu.`,
        `Pricing kuda fair ga undi, no unnecessary delays.`,
      ]
    : [
        `Staff chala patient ga requirements vinnaaru.`,
        `Colors and frame border quality chala solid ga unai.`,
        `Pricing kuda fair ga undi, no unnecessary delays.`,
        `Family members andariki chala nachindi output.`,
        `Print colors chala vibrant ga unnai, packaging kuda safe ga chesi icharu.`,
      ];

  const closers = gold
    ? [
        `Kadapa lo best place to sell old gold and release pledged gold!`,
        `Thanks to ${bName} team.`,
        `Worth it, satisfied customer!`,
        `Super service and genuine valuation!`,
      ]
    : printing
    ? [
        `Kadapa lo best place for printing and signage!`,
        `Thanks to ${bName} team.`,
        `Worth it, satisfied customer!`,
        `Super service!`,
      ]
    : [
        `Will visit again for sure!`,
        `Thanks to ${bName} team.`,
        `Worth it, satisfied customer!`,
        `Super service!`,
      ];

  let review = `${pickRandom(openers)} ${pickRandom(middles)} ${pickRandom(closers)}`;
  if (note) {
    review += ` ${note} kuda chala baga manage chesaru.`;
  }
  return review;
}

// Style 18: Value & Honest Pricing Focus
function generateValuePricing(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
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

// Style 20: Telugu Occasion, Wedding & Event Context (Telugu Script)
function generateTeluguOccasion(bName: string, tags: string[], note: string, lex: DomainLexicon): string {
  const item = tags[0] || pickRandom(lex.items);
  const gold = isGoldDomain(bName, lex);
  const printing = isPrintingDomain(bName, lex);

  const openers = gold
    ? [
        `అర్జెంట్ ఫైనాన్షియల్ అవసరం కోసం పాత బంగారం అమ్మడానికి ${bName} కి వెళ్ళాము.`,
        `బ్యాంక్ గోల్డ్ లోన్ క్లోజ్ చేసి ప్లెడ్జ్డ్ గోల్డ్ రిలీజ్ చేసుకోవడానికి ${bName} టీమ్ సహాయం తీసుకున్నాము.`,
        `పాత గోల్డ్ ఆర్నమెంట్స్ సేల్ చేయడానికి ${bName} కి వెళ్ళాము, ప్రాసెస్ చాలా స్పీడ్‌గా జరిగింది.`,
        `ఇంట్లో ఉన్న పాత బంగారం అమ్మడానికి మంచి షాప్ కోసం చూసి ${bName} ని సంప్రదించాము.`,
      ]
    : printing
    ? [
        `మా షాప్ ఓపెనింగ్ కోసం flex banner మరియు sign board ${bName} లో చేయించాము.`,
        `బిజినెస్ ప్రమోషన్ కోసం విజిటింగ్ కార్డ్స్ మరియు బ్రోచర్స్ ఆర్డర్ ఇచ్చాము.`,
        `ఈవెంట్ ప్రమోషన్ కోసం flex banners మరియు posters ఆర్డర్ ఇచ్చాము.`,
      ]
    : [
        `మా పెళ్ళికి candid wedding photography మరియు cinematic video కోసం ${bName} ని బుక్ చేసుకున్నాము.`,
        `Pre-wedding shoot కోసం ${bName} టీమ్ ని సెలెక్ట్ చేశాము, చాలా మంచి అవుట్‌పుట్ ఇచ్చారు.`,
        `బర్త్‌డే సర్ప్రైజ్ గిఫ్ట్ కోసం ${item} చేయించాము.`,
        `మ్యారేజ్ యానివర్సరీ ఫోటో ఫ్రేమ్ ${bName} లో చేయించాము.`,
        `ఫ్రెండ్స్ అందరం కలిసి ఒక మెమరీ ${item} ఆర్డర్ ఇచ్చాము.`,
        `కొత్త ఇంటి గృహప్రవేశం కోసం పెద్ద వాల్ ఫ్రేమ్ చేయించాము.`,
        `అమ్మనాన్నల యానివర్సరీ కోసం ${item} చేయించాము, చాలా బాగా వచ్చింది.`,
        `మా పాప పుట్టినరోజు కోసం స్పెషల్ ${item} చేయించాము.`,
        `మా ఈవెంట్ కవరేజ్ మరియు ${item} చాలా ప్రొఫెషనల్ గా చేశారు.`,
        `ఫ్రెండ్‌కి స్పెషల్ సర్ప్రైజ్ కోసం కప్ ప్రింటింగ్ మరియు మ్యాజిక్ పిల్లో ఆర్డర్ ఇచ్చాము.`,
        `హాల్ కోసం పెద్ద సైజు ఫోటో ఫ్రేమ్ (big size photo) చేయించాము, ఇంట్లో అందరికీ చాలా నచ్చింది.`,
      ];

  const middles = gold
    ? [
        `వాళ్ళే స్వయంగా బ్యాంక్ కి వచ్చి పేపర్ వర్క్ క్లియర్ చేసి గోల్డ్ రిలీజ్ చేయించారు.`,
        `10 నిమిషాల్లో ప్యూరిటీ చెక్ పూర్తి చేసి లైవ్ బులియన్ రేటు ప్రకారం అమౌంట్ సెటిల్ చేశారు.`,
        `కంప్యూటరైజ్డ్ జర్మన్ మెషిన్ లో ప్యూరిటీ చెక్ చేసి ఎక్కడా వేస్టేజ్ లేకుండా రేట్ ఇచ్చారు.`,
        `డిజిటల్ స్కేల్ మీద మా కంటి ముందే తూకం వేసి స్పాట్ లో బ్యాంక్ ట్రాన్స్‌ఫర్ చేశారు.`,
      ]
    : printing
    ? [
        `ఫ్లెక్స్ ప్రింట్ చాలా షార్ప్‌గా వచ్చింది, ఎండలో కూడా కలర్స్ ఏమాత్రం డల్ అవ్వలేదు.`,
        `గ్రాఫిక్ డిజైనింగ్ చాలా క్రియేటివ్‌గా చేశారు, లేఅవుట్ చాలా నచ్చింది.`,
        `కలర్ క్వాలిటీ మరియు మెటీరియల్ మన్నిక చాలా బాగుంది.`,
      ]
    : [
        `డ్రోన్ షాట్స్ మరియు సినిమాటిక్ ఎడిటింగ్ చాలా రిచ్ గా వచ్చాయి.`,
        `ఫోటోలలో నాచురల్ స్మైల్స్ మరియు ప్రతి క్షణాన్ని చాలా అందంగా క్యాప్చర్ చేశారు.`,
        `ఫోటో సెలెక్షన్ మరియు క్రాపింగ్ లో స్టాఫ్ చాలా ఓపికగా సహాయం చేశారు.`,
        `ఫినిషింగ్ చూసి ఇంట్లో అందరూ చాలా హ్యాపీగా ఫీల్ అయ్యారు.`,
        `లైటింగ్ మరియు కలర్ గ్రేడింగ్ హై ఎండ్ సినిమా రేంజ్ లో ఉంది.`,
        `ఆల్బమ్ డిజైన్ మరియు ప్రింట్ క్వాలిటీ చూసి ఫ్యామిలీ అందరూ చాలా హ్యాపీగా ఫీల్ అయ్యారు.`,
        `కలర్స్ చాలా నేచురల్‌గా వచ్చాయి, ఫ్రేమ్ లుక్ చాలా ఎలిగెంట్‌గా ఉంది.`,
        `మ్యాజిక్ పిల్లో రివీల్ ఎఫెక్ట్ మరియు కప్ ప్రింటింగ్ క్లారిటీ అదిరిపోయింది.`,
      ];

  const closers = gold
    ? [
        `కడపలో తాకట్టు బంగారం విడిపించడానికి మరియు అమ్మడానికి ది బెస్ట్ సర్వీస్!`,
        `బంగారం అమ్మడానికి కడపలో 100% నమ్మకమైన షాప్, థాంక్యూ ${bName}!`,
        `చాలా జెన్యూన్ సర్వీస్, అందరికీ రికమండ్ చేస్తున్నాను.`,
      ]
    : printing
    ? [
        `ఫ్లెక్స్ ప్రింటింగ్, సైన్ బోర్డ్స్ మరియు డిజైనింగ్ కి కడపలో బెస్ట్ షాప్.`,
        `థాంక్యూ ${bName}, క్వాలిటీ వర్క్ కి బెస్ట్ ప్లేస్!`,
      ]
    : [
        `థాంక్యూ ${bName}, మా ఈవెంట్‌ని స్పెషల్ చేశారు!`,
        `ఖచ్చితంగా రాబోయే ఫంక్షన్లకి కూడా ఇక్కడికే వస్తాము.`,
        `వెడ్డింగ్ ఫోటోగ్రఫీ, కస్టమైజ్డ్ గిఫ్ట్స్ మరియు ఫ్రేమ్స్ కి కడపలో బెస్ట్ ప్లేస్.`,
        `టీమ్ ఎఫర్ట్ మరియు డెడికేషన్ కి హ్యాట్సాఫ్!`,
        `చాలా తృప్తిగా ఉంది.`,
      ];

  let review = `${pickRandom(openers)} ${pickRandom(middles)} ${pickRandom(closers)}`;
  if (note) review += ` ${note} వర్క్ కూడా పర్ఫెక్ట్‌గా చేశారు.`;
  return review;
}

// ─── HEADLINE GENERATOR ─────────────────────────────────────────────────────
function buildDynamicHeadline(text: string, lang: string): string {
  if (lang === "TELUGU_SCRIPT") {
    const telHeadlines = [
      "చాలా మంచి అనుభవం & Super Quality",
      "Neat Finishing & Time కి Delivery",
      "Excellent Service & Friendly Staff",
      "Great Work, Family కి బాగా నచ్చింది",
      "Super Quality & Reasonable Price",
      "మంచి సర్వీస్ & సాలిడ్ క్వాలిటీ",
      "Super Flex Printing & Great Design",
      "100% Genuine Gold Rate & Instant Cash",
      "Spot Bank Transfer & Best Valuation",
    ];
    return pickRandom(telHeadlines);
  }

  if (lang === "TELUGU_ROMAN") {
    return pickRandom([
      "Super Neat Work & Timely Delivery",
      "Chala Baga Chesaru, Good Service",
      "Solid Quality & Friendly Staff",
      "Worth It & Happy with Output",
      "Top Printing Quality in Kadapa",
      "Instant Bank Transfer & Best Gold Rate",
      "Honest Testing & Quick Cash in Kadapa",
    ]);
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

  if (
    text.toLowerCase().includes("gold") ||
    text.toLowerCase().includes("pledge") ||
    text.toLowerCase().includes("purity") ||
    text.toLowerCase().includes("bullion") ||
    text.toLowerCase().includes("valuation")
  ) {
    return pickRandom([
      "Instant Payment & Best Market Rate",
      "100% Transparent Purity Testing",
      "Quick & Honest Gold Valuation",
      "Smooth Pledged Gold Release",
      "Spot Bank Transfer & Genuine Rate",
      "Hassle-Free 10-Minute Process",
      "Trustworthy & Safe Experience",
    ]);
  }

  if (
    text.toLowerCase().includes("finish") ||
    text.toLowerCase().includes("frame") ||
    text.toLowerCase().includes("print") ||
    text.toLowerCase().includes("gift") ||
    text.toLowerCase().includes("pillow") ||
    text.toLowerCase().includes("flex") ||
    text.toLowerCase().includes("banner") ||
    text.toLowerCase().includes("board") ||
    text.toLowerCase().includes("card")
  ) {
    return pickRandom([
      "Neat Finishing & Solid Quality",
      "Sharp Resolution & Clean Output",
      "Delivered On Schedule",
      "Clean Workmanship",
      "Precise Detailing",
      "Superb Custom Prints",
      "Vibrant Print Quality",
    ]);
  }

  return pickRandom([
    "Genuine & Dependable Service",
    "Great Experience Overall",
    "Polite Staff & Prompt Response",
    "Fair Pricing & Solid Output",
    "Helpful & Attentive Team",
  ]);
}

// ─── PROCEDURAL ENTROPY SAFEGUARD GENERATOR ─────────────────────────────────
// When standard templates are heavily populated in history, this procedurally
// generates high-entropy sentences using dynamic combinations.
function generateProceduralFallback(
  bName: string,
  tag: string,
  lex: DomainLexicon,
  roundSeed: number,
  isTelugu: boolean
): string {
  const gold = isGoldDomain(bName, lex);
  const printing = isPrintingDomain(bName, lex);

  if (isTelugu) {
    const starters = gold
      ? [
          `బంగారం ప్యూరిటీని కంప్యూటరైజ్డ్ మెషిన్‌లో పారదర్శకంగా చెక్ చేశారు.`,
          `కంటి ముందే డిజిటల్ స్కేల్‌లో తూకం వేసి కరెక్ట్ రేటు ఇచ్చారు.`,
          `ప్లెడ్జ్డ్ గోల్డ్ రిలీజ్ చేసి వెంటనే బ్యాంక్ ట్రాన్స్‌ఫర్ చేశారు.`,
          `${bName} లో సర్వీస్ చాలా genuine గా ఉంది.`,
          `స్టాఫ్ చాలా పద్ధతిగా మాట్లాడారు.`,
          `కడపలో బెస్ట్ గోల్డ్ బయర్స్ మరియు తాకట్టు బంగారం రిలీజ్ సర్వీస్.`,
          `${tag} కోసం ${bName} ని సంప్రదించాము, మంచి అనుభవం.`,
          `10 నిమిషాల్లో ప్రొసీజర్ మొత్తం కంప్లీట్ చేశారు.`,
        ]
      : printing
      ? [
          `వర్క్ ఫినిషింగ్ చాలా neat గా ఉంది.`,
          `మా ఆర్డర్ ని టైమ్‌కి రెడీ చేసి ఇచ్చారు.`,
          `${tag} క్వాలిటీ అనుకున్నదానికంటే బాగుంది.`,
          `స్టాఫ్ చాలా పద్ధతిగా మాట్లాడారు.`,
          `${bName} లో వర్క్ చాలా genuine గా చేశారు.`,
          `ఫ్లెక్స్ మరియు బోర్డ్స్ డిజైనింగ్ చాలా చక్కగా అమర్చారు.`,
          `మంచి క్వాలిటీ ప్రింట్స్ మరియు బ్యానర్స్ ఇచ్చారు.`,
          `ప్రింట్ కలర్స్ ఏమాత్రం తగ్గకుండా చూసుకున్నారు.`,
          `స్టోర్ లో రెస్పాన్స్ చాలా మర్యాదగా ఉంది.`,
          `సకాలంలో మా ఆర్డర్ పూర్తి చేశారు.`,
          `కడపలో మంచి ప్రింటింగ్ మరియు సైనేజ్ సర్వీస్.`,
        ]
      : [
          `వర్క్ ఫినిషింగ్ చాలా neat గా ఉంది.`,
          `మా ఆర్డర్ ని టైమ్‌కి రెడీ చేసి ఇచ్చారు.`,
          `${tag} క్వాలిటీ అనుకున్నదానికంటే బాగుంది.`,
          `స్టాఫ్ చాలా పద్ధతిగా మాట్లాడారు.`,
          `${bName} లో వర్క్ చాలా genuine గా చేశారు.`,
          `కస్టమైజ్డ్ ${tag} చాలా చక్కగా అమర్చారు.`,
          `మంచి క్వాలిటీ ప్రింట్స్ మరియు ఫ్రేమింగ్ ఇచ్చారు.`,
          `ఫోటో క్లారిటీ ఏమాత్రం తగ్గకుండా చూసుకున్నారు.`,
          `స్టోర్ లో రెస్పాన్స్ చాలా మర్యాదగా ఉంది.`,
          `సకాలంలో మా ఆర్డర్ పూర్తి చేశారు.`,
          `కడపలో మంచి ఫోటో మరియు గిఫ్ట్ సర్వీస్.`,
          `${tag} డిజైన్ చాలా రిచ్‌గా వచ్చింది.`,
        ];

    const middles = gold
      ? [
          `లైవ్ మార్కెట్ బులియన్ రేటు ప్రకారం అమౌంట్ సెటిల్ చేశారు.`,
          `అనవసరమైన కటింగ్స్ లేదా డిడక్షన్స్ ఏమీ లేవు.`,
          `వెంటనే బ్యాంక్ ఖాతాకి అమౌంట్ క్రెడిట్ అయిపోయింది.`,
          `ఎక్కడా అనవసర ఆలస్యం చేయలేదు.`,
          `కంప్యూటర్ టెస్టింగ్ లో 100% పారదర్శకత చూపించారు.`,
          `మా రిక్వైర్మెంట్‌కి సరిపోయే వివరాలు ఓపికగా చెప్పారు.`,
        ]
      : printing
      ? [
          `కలర్ ప్రింటింగ్ మరియు బోర్డర్ నీట్‌గా వచ్చాయి.`,
          `ప్రైస్ కూడా చాలా రీజనబుల్ గా అనిపించింది.`,
          `కలర్స్ చాలా వైబ్రంట్ గా మరియు షార్ప్‌గా ఉన్నాయి.`,
          `ఎక్కడా అనవసర ఆలస్యం చేయలేదు.`,
          `మంచి మన్నికైన బోర్డర్ మెటీరియల్ వాడారు.`,
          `ప్యాకింగ్ చాలా సేఫ్ గా చేసి ఇచ్చారు.`,
        ]
      : [
          `కలర్ ప్రింటింగ్ మరియు బోర్డర్ నీట్‌గా వచ్చాయి.`,
          `ప్రైస్ కూడా చాలా రీజనబుల్ గా అనిపించింది.`,
          `ఫ్యామిలీ అందరూ చాలా హ్యాపీగా ఫీల్ అయ్యారు.`,
          `ఎక్కడా అనవసర ఆలస్యం చేయలేదు.`,
          `మంచి క్వాలిటీ గ్లాస్ మరియు బోర్డర్ మెటీరియల్ వాడారు.`,
          `మా రిక్వైర్మెంట్‌కి సరిపోయే ఆప్షన్స్ చూపించారు.`,
          `ఫ్రేమ్ వెనుక హ్యాంగింగ్ మరియు సపోర్ట్ చాలా స్ట్రాంగ్ గా ఉంది.`,
          `ప్యాకింగ్ చాలా సేఫ్ గా చేసి ఇచ్చారు.`,
          `ఫోటో కలర్స్ చాలా నేచురల్‌గా అనిపించాయి.`,
        ];

    const ends = [
      `Thank you team!`,
      `ఖచ్చితంగా మళ్ళీ వస్తాము.`,
      `Good experience overall.`,
      `Worth every rupee.`,
      `హైలీ రికమండెడ్!`,
      `చాలా సంతోషంగా ఉంది.`,
      `మంచి సర్వీస్ ఇచ్చినందుకు ధన్యవాదాలు!`,
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

  const starters = gold
    ? [
        `100% transparent testing for ${tag}.`,
        `Got immediate bank transfer for ${tag}.`,
        `Accurate weighing and live rate for ${tag}.`,
        `Smooth and confidential process for ${tag}.`,
        `Fair pricing and polite coordination at ${bName}.`,
        `Very smooth transaction for the ${tag}.`,
        `Glad I relied on ${bName} for this service.`,
        `Quick handover and respectful behavior.`,
        `Straightforward experience getting our ${tag} completed.`,
        `Reliable and patient team handling the ${tag}.`,
      ]
    : printing
    ? [
        `Cleanly executed ${tag} work.`,
        `Got my ${tag} done without any delays.`,
        `Appreciated the prompt turnaround for the ${tag}.`,
        `Solid build and accurate colors on the ${tag}.`,
        `Fair pricing and polite coordination at ${bName}.`,
        `Very smooth transaction for the ${tag}.`,
        `Delighted with how the ${tag} turned out.`,
        `Reliable and patient team handling the ${tag}.`,
        `Neat attention paid to the edges of the ${tag}.`,
        `Glad I relied on ${bName} for this order.`,
      ]
    : [
        `Cleanly executed ${tag} work.`,
        `Got my ${tag} done without any delays.`,
        `Appreciated the prompt turnaround for the ${tag}.`,
        `Solid build and accurate colors on the ${tag}.`,
        `Fair pricing and polite coordination at ${bName}.`,
        `Very smooth transaction for the ${tag}.`,
        `High precision on the ${tag} assembly.`,
        `Delighted with how the ${tag} turned out.`,
        `Reliable and patient team handling the ${tag}.`,
        `Straightforward experience getting our ${tag} ready.`,
        `Neat attention paid to the edges of the ${tag}.`,
        `Glad I relied on ${bName} for this order.`,
        `Quick handover and respectful behavior.`,
      ];

  const middles = gold
    ? [
        `Purity was checked right in front of me on their computerized German machine.`,
        `The valuation was 100% transparent with zero unfair deductions.`,
        `Payment was credited to my bank account in less than 2 minutes.`,
        `The staff was patient, polite, and handled everything with complete confidentiality.`,
        `Turnaround was prompt and communication was spot on.`,
        `Accurate digital scale weighing with live bullion market rate.`,
      ]
    : printing
    ? [
        `The staff was patient and listened to the exact preferences.`,
        `Everything was packaged neatly and handed over right on time.`,
        `The banner finishing is crisp with great attention to borders.`,
        `Print resolution came out sharp without any dullness in colors.`,
        `Pricing was transparent with zero unexpected extra charges.`,
        `Turnaround was prompt and communication was spot on.`,
      ]
    : [
        `The staff was patient and listened to the exact preferences.`,
        `Everything was packaged neatly and handed over right on time.`,
        `The finishing is crisp with great attention to the borders.`,
        `Workmanship is dependable and looks very premium.`,
        `No rushing or pushing unnecessary upgrades during the visit.`,
        `Resolution came out sharp without any dullness in colors.`,
        `Pricing was transparent with zero unexpected extra charges.`,
        `They double checked dimensions before sealing the frame.`,
        `Turnaround was prompt and communication was spot on.`,
      ];

  const ends = gold
    ? [
        `Highly satisfied with the service.`,
        `Will certainly come back for future needs.`,
        `A trustworthy place for gold selling and loan release.`,
        `Glad I chose them.`,
        `Dependable team all around.`,
        `Much appreciated!`,
        `Great local service to trust.`,
        `No complaints whatsoever.`,
        `Smooth transaction from start to finish.`,
      ]
    : [
        `Satisfied with the purchase.`,
        `Will certainly come back for future needs.`,
        `A trustworthy place for this kind of work.`,
        `Glad I chose them.`,
        `Dependable team all around.`,
        `Much appreciated!`,
        `Great local shop to support.`,
        `No complaints whatsoever.`,
        `Delivered exactly as discussed.`,
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

// ─── MASTER ZERO-REPETITION SYNTHESIZER ─────────────────────────────────────

export function synthesizeUniqueReviews(params: SynthesizerParams): SynthesizedReview[] {
  const {
    businessName,
    category = "Local Business",
    tagline = "",
    selectedTags = [],
    customNote = "",
    languageMode = "AUTO",
    history = [],
  } = params;

  const lexicon = getDomainLexicon(category, businessName);
  const activeTags = selectedTags.length > 0 ? selectedTags : lexicon.items.slice(0, 3);

  // Check if Telugu is naturally appropriate:
  const combinedContext = (businessName + " " + category + " " + (tagline || "")).toLowerCase();
  const isTeluguContext =
    languageMode === "TELUGU_SCRIPT" ||
    languageMode === "TELUGU_ROMAN" ||
    languageMode === "TELUGU_ENGLISH" ||
    combinedContext.includes("kadapa") ||
    combinedContext.includes("andhra") ||
    combinedContext.includes("telangana") ||
    combinedContext.includes("hyderabad") ||
    combinedContext.includes("tirupati") ||
    combinedContext.includes("vijayawada");

  const acceptedReviews: SynthesizedReview[] = [];
  const acceptedTexts: string[] = [];

  interface StyleDefinition {
    structure: string;
    style: string;
    lang: string;
    generator: () => string;
  }

  // 18 distinct style definitions
  const allStyles: StyleDefinition[] = [
    {
      structure: "STRUCTURE_F",
      style: "short_human",
      lang: "ENGLISH",
      generator: () => generateShortDirect(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_B",
      style: "product_quality",
      lang: "ENGLISH",
      generator: () => generateProductQuality(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_C",
      style: "problem_solution",
      lang: "ENGLISH",
      generator: () => generateProblemSolution(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_A",
      style: "conversational_flow",
      lang: "ENGLISH",
      generator: () => generateConversationalFlow(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_D",
      style: "calm_personal",
      lang: "ENGLISH",
      generator: () => generateCalmPersonal(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_E",
      style: "occasion_context",
      lang: "ENGLISH",
      generator: () => generateOccasionContext(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_G",
      style: "detailed_helpful",
      lang: "ENGLISH",
      generator: () => generateDetailedReview(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_LOCAL",
      style: "casual_local",
      lang: "ENGLISH",
      generator: () => generateCasualLocal(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_MINIMAL",
      style: "minimalist_punchy",
      lang: "ENGLISH",
      generator: () => generateMinimalist(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_ENTHUSIASTIC",
      style: "delighted",
      lang: "ENGLISH",
      generator: () => generateEnthusiastic(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_FIRST_TIME",
      style: "first_time_visitor",
      lang: "ENGLISH",
      generator: () => generateFirstTime(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_REPEAT",
      style: "repeat_customer",
      lang: "ENGLISH",
      generator: () => generateRepeatCustomer(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_RELIEF",
      style: "question_relief",
      lang: "ENGLISH",
      generator: () => generateRelief(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_FAMILY_GIFT",
      style: "family_gift",
      lang: "ENGLISH",
      generator: () => generateFamilyGift(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_STAFF_SERVICE",
      style: "staff_service",
      lang: "ENGLISH",
      generator: () => generateStaffService(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_VALUE",
      style: "value_pricing",
      lang: "ENGLISH",
      generator: () => generateValuePricing(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_TELUGU_CONVERSATIONAL",
      style: "telugu_conversational",
      lang: "TELUGU_SCRIPT",
      generator: () => generateTeluguConversational(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_TELUGU_CRAFT",
      style: "telugu_craftsmanship",
      lang: "TELUGU_SCRIPT",
      generator: () => generateTeluguCraftsmanship(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_TELUGU_PUNCHY",
      style: "telugu_punchy",
      lang: "TELUGU_SCRIPT",
      generator: () => generateTeluguPunchy(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_TELUGU_OCCASION",
      style: "telugu_occasion",
      lang: "TELUGU_SCRIPT",
      generator: () => generateTeluguOccasion(businessName, activeTags, customNote, lexicon),
    },
    {
      structure: "STRUCTURE_TELUGU_ROMAN",
      style: "telugu_roman",
      lang: "TELUGU_ROMAN",
      generator: () => generateTeluguRoman(businessName, activeTags, customNote, lexicon),
    },
  ];

  // Filter based on explicit languageMode:
  let eligibleStyles = allStyles;
  if (languageMode === "TELUGU_SCRIPT") {
    eligibleStyles = allStyles.filter((s) => s.lang === "TELUGU_SCRIPT");
  } else if (languageMode === "TELUGU_ROMAN") {
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
  const maxAttempts = 75;

  while (acceptedReviews.length < 3 && attempts < maxAttempts) {
    attempts++;
    const slot = shuffledStyles[styleIndex % shuffledStyles.length];
    styleIndex++;

    const candidateText = slot.generator().trim();
    const validation = validateReviewUniqueness(candidateText, history, acceptedTexts, businessName);

    if (validation.valid) {
      acceptedTexts.push(candidateText);
      acceptedReviews.push({
        id: acceptedReviews.length + 1,
        headline: buildDynamicHeadline(candidateText, slot.lang),
        text: candidateText,
        tone: slot.style,
        structureTag: slot.structure,
        writingStyle: slot.style,
        languageMix: slot.lang,
      });
    }
  }

  // High-entropy fallback safeguard if historical memory is dense:
  let fallbackSeed = 0;
  while (acceptedReviews.length < 3 && fallbackSeed < 50) {
    fallbackSeed++;
    const tag = activeTags[fallbackSeed % activeTags.length] || "service";
    const wantsTelugu = languageMode === "TELUGU_SCRIPT" || (isTeluguContext && acceptedReviews.length === 2);
    const proceduralText = generateProceduralFallback(
      businessName,
      tag,
      lexicon,
      fallbackSeed + Date.now(),
      wantsTelugu
    );

    const val = validateReviewUniqueness(proceduralText, history, acceptedTexts, businessName);
    if (val.valid) {
      const lang = wantsTelugu ? "TELUGU_SCRIPT" : "ENGLISH";
      acceptedTexts.push(proceduralText);
      acceptedReviews.push({
        id: acceptedReviews.length + 1,
        headline: buildDynamicHeadline(proceduralText, lang),
        text: proceduralText,
        tone: "Natural & Direct",
        structureTag: "STRUCTURE_PROCEDURAL",
        writingStyle: "conversational",
        languageMix: lang,
      });
    }
  }

  return acceptedReviews;
}
