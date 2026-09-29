import { GoogleGenAI } from "@google/genai";
import { detectIndustry } from "./industry";
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

interface GenerateReviewParams {
  businessId?: string;
  businessName: string;
  tagline?: string | null;
  selectedTags?: string[];
  keywords?: string;
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
    selectedTags = [],
    keywords,
    tone = "friendly",
    customNote,
    category,
    languageMode = "AUTO",
  } = params;

  // 1. Fetch recent review memory from database to enforce zero-repetition
  const history: MemoryReviewItem[] = await fetchRecentReviewHistory(businessId, 50);
  const pastOpenings = history.map((h) => h.openingPhrase).filter(Boolean).slice(0, 10);

  const industry = detectIndustry(businessName, category || "", tagline || "");
  const activeTags = selectedTags.length > 0 ? selectedTags : industry.tags.slice(0, 3);
  const tagsString = activeTags.join(", ");

  const apiKey = process.env.GEMINI_API_KEY;

  // 2. Try Gemini AI if API Key is configured
  if (apiKey && apiKey.trim().length > 5) {
    const modelsToTry = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-3.8-flash", "gemini-2.5-flash"];

    for (const model of modelsToTry) {
      try {
        const client = new GoogleGenAI({ apiKey });

        const prompt = `You are a real customer writing an authentic, human-sounding 5-star Google review on your phone.
Business Name: "${businessName}"
Industry: ${industry.label}
${tagline ? `Tagline: "${tagline}"` : ""}
Things the customer liked: ${tagsString}
${keywords ? `Natural business services/context: ${keywords}` : ""}
${customNote ? `Specific customer comment/note: "${customNote}"` : ""}
Desired tone: ${tone}

CRITICAL ZERO-DUPLICATION & ANTI-REPETITION RULES:
1. Sound like a REAL PERSON who actually visited this business — NOT an AI marketing bot.
2. ABSOLUTELY DO NOT use generic clichés such as:
   - "Had a wonderful experience with..."
   - "Great experience..."
   - "Excellent service..."
   - "Highly recommend..."
   - "Amazing service..."
   - "Very happy with..."
   - "Good quality and service..."
   - "made our memories truly special"
   - "exemplary", "testament to", "transcends expectations", "a game changer".
3. DO NOT repeat any of these previously used openings:
${pastOpenings.length > 0 ? pastOpenings.map((op) => `   - "${op}..."`).join("\n") : "   (None yet)"}
4. Tailor vocabulary strictly to ${industry.label}.
5. Provide 3 completely distinct reviews with different lengths, different structures, and different openings:
   - Review 1: Very short (1-2 punchy, human-typed sentences).
   - Review 2: Medium product/service quality observation.
   - Review 3: Detailed conversational review with specific observations.

Output strictly a JSON array without markdown formatting:
[
  { "id": 1, "headline": "Quick & Direct", "text": "...", "tone": "Quick & Direct" },
  { "id": 2, "headline": "Quality Observation", "text": "...", "tone": "Quality Observation" },
  { "id": 3, "headline": "Detailed Experience", "text": "...", "tone": "Detailed Experience" }
]`;

        const response = await client.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.95, // High entropy for maximum variety
            responseMimeType: "application/json",
          },
        });

        const responseText = response.text || "";
        const cleaned = responseText.replace(/```json/gi, "").replace(/```/gi, "").trim();
        const parsed = JSON.parse(cleaned);

        if (Array.isArray(parsed) && parsed.length >= 3 && parsed[0]?.text) {
          // Validate all 3 reviews against uniqueness rules
          const validatedReviews: ReviewOption[] = [];
          const acceptedTexts: string[] = [];

          for (let i = 0; i < parsed.length; i++) {
            const item = parsed[i];
            const check = validateReviewUniqueness(item.text, history, acceptedTexts);
            if (check.valid) {
              acceptedTexts.push(item.text);
              validatedReviews.push({
                id: validatedReviews.length + 1,
                headline: item.headline || "Authentic Review",
                text: item.text,
                tone: item.tone || "Customer Experience",
                structureTag: `GEMINI_SLOT_${i + 1}`,
                writingStyle: "gemini_generative",
                languageMix: "ENGLISH",
              });
            }
          }

          // If at least 3 passed uniqueness check, record and return!
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
        // Proceed to high-entropy zero-repetition synthesizer
      }
    }
  }

  // 3. High-entropy Linguistic Combinatorial Synthesizer
  // Guarantees zero duplicates, varied structures (A-G), 18 writing styles, and Telugu-English mixing
  const synthesized = synthesizeUniqueReviews({
    businessName,
    category: category || industry.label,
    tagline,
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
