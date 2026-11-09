import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import { User, AuditLog } from "@/models";
import { signToken, setAuthCookie } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectDB();

    // Query user and select password hash
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password credentials." },
        { status: 401 }
      );
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      // Record failed attempt
      await AuditLog.create({
        action: "LOGIN_FAILED",
        resource: "AUTH",
        details: { email: email.toLowerCase() },
      });

      return NextResponse.json(
        { success: false, error: "Invalid email or password credentials." },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    });

    await setAuthCookie(token);

    // Record successful login audit
    await AuditLog.create({
      userId: user._id,
      action: "LOGIN_SUCCESS",
      resource: "AUTH",
      details: { role: user.role, email: user.email },
    });

    return NextResponse.json({
      success: true,
      message: "Sign in successful.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Sign in failed." },
      { status: 500 }
    );
  }
}

