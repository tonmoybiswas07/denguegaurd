import { NextResponse } from "next/server";
import { getSession } from "./jwt";
import type { UserRole, UserSession } from "@/types";
import { AuditLog } from "@/models";
import { connectDB } from "@/lib/db/connect";

/**
 * Ensures user is authenticated; returns session or 401 response.
 */
export async function requireAuth(): Promise<
  { session: UserSession; error?: never } | { session?: never; error: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return {
      error: NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to continue." },
        { status: 401 }
      ),
    };
  }
  return { session };
}

/**
 * Enforces role-based authorization (e.g. ['admin'], ['doctor'], ['patient', 'doctor']).
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<
  { session: UserSession; error?: never } | { session?: never; error: NextResponse }
> {
  const auth = await requireAuth();
  if (auth.error) return auth;

  const { session } = auth;
  if (!allowedRoles.includes(session.role)) {
    // Log unauthorized attempt to audit log
    try {
      await connectDB();
      await AuditLog.create({
        userId: session.id,
        action: "UNAUTHORIZED_ROLE_ACCESS_BLOCKED",
        resource: "RBAC_GUARD",
        details: { userRole: session.role, requiredRoles: allowedRoles },
      });
    } catch (e) {
      // ignore logging error
    }

    return {
      error: NextResponse.json(
        {
          success: false,
          error: `Forbidden. Access requires one of the following roles: [${allowedRoles.join(
            ", "
          )}]`,
        },
        { status: 403 }
      ),
    };
  }

  return { session };
}

