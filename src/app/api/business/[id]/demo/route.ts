import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function canUserAccessBusiness(
  user: { id: string; role: string },
  business: { id: string; userId: string }
): Promise<boolean> {
  if (user.role === "SUPER_ADMIN") return true;
  if (business.userId === user.id) return true;
  if (user.role === "MARKETING_AGENT") {
    const merchantUser = await prisma.user.findUnique({
      where: { id: business.userId },
      select: { referredBy: true },
    });
    if (merchantUser?.referredBy === user.id) return true;

    const payment = await prisma.upiPayment.findFirst({
      where: {
        agentId: user.id,
        OR: [{ businessId: business.id }, { userId: business.userId }],
      },
    });
    if (payment) return true;
  }
  return false;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser();
    if (
      !session ||
      (session.role !== "MARKETING_AGENT" && session.role !== "SUPER_ADMIN")
    ) {
      return NextResponse.json(
        { error: "Unauthorized. Marketing Agent or Super Admin credentials required." },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await req.json();
    const action = body.action as "activate_demo" | "cancel_demo" | "convert_to_paid";

    const business = await prisma.business.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        user: true,
      },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found." }, { status: 404 });
    }

    const hasAccess = await canUserAccessBusiness(session, business);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Forbidden. You do not have permission to manage this business." },
        { status: 403 }
      );
    }

    // ─── 1. ACTIVATE 24-HOUR EVALUATION DEMO ─────────────────────────────
    if (action === "activate_demo") {
      if (business.isPaid) {
        return NextResponse.json(
          { error: "This merchant is already a permanently active paid account." },
          { status: 400 }
        );
      }

      // Check anti-abuse guardrail: single trial per business (unless Super Admin override)
      if (business.demoUsed && session.role !== "SUPER_ADMIN") {
        return NextResponse.json(
          {
            error:
              "This merchant has already utilized their 1-day evaluation trial. Collect payment or contact administrator for an override.",
          },
          { status: 400 }
        );
      }

      // 24 Hours evaluation period from now
      const demoExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const updated = await prisma.business.update({
        where: { id: business.id },
        data: {
          demoExpiresAt,
          demoActivatedAt: new Date(),
          demoActivatedBy: session.id,
          demoUsed: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "24-Hour evaluation trial successfully activated!",
        business: {
          id: updated.id,
          name: updated.name,
          slug: updated.slug,
          isPaid: updated.isPaid,
          demoExpiresAt: updated.demoExpiresAt?.toISOString(),
          demoActivatedAt: updated.demoActivatedAt?.toISOString(),
          demoUsed: updated.demoUsed,
          isDemoActive: true,
        },
      });
    }

    // ─── 2. CANCEL DEMO EARLY ─────────────────────────────────────────────
    if (action === "cancel_demo") {
      const updated = await prisma.business.update({
        where: { id: business.id },
        data: {
          demoExpiresAt: new Date(Date.now() - 1000), // set in past to expire immediately
        },
      });

      return NextResponse.json({
        success: true,
        message: "Evaluation demo canceled. Merchant card has been locked.",
        business: {
          id: updated.id,
          isPaid: updated.isPaid,
          demoExpiresAt: updated.demoExpiresAt?.toISOString(),
          isDemoActive: false,
        },
      });
    }

    // ─── 3. CONVERT TO PERMANENT ACTIVE ACCOUNT ──────────────────────────
    if (action === "convert_to_paid") {
      const utrNumber = body.utrNumber ? String(body.utrNumber).trim() : null;

      // Update business to permanent paid
      const updated = await prisma.business.update({
        where: { id: business.id },
        data: {
          isPaid: true,
          demoExpiresAt: null, // clear demo expiration
        },
      });

      // Update any pending payments for this business to APPROVED
      await prisma.upiPayment.updateMany({
        where: {
          businessId: business.id,
          status: "PENDING",
        },
        data: {
          status: "APPROVED",
          ...(utrNumber ? { utrNumber } : {}),
          notes: `Activated permanently by ${session.role} (${session.name || session.id}) on ${new Date().toLocaleDateString("en-IN")}`,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Merchant account successfully converted to permanent active status!",
        business: {
          id: updated.id,
          name: updated.name,
          slug: updated.slug,
          isPaid: true,
          demoExpiresAt: null,
          isDemoActive: false,
        },
      });
    }

    return NextResponse.json({ error: "Invalid action specified." }, { status: 400 });
  } catch (error) {
    console.error("Demo activation route error:", error);
    return NextResponse.json(
      { error: "Failed to process evaluation status." },
      { status: 500 }
    );
  }
}
