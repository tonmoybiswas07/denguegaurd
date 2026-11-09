import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/db/connect";
import { DoctorProfile, User, AuditLog } from "@/models";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const doctors = await DoctorProfile.find()
      .populate("userId", "name email phone isVerified createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: doctors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { doctorProfileId, verificationStatus } = await req.json();

    if (!doctorProfileId || !["approved", "rejected", "pending"].includes(verificationStatus)) {
      return NextResponse.json({ success: false, error: "Valid profile ID and status required." }, { status: 400 });
    }

    await connectDB();
    const profile = await DoctorProfile.findById(doctorProfileId);
    if (!profile) {
      return NextResponse.json({ success: false, error: "Doctor profile not found." }, { status: 404 });
    }

    profile.verificationStatus = verificationStatus;
    await profile.save();

    // Also update User isVerified flag
    await User.findByIdAndUpdate(profile.userId, {
      isVerified: verificationStatus === "approved",
    });

    await AuditLog.create({
      userId: session.id,
      action: "DOCTOR_VERIFICATION_STATUS_CHANGED",
      resource: "DOCTOR_PROFILE",
      resourceId: doctorProfileId,
      details: { verificationStatus, doctorUserId: profile.userId },
    });

    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

