import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, hashPin, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── GET: List all marketing agents ──────────────────────────────────────────
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
        isActive: true,
        createdAt: true,
      },
    });

    // Fetch deal stats per agent
    const agentStats = await Promise.all(
      agents.map(async (agt) => {
        const payments = await prisma.upiPayment.findMany({
          where: { agentId: agt.id },
          select: { amount: true, status: true, commission: true },
        });

        const dealsClosed = payments.filter((p) => p.status === "APPROVED").length;
        const totalRevenue = payments
          .filter((p) => p.status === "APPROVED")
          .reduce((sum, p) => sum + p.amount, 0);
        const totalCommission = payments
          .filter((p) => p.status === "APPROVED")
          .reduce((sum, p) => sum + (p.commission || 0), 0);
        const pendingDeals = payments.filter((p) => p.status === "PENDING").length;

        return { ...agt, dealsClosed, totalRevenue, totalCommission, pendingDeals };
      })
    );

    return NextResponse.json({ agents: agentStats });
  } catch (error) {
    console.error("Fetch agents error:", error);
    return NextResponse.json({ error: "Failed to fetch agents." }, { status: 500 });
  }
}

// ─── POST: Create new agent ───────────────────────────────────────────────────
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
    const cleanPin = String(pin).trim().replace(/[^0-9]/g, "").slice(0, 4);
    const cleanPhone = phone ? String(phone).replace(/[^0-9]/g, "") : null;

    if (cleanPin.length !== 4) {
      return NextResponse.json({ error: "PIN must be exactly 4 digits." }, { status: 400 });
    }

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
        isActive: true,
      },
      select: { id: true, name: true, agentCode: true, phone: true, userIdTag: true, createdAt: true, isActive: true },
    });

    return NextResponse.json({ success: true, agent: newAgent });
  } catch (error) {
    console.error("Create agent error:", error);
    return NextResponse.json({ error: "Failed to create agent." }, { status: 500 });
  }
}

// ─── PATCH: Toggle active / Reset PIN ────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { agentId, action } = await req.json();
    if (!agentId || !action) {
      return NextResponse.json({ error: "agentId and action are required." }, { status: 400 });
    }

    if (action === "toggle_active") {
      const agent = await prisma.user.findUnique({ where: { id: agentId } });
      if (!agent) return NextResponse.json({ error: "Agent not found." }, { status: 404 });

      const updated = await prisma.user.update({
        where: { id: agentId },
        data: { isActive: !agent.isActive },
        select: { id: true, isActive: true, name: true },
      });

      return NextResponse.json({
        success: true,
        isActive: updated.isActive,
        message: `${updated.name} is now ${updated.isActive ? "ACTIVE" : "SUSPENDED"}.`,
      });
    }

    if (action === "reset_pin") {
      const newPin = Math.floor(1000 + Math.random() * 9000).toString();
      const hashedPin = await hashPin(newPin);
      const hashedPassword = await hashPassword(newPin);

      await prisma.user.update({
        where: { id: agentId },
        data: { pinCode: hashedPin, password: hashedPassword },
      });

      return NextResponse.json({ success: true, newPin, message: "Agent PIN reset successfully." });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("Agent PATCH error:", error);
    return NextResponse.json({ error: "Failed to update agent." }, { status: 500 });
  }
}
