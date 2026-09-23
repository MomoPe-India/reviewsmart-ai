import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
      const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          userIdTag: true,
          agentCode: true,
          phone: true,
          businesses: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
              primaryColor: true,
            },
          },
          subscription: {
            include: {
              plan: true,
            },
          },
        },
      });

      return NextResponse.json({ user: fullUser || user });
    } catch (dbErr) {
      console.warn("DB lookup in /api/auth/me failed, falling back to session user:", dbErr);
      return NextResponse.json({ user });
    }
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
