import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/db/connect";
import { HealthRecord, Appointment, PatientProfile, User, AuditLog } from "@/models";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "doctor" && session.role !== "admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: patientId } = await params;

    await connectDB();

    // Verify authorized relationship between this doctor and the patient
    if (session.role === "doctor") {
      const authorizedAppointment = await Appointment.findOne({
        doctorId: session.id,
        patientId,
      });

      if (!authorizedAppointment) {
        await AuditLog.create({
          userId: session.id,
          action: "UNAUTHORIZED_PATIENT_RECORD_ACCESS_BLOCKED",
          resource: "PATIENT_RECORD",
          details: { attemptedPatientId: patientId },
        });

        return NextResponse.json(
          {
            success: false,
            error: "Access denied. You may only view records for patients with an active appointment or referral consent.",
          },
          { status: 403 }
        );
      }
    }

    // Retrieve records
    const [patientUser, profile, records] = await Promise.all([
      User.findById(patientId).select("name email phone"),
      PatientProfile.findOne({ userId: patientId }),
      HealthRecord.find({ patientId }).sort({ recordDate: -1 }),
    ]);

    // Record audit trail
    await AuditLog.create({
      userId: session.id,
      action: "PATIENT_RECORD_VIEWED",
      resource: "HEALTH_RECORD",
      details: { patientId, recordsCount: records.length },
    });

    return NextResponse.json({
      success: true,
      data: {
        patient: patientUser,
        profile,
        records,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

