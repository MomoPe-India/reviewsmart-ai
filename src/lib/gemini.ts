import { GoogleGenAI } from "@google/genai";
import { detectIndustry } from "./industry";

interface GenerateReviewParams {
  businessName: string;
  tagline?: string | null;
  selectedTags: string[];
  keywords?: string;
  tone?: string;
  customNote?: string;
  category?: string;
}

export interface ReviewOption {
  id: number;
  text: string;
  headline: string;
  tone: string;
}

export async function generateAiReviews(params: GenerateReviewParams): Promise<ReviewOption[]> {
  const {
    businessName,
    tagline,
    selectedTags,
    keywords,
    tone = "friendly",
    customNote,
    category,
  } = params;

  // 1. Detect industry vertical
  const industry = detectIndustry(businessName, category || "", tagline || "");
  const activeTags = selectedTags.length > 0 ? selectedTags : industry.tags.slice(0, 3);
  const tagsString = activeTags.join(", ");

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 5) {
    // Try gemini-2.5-flash first, then gemini-2.0-flash
    const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash"];

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

CRITICAL RULES FOR AUTHENTICITY:
1. Sound like a REAL PERSON who actually visited this business — NOT an AI marketing bot.
2. DO NOT use generic AI clichés like "exemplary", "testament to", "transcends expectations", "delve into", "epitome of", or "a game changer".
3. Use natural, conversational, everyday phrasing that regular customers use on Google Maps (e.g., "Had a really good experience here", "Staff was very polite and helpful", "Fair prices and great quality", "Clean place and quick service").
4. Tailor vocabulary strictly to ${industry.label}. Never mix medical terms into food, or food terms into fashion/clothing!
5. NEVER fabricate specific employee names, fake dates, or claims not mentioned.
6. Provide exactly 3 distinct reviews with different lengths and styles:
   - Review 1 (Quick & Direct): 1-2 punchy, genuine sentences.
   - Review 2 (Detailed & Helpful): 2-3 sentences with specific praise on quality, service, and atmosphere.
   - Review 3 (Warm Recommendation): 2-3 sentences warmly recommending the place to locals.

Output strictly a JSON array without markdown formatting:
[
  { "id": 1, "headline": "Quick Take", "text": "...", "tone": "Quick & Direct" },
  { "id": 2, "headline": "Detailed Experience", "text": "...", "tone": "Detailed & Helpful" },
  { "id": 3, "headline": "Warm Recommendation", "text": "...", "tone": "Warm Recommendation" }
]`;

        const response = await client.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.85,
            responseMimeType: "application/json",
          },
        });

        const responseText = response.text || "";
        const cleaned = responseText.replace(/```json/gi, "").replace(/```/gi, "").trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed.length >= 3 && parsed[0]?.text) {
          return parsed;
        }
      } catch (err: any) {
        console.warn(`Gemini (${model}) attempt failed:`, err?.message || err);
        // Continue to fallback model or dynamic generator
      }
    }
  }

  // 2. High-entropy dynamic industry generator fallback
  const drafts = industry.reviewDrafts;
  const tagsFormatted = activeTags.join(" and ");

  return [
    {
      id: 1,
      headline: drafts.direct.headline,
      text: drafts.direct.text(businessName, tagsFormatted, customNote),
      tone: "Quick & Direct",
    },
    {
      id: 2,
      headline: drafts.detailed.headline,
      text: drafts.detailed.text(businessName, tagsFormatted, customNote),
      tone: "Detailed & Helpful",
    },
    {
      id: 3,
      headline: drafts.enthusiastic.headline,
      text: drafts.enthusiastic.text(businessName, tagsFormatted, customNote),
      tone: "Warm Recommendation",
    },
  ];
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
    const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash"];
    for (const model of modelsToTry) {
      try {
        const client = new GoogleGenAI({ apiKey });
        const prompt = `You are the owner/manager of "${businessName}". 
A customer left this ${rating}-star review on Google:
"${reviewText}"
Customer Name: ${reviewerName || "Valued Customer"}

Write a warm, authentic, polite reply to post on your Google Business Profile.
Guidelines:
- Keep it concise (2-3 sentences).
- If 4-5 stars: thank them sincerely and mention looking forward to welcoming them back.
- If 1-3 stars: apologize politely for their experience, take accountability, and invite them to reach out directly so you can resolve the issue.
- Sound genuine, respectful, and professional.`;

        const response = await client.models.generateContent({
          model,
          contents: prompt,
        });

        if (response.text) {
          return response.text.trim();
        }
      } catch (err) {
        console.warn(`Gemini reply (${model}) error:`, err);
      }
    }
  }

  // Fallback replies
  if (rating >= 4) {
    return `Thank you so much${nameGreeting} for the fantastic 5-star review! The entire team at ${businessName} truly appreciates your kind feedback. We look forward to serving you again soon!`;
  } else {
    return `Hi${nameGreeting}, thank you for sharing your feedback. We sincerely apologize that your experience did not meet expectations. We take quality and service very seriously at ${businessName}. Please contact us directly so we can understand what happened and make things right.`;
  }
}
