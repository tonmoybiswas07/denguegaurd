import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { readClinicalPatient } from "@/lib/patients/clinicalAccess";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const headers = { "Cache-Control": "private, no-store" };
  try {
    const session = await getSession();
    if (!session || (session.role !== "doctor" && session.role !== "admin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401, headers });
    }

    const result = await readClinicalPatient(session, (await params).id);
    if (result.status !== 200) {
      const error = result.status === 403 ? "Access to these patient records is restricted." : "Patient not found.";
      return NextResponse.json({ success: false, error }, { status: result.status, headers });
    }

    const { patient, profile, records } = result.data;
    return NextResponse.json({ success: true, data: { patient, profile, records } }, { headers });
  } catch {
    return NextResponse.json({ success: false, error: "Patient records are temporarily unavailable." }, { status: 503, headers });
  }
}
