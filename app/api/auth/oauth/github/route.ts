import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User, PatientProfile, AuditLog } from "@/models";
import { signToken, setAuthCookie } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: false, error: "Not found." }, { status: 404 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${appUrl}/api/auth/oauth/github/callback`;

  // If real GitHub OAuth credentials are configured
  if (clientId && process.env.GITHUB_CLIENT_SECRET) {
    const scope = encodeURIComponent("user:email");
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scope}`;

    return NextResponse.redirect(githubAuthUrl);
  }

  // Developer / Demo Fallback Mode
  try {
    await connectDB();
    const demoGithubEmail = "github.developer@dengueguard.org";
    let user = await User.findOne({ email: demoGithubEmail });

    if (!user) {
      user = await User.create({
        name: "GitHub Developer User",
        email: demoGithubEmail,
        password: "OAUTH_EXTERNAL_LOGIN_MANAGED",
        role: "patient",
        phone: "+8801700000088",
        avatarUrl: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
        isVerified: true,
      });

      await PatientProfile.create({
        userId: user._id,
        bloodGroup: "B+",
        district: "Dhaka",
      });
    }

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

    await AuditLog.create({
      userId: user._id,
      action: "GITHUB_OAUTH_LOGIN",
      resource: "AUTH_OAUTH",
      details: { provider: "github", email: user.email },
    });

    return NextResponse.redirect(new URL("/patient", req.url));
  } catch (error) {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
  }
}

