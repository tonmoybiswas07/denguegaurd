import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/db/connect";
import { AuditLog } from "@/models";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const logs = await AuditLog.find()
      .populate("userId", "name email role")
      .sort({ timestamp: -1 })
      .limit(50);

    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

