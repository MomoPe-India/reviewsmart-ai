import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      businesses: {
        select: {
          id: true,
          name: true,
          slug: true,
          googleReviewUrl: true,
        },
      },
      subscription: {
        include: {
          plan: true,
        },
      },
    },
  });

  return NextResponse.json({ users });
}
