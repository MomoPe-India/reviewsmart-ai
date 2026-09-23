import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, hashPin, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const agents = await prisma.user.findMany({
      where: { role: "MARKETING_AGENT" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        userIdTag: true,
        agentCode: true,
        createdAt: true,
      },
    });

    // Fetch payments for each agent
    const agentStats = await Promise.all(
      agents.map(async (agt) => {
        const payments = await prisma.upiPayment.findMany({
          where: { agentId: agt.id },
          select: { amount: true, status: true },
        });

        const dealsClosed = payments.length;
        const totalRevenue = payments
          .filter((p) => p.status === "APPROVED")
          .reduce((sum, p) => sum + p.amount, 0);

        return {
          ...agt,
          dealsClosed,
          totalRevenue,
        };
      })
    );

    return NextResponse.json({ agents: agentStats });
  } catch (error) {
    console.error("Fetch agents error:", error);
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name, phone, agentCode, pin } = await req.json();

    if (!name || !agentCode || !pin) {
      return NextResponse.json(
        { error: "Name, Agent Code, and PIN are required." },
        { status: 400 }
      );
    }

    const cleanCode = String(agentCode).trim().toUpperCase();
    const cleanPin = String(pin).trim();
    const cleanPhone = phone ? String(phone).replace(/[^0-9]/g, "") : null;

    // Check if code or phone already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { agentCode: cleanCode },
          { userIdTag: cleanCode },
          ...(cleanPhone ? [{ phone: cleanPhone }] : []),
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Agent code ${cleanCode} or phone number is already registered.` },
        { status: 400 }
      );
    }

    const hashedPin = await hashPin(cleanPin);
    const hashedPassword = await hashPassword(cleanPin);

    const newAgent = await prisma.user.create({
      data: {
        name,
        email: `${cleanCode.toLowerCase()}@agent.reviewsmart.local`,
        phone: cleanPhone,
        userIdTag: cleanCode,
        agentCode: cleanCode,
        pinCode: hashedPin,
        password: hashedPassword,
        role: "MARKETING_AGENT",
      },
      select: {
        id: true,
        name: true,
        agentCode: true,
        phone: true,
        userIdTag: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, agent: newAgent });
  } catch (error) {
    console.error("Create agent error:", error);
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}
