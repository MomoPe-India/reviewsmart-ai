import { NextRequest, NextResponse } from "next/server";
import { resolveGoogleMapsUrl } from "@/lib/googleMapsResolver";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body?.url;

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json({ error: "Google Maps URL is required." }, { status: 400 });
    }

    const resolved = await resolveGoogleMapsUrl(url.trim());

    if (!resolved.success && !resolved.placeId) {
      return NextResponse.json(
        {
          error: "Could not extract Google Place ID from the provided link. Please ensure it is a valid Google Maps location or share link.",
          data: resolved,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      data: resolved,
    });
  } catch (error: any) {
    console.error("Resolve Maps URL API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to resolve Google Maps URL" },
      { status: 500 }
    );
  }
}
