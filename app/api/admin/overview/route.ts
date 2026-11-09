import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/db/connect";
import { User, Hospital, BloodDonor, DengueReport, AuditLog, DoctorProfile } from "@/models";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    await connectDB();

    const [
      totalUsers,
      totalPatients,
      totalDoctors,
      pendingDoctors,
      totalHospitals,
      totalDonors,
      totalReports,
      recentLogs,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "patient" }),
      User.countDocuments({ role: "doctor" }),
      DoctorProfile.countDocuments({ verificationStatus: "pending" }),
      Hospital.countDocuments(),
      BloodDonor.countDocuments(),
      DengueReport.countDocuments(),
      AuditLog.find().sort({ timestamp: -1 }).limit(10),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalPatients,
        totalDoctors,
        pendingDoctors,
        totalHospitals,
        totalDonors,
        totalReports,
        recentLogs,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

