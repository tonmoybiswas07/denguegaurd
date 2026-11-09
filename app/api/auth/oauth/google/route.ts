import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User, PatientProfile, AuditLog } from "@/models";
import { signToken, setAuthCookie } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${appUrl}/api/auth/oauth/google/callback`;

  // If real Google OAuth credentials are provided, redirect to Google consent
  if (clientId && process.env.GOOGLE_CLIENT_SECRET) {
    const scope = encodeURIComponent("openid email profile");
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

    return NextResponse.redirect(googleAuthUrl);
  }

  // Developer / Demo Fallback Mode:
  // Automatically logs in or registers a verified Google user for testing & defense
  try {
    await connectDB();
    const demoGoogleEmail = "google.user@dengueguard.org";
    let user = await User.findOne({ email: demoGoogleEmail });

    if (!user) {
      user = await User.create({
        name: "Google Verified User",
        email: demoGoogleEmail,
        password: "OAUTH_EXTERNAL_LOGIN_MANAGED",
        role: "patient",
        phone: "+8801700000099",
        avatarUrl: "https://lh3.googleusercontent.com/a/default-user=s96-c",
        isVerified: true,
      });

      await PatientProfile.create({
        userId: user._id,
        bloodGroup: "O+",
        district: "Dhaka",
      });
    }

    const token = signToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    });

    await setAuthCookie(token);

    await AuditLog.create({
      userId: user._id,
      action: "GOOGLE_OAUTH_LOGIN",
      resource: "AUTH_OAUTH",
      details: { provider: "google", email: user.email },
    });

    return NextResponse.redirect(new URL("/patient", req.url));
  } catch (error) {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
  }
}

