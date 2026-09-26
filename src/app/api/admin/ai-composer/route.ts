import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { processAdminAiCommand } from "@/lib/admin-ai-brain";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Super Admin privileges required." },
        { status: 403 }
      );
    }

    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "A prompt instruction is required." },
        { status: 400 }
      );
    }

    const result = await processAdminAiCommand(prompt.trim());
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("AI Composer Route Error:", err);
    return NextResponse.json(
      {
        success: false,
        intent: "ERROR",
        message: `Execution failed: ${err?.message || "Internal server error occurred."}`,
      },
      { status: 500 }
    );
  }
}
