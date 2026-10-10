import { GoogleGenAI } from "@google/genai";
import { detectIndustry, IndustryType } from "./industry";
import {
  fetchRecentReviewHistory,
  recordGeneratedReviews,
  validateReviewUniqueness,
  MemoryReviewItem,
} from "./review-memory";
import {
  synthesizeUniqueReviews,
  LanguageMode,
} from "./review-synthesizer";
import {
  validateBusinessRelevance,
  extractBusinessLocation,
  DOMAIN_FENCES,
  BusinessProfile,
} from "./domain-fences";

interface GenerateReviewParams {
  businessId?: string;
  businessName: string;
  tagline?: string | null;
  location?: string;
  selectedTags?: string[];
  keywords?: string;
  tagChips?: string;
  tone?: string;
  customNote?: string;
  category?: string;
  languageMode?: LanguageMode;
}

export interface ReviewOption {
  id: number;
  text: string;
  headline: string;
  tone: string;
  structureTag?: string;
  writingStyle?: string;
  languageMix?: string;
}

export async function generateAiReviews(params: GenerateReviewParams): Promise<ReviewOption[]> {
  const {
    businessId,
    businessName,
    tagline,
    location,
    selectedTags = [],
    keywords,
    tagChips,
    tone = "friendly",
    customNote,
    category,
    languageMode = "AUTO",
  } = params;

  // 1. Fetch recent review memory from database to enforce zero-repetition
  const history: MemoryReviewItem[] = await fetchRecentReviewHistory(businessId, 50);
  const pastOpenings = history.map((h) => h.openingPhrase).filter(Boolean).slice(0, 10);

  const industry = detectIndustry(businessName, category || "", tagline || "");
  const fence = DOMAIN_FENCES[industry.type];

  // Consolidate active tags
  let activeTags = selectedTags.length > 0 ? selectedTags : [];
  if (activeTags.length === 0 && tagChips) {
    activeTags = tagChips.split(",").map((t) => t.trim()).filter(Boolean);
  }
  if (activeTags.length === 0) {
    activeTags = industry.tags.slice(0, 3);
  }
  const tagsString = activeTags.join(", ");

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

  const detectedCity = extractBusinessLocation(profile);
  const apiKey = process.env.GEMINI_API_KEY;

  // 2. Try Gemini AI if API Key is configured
  if (apiKey && apiKey.trim().length > 5) {
    const modelsToTry = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-3.8-flash", "gemini-2.5-flash"];

    const forbiddenList = fence.forbiddenKeywords.slice(0, 15).join(", ");

    // Determine language guidance
    let languageInstruction = "";
    if (languageMode === "TELUGU_SCRIPT") {
      languageInstruction = `CRITICAL LANGUAGE REQUIREMENT: Write ALL 3 reviews in authentic, natural TELUGU SCRIPT (తెలుగు), as written by local customers on mobile.`;
    } else if (languageMode === "TELUGU_ROMAN" || languageMode === "TELUGU_ENGLISH") {
      languageInstruction = `CRITICAL LANGUAGE REQUIREMENT: Write ALL 3 reviews in authentic TANGLISH (conversational Telugu typed in English script, e.g., 'Chala baga chesaru, super quality and fast service. Staff kuda friendly ga unaru.').`;
    } else if (languageMode === "ENGLISH") {
      languageInstruction = `CRITICAL LANGUAGE REQUIREMENT: Write ALL 3 reviews in natural, conversational English.`;
    } else {
      // AUTO
      if (detectedCity) {
        languageInstruction = `LANGUAGE REQUIREMENT:
- Review 1: Natural conversational English.
- Review 2: Authentic Telugu Script (తెలుగు).
- Review 3: Authentic Tanglish (Telugu in English alphabet, e.g., 'Work chala clean ga chesaru, time ki delivery icharu.').`;
      } else {
        languageInstruction = `LANGUAGE REQUIREMENT: Write all 3 reviews in authentic, human-sounding English.`;
      }
    }

    const goldBuyerInstruction = industry.type === "GOLD_BUYERS" ? `
CRITICAL POSITIONING (GOLD BUYING & PLEDGED GOLD SERVICE):
This business is a gold-buying and pledged-gold assistance service (similar to Attica Gold Company). It is NOT a goldsmith or jewellery manufacturer, and does NOT sell jewellery to retail customers.
- Customers visit to SELL existing gold for cash, get old gold evaluated, get computerized German XRF purity testing, transparent gold valuation, assistance releasing pledged gold from banks, and immediate payment via bank transfer.
- DO NOT mention buying jewellery, necklace/chain designs, bridal collections, making charges, or wastage.
` : "";

    const toursTravelsInstruction = industry.type === "TOURS_TRAVELS" ? `
CRITICAL POSITIONING (TOURS, TRAVELS & SELF-DRIVE CAR RENTALS):
This business provides cab services, outstation trips, airport transfers, pilgrimage packages (Tirupati, Gandikota), and self-drive car rentals in Andhra Pradesh (Kadapa/Rayalaseema).
- Customers review their travel experiences: punctuality, AC cooling, safe driving on highways and ghat roads, clean sanitized vehicles (Innova Crysta, Etios, Swift), transparent pricing with no hidden charges, fast handover and quick security deposit refund for self-drive cars.
- DO NOT mention gold, jewellery, salon, haircuts, food, restaurants, doctor/clinic, photography studio, or general hardware/material.
` : "";

    const tattooStudioInstruction = industry.type === "TATTOO_STUDIO" ? `
CRITICAL POSITIONING (TATTOO & BODY PIERCING STUDIO):
This business is a professional tattoo and body piercing studio (Karthik Tattoo Studio KTS in Kadapa).
- Customers review getting inked or pierced: custom tattoo art, portrait accuracy, fine-line detailing, smooth shading, sterile single-use needles, wireless tattoo machine, studio hygiene, ear/nose/helix piercings done gently with minimal pain, transparent pricing, and clear aftercare healing advice.
- DO NOT mention gold buying, jewellery, cabs, travel/rental, flex printing, visiting cards, salons/haircuts, restaurants/food, dental/clinics, or software.
` : "";

    const applianceRepairInstruction = industry.type === "APPLIANCE_REPAIR" ? `
CRITICAL POSITIONING (AC, REFRIGERATOR & HOME APPLIANCE REPAIR SERVICES):
This business is a premier AC, refrigerator, and washing machine repair & servicing specialist in Kadapa (AS Refrigeration).
- Customers review doorstep appliance repair: deep AC jet cleaning, foam wash, prompt cooling restoration, accurate gas charging (R32, R410, R22), compressor/coil repair, single/double door fridge cooling issues fixed, washing machine motor/spin problems resolved, transparent visiting charges, fair quotation with no hidden costs, polite and certified technicians arriving on time.
- DO NOT mention gold buying, jewellery, cabs, car rental, tattoo art, body piercings, salons, haircut, flex printing, dental clinics, or software dev.
` : "";

    const prompt = `You are a real customer writing an authentic, human-sounding 5-star Google review on your phone.
Business Name: "${businessName}"
Industry: ${industry.label}
${detectedCity ? `Location / City: ${detectedCity}` : ""}
${tagline ? `Tagline: "${tagline}"` : ""}
Things the customer liked: ${tagsString}
${keywords ? `Natural business services/context: ${keywords}` : ""}
${customNote ? `Specific customer comment/note: "${customNote}"` : ""}
Desired tone: ${tone}

${languageInstruction}
${goldBuyerInstruction}
${toursTravelsInstruction}
${tattooStudioInstruction}
${applianceRepairInstruction}

CRITICAL BUSINESS-SPECIFIC & ZERO-POLLUTION RULES:
1. STRICT FOCUS ON SELECTED SERVICES:
   - Ground the review STRICTLY in what the customer experienced / selected (${tagsString}).
   - DO NOT invent unselected services or facilities.
   - For example: if the customer selected "Gold Purity Testing", review MUST focus on purity testing and NOT mention releasing pledged bank loans or doorstep evaluation unless explicitly selected.
   - If the customer selected "Release Pledged Gold", review MUST focus on gold loan release and pledged gold settlement.
2. ABSOLUTELY DO NOT mention concepts, products, or services from other industries.
   FORBIDDEN CONCEPTS (DO NOT USE): ${forbiddenList}.
3. RELEVANCE > CREATIVITY: Keep reviews simple, authentic, and accurate rather than elaborately inventing unverified claims.
4. Sound like a REAL LOCAL CUSTOMER — NOT a marketing bot.
4. ABSOLUTELY DO NOT use generic clichés such as:
   - "Had a wonderful experience with..."
   - "Great experience..."
   - "Excellent service..."
   - "Highly recommend..."
   - "Amazing service..."
   - "Very happy with..."
   - "Good quality and service..."
   - "made our memories truly special"
   - "exemplary", "testament to", "transcends expectations", "a game changer".
5. DO NOT repeat any of these previously used openings:
${pastOpenings.length > 0 ? pastOpenings.map((op) => `   - "${op}..."`).join("\n") : "   (None yet)"}
6. Provide 3 completely distinct reviews with different lengths, different structures, and different openings:
   - Review 1: Very short (1-2 punchy, human-typed sentences).
   - Review 2: Medium product/service quality observation.
   - Review 3: Detailed conversational review with specific observations.

Output strictly a JSON array without markdown formatting:
[
  { "id": 1, "headline": "...", "text": "...", "tone": "..." },
  { "id": 2, "headline": "...", "text": "...", "tone": "..." },
  { "id": 3, "headline": "...", "text": "...", "tone": "..." }
]`;

    for (const model of modelsToTry) {
      try {
        const client = new GoogleGenAI({ apiKey });

        const response = await client.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.95,
            responseMimeType: "application/json",
          },
        });

        const responseText = response.text || "";
        const cleaned = responseText.replace(/```json/gi, "").replace(/```/gi, "").trim();
        const parsed = JSON.parse(cleaned);

        if (Array.isArray(parsed) && parsed.length >= 3 && parsed[0]?.text) {
          const validatedReviews: ReviewOption[] = [];
          const acceptedTexts: string[] = [];

          for (let i = 0; i < parsed.length; i++) {
            const item = parsed[i];
            const candidateText = (item.text || "").trim();

            // 1. Uniqueness check
            const uniq = validateReviewUniqueness(candidateText, history, acceptedTexts, businessName);
            if (!uniq.valid) continue;

            // 2. Business Relevance & Domain Fence check
            const rel = validateBusinessRelevance(candidateText, profile, industry.type);
            if (!rel.valid) continue;

            acceptedTexts.push(candidateText);
            validatedReviews.push({
              id: validatedReviews.length + 1,
              headline: item.headline || "Authentic Review",
              text: candidateText,
              tone: item.tone || "Customer Experience",
              structureTag: `GEMINI_SLOT_${i + 1}`,
              writingStyle: "gemini_generative",
              languageMix: languageMode,
            });
          }

          // If at least 3 passed both uniqueness AND domain relevance checks, record and return!
          if (validatedReviews.length >= 3) {
            recordGeneratedReviews(
              validatedReviews.map((r) => ({
                text: r.text,
                structureTag: r.structureTag,
                writingStyle: r.writingStyle,
                languageMix: r.languageMix,
                tagsUsed: tagsString,
              })),
              businessId,
              businessName,
              category
            ).catch(() => {});

            return validatedReviews.slice(0, 3);
          }
        }
      } catch (err: any) {
        // Proceed to next model or synthesizer fallback
      }
    }
  }

  // 3. High-entropy, Domain-Fenced Combinatorial Synthesizer
  // Guarantees zero cross-contamination, zero duplicates, authentic Telugu/Tanglish, and 100% domain relevance
  const synthesized = synthesizeUniqueReviews({
    businessName,
    category: category || industry.label,
    tagline,
    location,
    keywords,
    tagChips,
    selectedTags: activeTags,
    customNote,
    tone,
    languageMode,
    history,
  });

  // Record newly synthesized reviews to database memory in the background
  recordGeneratedReviews(
    synthesized.map((r) => ({
      text: r.text,
      structureTag: r.structureTag,
      writingStyle: r.writingStyle,
      languageMix: r.languageMix,
      tagsUsed: tagsString,
    })),
    businessId,
    businessName,
    category
  ).catch(() => {});

  return synthesized;
}

