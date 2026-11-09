import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/db/connect";
import { Appointment, User, AuditLog } from "@/models";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "patient") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const appointments = await Appointment.find({ patientId: session.id })
      .populate("doctorId", "name email phone")
      .sort({ date: -1 });

    return NextResponse.json({ success: true, data: appointments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "patient") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { doctorId, date, timeSlot, symptomsSummary } = await req.json();

    if (!doctorId || !date || !timeSlot || !symptomsSummary) {
      return NextResponse.json(
        { success: false, error: "Doctor, date, time slot, and symptoms summary are required." },
        { status: 400 }
      );
    }

    await connectDB();
    const appointment = await Appointment.create({
      patientId: session.id,
      doctorId,
      date: new Date(date),
      timeSlot,
      symptomsSummary,
      status: "pending",
    });

    await AuditLog.create({
      userId: session.id,
      action: "APPOINTMENT_REQUESTED",
      resource: "APPOINTMENT",
      resourceId: appointment._id.toString(),
      details: { doctorId },
    });

    return NextResponse.json({ success: true, data: appointment });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

