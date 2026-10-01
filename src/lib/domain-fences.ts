import { IndustryType, detectIndustry } from "./industry";

export interface BusinessProfile {
  name: string;
  category?: string;
  tagline?: string | null;
  location?: string;
  keywords?: string;
  tagChips?: string;
  selectedTags?: string[];
  customNote?: string;
}

export interface DomainFenceConfig {
  industryType: IndustryType;
  allowedKeywords: string[];
  forbiddenKeywords: string[];
  forbiddenPhrases: RegExp[];
  positiveIdentifiers: RegExp[];
}

/**
 * Domain-specific fences that strictly isolate one business type from another.
 * Any review containing a forbidden concept or phrase for that business domain
 * will be immediately rejected.
 */
export const DOMAIN_FENCES: Record<IndustryType, DomainFenceConfig> = {
  GOLD_BUYERS: {
    industryType: "GOLD_BUYERS",
    allowedKeywords: [
      "gold", "bullion", "jewellery", "jewelry", "ornaments", "pledged", "pawn",
      "purity", "xrf", "karat", "carat", "weighing", "scale", "bank transfer",
      "cash", "valuation", "evaluation", "loan release", "market rate", "gram", "spot payment",
      "muthoot", "manappuram", "kadapa", "testing", "rate", "rates", "attica", "pricing",
      "doorstep", "assistance", "transparency", "payment",
    ],
    forbiddenKeywords: [
      "photo", "frame", "framing", "album", "flex", "banner", "sign board",
      "signboard", "mug", "pillow", "keychain", "visiting card", "print", "printing",
      "haircut", "facial", "salon", "spa", "doctor", "dental", "clinic", "hospital",
      "biryani", "food", "restaurant", "dining", "software", "code", "app development",
      "mechanic", "car repair", "bike repair", "gym", "workout", "pre-wedding",
      "candid", "shoots", "photographer",
      // Strictly forbid jewellery manufacturing / showroom concepts (VR GOLD only buys gold/provides services)
      "goldsmith", "making charges", "wastage charges", "jewellery showroom", "jewelry showroom",
      "bought jewellery", "bought jewelry", "purchased jewellery", "purchased jewelry",
      "bridal collection", "jewellery collection", "jewelry collection", "custom jewellery",
      "custom jewelry", "jewellery design", "jewelry design", "latest collection",
      // Strictly forbid unrelated consumer services per explicit rule
      "eyewear", "glasses", "spectacles", "lenses", "opticals", "optician", "hotel", "room",
      "resort", "real estate", "plots", "land", "clothing", "apparel", "saree", "dress",
      "education", "coaching", "school", "college", "tuition",
    ],
    forbiddenPhrases: [
      /\b(photo\s*frames?|wall\s*frames?|acrylic\s*frames?|album\s*designs?|frames?)\b/i,
      /\b(lenses?|eyewear|spectacles?|glasses|opticals?)\b/i,
      /\b(candid\s*photography|pre-weddings?|wedding\s*films?|camera\s*angles?)\b/i,
      /\b(flex\s*banners?|sign\s*boards?|visiting\s*cards?|offset\s*printing)\b/i,
      /\b(cup\s*printings?|magic\s*pillows?|keychain\s*printings?)\b/i,
      /\b(haircuts?|beard\s*groomings?|facials?|makeups?|hairstylists?)\b/i,
      /\b(doctors?|clinics?|treatments?|teeth|dentals?|hospitals?|medicines?)\b/i,
      /\b(biryani|delicious\s*food|tasty\s*meals?|kitchens?|restaurants?)\b/i,
      /\b(hotels?|resorts?|rooms?|real\s*estate|plots?|property|apartments?)\b/i,
      /\b(clothing|textiles?|sarees?|dresses?|apparel|coaching|school|college)\b/i,
      /\b(software\s*dev|app\s*dev|clean\s*code|ui\/ux|developers?)\b/i,
      /\b(car\s*service|bike\s*service|mechanic\s*shop|engine\s*oil|wheel\s*alignment)\b/i,
      // Forbid jewellery sales / manufacturing concepts
      /\b(goldsmith|making\s*charges?|wastage\s*(charges?|percentage)|v\.?a\.?\s*charges?)\b/i,
      /\b(bought\s*(a\s*)?(jeweller(y|ies)|necklace|chain|bangles?|ring|earrings?|ornaments?))\b/i,
      /\b(purchased\s*(a\s*)?(jeweller(y|ies)|necklace|chain|bangles?|ring|earrings?|ornaments?))\b/i,
      /\b(bridal\s*(jeweller(y|ies)|collection)|jeweller(y|ies)\s*showroom|latest\s*jeweller(y|ies)\s*designs?)\b/i,
      /\b(custom\s*jeweller(y|ies)\s*(making|designing|manufacturing))\b/i,
      // Telugu forbidden phrases for gold businesses
      /(ఫ్రేమ్|ఫ్రేములు|లెన్స్|కళ్ళద్దాలు|హాస్పిటల్|డాక్టర్|రెస్టారెంట్|బిర్యానీ|హోటల్|స్కూల్|కాలేజ్|బట్టలు|శారీ|ప్లాట్|ఫ్లాట్|రియల్\s*ఎస్టేట్|మెకానిక్|గ్యారేజ్|కారు\s*రిపేర్)/i,
    ],
    positiveIdentifiers: [
      /\b(sell(ing)?\s*gold|cash\s*for\s*gold|old\s*gold(\s*evaluation|\s*buying)?|gold\s*purity\s*test(ing)?|gold\s*valuation|pledged\s*gold(\s*assistance)?|transparent\s*gold\s*pricing|quick\s*instant\s*payment|doorstep\s*(gold\s*)?evaluation|release\s*pledged\s*gold|bank\s*transfer|spot\s*payment|german\s*xrf|digital\s*weighing|valuation|bullion|karats?|carats?)\b/i,
      /(బంగారం\s*(అమ్మకం|తాకట్టు|విడుదల|ప్యూరిటీ|వాల్యుయేషన్|రేటు|టెస్టింగ్)|గోల్డ్\s*బయ్యర్స్|క్యాష్\s*ఫర్\s*గోల్డ్|ఓల్డ్\s*గోల్డ్|తాకట్టు\s*బంగారం)/i,
    ],
  },

  PRINTING_GRAPHICS: {
    industryType: "PRINTING_GRAPHICS",
    allowedKeywords: [
      "flex", "banner", "banners", "sign board", "sign boards", "signboard", "visiting cards", "vinyl",
      "stickers", "glow sign", "acrylic lettering", "standee", "brochures",
      "pamphlets", "graphic design", "offset", "printing", "vibrant colors",
      "weather proof", "shop board", "digital printing", "color clarity", "board cut",
      "mug printing", "t-shirt printing", "cards", "boards",
    ],
    forbiddenKeywords: [
      "bullion", "pledged", "pawn", "xrf", "purity test", "loan release",
      "haircut", "facial", "salon", "spa", "doctor", "dental", "clinic", "hospital",
      "biryani", "dining", "pre-wedding", "candid wedding", "wedding film",
      "family photo frame", "software dev", "mechanic", "car repair",
    ],
    forbiddenPhrases: [
      /\b(gold\s*rate|pledged\s*gold|purity\s*testing|xrf\s*machines?|sell\s*gold)\b/i,
      /\b(pre-weddings?|candid\s*photography|wedding\s*films?|drone\s*shots?)\b/i,
      /\b(haircuts?|beard\s*trims?|facial\s*cleanups?|spa\s*massages?)\b/i,
      /\b(doctors?|patient\s*care|clinics?|dentals?|treatments?)\b/i,
      /\b(biryani|dining|tasty\s*food|restaurant\s*menus?)\b/i,
      /\b(software\s*apps?|clean\s*code|cloud\s*deployments?)\b/i,
    ],
    positiveIdentifiers: [
      /\b(flex|banners?|sign\s*boards?|visiting\s*cards?|graphics?|prints?|printing|offset|brochures?|pamphlets?|standees?|letterings?|vinyl|stickers?|signage|boards?|mugs?|t-?shirts?)\b/i,
      /(ఫ్లెక్స్|ప్రింటింగ్|బోర్డ్(స్)?|విజిటింగ్\s*కార్డ్(స్)?|బ్యానర్(స్)?|గ్రాఫిక్|డిజైన్|సైనేజ్)/i,
    ],
  },

  PHOTOGRAPHY_STUDIO: {
    industryType: "PHOTOGRAPHY_STUDIO",
    allowedKeywords: [
      "photo", "photography", "candid", "pre-wedding", "wedding film", "portfolio",
      "headshots", "portrait", "gifts", "cup printing", "pillow printing", "magic pillow",
      "keychain", "big size photo", "frame", "frames", "framing", "album", "acrylic frame",
      "canvas", "studio", "camera", "color grading", "drone", "shoots",
    ],
    forbiddenKeywords: [
      "bullion", "pledged", "xrf", "loan release", "pawn",
      "glow sign board", "commercial sign board", "flex banner printing",
      "haircut", "facial", "salon", "doctor", "dental", "clinic",
      "biryani", "restaurant", "software", "code", "car repair",
    ],
    forbiddenPhrases: [
      /\b(gold\s*rates?|pledged\s*gold|xrf\s*testings?|sell\s*gold)\b/i,
      /\b(glow\s*sign\s*boards?|commercial\s*flex\s*banners?|shop\s*hoardings?)\b/i,
      /\b(haircuts?|facial\s*treatments?|spas?)\b/i,
      /\b(doctors?|clinics?|dental\s*care)\b/i,
      /\b(biryani|delicious\s*food|menus?)\b/i,
      /\b(software\s*engineers?|web\s*developments?)\b/i,
    ],
    positiveIdentifiers: [
      /\b(photos?|photography|shoots?|frames?|albums?|candids?|weddings?|studios?|portraits?|canvas(es)?|gifts?|pillows?|cups?|keychains?)\b/i,
      /(ఫోటో(లు)?|ఫ్రేమ్(స్)?|స్టూడియో|షూట్|ఆల్బమ్|వెడ్డింగ్|గిఫ్ట్(స్)?|పిల్లో|కప్)/i,
    ],
  },

  SOFTWARE_IT: {
    industryType: "SOFTWARE_IT",
    allowedKeywords: [
      "software", "web app", "mobile app", "website", "application", "developers",
      "tech support", "code", "cloud", "ui/ux", "frontend", "backend", "api",
      "database", "architecture", "deployment", "agile", "sprint", "it solutions",
    ],
    forbiddenKeywords: [
      "gold", "bullion", "pledged", "photo frame", "flex banner", "sign board",
      "cup printing", "magic pillow", "haircut", "salon", "dental", "doctor",
      "biryani", "food", "car repair", "gym", "workout",
    ],
    forbiddenPhrases: [
      /\b(gold|pledged|bullion|xrf)\b/i,
      /\b(photo\s*frames?|wedding\s*photography|cup\s*printings?|flex\s*banners?)\b/i,
      /\b(haircuts?|salons?|spas?|massages?)\b/i,
      /\b(clinics?|doctors?|dentals?|treatments?)\b/i,
      /\b(biryani|restaurants?|tasty\s*food)\b/i,
    ],
    positiveIdentifiers: [
      /\b(software|tech|developers?|code|apps?|web(site)?|cloud|ui\/ux|support|systems?|platforms?|solutions?|architectures?)\b/i,
      /(సాఫ్ట్‌వేర్|యాప్|వెబ్‌సైట్|డెవలపర్|టెక్|కోడ్)/i,
    ],
  },

  RESTAURANT_FOOD: {
    industryType: "RESTAURANT_FOOD",
    allowedKeywords: [
      "food", "taste", "flavor", "delicious", "dish", "biryani", "starters", "curry",
      "meal", "dining", "chef", "table service", "hygiene", "fresh ingredients",
      "spices", "ambiance", "menu", "seating", "hot serving",
    ],
    forbiddenKeywords: [
      "gold", "pledged", "photo frame", "flex banner", "sign board", "visiting card",
      "software", "code", "app dev", "haircut", "salon", "doctor", "dental",
      "car repair", "gym", "workout",
    ],
    forbiddenPhrases: [
      /\b(gold|bullion|pledged|xrf)\b/i,
      /\b(photo\s*frames?|flex\s*banners?|visiting\s*cards?)\b/i,
      /\b(haircuts?|facials?|stylings?)\b/i,
      /\b(dentals?|doctors?|clinics?)\b/i,
      /\b(software|developers?|clean\s*code)\b/i,
    ],
    positiveIdentifiers: [
      /\b(food|taste|delicious|flavors?|dish(es)?|biryani|meals?|dining|kitchens?|restaurants?|services?|spices?|starters?|curry|curries)\b/i,
      /(రుచి|ఫుడ్|భోజనం|బిర్యానీ|టేస్ట్|రెస్టారెంట్|హోటల్)/i,
    ],
  },

  SALON_BEAUTY: {
    industryType: "SALON_BEAUTY",
    allowedKeywords: [
      "haircut", "styling", "hair", "beard", "grooming", "facial", "cleanup",
      "spa", "massage", "makeup", "bridal", "stylist", "hygienic", "salon",
      "ambiance", "products", "look", "trim",
    ],
    forbiddenKeywords: [
      "gold", "bullion", "pledged", "photo frame", "flex banner", "software",
      "coding", "dental", "doctor clinic", "biryani", "food menu", "car repair",
    ],
    forbiddenPhrases: [
      /\b(gold|pledged|bullion)\b/i,
      /\b(photo\s*frames?|flex\s*banners?|sign\s*boards?)\b/i,
      /\b(software|clean\s*code|app\s*dev)\b/i,
      /\b(biryani|tasty\s*food|curry)\b/i,
    ],
    positiveIdentifiers: [
      /\b(hair|haircuts?|stylings?|stylists?|groomings?|facials?|spas?|salons?|makeups?|beards?|beaut(y|ies)|parlours?|makeover)\b/i,
      /(హెయిర్‌కట్|స్టైలింగ్|సెలూన్|ఫేషియల్|మేకప్|స్పా)/i,
    ],
  },

  HEALTHCARE_CLINIC: {
    industryType: "HEALTHCARE_CLINIC",
    allowedKeywords: [
      "doctor", "clinic", "treatment", "consultation", "diagnosis", "health",
      "dental", "teeth", "painless", "hygiene", "caring", "patient", "medical",
      "prescription", "recovery", "care", "staff", "appointment", "checkup",
    ],
    forbiddenKeywords: [
      "gold", "bullion", "pledged", "photo frame", "flex banner", "visiting cards",
      "haircut", "salon", "spa", "biryani", "delicious food", "software", "code",
    ],
    forbiddenPhrases: [
      /\b(gold|pledged|xrf)\b/i,
      /\b(photo\s*frames?|banners?|sign\s*boards?)\b/i,
      /\b(haircuts?|beards?|stylings?)\b/i,
      /\b(biryani|food\s*taste)\b/i,
      /\b(software|app\s*dev)\b/i,
    ],
    positiveIdentifiers: [
      /\b(doctors?|clinics?|treatments?|consultations?|health|dental|teeth|tooth|patients?|care|medicals?|hygienic|appointments?|checkups?)\b/i,
      /(డాక్టర్|క్లినిక్|వైద్యం|ట్రీట్మెంట్|ఆరోగ్యం|దంత|పంటి)/i,
    ],
  },

  AUTO_GARAGE: {
    industryType: "AUTO_GARAGE",
    allowedKeywords: [
      "vehicle", "car", "bike", "mechanic", "servicing", "repair", "engine",
      "spare parts", "genuine parts", "oil change", "wheel alignment", "brake",
      "driving", "pickup", "garage", "workshop", "inspection",
    ],
    forbiddenKeywords: [
      "gold", "pledged", "photo frame", "flex banner", "wedding shoot",
      "haircut", "salon", "doctor", "dental", "biryani", "software dev",
    ],
    forbiddenPhrases: [
      /\b(gold|bullion|pledged)\b/i,
      /\b(photo\s*frames?|wedding\s*shoots?)\b/i,
      /\b(haircuts?|facials?|salons?)\b/i,
      /\b(doctors?|clinics?|dentals?)\b/i,
      /\b(biryani|tasty\s*food)\b/i,
    ],
    positiveIdentifiers: [
      /\b(vehicles?|cars?|bikes?|mechanics?|services?|repairs?|engines?|parts?|garages?|workshops?|drive|driving|pickup)\b/i,
      /(మెకానిక్|సర్వీస్|రిపేర్|బండి|కారు|బైక్|గ్యారేజ్)/i,
    ],
  },

  FITNESS_GYM: {
    industryType: "FITNESS_GYM",
    allowedKeywords: [
      "gym", "workout", "fitness", "trainer", "coaching", "equipment", "machines",
      "weights", "cardio", "body", "health", "energy", "clean floor", "timing",
    ],
    forbiddenKeywords: [
      "gold", "photo frame", "flex banner", "haircut", "dental", "doctor clinic",
      "biryani", "food menu", "software code", "car mechanic",
    ],
    forbiddenPhrases: [
      /\b(gold|pledged)\b/i,
      /\b(photo\s*frames?|flex\s*banners?)\b/i,
      /\b(haircuts?|facials?)\b/i,
      /\b(dentals?|doctor\s*prescriptions?)\b/i,
      /\b(software\s*code|car\s*service)\b/i,
    ],
    positiveIdentifiers: [
      /\b(gyms?|workouts?|fitness|trainers?|equipments?|coachings?|exercises?|weights?|cardio)\b/i,
      /(జిమ్|వర్కౌట్|ఫిట్‌నెస్|ట్రైనర్|ఎక్సర్‌సైజ్)/i,
    ],
  },

  RETAIL_SHOP: {
    industryType: "RETAIL_SHOP",
    allowedKeywords: [
      "shopping", "collection", "clothes", "dress", "saree", "fabric", "materials",
      "quality", "fitting", "variety", "trends", "store", "purchase", "pricing",
      "sales staff", "customer support",
    ],
    forbiddenKeywords: [
      "gold purity test", "pledged gold loan", "xrf machine", "flex banner printing",
      "commercial sign board", "haircut", "doctor clinic", "dental treatment",
      "software engineering", "car engine repair",
    ],
    forbiddenPhrases: [
      /\b(gold\s*purity|pledged\s*gold|xrf)\b/i,
      /\b(sign\s*boards?|flex\s*banners?)\b/i,
      /\b(haircuts?|facials?|spas?)\b/i,
      /\b(dentals?|doctors?|clinics?)\b/i,
      /\b(software\s*code|car\s*service)\b/i,
    ],
    positiveIdentifiers: [
      /\b(shops?|stores?|collections?|fabrics?|dress(es)?|clothings?|quality|purchases?|shoppings?|variet(y|ies)|sarees?|trends?)\b/i,
      /(షాప్|కలెక్షన్|బట్టలు|క్వాలిటీ|షాపింగ్|స్టోర్|చీరలు)/i,
    ],
  },

  HOTEL_HOSPITALITY: {
    industryType: "HOTEL_HOSPITALITY",
    allowedKeywords: [
      "hotel", "stay", "room", "cleanliness", "hygiene", "bed", "check-in",
      "reception", "staff", "hospitality", "location", "amenities", "peaceful",
    ],
    forbiddenKeywords: [
      "gold testing", "pledged gold", "photo framing", "flex banner",
      "software dev", "haircut", "dental clinic", "car mechanic",
    ],
    forbiddenPhrases: [
      /\b(gold|pledged|xrf)\b/i,
      /\b(flex\s*banners?|sign\s*boards?|photo\s*frames?)\b/i,
      /\b(haircuts?|facials?|salons?)\b/i,
      /\b(clinics?|doctors?|dentals?)\b/i,
    ],
    positiveIdentifiers: [
      /\b(hotels?|stays?|rooms?|hospitalit(y|ies)|check-in|staff|clean|locations?|resorts?|lodgings?)\b/i,
      /(హోటల్|స్టే|రూమ్|హాస్పిటాలిటీ|సర్వీస్)/i,
    ],
  },

  PROFESSIONAL_SERVICES: {
    industryType: "PROFESSIONAL_SERVICES",
    allowedKeywords: [
      "consultation", "advisory", "legal", "tax", "accounting", "guidance",
      "process", "documentation", "clarity", "honest advice", "professional",
      "timely response",
    ],
    forbiddenKeywords: [
      "gold purity", "photo framing", "flex banner", "biryani", "food menu",
      "haircut", "facial", "dental treatment", "car engine",
    ],
    forbiddenPhrases: [
      /\b(gold|pledged|xrf)\b/i,
      /\b(photo\s*frames?|flex\s*banners?|wedding\s*shoots?)\b/i,
      /\b(haircuts?|facials?|salons?)\b/i,
      /\b(biryani|delicious\s*food)\b/i,
    ],
    positiveIdentifiers: [
      /\b(consultations?|advisor(y|ies)|guidance|professionals?|advice|process(es)?|documentations?|tax|legal|audit)\b/i,
      /(సలహా|గైడెన్స్|కన్సల్టేషన్|సర్వీస్|డాక్యుమెంటేషన్)/i,
    ],
  },

  GENERAL: {
    industryType: "GENERAL",
    allowedKeywords: [
      "service", "work", "staff", "response", "quality", "experience", "pricing",
      "commitment", "team", "support", "visit", "order",
    ],
    forbiddenKeywords: [
      "xrf machine", "pledged gold loan", "german testing", "magic pillow",
      "candid wedding photography", "dental extraction", "engine overhaul",
    ],
    forbiddenPhrases: [
      /\b(pledged\s*gold|xrf\s*machines?)\b/i,
      /\b(magic\s*pillows?|candid\s*wedding\s*films?)\b/i,
      /\b(dental\s*treatments?|tooth\s*cleanings?)\b/i,
    ],
    positiveIdentifiers: [
      /\b(services?|quality|staff|response|experience|team|support|work|pricing|orders?)\b/i,
      /(సర్వీస్|క్వాలిటీ|స్టాఫ్|రెస్పాన్స్|అనుభవం)/i,
    ],
  },
};

