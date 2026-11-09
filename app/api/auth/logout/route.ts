import { NextResponse } from "next/server";
import { clearAuthCookie, getSession } from "@/lib/auth/jwt";
import { AuditLog } from "@/models";
import { connectDB } from "@/lib/db/connect";

export async function POST() {
  try {
    const session = await getSession();
    if (session) {
      try {
        await connectDB();
        await AuditLog.create({
          userId: session.id,
          action: "LOGOUT",
          resource: "AUTH",
        });
      } catch (e) {
        // ignore log error
      }
    }

    await clearAuthCookie();
    return NextResponse.json({ success: true, message: "Logged out successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Logout failed." },
      { status: 500 }
    );
  }
}

