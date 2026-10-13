import { IndustryType } from "./industry";
import { LanguageMode } from "./review-synthesizer";

export function detectScriptLanguage(text: string, spokenLang?: string): LanguageMode | null {
  if (!text) return null;
  if (/[\u0C00-\u0C7F]/.test(text) || spokenLang === "te-IN") return "TELUGU_SCRIPT";
  if (/[\u0900-\u097F]/.test(text) || spokenLang === "hi-IN") return "HINDI";
  if (/[\u0B80-\u0BFF]/.test(text) || spokenLang === "ta-IN") return "TAMIL";
  if (/[\u0C80-\u0CFF]/.test(text) || spokenLang === "kn-IN") return "KANNADA";
  if (/[\u0D00-\u0D7F]/.test(text) || spokenLang === "ml-IN") return "MALAYALAM";

  const lower = text.toLowerCase();
  if (/\b(chala|bagundi|baga|chesaru|vacharu|super ga|manchi|tvaraga)\b/.test(lower)) {
    return "TELUGU_SCRIPT";
  }
  if (/\b(bahut|accha|badhiya|kaam|shandar|sahi|waqt)\b/.test(lower)) {
    return "HINDI";
  }
  if (/\b(romba|nalla|supera|seithanga|nerathuku)\b/.test(lower)) {
    return "TAMIL";
  }
  if (/\b(thumba|chennagide|olle|sariyagi)\b/.test(lower)) {
    return "KANNADA";
  }
  if (/\b(valare|nalla|sevanam|adipoli)\b/.test(lower)) {
    return "MALAYALAM";
  }
  return null;
}

export function hasNonLatinScript(text: string): boolean {
  return /[\u0900-\u0D7F]/.test(text);
}

/**
 * Translates common spoken Telugu, Hindi, Tamil, Kannada, Malayalam, and Tanglish/Hinglish
 * customer expressions into natural, grammatical English for instant 0ms preview and fallback synthesis.
 */
export function translateSpokenRegionalToEnglish(text: string, spokenLang?: string): string {
  if (!text || !text.trim()) return "";
  const trimmed = text.trim();

  // If pure Latin without regional colloquialisms, return as-is
  if (
    !hasNonLatinScript(trimmed) &&
    !/\b(chala|bagundi|baga|chesaru|vacharu|manchi|tvaraga|bahut|accha|badhiya|kaam|shandar|romba|nalla|thumba|chennagide|valare|adipoli)\b/i.test(
      trimmed
    )
  ) {
    return trimmed;
  }

  const traits: string[] = [];
  const lower = trimmed.toLowerCase();

  // Quality / Good work
  if (
    /చాలా బాగుంది|బాగా చేశారు|సూపర్|మంచి|अच्छा|बढ़िया|शानदार|நல்ல|அருமை|ಚೆನ್ನಾಗಿದೆ|ಉತ್ತಮ|നല്ല|അടിപൊളി|\b(chala baga|bagundi|bahut accha|badhiya|romba nalla|thumba chennagide|valare nalla|adipoli)\b/i.test(
      trimmed
    )
  ) {
    traits.push("the work quality was neat and genuinely impressive");
  }

  // Punctuality / Fast service
  if (
    /టైమ్|సమయానికి|త్వరగా|ఫాస్ట్|समय|जल्दी|फास्ट|நேரத்திற்கு|வேகமாக|ಸಮಯಕ್ಕೆ|വേഗത്തിൽ|കൃത്യസമയത്ത്|\b(time ki|tvaraga|fast ga|jaldi|waqt par|nerathuku)\b/i.test(
      trimmed
    )
  ) {
    traits.push("they completed the service right on time without any delay");
  }

  // Staff / Politeness
  if (
    /మర్యాద|స్టాఫ్|టెక్నీషియన్|স্টാफ|स्टाफ|विनम्र|ஊழியர்கள்|ಸಿಬ್ಬಂದಿ|സ്റ്റാഫ്|\b(staff|technician|polite|friendly|maryada)\b/i.test(
      trimmed
    )
  ) {
    traits.push("the staff were polite, patient, and cooperative");
  }

  // Pricing / Reasonable cost
  if (
    /రేట్|ధర|తక్కువ|రీజనబుల్|दाम|कीमत|उचित|விலை|ಬೆಲೆ|വില|\b(rate|price|reasonable|takkuva|sahi daam)\b/i.test(
      trimmed
    )
  ) {
    traits.push("the pricing was transparent and very reasonable");
  }

  // Cooling / AC / Repair specific
  if (/కూలింగ్|ఏసీ|ఫ్రిజ్|वाशिंग|एसी|कूलिंग|\b(cooling|ac|fridge|jet wash|gas)\b/i.test(lower)) {
    traits.push("the cooling performance is restored to brand-new condition");
  }

  if (traits.length > 0) {
    const joined = traits.join(", and ");
    return joined.charAt(0).toUpperCase() + joined.slice(1);
  }

  return "The overall service quality, prompt execution, and attention to detail stood out";
}