/**
 * Extract known city/region from business profile strings.
 */
export function extractBusinessLocation(profile: BusinessProfile): string | null {
  const combined = (
    (profile.name || "") + " " +
    (profile.location || "") + " " +
    (profile.tagline || "") + " " +
    (profile.keywords || "")
  ).toLowerCase();

  const cities = [
    "kadapa", "tirupati", "hyderabad", "vijayawada", "visakhapatnam",
    "guntur", "kurnool", "nellore", "bangalore", "bengaluru", "chennai", "proddatur",
  ];

  for (const city of cities) {
    if (combined.includes(city)) {
      // Capitalize first letter
      return city.charAt(0).toUpperCase() + city.slice(1);
    }
  }

  return null;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  matchedForbidden?: string;
}

/**
 * Validates a generated review against the business's actual domain fence.
 * Rejects if:
 * 1. Contains forbidden keywords or regex patterns for the business's industry.
 * 2. Lacks positive domain relevance or alignment with customer tags.
 * 3. Mentions conflicting foreign locations.
 */
export function validateBusinessRelevance(
  reviewText: string,
  profile: BusinessProfile,
  industryOverride?: IndustryType
): ValidationResult {
  const text = (reviewText || "").trim();
  if (text.length < 15) {
    return { valid: false, reason: "Review text too short." };
  }

  const industry = industryOverride
    ? DOMAIN_FENCES[industryOverride]
    : DOMAIN_FENCES[detectIndustry(profile.name, profile.category || "", profile.tagline || "").type];

  if (!industry) {
    return { valid: true };
  }

  const lower = text.toLowerCase();

  // 1. Check forbidden regex phrases (exact multi-word cross-domain leaks)
  for (const regex of industry.forbiddenPhrases) {
    if (regex.test(text)) {
      return {
        valid: false,
        reason: `Violates domain fence: matches forbidden phrase pattern ${regex.source}`,
        matchedForbidden: regex.source,
      };
    }
  }

  // 2. Check forbidden standalone keywords
  for (const forbidden of industry.forbiddenKeywords) {
    // Only check whole words using boundary regex
    const escaped = forbidden.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const wordRegex = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, "i");
    if (wordRegex.test(lower)) {
      return {
        valid: false,
        reason: `Violates domain fence: mentions forbidden keyword "${forbidden}" for ${industry.industryType}`,
        matchedForbidden: forbidden,
      };
    }
  }

  // 3. Positive domain relevance verification
  // Ensure the review aligns with at least one:
  // - Positive domain identifier
  // - One of the customer-selected tags
  // - A keyword from the business profile
  // - One of the business's tagChips
  // - Business name
  let hasRelevance = false;

  for (const posRegex of industry.positiveIdentifiers) {
    if (posRegex.test(text)) {
      hasRelevance = true;
      break;
    }
  }

  if (!hasRelevance && profile.selectedTags && profile.selectedTags.length > 0) {
    for (const tag of profile.selectedTags) {
      if (lower.includes(tag.toLowerCase())) {
        hasRelevance = true;
        break;
      }
    }
  }

  if (!hasRelevance && profile.tagChips) {
    const chips = profile.tagChips.split(",").map((c) => c.trim().toLowerCase()).filter(Boolean);
    for (const chip of chips) {
      if (lower.includes(chip)) {
        hasRelevance = true;
        break;
      }
    }
  }

  if (!hasRelevance && profile.keywords) {
    const kws = profile.keywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
    for (const kw of kws) {
      if (lower.includes(kw)) {
        hasRelevance = true;
        break;
      }
    }
  }

  if (!hasRelevance && profile.name) {
    const cleanName = profile.name.toLowerCase().trim();
    if (cleanName.length > 3 && lower.includes(cleanName)) {
      hasRelevance = true;
    }
  }

  // Allow general positive service words if domain was GENERAL
  if (!hasRelevance && industry.industryType === "GENERAL") {
    hasRelevance = /\b(services?|quality|staff|experience|work|support|pricing)\b/i.test(text);
  }

  if (!hasRelevance) {
    return {
      valid: false,
      reason: `Review lacks domain relevance for ${industry.industryType}`,
    };
  }

  // 4. Location consistency guardrail
  const detectedLocation = extractBusinessLocation(profile);
  if (detectedLocation) {
    const foreignCities = [
      "kadapa", "tirupati", "hyderabad", "vijayawada", "bangalore", "chennai", "proddatur",
    ].filter((c) => c !== detectedLocation.toLowerCase());

    for (const foreign of foreignCities) {
      const foreignRegex = new RegExp(`\\b${foreign}\\b`, "i");
      if (foreignRegex.test(text)) {
        return {
          valid: false,
          reason: `Review mentions foreign location "${foreign}" instead of business city "${detectedLocation}"`,
        };
      }
    }
  }

  // 5. Unconfigured Service Invention Guard (DO NOT INVENT SERVICES)
  const allProfileContext = `${profile.tagChips || ""} ${profile.keywords || ""} ${profile.category || ""} ${profile.tagline || ""}`.toLowerCase();

  // If review mentions doorstep service, verify the merchant actually offers doorstep
  const mentionsDoorstep = /\b(doorstep|door\s*step)\b/i.test(lower) || /(డోర్‌స్టెప్|ఇంటి\s*వద్ద)/i.test(text);
  if (mentionsDoorstep && !allProfileContext.includes("doorstep") && !allProfileContext.includes("door step")) {
    return {
      valid: false,
      reason: `Review invents unconfigured service "Doorstep Service" not in merchant profile`,
    };
  }

  // If review mentions pledged gold release, verify the merchant actually offers pledged gold services
  const mentionsPledged = /\b(pledged?|pawn\s*broker|gold\s*loan)\b/i.test(lower) || /(తాకట్టు|ప్లెడ్జ్డ్|లోన్)/i.test(text);
  if (mentionsPledged && industry.industryType === "GOLD_BUYERS") {
    const allowsPledged = allProfileContext.includes("pledge") || allProfileContext.includes("loan") || allProfileContext.includes("తాకట్టు");
    if (!allowsPledged) {
      return {
        valid: false,
        reason: `Review invents unconfigured service "Pledged Gold Release" not in merchant profile`,
      };
    }
  }

  // 6. Selected Service / Highlight Focus Guard (SELECTED SERVICE MUST CONTROL THE REVIEW)
  if (profile.selectedTags && profile.selectedTags.length > 0) {
    const selectedText = profile.selectedTags.join(" ").toLowerCase();

    // GOLD_BUYERS guards:
    if (industry.industryType === "GOLD_BUYERS") {
      const selectedPledged = selectedText.includes("pledge") || selectedText.includes("loan") || selectedText.includes("తాకట్టు");
      const selectedPurity = selectedText.includes("purity") || selectedText.includes("xrf") || selectedText.includes("ప్యూరిటీ");

      // If user selected purity, but not pledged, review MUST NOT mention pledged/loan
      if (selectedPurity && !selectedPledged && mentionsPledged) {
        return {
          valid: false,
          reason: `Review introduces unselected service "Pledged Gold" when user selected "Gold Purity Testing"`,
        };
      }

      // If user selected pledged gold, review MUST mention pledged/loan release
      if (selectedPledged && !mentionsPledged) {
        return {
          valid: false,
          reason: `Review fails to focus on user-selected highlight "Release Pledged Gold"`,
        };
      }
    }

    // PHOTOGRAPHY_STUDIO guards:
    if (industry.industryType === "PHOTOGRAPHY_STUDIO") {
      const selectedWedding = /wedding|candid|cinematic|pre-wedding|వెడ్డింగ్|షూట్/i.test(selectedText);
      const selectedGifts = /gift|cup|pillow|magic|keychain|గిఫ్ట్|పిల్లో|కీచైన్|మగ్/i.test(selectedText);

      const mentionsGifts = /\b(cup\s*print(ing)?|pillow\s*print(ing)?|magic\s*pillow|keychains?|customized\s*gifts?)\b/i.test(lower) || /(గిఫ్ట్|పిల్లో|కప్|కీచైన్)/i.test(text);
      const mentionsWedding = /\b(pre-weddings?|candid\s*weddings?|wedding\s*films?|cinematics?)\b/i.test(lower) || /(వెడ్డింగ్|షూట్|సినిమాటిక్)/i.test(text);

      if (selectedWedding && !selectedGifts && mentionsGifts) {
        return {
          valid: false,
          reason: `Review introduces unselected gift merchandise when user selected Wedding Photography`,
        };
      }
      if (selectedGifts && !selectedWedding && mentionsWedding) {
        return {
          valid: false,
          reason: `Review introduces unselected Wedding Photography when user selected Custom Gifts`,
        };
      }
    }

    // PRINTING_GRAPHICS guards:
    if (industry.industryType === "PRINTING_GRAPHICS") {
      const selectedMug = /mug|t-?shirt|మగ్/i.test(selectedText);
      const selectedSignage = /flex|banner|sign\s*board|glow|acrylic|బోర్డు/i.test(selectedText);

      const mentionsMug = /\b(mugs?|t-?shirts?)\b/i.test(lower) || /(మగ్|టీషర్ట్)/i.test(text);
      if (selectedSignage && !selectedMug && mentionsMug) {
        return {
          valid: false,
          reason: `Review introduces unselected merchandise when user selected Flex/Sign Boards`,
        };
      }
    }
  }

  return { valid: true };
}
