import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/db/connect";
import { HealthRecord, AuditLog } from "@/models";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "patient") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const records = await HealthRecord.find({ patientId: session.id })
      .sort({ recordDate: -1 })
      .limit(30);

    return NextResponse.json({ success: true, data: records });
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

    const body = await req.json();
    const { temperature, plateletCount, hematocrit, wbcCount, symptoms, notes } = body;

    if (!temperature || !plateletCount) {
      return NextResponse.json(
        { success: false, error: "Temperature and Platelet Count are mandatory." },
        { status: 400 }
      );
    }

    await connectDB();
    const record = await HealthRecord.create({
      patientId: session.id,
      recordDate: new Date(),
      temperature: Number(temperature),
      plateletCount: Number(plateletCount),
      hematocrit: hematocrit ? Number(hematocrit) : undefined,
      wbcCount: wbcCount ? Number(wbcCount) : undefined,
      symptoms: symptoms || [],
      notes: notes || "",
      enteredBy: session.id,
    });

    await AuditLog.create({
      userId: session.id,
      action: "HEALTH_RECORD_LOGGED",
      resource: "HEALTH_RECORD",
      resourceId: record._id.toString(),
      details: { temperature, plateletCount },
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