export async function generateReviewReply(
  businessName: string,
  reviewText: string,
  rating: number,
  reviewerName?: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const nameGreeting = reviewerName ? ` ${reviewerName}` : "";

  if (apiKey && apiKey.trim().length > 5) {
    const modelsToTry = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-3.8-flash", "gemini-2.5-flash"];
    for (const model of modelsToTry) {
      try {
        const client = new GoogleGenAI({ apiKey });
        const prompt = `You are the owner/manager of "${businessName}". 
A customer left this ${rating}-star review on Google:
"${reviewText}"
Customer Name: ${reviewerName || "Valued Customer"}

Write a short, warm, professional 1-2 sentence response thanking them specifically for their support. Sound genuine, humble, and polite. Never use generic AI clichés.`;

        const response = await client.models.generateContent({
          model,
          contents: prompt,
        });

        if (response.text?.trim()) {
          return response.text.trim();
        }
      } catch {
        // Continue to fallback
      }
    }
  }

  // Intelligent dynamic fallback for review reply
  if (rating >= 4) {
    const highStarReplies = [
      `Thank you so much${nameGreeting} for visiting us and sharing your kind words! We look forward to serving you again.`,
      `Really appreciate your feedback${nameGreeting}! Our team is glad you had a pleasant experience with us.`,
      `Thank you${nameGreeting}! Your support means a lot to our local team. See you again soon!`,
    ];
    return highStarReplies[Math.floor(Math.random() * highStarReplies.length)];
  }

  return `Thank you for taking the time to share your feedback${nameGreeting}. We are continuously working to improve and would appreciate the chance to make things right.`;
}
