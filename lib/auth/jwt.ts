import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { UserRole, UserSession } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-dengueguard-jwt-token-key-change-in-production-2025";
const AUTH_COOKIE_NAME = "dengueguard_session";
const TOKEN_EXPIRY = "7d";

export interface DecodedToken {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
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
}): string {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl || "",
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

/**
 * Verifies and decodes a JWT token string.
 */
export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch (error) {
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
export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  return {
    id: decoded.id,
    name: decoded.name,
    email: decoded.email,
    role: decoded.role,
    avatarUrl: decoded.avatarUrl,
  };
}

