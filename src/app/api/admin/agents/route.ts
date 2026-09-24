import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, hashPin, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── GET: List all marketing agents with stats ──────────────────────────────
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

    // Fetch deal stats per agent (matching either agentId OR agentCode)
    const agentStats = await Promise.all(
      agents.map(async (agt) => {
        const payments = await prisma.upiPayment.findMany({
          where: {
            OR: [
              { agentId: agt.id },
              ...(agt.agentCode ? [{ agentCode: agt.agentCode }] : []),
              ...(agt.userIdTag ? [{ agentCode: agt.userIdTag }] : []),
            ],
          },
          select: { amount: true, status: true, commission: true },
        });

        const dealsClosed = payments.filter((p) => p.status === "APPROVED").length;
        const totalRevenue = payments
          .filter((p) => p.status === "APPROVED")
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalCommission = payments
          .filter((p) => p.status === "APPROVED")
          .reduce((sum, p) => sum + (p.commission || 0), 0);
        const pendingDeals = payments.filter((p) => p.status === "PENDING").length;

        return {
          ...agt,
          dealsClosed: dealsClosed || 0,
          totalRevenue: totalRevenue || 0,
          totalCommission: totalCommission || 0,
          commissionEarned: totalCommission || 0,
          pendingDeals: pendingDeals || 0,
        };
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
    const cleanPhone = phone ? String(phone).replace(/[^0-9]/g, "").slice(0, 10) : null;

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
        { error: `Agent code ${cleanCode} or mobile number is already registered.` },
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
      select: {
        id: true,
        name: true,
        agentCode: true,
        phone: true,
        userIdTag: true,
        createdAt: true,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, agent: newAgent });
  } catch (error) {
    console.error("Create agent error:", error);
    return NextResponse.json({ error: "Failed to create agent." }, { status: 500 });
  }
}

// ─── PATCH: Toggle active / Reset PIN / Edit Agent ──────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { agentId, action } = body;

    if (!agentId || !action) {
      return NextResponse.json({ error: "agentId and action are required." }, { status: 400 });
    }

    const agent = await prisma.user.findUnique({ where: { id: agentId } });
    if (!agent) {
      return NextResponse.json({ error: "Agent not found." }, { status: 404 });
    }

    // 1. Toggle Active / Suspended
    if (action === "toggle_active") {
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

    // 2. Reset PIN
    if (action === "reset_pin") {
      const customPin = body.pin ? String(body.pin).replace(/[^0-9]/g, "").slice(0, 4) : null;
      const newPin = customPin && customPin.length === 4 ? customPin : Math.floor(1000 + Math.random() * 9000).toString();
      const hashedPin = await hashPin(newPin);
      const hashedPassword = await hashPassword(newPin);

      await prisma.user.update({
        where: { id: agentId },
        data: { pinCode: hashedPin, password: hashedPassword },
      });

      return NextResponse.json({
        success: true,
        newPin,
        agentName: agent.name,
        agentPhone: agent.phone,
        message: "Agent PIN reset successfully.",
      });
    }

    // 3. Edit Agent Details
    if (action === "edit_agent") {
      const { name, phone, agentCode } = body;
      const cleanCode = agentCode ? String(agentCode).trim().toUpperCase() : agent.agentCode;
      const cleanPhone = phone ? String(phone).replace(/[^0-9]/g, "").slice(0, 10) : agent.phone;

      // Check unique code / phone conflict if changed
      if (cleanCode && cleanCode !== agent.agentCode) {
        const conflict = await prisma.user.findFirst({
          where: {
            id: { not: agentId },
            OR: [{ agentCode: cleanCode }, { userIdTag: cleanCode }],
          },
        });
        if (conflict) {
          return NextResponse.json(
            { error: `Agent code ${cleanCode} is already in use by another user.` },
            { status: 400 }
          );
        }
      }

      const updateData: Record<string, unknown> = {
        name: name ? String(name).trim() : agent.name,
        phone: cleanPhone,
        agentCode: cleanCode,
        userIdTag: cleanCode,
      };

      if (cleanCode) {
        updateData.email = `${cleanCode.toLowerCase()}@agent.reviewsmart.local`;
      }

      if (body.pin && String(body.pin).trim().length === 4) {
        const cleanPin = String(body.pin).trim().replace(/[^0-9]/g, "");
        if (cleanPin.length === 4) {
          const hp = await hashPin(cleanPin);
          updateData.pinCode = hp;
          updateData.password = hp;
        }
      }

      const updated = await prisma.user.update({
        where: { id: agentId },
        data: updateData,
        select: {
          id: true,
          name: true,
          agentCode: true,
          phone: true,
          userIdTag: true,
          isActive: true,
          createdAt: true,
        },
      });

      // Synchronize all historical payments to reflect the new agent code
      if (cleanCode && cleanCode !== agent.agentCode) {
        await prisma.upiPayment.updateMany({
          where: { agentId },
          data: { agentCode: cleanCode },
        });
      }

      return NextResponse.json({
        success: true,
        agent: updated,
        message: `Agent ${updated.name} updated successfully and deals synchronized.`,
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("Agent PATCH error:", error);
    return NextResponse.json({ error: "Failed to update agent." }, { status: 500 });
  }
}

// ─── DELETE: Delete Marketing Agent ──────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    let agentId: string | null = null;
    try {
      const body = await req.json();
      agentId = body?.agentId || body?.id || null;
    } catch {
      // Body may be empty, try searchParams
    }

    if (!agentId) {
      agentId = req.nextUrl.searchParams.get("agentId") || req.nextUrl.searchParams.get("id");
    }

    if (!agentId) {
      return NextResponse.json({ error: "agentId is required." }, { status: 400 });
    }

    const agent = await prisma.user.findUnique({
      where: { id: agentId },
      select: { id: true, name: true, role: true },
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found." }, { status: 404 });
    }

    if (agent.role !== "MARKETING_AGENT") {
      return NextResponse.json({ error: "User is not a marketing agent." }, { status: 400 });
    }

    // Delete agent record
    await prisma.user.delete({ where: { id: agentId } });

    return NextResponse.json({
      success: true,
      message: `Agent ${agent.name || "Representative"} has been deleted successfully.`,
    });
  } catch (error) {
    console.error("Delete agent error:", error);
    return NextResponse.json({ error: "Failed to delete agent." }, { status: 500 });
  }
}
