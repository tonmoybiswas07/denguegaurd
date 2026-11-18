import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User, PatientProfile, AuditLog } from "@/models";
import { signToken, setAuthCookie } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: false, error: "Not found." }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/login?error=google_oauth_denied", req.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${appUrl}/api/auth/oauth/google/callback`;

  try {
    // 1. Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId || "",
        client_secret: clientSecret || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || "Failed to exchange token with Google.");
    }

    // 2. Fetch user profile from Google UserInfo endpoint
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileResponse.json();

    if (!profile.email) {
      throw new Error("No verified email returned by Google.");
    }

    await connectDB();

    // 3. Find or create user
    let user = await User.findOne({ email: profile.email.toLowerCase() });

    if (!user) {
      user = await User.create({
        name: profile.name || "Google User",
        email: profile.email.toLowerCase(),
        password: "OAUTH_EXTERNAL_LOGIN_MANAGED",
        role: "patient",
        avatarUrl: profile.picture || "",
        isVerified: true,
      });

      await PatientProfile.create({
        userId: user._id,
      });
    } else {
      // Update avatar if available
      if (profile.picture && !user.avatarUrl) {
        user.avatarUrl = profile.picture;
        await user.save();
      }
    }

    // 4. Sign JWT session token
    if (user.deactivatedAt) {
      return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
    }

    const token = signToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      sessionVersion: user.sessionVersion,
      avatarUrl: user.avatarUrl,
    });

    await setAuthCookie(token);

    // 5. Audit log
    await AuditLog.create({
      userId: user._id,
      action: "GOOGLE_OAUTH_LOGIN_SUCCESS",
      resource: "AUTH_OAUTH",
      details: { email: user.email, provider: "google" },
    });

    const destination = user.role === "admin" ? "/admin" : user.role === "doctor" ? "/doctor" : "/patient";
    return NextResponse.redirect(new URL(destination, req.url));
  } catch (err: any) {
    return NextResponse.redirect(new URL("/login?error=google_auth_failed", req.url));
  }
}