/**
 * Generates authentic visual observations for each industry when a customer snaps a photo.
 */
export function getIndustryPhotoObservation(
  industry: IndustryType,
  lang: LanguageMode = "ENGLISH"
): string {
  if (lang === "TELUGU_SCRIPT") {
    switch (industry) {
      case "APPLIANCE_REPAIR":
        return "ఫోటోలో కనిపిస్తున్నట్లుగా ఏసీ యూనిట్ ని చాలా నీట్ గా క్లీన్ చేసి ఫుల్ కూలింగ్ వచ్చేలా సెట్ చేశారు.";
      case "GOLD_BUYERS":
        return "ఫోటోలో చూపినట్లుగా జర్మన్ మిషన్ తో కళ్ళముందే ప్యూరిటీ చెక్ చేసి వెంటనే పేమెంట్ వేశారు.";
      case "TATTOO_STUDIO":
        return "ఫోటోలో కనిపిస్తున్నట్లుగా టాటూ లైన్ వర్క్ మరియు ఫినిషింగ్ చాలా షార్ప్ గా వచ్చింది.";
      case "PRINTING_GRAPHICS":
        return "ఫోటోలో కనిపిస్తున్నట్లుగా ప్రింటింగ్ కలర్స్ మరియు క్వాలిటీ చాలా షార్ప్ గా వచ్చాయి.";
      case "RESTAURANT_FOOD":
        return "ఫోటోలో చూస్తున్నట్లుగా ఫుడ్ ప్రజెంటేషన్ మరియు టేస్ట్ చాలా బాగున్నాయి.";
      case "RETAIL_SHOP":
        return "ఫోటోలో కనిపిస్తున్నట్లుగా క్వాలిటీ మరియు ఫిట్టింగ్ చాలా పర్ఫెక్ట్ గా ఉన్నాయి.";
      case "SALON_BEAUTY":
        return "ఫోటోలో కనిపిస్తున్నట్లుగా స్టైలింగ్ మరియు ఫినిషింగ్ చాలా నీట్ గా వచ్చాయి.";
      default:
        return "ఫోటోలో కనిపిస్తున్నట్లుగా క్వాలిటీ మరియు ఫినిషింగ్ చాలా నీట్ గా ఉన్నాయి.";
    }
  }

  if (lang === "HINDI") {
    switch (industry) {
      case "APPLIANCE_REPAIR":
        return "जैसा कि फोटो में दिख रहा है, एसी की जेट क्लीनिंग बहुत सफाई से की गई है और कूलिंग एकदम बढ़िया है।";
      case "GOLD_BUYERS":
        return "जैसा फोटो में दिख रहा है, मशीन से हमारे सामने सोने की शुद्धता जांचकर तुरंत पेमेंट दिया गया।";
      default:
        return "जैसा कि फोटो में साफ दिख रहा है, काम की फिनिशिंग और क्वालिटी वाकई शानदार है।";
    }
  }

  switch (industry) {
    case "APPLIANCE_REPAIR":
      return "As seen in the photo, the unit was thoroughly cleaned inside-out with zero mess left behind.";
    case "GOLD_BUYERS":
      return "As shown in the photo, the digital purity testing and weight valuation were done transparently right in front of us.";
    case "TATTOO_STUDIO":
      return "As you can see in the photo, the crisp linework, shading precision, and clean studio hygiene really stand out.";
    case "PRINTING_GRAPHICS":
      return "As visible in the photo, the print resolution, color vibrancy, and edge finishing came out super sharp.";
    case "RESTAURANT_FOOD":
      return "As seen in the photo, the fresh presentation and generous portion size matched the great taste.";
    case "RETAIL_SHOP":
      return "As shown in the photo, the fabric texture, color finish, and custom fitting turned out spot-on.";
    case "SALON_BEAUTY":
      return "As seen in the photo, the clean styling, neat finish, and attention to detail turned out great.";
    case "TOURS_TRAVELS":
      return "As seen in the photo, the vehicle interior and exterior were spotless and well-maintained for the journey.";
    default:
      return "As visible in the attached photo, the neat finishing and attention to detail really stand out.";
  }
}
