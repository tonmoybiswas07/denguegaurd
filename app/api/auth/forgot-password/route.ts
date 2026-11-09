import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User, AuditLog } from "@/models";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    // For security reasons, always return generic success message to prevent user enumeration
    if (user) {
      await AuditLog.create({
        userId: user._id,
        action: "PASSWORD_RESET_REQUESTED",
        resource: "AUTH",
        details: { email: user.email },
      });
    }

    return NextResponse.json({
      success: true,
      message:
        "If an account with that email exists, password recovery instructions have been dispatched.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Request failed." },
      { status: 500 }
    );
  }
}

