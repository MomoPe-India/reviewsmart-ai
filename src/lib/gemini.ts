import { GoogleGenAI } from "@google/genai";
import { detectIndustry, INDUSTRY_CONFIGS } from "./industry";

interface GenerateReviewParams {
  businessName: string;
  tagline?: string | null;
  selectedTags: string[];
  keywords?: string;
  tone?: string;
  customNote?: string;
  category?: string;
}

interface ReviewOption {
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
    try {
      const client = new GoogleGenAI({ apiKey });

      const prompt = `
You are an expert review assistant creating authentic, human-sounding 5-star Google reviews.
Business Name: "${businessName}"
Industry / Domain: ${industry.label} (${industry.tagline})
${tagline ? `Tagline: "${tagline}"` : ""}
Selected Customer Highlights: ${tagsString}
${keywords ? `Key terms/services: ${keywords}` : ""}
${customNote ? `Customer specific detail or note: "${customNote}"` : ""}
Target Tone: ${tone}

IMPORTANT GUIDELINES:
1. Tailor the review vocabulary strictly to this specific business industry (${industry.label}). For example, if it is a tech/software company, talk about dev speed, tech stack, clean code, responsive support, and UI/UX. If it is a clinic, talk about hygiene, gentle doctors, and painless care. Do NOT use food or restaurant phrases unless this is a dining business!
2. Write 3 distinct, authentic 5-star reviews as if written by real customers on a smartphone.
3. Variation 1: Short & Punchy (2 sentences).
4. Variation 2: Detailed & Warm (3-4 sentences, highlighting execution & communication).
5. Variation 3: Enthusiastic & Strong Recommendation ("10/10 would recommend!").
6. Output strictly a JSON array with schema:
[
  { "id": 1, "headline": "Catchy Title", "text": "...", "tone": "Direct & Punchy" },
  { "id": 2, "headline": "Catchy Title", "text": "...", "tone": "Detailed & Warm" },
  { "id": 3, "headline": "Catchy Title", "text": "...", "tone": "Enthusiastic" }
]
`;

      const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      const responseText = response.text || "";
      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length >= 3) {
        return parsed;
      }
    } catch (err: any) {
      console.warn("Gemini API call bypassed or depleted, utilizing dynamic industry generator:", err?.message || err);
    }
  }

  // 2. High-precision dynamic industry generation fallback
  // Generates 100% domain-specific, natural 5-star reviews matching the exact business type!
  const drafts = industry.reviewDrafts;
  const tagsFormatted = activeTags.join(" and ");

  return [
    {
      id: 1,
      headline: drafts.direct.headline,
      text: drafts.direct.text(businessName, tagsFormatted, customNote),
      tone: "Direct & Punchy",
    },
    {
      id: 2,
      headline: drafts.detailed.headline,
      text: drafts.detailed.text(businessName, tagsFormatted, customNote),
      tone: "Detailed & Warm",
    },
    {
      id: 3,
      headline: drafts.enthusiastic.headline,
      text: drafts.enthusiastic.text(businessName, tagsFormatted, customNote),
      tone: "Enthusiastic",
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
    try {
      const client = new GoogleGenAI({ apiKey });
      const prompt = `
You are the business owner of "${businessName}". 
A customer left a ${rating}-star review on Google:
"${reviewText}"
Reviewer Name: ${reviewerName || "Customer"}

Write an authentic, polite, professional, and brand-building reply from the business owner to post on Google Business Profile.
Keep it under 3-4 sentences. If rating is 4-5, express heartfelt gratitude. If rating is 1-3, apologize politely and offer to make things right.
`;

      const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      if (response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn("Gemini reply error, using industry reply:", err);
    }
  }

  if (rating >= 4) {
    return `Thank you so much${nameGreeting} for the fantastic 5-star review! Our team at ${businessName} truly appreciates your trust and kind words. Looking forward to continuing to provide top-quality service!`;
  } else {
    return `Hi${nameGreeting}, thank you for your feedback. We sincerely apologize that your experience did not meet your expectations. We strive for excellence at ${businessName} and would love the opportunity to make this right. Please reach out to our management team directly so we can assist you.`;
  }
}
