import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/db/connect";
import { User, PatientProfile, DoctorProfile } from "@/models";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User record not found" },
        { status: 404 }
      );
    }

    let profile = null;
    if (user.role === "patient") {
      profile = await PatientProfile.findOne({ userId: user._id });
    } else if (user.role === "doctor") {
      profile = await DoctorProfile.findOne({ userId: user._id });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
        profile,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch session." },
      { status: 500 }
    );
  }
}

