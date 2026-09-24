import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const steps: Record<string, unknown> = {
    version: "v2-embedded-db-url",
    envDbUrlLength: (process.env.DATABASE_URL || "").length,
    envDirectUrlLength: (process.env.DIRECT_URL || "").length,
  };
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    steps.hasToken = !!token;

    if (token) {
      try {
        const decoded = verifyToken(token);
        steps.decoded = decoded;
      } catch (err: unknown) {
        steps.verifyError = err instanceof Error ? err.message : String(err);
      }
    }

    try {
      const userCount = await prisma.user.count();
      steps.userCount = userCount;
      const allUsers = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true, userIdTag: true, phone: true },
      });
      steps.users = allUsers;
    } catch (err: unknown) {
      steps.dbCountError = err instanceof Error ? { message: err.message, stack: err.stack } : String(err);
    }

    if (steps.decoded && typeof steps.decoded === "object" && "id" in steps.decoded) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: (steps.decoded as { id: string }).id },
          select: { id: true, email: true, role: true },
        });
        steps.foundUser = user;
      } catch (err: unknown) {
        steps.dbFindError = err instanceof Error ? { message: err.message, stack: err.stack } : String(err);
      }
    }

    return NextResponse.json({ success: true, steps });
  } catch (err: unknown) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? { message: err.message, stack: err.stack } : String(err),
      steps,
    }, { status: 500 });
  }
}
