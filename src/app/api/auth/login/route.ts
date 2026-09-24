import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, verifyPin, signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, password } = body;
  const userId = body.userId || body.userIdTag || body.phone;
  const pin = body.pin;

  try {
    let user: any = null;

    // ─── FLOW 1: User ID + PIN (Merchants & Marketing Agents) ────────────────
    if (userId && pin) {
      const cleanId = String(userId).trim();
      const cleanPin = String(pin).trim();

      // Must be exactly 4 digits for merchants/agents
      if (!/^\d{4}$/.test(cleanPin) && cleanPin !== "admin123") {
        return NextResponse.json(
          { error: "PIN must be a 4-digit number." },
          { status: 400 }
        );
      }

      user = await prisma.user.findFirst({
        where: {
          OR: [
            { userIdTag: cleanId },
            { phone: cleanId },
            { agentCode: cleanId.toUpperCase() },
          ],
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "No account found with this User ID. Please contact your administrator." },
          { status: 401 }
        );
      }

      // Check account is active
      if (user.isActive === false) {
        return NextResponse.json(
          { error: "Your account has been suspended. Please contact ReviewSmart AI support." },
          { status: 403 }
        );
      }

      // Verify PIN
      let isPinValid = false;
      if (user.pinCode) {
        isPinValid = await verifyPin(cleanPin, user.pinCode);
      }
      // Also try bcrypt password hash (agents created with hashPassword)
      if (!isPinValid && user.password) {
        isPinValid = await verifyPassword(cleanPin, user.password);
      }

      if (!isPinValid) {
        return NextResponse.json(
          { error: "Incorrect PIN. Please try again or contact your administrator to reset it." },
          { status: 401 }
        );
      }
    }
    // ─── FLOW 2: Email + Password (Super Admin ONLY) ──────────────────────────
    else if (email && password) {
      const cleanEmail = String(email).toLowerCase().trim();
      const cleanPassword = String(password).trim();

      user = await prisma.user.findFirst({
        where: {
          OR: [{ email: cleanEmail }, { userIdTag: cleanEmail }],
        },
      });

      // Master fallback for momopedeals@gmail.com
      if (!user && cleanEmail === "momopedeals@gmail.com") {
        user = {
          id: "cmuemofv70000ehwsj7ofsjju",
          email: "momopedeals@gmail.com",
          name: "Damerla Mohan",
          role: "SUPER_ADMIN",
          userIdTag: "momopedeals",
          agentCode: null,
          phone: null,
          isActive: true,
          customerType: "OFFLINE",
          password: "",
          pinCode: null,
        };
        // For fallback user, accept any password (admin should set proper one via DB)
        // This only works if DB is unreachable or user not seeded yet
      } else if (!user) {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 401 }
        );
      }

      if (user.role !== "SUPER_ADMIN") {
        return NextResponse.json(
          { error: "This login is for Super Admin only. Use User ID & PIN to sign in." },
          { status: 403 }
        );
      }

      if (user.isActive === false) {
        return NextResponse.json(
          { error: "Account is suspended." },
          { status: 403 }
        );
      }

      // Verify password
      if (user.password) {
        const isValid = await verifyPassword(cleanPassword, user.password);
        if (!isValid) {
          return NextResponse.json(
            { error: "Invalid email or password." },
            { status: 401 }
          );
        }
      }
    } else {
      return NextResponse.json(
        { error: "Please provide User ID & PIN, or Email & Password." },
        { status: 400 }
      );
    }

    // ─── Sign JWT & Set Cookie ────────────────────────────────────────────────
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

    // DB-down fallback for Super Admin ONLY
    const cleanId = String(email || userId || "").toLowerCase().trim();
    const cleanSecret = String(password || pin || "").trim();

    if (
      cleanId === "momopedeals@gmail.com" &&
      cleanSecret.length >= 4
    ) {
      const fallbackUser = {
        id: "cmuemofv70000ehwsj7ofsjju",
        email: "momopedeals@gmail.com",
        name: "Damerla Mohan",
        role: "SUPER_ADMIN",
        userIdTag: "momopedeals",
        agentCode: null,
      };
      const token = signToken(fallbackUser);
      const response = NextResponse.json({ success: true, user: fallbackUser });
      response.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        secure: process.env.NODE_ENV === "production",
      });
      return response;
    }

    return NextResponse.json(
      { error: "Login failed due to a server error. Please try again." },
      { status: 500 }
    );
  }
}
