import { detectIndustry } from "@/lib/industry";

/**
 * Converts Google Maps 64-bit hex feature pair into standard base64url ChIJ Place ID.
 * Google Place ID format: 
 * Protobuf message: 0x0a (tag 1, len 18) -> 0x09 (tag 1, fixed64) + 8 bytes le -> 0x11 (tag 2, fixed64) + 8 bytes le
 */
export function convertHexPairToPlaceId(hex1: string, hex2: string): string {
  const h1 = hex1.replace(/^0x/i, "").padStart(16, "0");
  const h2 = hex2.replace(/^0x/i, "").padStart(16, "0");
  
  const b1 = Buffer.from(h1, "hex").reverse();
  const b2 = Buffer.from(h2, "hex").reverse();
  
  const buf = Buffer.alloc(20);
  buf[0] = 0x0a; // field 1, wire type 2 (length-delimited)
  buf[1] = 0x12; // length 18
  buf[2] = 0x09; // field 1, wire type 1 (fixed64)
  b1.copy(buf, 3);
  buf[11] = 0x11; // field 2, wire type 1 (fixed64)
  b2.copy(buf, 12);
  
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export interface ResolvedGooglePlace {
  success: boolean;
  name: string;
  placeId: string | null;
  cid: string | null;
  lat: number | null;
  lng: number | null;
  address: string;
  category: string;
  suggestedTags: string[];
  googleReviewUrl: string;
  source: "DIRECT_LINK" | "PLACE_ID" | "FALLBACK";
}

/**
 * Universally resolves any Google Maps URL (maps.app.goo.gl, goo.gl/maps, google.com/maps/place, CID, etc.)
 * into a verified Google Place ID and direct 5-star write-review URL.
 */
export async function resolveGoogleMapsUrl(inputUrl: string): Promise<ResolvedGooglePlace> {
  const trimmed = inputUrl.trim();

  // 1. Direct Place ID input (ChIJ...)
  if (/^ChIJ[A-Za-z0-9_-]{20,}$/.test(trimmed)) {
    const industry = detectIndustry("Google Business");
    return {
      success: true,
      name: "Verified Google Business",
      placeId: trimmed,
      cid: null,
      lat: null,
      lng: null,
      address: "Verified Google Maps Profile",
      category: industry.label,
      suggestedTags: industry.tags.slice(0, 5),
      googleReviewUrl: `https://search.google.com/local/writereview?placeid=${trimmed}`,
      source: "PLACE_ID",
    };
  }

  try {
    // 2. Follow redirects and fetch HTML
    const res = await fetch(trimmed, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const finalUrl = res.url;
    const html = await res.text();

    // 3. Extract hex pair (e.g. !1s0x3bae0f68364ad17f:0x927075cc4decf31 or %211s0x...%3A0x...)
    const hexMatch =
      html.match(/(?:%211s|!1s)(0x[0-9a-fA-F]+)(?:%3A|:)(0x[0-9a-fA-F]+)/) ||
      finalUrl.match(/(?:%211s|!1s)(0x[0-9a-fA-F]+)(?:%3A|:)(0x[0-9a-fA-F]+)/);

    let placeId: string | null = null;
    let cid: string | null = null;

    if (hexMatch) {
      placeId = convertHexPairToPlaceId(hexMatch[1], hexMatch[2]);
      try {
        cid = BigInt(hexMatch[2]).toString();
      } catch {}
    }

    // 4. Also check if place_id / placeid is already in URL or HTML
    if (!placeId) {
      const explicitPlaceIdMatch =
        finalUrl.match(/[?&]place(?:_)?id=(ChIJ[A-Za-z0-9_-]+)/i) ||
        html.match(/[?&]place(?:_)?id=(ChIJ[A-Za-z0-9_-]+)/i);
      if (explicitPlaceIdMatch) {
        placeId = explicitPlaceIdMatch[1];
      }
    }

    // 5. Extract Business Name
    let name = "";
    const nameQueryMatch = html.match(/[?&](?:amp;)?q=([^&"]+)/);
    if (nameQueryMatch && nameQueryMatch[1]) {
      try {
        name = decodeURIComponent(nameQueryMatch[1].replace(/\+/g, " "));
      } catch {
        name = nameQueryMatch[1].replace(/\+/g, " ");
      }
    }

    if (!name) {
      const protoNameMatch = html.match(/(?:%212s|!2s)([^%&!"]+)/);
      if (protoNameMatch && protoNameMatch[1]) {
        try {
          name = decodeURIComponent(protoNameMatch[1].replace(/\+/g, " "));
        } catch {
          name = protoNameMatch[1].replace(/\+/g, " ");
        }
      }
    }

    if (!name) {
      const titleMatch =
        html.match(/<meta content="([^"]+)" (?:property="og:title"|itemprop="name")/) ||
        html.match(/<title>([^<]+)<\/title>/);
      if (titleMatch) {
        name = titleMatch[1].replace(/ - Google Maps$/, "").trim();
        if (name.toLowerCase() === "google maps") name = "";
      }
    }

    // 6. Extract Coordinates
    let lat: number | null = null;
    let lng: number | null = null;
    const coordMatch =
      html.match(/(?:%213d|!3d)([0-9.-]+)(?:%214d|!4d)([0-9.-]+)/) ||
      finalUrl.match(/@([0-9.-]+),([0-9.-]+)/);
    if (coordMatch) {
      lat = parseFloat(coordMatch[1]);
      lng = parseFloat(coordMatch[2]);
    }

    const businessName = name || "Verified Google Business";
    const industry = detectIndustry(businessName);

    const googleReviewUrl = placeId
      ? `https://search.google.com/local/writereview?placeid=${placeId}`
      : cid
      ? `https://search.google.com/local/writereview?cid=${cid}`
      : trimmed;

    return {
      success: Boolean(placeId),
      name: businessName,
      placeId,
      cid,
      lat,
      lng,
      address: lat && lng ? `Google Verified Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` : "Google Verified Profile",
      category: industry.label,
      suggestedTags: industry.tags.slice(0, 5),
      googleReviewUrl,
      source: "DIRECT_LINK",
    };
  } catch (err) {
    console.error("Failed to resolve Google Maps link:", err);
    const industry = detectIndustry("Google Business");
    return {
      success: false,
      name: "Google Business",
      placeId: null,
      cid: null,
      lat: null,
      lng: null,
      address: "Google Maps Location",
      category: industry.label,
      suggestedTags: industry.tags.slice(0, 5),
      googleReviewUrl: trimmed,
      source: "FALLBACK",
    };
  }
}
