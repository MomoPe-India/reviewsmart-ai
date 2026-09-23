import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  return handleSearch(query);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return handleSearch(body?.query);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

async function handleSearch(query: string | null) {
  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: "Search query must be at least 2 characters" },
      { status: 400 }
    );
  }

  const cleanQuery = query.trim();
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 5) {
    try {
      const client = new GoogleGenAI({ apiKey });
      const prompt = `
You are a business discovery assistant for local Indian merchants.
The user is searching for their business on Google Maps with query: "${cleanQuery}".

Find up to 3 most likely matching real businesses on Google Maps. For each business:
1. Provide the exact business name ("name")
2. Provide the locality and city ("address")
3. Detect the main category ("category": Cafe, Restaurant, Dental Clinic, Salon, Retail, Hospital, Gym, etc.)
4. Construct the direct Google Maps search & review URL:
   "https://www.google.com/maps/search/?api=1&query=" + URI encoded (name + " " + address)
5. Provide 5 positive tag chips for customer reviews ("suggestedTags": array of 5 strings)
6. Provide approximate rating e.g. 4.8 ("rating": number)

Respond strictly in valid JSON format:
{
  "results": [
    {
      "name": "Exact Name",
      "address": "Locality, City, State",
      "category": "Cafe & Restaurant",
      "googleReviewUrl": "https://www.google.com/maps/search/?api=1&query=...",
      "suggestedTags": ["Great Coffee", "Cozy Ambience", "Friendly Staff", "Fast Wifi", "Clean Tables"],
      "rating": 4.9
    }
  ]
}
Do not include markdown backticks or explanations. Output pure JSON.
`;

      const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      const responseText = response.text || "";
      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      if (parsed && Array.isArray(parsed.results) && parsed.results.length > 0) {
        return NextResponse.json({ success: true, results: parsed.results });
      }
    } catch (err) {
      console.error("Gemini search error, using algorithmic fallback:", err);
    }
  }

  // Algorithmic intelligent fallback so search ALWAYS returns an instant ready-to-use business & review link
  const words = cleanQuery.split(/\s+/);
  const guessedCity = words.length > 2 ? words[words.length - 1] : "";
  const directMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    cleanQuery
  )}`;

  // Keyword-based tag detection
  const lower = cleanQuery.toLowerCase();
  let category = "Local Business";
  let suggestedTags = ["Exceptional Quality", "Friendly Staff", "Fast Service", "Fair Pricing", "Clean Ambiance"];

  if (lower.includes("cafe") || lower.includes("coffee") || lower.includes("tea") || lower.includes("chai")) {
    category = "Cafe & Bakery";
    suggestedTags = ["Delicious Brew", "Cozy Ambience", "Fresh Bakes", "Polite Staff", "Quick Service"];
  } else if (lower.includes("restaurant") || lower.includes("biryani") || lower.includes("food") || lower.includes("kitchen")) {
    category = "Restaurant & Dining";
    suggestedTags = ["Authentic Flavors", "Hygienic Dining", "Prompt Service", "Family Friendly", "Great Value"];
  } else if (lower.includes("dental") || lower.includes("clinic") || lower.includes("doctor") || lower.includes("care")) {
    category = "Clinic & Healthcare";
    suggestedTags = ["Caring Doctor", "Painless Treatment", "Polite Staff", "Zero Waiting", "Sterile Clinic"];
  } else if (lower.includes("salon") || lower.includes("spa") || lower.includes("beauty") || lower.includes("hair")) {
    category = "Salon & Spa";
    suggestedTags = ["Expert Stylist", "Relaxing Vibe", "Hygienic Tools", "Punctual Service", "Great Hospitality"];
  } else if (lower.includes("gym") || lower.includes("fitness")) {
    category = "Gym & Fitness";
    suggestedTags = ["Modern Equipment", "Motivating Trainers", "Clean Showers", "Good Atmosphere", "Fair Fees"];
  }

  return NextResponse.json({
    success: true,
    results: [
      {
        name: cleanQuery,
        address: guessedCity ? `${guessedCity}, India` : "India",
        category,
        googleReviewUrl: directMapsUrl,
        suggestedTags,
        rating: 5.0,
      },
    ],
  });
}
