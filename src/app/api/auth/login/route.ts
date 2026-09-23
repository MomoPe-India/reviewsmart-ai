import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, verifyPin, signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, userId, pin } = body;

    let user = null;

    // FLOW 1: User ID / Mobile / Agent Code & PIN (for Merchants & Marketing Agents)
    if (userId && pin) {
      const cleanId = String(userId).trim();
      const cleanPin = String(pin).trim();

      user = await prisma.user.findFirst({
        where: {
          OR: [
            { userIdTag: cleanId },
            { phone: cleanId },
            { agentCode: cleanId.toUpperCase() },
            { email: cleanId.toLowerCase() },
          ],
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Invalid User ID or PIN. Please verify and try again." },
          { status: 401 }
        );
      }

      // Verify PIN (or fallback to password if pinCode is not yet set)
      let isPinValid = false;
      if (user.pinCode) {
        isPinValid = await verifyPin(cleanPin, user.pinCode);
      } else if (user.password) {
        isPinValid = await verifyPassword(cleanPin, user.password);
      }

      if (!isPinValid) {
        return NextResponse.json(
          { error: "Invalid User ID or PIN. Please verify and try again." },
          { status: 401 }
        );
      }
    }
    // FLOW 2: Master Email & Password (for Super Admin)
    else if (email && password) {
      const cleanEmail = String(email).toLowerCase().trim();
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: cleanEmail },
            { userIdTag: cleanEmail },
          ],
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Please provide either User ID & PIN or Email & Password" },
        { status: 400 }
      );
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      userIdTag: user.userIdTag,
      agentCode: user.agentCode,
      phone: user.phone,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        userIdTag: user.userIdTag,
        agentCode: user.agentCode,
      },
    });

    // Set cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
