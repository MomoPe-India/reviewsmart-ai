import { NextRequest, NextResponse } from "next/server";
import { generateQrSvg, generateQrDataUrl } from "@/lib/qr";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const dark = searchParams.get("color") || "#000000";
    const light = searchParams.get("bg") || "#ffffff";
    const format = searchParams.get("format") || "svg";

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    if (format === "png") {
      const dataUrl = await generateQrDataUrl(url, {
        color: { dark, light },
        width: 800,
      });
      // Return base64 png buffer
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    const svg = await generateQrSvg(url, {
      color: { dark, light },
    });

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("QR generation error:", error);
    return NextResponse.json({ error: "Failed to generate QR" }, { status: 500 });
  }
}
