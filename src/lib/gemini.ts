import { GoogleGenAI } from "@google/genai";

interface GenerateReviewParams {
  businessName: string;
  tagline?: string | null;
  selectedTags: string[];
  keywords?: string;
  tone?: string;
  customNote?: string;
}

interface ReviewOption {
  id: number;
  text: string;
  headline: string;
  tone: string;
}

export async function generateAiReviews(params: GenerateReviewParams): Promise<ReviewOption[]> {
  const { businessName, tagline, selectedTags, keywords, tone = "friendly", customNote } = params;

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 5) {
    try {
      const client = new GoogleGenAI({ apiKey });

      const prompt = `
You are an expert customer review assistant. A customer had a wonderful experience at "${businessName}"${tagline ? ` (${tagline})` : ""}.
The customer highlighted the following positive aspects: ${selectedTags.length > 0 ? selectedTags.join(", ") : "Great service and experience"}.
${keywords ? `Naturally and subtly weave in some of these keywords if relevant: ${keywords}.` : ""}
${customNote ? `Customer specific comment: "${customNote}".` : ""}
Tone style: ${tone} (e.g. enthusiastic, natural, professional, warm).

Generate exactly 3 distinct, authentic, human-sounding 5-star Google reviews.
Guidelines:
1. They must sound like real, genuine customers written on a mobile phone (NOT robotic or overly formal marketing speak).
2. Variation 1: Short, punchy, direct to the point (2-3 sentences).
3. Variation 2: Detailed and descriptive, focusing on the atmosphere and specific staff/service excellence (3-4 sentences).
4. Variation 3: Enthusiastic recommendation ("Will definitely be coming back!").
5. Return ONLY a valid JSON array of objects with the exact schema:
[
  { "id": 1, "headline": "Short Catchy Title", "text": "Full review text...", "tone": "Direct & Punchy" },
  { "id": 2, "headline": "Short Catchy Title", "text": "Full review text...", "tone": "Detailed & Warm" },
  { "id": 3, "headline": "Short Catchy Title", "text": "Full review text...", "tone": "Enthusiastic" }
]
Do not wrap in markdown quotes if possible, output strictly JSON.
`;

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const responseText = response.text || "";
      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (err) {
      console.error("Gemini API error, falling back to smart dynamic generator:", err);
    }
  }

  // Fallback dynamic high-quality review templates so the app works immediately out of the box
  const highlights = selectedTags.length > 0 ? selectedTags.join(" and ") : "exceptional service";
  const extra = customNote ? ` Especially appreciated: ${customNote}.` : "";

  return [
    {
      id: 1,
      headline: "Outstanding Experience!",
      text: `Had an amazing experience at ${businessName}! The ${highlights.toLowerCase()} really stood out.${extra} The staff was welcoming and professional throughout. Highly recommend checking them out!`,
      tone: "Direct & Punchy",
    },
    {
      id: 2,
      headline: "Consistently Top-Tier",
      text: `From start to finish, ${businessName} exceeded all expectations. You can really feel the attention to detail, especially regarding ${highlights.toLowerCase()}.${extra} Truly a 5-star gem that deserves all the praise. Will definitely be returning soon!`,
      tone: "Detailed & Warm",
    },
    {
      id: 3,
      headline: "5 Stars all the way!",
      text: `Such a great discovery! ${businessName} is simply top notch. Love their ${highlights.toLowerCase()}.${extra} Super friendly vibes and quality that speaks for itself. 10/10 recommend to friends and family!`,
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
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      if (response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.error("Gemini reply error:", err);
    }
  }

  if (rating >= 4) {
    return `Thank you so much${nameGreeting} for the fantastic 5-star review! Our team at ${businessName} truly appreciates your kind words and support. We can't wait to welcome you back soon!`;
  } else {
    return `Hi${nameGreeting}, thank you for your feedback. We sincerely apologize that your experience did not meet your expectations. We strive for excellence at ${businessName} and would love the opportunity to make this right. Please reach out to us directly so we can assist you.`;
  }
}
