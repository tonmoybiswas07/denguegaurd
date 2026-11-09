import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User, PatientProfile, AuditLog } from "@/models";
import { signToken, setAuthCookie } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/login?error=github_oauth_denied", req.url));
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  try {
    // 1. Exchange authorization code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      throw new Error(tokenData.error_description || "Failed to exchange token with GitHub.");
    }

    // 2. Fetch user profile
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "User-Agent": "DengueGuard-App",
      },
    });
    const ghUser = await userResponse.json();

    // 3. Fetch primary verified email if not public in profile
    let email = ghUser.email;
    if (!email) {
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "User-Agent": "DengueGuard-App",
        },
      });
      const emails = await emailResponse.json();
      const primaryEmail = emails.find((e: any) => e.primary && e.verified);
      email = primaryEmail ? primaryEmail.email : emails[0]?.email;
    }

    if (!email) {
      throw new Error("Unable to retrieve verified email from GitHub.");
    }

    await connectDB();

    // 4. Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await User.create({
        name: ghUser.name || ghUser.login || "GitHub User",
        email: email.toLowerCase(),
        password: "OAUTH_EXTERNAL_LOGIN_MANAGED",
        role: "patient",
        avatarUrl: ghUser.avatar_url || "",
        isVerified: true,
      });

      await PatientProfile.create({
        userId: user._id,
      });
    } else {
      if (ghUser.avatar_url && !user.avatarUrl) {
        user.avatarUrl = ghUser.avatar_url;
        await user.save();
      }
    }

    // 5. Sign JWT session
    const token = signToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    });

    await setAuthCookie(token);

    // 6. Audit log
    await AuditLog.create({
      userId: user._id,
      action: "GITHUB_OAUTH_LOGIN_SUCCESS",
      resource: "AUTH_OAUTH",
      details: { email: user.email, provider: "github" },
    });

    const destination = user.role === "admin" ? "/admin" : user.role === "doctor" ? "/doctor" : "/patient";
    return NextResponse.redirect(new URL(destination, req.url));
  } catch (err: any) {
    return NextResponse.redirect(new URL("/login?error=github_auth_failed", req.url));
  }
}

