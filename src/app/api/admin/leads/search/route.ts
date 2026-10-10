import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { city, category, customQuery } = await req.json();

    const targetCity = String(city || "Kadapa").trim();
    const targetCategory = String(category || "Dental Clinics").trim();
    const fullQuery = customQuery?.trim() || `${targetCategory} in ${targetCity}`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const client = new GoogleGenAI({ apiKey });

    const prompt = `
You are an expert Local Lead Intelligence Engine for "ReviewSmart AI", an Indian Google Review tool (NFC Standees + AI Review Cards).
Your goal is to extract and generate 8 to 12 realistic target merchant leads in "${targetCity}", focusing on "${targetCategory}".

CRITICAL FOCUS:
We specifically want to target businesses that SUFFER FROM LOW GOOGLE REVIEWS (< 40 reviews or < 4.2 star rating), while competitors in the same city have hundreds of reviews. These are our highest-converting prospects.

For each lead, provide:
1. "name": The business or clinic name (e.g., "Dr. Reddy Dental Hospital", "Seven Roads Spice Restaurant", "Sri Balaji Hair Salon")
2. "locality": Real neighborhood or landmark in ${targetCity} (e.g., "Seven Roads Circle", "Nagarajupeta", "Yerramukkapalli", "RTC Bus Stand Road", "Madras Road")
3. "phone": Realistic local contact mobile number format (e.g., "9849123456", "9440123456", "8639123456")
4. "currentRating": Google Maps rating (e.g., 3.8, 4.0, 4.1, 4.2)
5. "currentReviews": Review count (e.g., 12, 18, 24, 32, 45)
6. "competitorName": Top competitor in that town (e.g., "Apollo Dental Kadapa", "Kritunga Biryani", "Naturals Salon")
7. "competitorReviews": Competitor review count (e.g., 240, 380, 520)
8. "isHotLead": Boolean (true if currentReviews < 40 or currentRating < 4.2)
9. "leadReason": Why this merchant needs ReviewSmart AI (e.g., "Only 14 reviews while competitor has 280+ reviews. Missing 70% of walk-ins.")
10. "whatsappPitchTelugu": A polite, high-converting WhatsApp message in conversational Telugu (with English loanwords) customized for this business name and review gap.
11. "whatsappPitchEnglish": The English version of the pitch.

Return STRICT JSON only, matching this structure without markdown formatting:
{
  "leads": [
    {
      "name": "string",
      "locality": "string",
      "phone": "string",
      "currentRating": 4.0,
      "currentReviews": 18,
      "competitorName": "string",
      "competitorReviews": 250,
      "isHotLead": true,
      "leadReason": "string",
      "whatsappPitchTelugu": "string",
      "whatsappPitchEnglish": "string"
    }
  ]
}
`;

    const response = await client.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const responseText = response.text || "";
    const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (parsed && Array.isArray(parsed.leads)) {
      return NextResponse.json({
        success: true,
        city: targetCity,
        category: targetCategory,
        leads: parsed.leads,
      });
    }

    return NextResponse.json(
      { error: "Failed to parse leads from AI response", raw: responseText },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Leads search error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to search leads" },
      { status: 500 }
    );
  }
}
