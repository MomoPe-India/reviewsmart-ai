import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { detectIndustry } from "@/lib/industry";

// In-memory cache for ultra-fast typeahead autocomplete responses (<10ms)
const searchCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || searchParams.get("q");
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
      { error: "Search query must be at least 2 characters", results: [] },
      { status: 400 }
    );
  }

  const cleanQuery = query.trim();
  const cacheKey = cleanQuery.toLowerCase();

  // Check cache for instant typeahead response
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({ success: true, results: cached.data, cached: true });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 5) {
    try {
      const client = new GoogleGenAI({ apiKey });
      const prompt = `
You are a live Google Maps Places discovery engine for merchants in India.
The user is actively typing in the search box: "${cleanQuery}".

Find up to 5 matching real business locations / Google Maps profiles that match "${cleanQuery}".
CRITICAL: If "${cleanQuery}" is a brand or franchise with multiple branches across different neighborhoods or cities (e.g. Paradise Biryani, Chai Point, Domino's, Naturals Salon, Apollo Clinic, Absolute Barbecue, Cafe Coffee Day, A2B, Haldiram's, Rameshwaram Cafe, etc.), return 4-5 distinct branch locations with specific locality names so the user can easily recognize their exact store!

For each matching business profile:
1. "name": The clean business name (e.g. "Paradise Biryani", "Chai Point")
2. "branchName": The specific locality, neighborhood, or landmark that makes this store immediately recognizable (e.g. "Indiranagar 100ft Rd", "Hitech City Cyber Towers", "Jayanagar 4th Block", "Connaught Place")
3. "address": Full recognizable street address with city & state
4. "category": Precise business type (e.g. "Biryani Restaurant", "Specialty Coffee Shop", "Multi-Cuisine Diner", "Dental Clinic", "Hair & Beauty Salon")
5. "googleReviewUrl": Direct Google Maps review link:
   "https://www.google.com/maps/search/?api=1&query=" + URI encoded (name + " " + branchName + " " + address)
6. "rating": Realistic Google star rating (e.g. 4.6, 4.8)
7. "reviewCount": Readable review count (e.g. "3,420 reviews", "1,850 reviews")
8. "suggestedTags": Array of 5 positive compliment chips suitable for 5-star customer reviews
9. "logoUrl": Public brand logo URL or null

Respond strictly in pure JSON without markdown quotes:
{
  "results": [
    {
      "name": "Paradise Biryani",
      "branchName": "Hitech City (Opp. Cyber Towers)",
      "address": "Ground Floor, Opposite Cyber Towers, Madhapur, Hitech City, Hyderabad, Telangana 500081",
      "category": "Biryani & Mughlai Restaurant",
      "googleReviewUrl": "https://www.google.com/maps/search/?api=1&query=Paradise+Biryani+Hitech+City",
      "rating": 4.7,
      "reviewCount": "5,120 reviews",
      "suggestedTags": ["World Famous Biryani", "Mirchi Ka Salan", "Quick Service", "Royal Ambience", "Great Hospitality"],
      "logoUrl": null
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

      if (parsed && Array.isArray(parsed.results) && parsed.results.length > 0) {
        // Cache the successful result
        searchCache.set(cacheKey, { timestamp: Date.now(), data: parsed.results });
        return NextResponse.json({ success: true, results: parsed.results });
      }
    } catch (err) {
      console.error("Gemini live search error, using algorithmic fallback:", err);
    }
  }

  // Algorithmic intelligent fallback powered by detectIndustry
  const directMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    cleanQuery
  )}`;

  const lower = cleanQuery.toLowerCase();
  
  // Special recognition for Momo IT Technologies
  if (lower.includes("momo it") || (lower.includes("momo") && lower.includes("tech"))) {
    const momoResult = {
      name: "Momo IT Technologies",
      branchName: "Krishnapuram, Kadapa (HQ)",
      address: "4/106, Krishnapuram, Kadapa, Andhra Pradesh 516003",
      category: "Software Development & IT Solutions",
      googleReviewUrl: "https://www.google.com/maps/search/?api=1&query=Momo+IT+Technologies+Kadapa",
      suggestedTags: [
        "Expert Developers",
        "Robust Software",
        "Prompt Tech Support",
        "Clean UI/UX Design",
        "Timely Delivery",
      ],
      rating: 4.9,
      reviewCount: "120+ reviews",
      logoUrl: "/images/momo-it-logo.svg",
      website: "https://www.momoittechnologies.com/",
    };
    return NextResponse.json({
      success: true,
      results: [momoResult],
    });
  }

  const industry = detectIndustry(cleanQuery);
  const category = industry.label;
  const suggestedTags = industry.tags.slice(0, 5);

  const fallbackResults = [
    {
      name: cleanQuery,
      branchName: "Main Branch",
      address: `${cleanQuery}, India`,
      category,
      googleReviewUrl: directMapsUrl,
      suggestedTags,
      rating: 4.8,
      reviewCount: "Verified Profile",
      logoUrl: null,
    },
  ];

  return NextResponse.json({
    success: true,
    results: fallbackResults,
  });
}
