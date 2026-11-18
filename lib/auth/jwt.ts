import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { cache } from "react";
import { isObjectIdOrHexString } from "mongoose";
import { connectDB } from "@/lib/db/connect";
import User from "@/models/User";
import type { UserRole, UserSession } from "@/types";

const DEVELOPMENT_SECRET = "super-secret-dengueguard-jwt-token-key-change-in-production-2025";

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();
  if (process.env.NODE_ENV === "production" && (!secret || secret.length < 32 || secret === DEVELOPMENT_SECRET)) {
    throw new Error("A unique JWT_SECRET of at least 32 characters is required in production.");
  }
  return secret || DEVELOPMENT_SECRET;
}
const AUTH_COOKIE_NAME = "dengueguard_session";
const TOKEN_EXPIRY = "7d";

export interface DecodedToken {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  sessionVersion?: number;
  iat: number;
  exp: number;
}

/**
 * Signs a JWT token containing user identity and role.
 */
export function signToken(user: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  sessionVersion?: number;
}): string {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl || "",
      sessionVersion: user.sessionVersion ?? 0,
    },
    getJwtSecret(),
    { expiresIn: TOKEN_EXPIRY }
  );
}

/**
 * Verifies and decodes a JWT token string.
 */
export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, getJwtSecret()) as DecodedToken;
  } catch {
    return null;
  }
}

/**
 * Sets the authentication HTTP-Only cookie.
 */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

/**
 * Clears the authentication session cookie.
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Retrieves the current authenticated session on the server.
 */
export const getSession = cache(async (): Promise<UserSession | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded || !isObjectIdOrHexString(decoded.id)) return null;

  try {
    await connectDB();
    const user = await User.findOne({ _id: decoded.id, deactivatedAt: null })
      .select("name email role avatarUrl sessionVersion").lean();
    if (!user || (user.sessionVersion ?? 0) !== (decoded.sessionVersion ?? 0)) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    };
  } catch {
    return null;
  }
});
