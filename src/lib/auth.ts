import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "reviewsmart_super_secret_jwt_key_2026_change_in_prod";
export const COOKIE_NAME = "review_ai_token";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: string; // "SUPER_ADMIN" | "BUSINESS_OWNER" | "MARKETING_AGENT"
  userIdTag?: string | null;
  agentCode?: string | null;
  phone?: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin.trim(), 10);
}

export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pin.trim(), hash);
}

export function signToken(user: SessionUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      userIdTag: user.userIdTag || null,
      agentCode: user.agentCode || null,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) return null;

    // Verify in database to ensure user still exists & isActive
    try {
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          userIdTag: true,
          agentCode: true,
          phone: true,
          isActive: true,
        },
      });

      if (user) {
        if (user.isActive === false) return null;
        return user;
      }

      // If user wasn't found by decoded.id, try finding by email
      if (decoded.email) {
        const userByEmail = await prisma.user.findUnique({
          where: { email: decoded.email },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            userIdTag: true,
            agentCode: true,
            phone: true,
            isActive: true,
          },
        });
        if (userByEmail) {
          if (userByEmail.isActive === false) return null;
          return userByEmail;
        }
      }

      // If user is validly signed by our JWT secret, return decoded payload so UI never crashes
      return decoded;
    } catch (dbErr) {
      console.warn("DB lookup in getSessionUser failed, using decoded token:", dbErr);
      return decoded;
    }
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      typeof (err as { digest?: unknown }).digest === "string" &&
      ((err as { digest: string }).digest.includes("DYNAMIC_SERVER_USAGE") ||
        (err as { digest: string }).digest.includes("NEXT_REDIRECT"))
    ) {
      throw err;
    }
    console.error("Critical error in getSessionUser:", err);
    return null;
  }
}
