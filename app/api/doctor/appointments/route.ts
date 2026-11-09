import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/db/connect";
import { Appointment, User, PatientProfile, AuditLog } from "@/models";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== "doctor" && session.role !== "admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const appointments = await Appointment.find({ doctorId: session.id })
      .populate("patientId", "name email phone")
      .sort({ date: 1 });

    return NextResponse.json({ success: true, data: appointments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "doctor") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { appointmentId, status, doctorNotes, prescriptionNotes } = await req.json();

    if (!appointmentId) {
      return NextResponse.json({ success: false, error: "Appointment ID is required." }, { status: 400 });
    }

    await connectDB();
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctorId: session.id, // Enforce authorization ownership
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: "Appointment not found or not assigned to you." },
        { status: 404 }
      );
    }

    if (status) appointment.status = status;
    if (doctorNotes !== undefined) appointment.doctorNotes = doctorNotes;
    if (prescriptionNotes !== undefined) appointment.prescriptionNotes = prescriptionNotes;

    await appointment.save();

    await AuditLog.create({
      userId: session.id,
      action: "APPOINTMENT_UPDATED_BY_DOCTOR",
      resource: "APPOINTMENT",
      resourceId: appointmentId,
      details: { status, hasNotes: !!doctorNotes },
    });

    return NextResponse.json({ success: true, data: appointment });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

