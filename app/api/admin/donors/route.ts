import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { requireRole } from "@/lib/auth/rbac";
import { connectDB } from "@/lib/db/connect";
import { AuditLog, BloodDonor } from "@/models";

export async function GET() {
  const auth = await requireRole(["admin"]);
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const data = await BloodDonor.find({ verificationStatus: "Pending" })
      .select("name phone bloodGroup district area")
      .sort({ createdAt: 1 })
      .lean();
    return NextResponse.json({ success: true, source: "registry", data }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ success: false, error: "The review queue is unavailable." }, { status: 503 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireRole(["admin"]);
  if (auth.error) return auth.error;

  const body = await req.json().catch(() => null);
  const status = body?.status;
  if (typeof body?.id !== "string" || !isValidObjectId(body.id) || (status !== "Verified" && status !== "Suspended")) {
    return NextResponse.json({ success: false, error: "A donor ID and review decision are required." }, { status: 400 });
  }

  try {
    await connectDB();
    const donor = await BloodDonor.findOneAndUpdate(
      { _id: body.id, verificationStatus: "Pending" },
      { verificationStatus: status },
    );
    if (!donor) {
      return NextResponse.json({ success: false, error: "This registration is no longer pending." }, { status: 409 });
    }

    try {
      await AuditLog.create({
        action: "DONOR_VERIFICATION_STATUS_CHANGED",
        resource: "BLOOD_DONOR",
        resourceId: donor._id.toString(),
        userId: auth.session.id,
        details: { verificationStatus: status },
      });
    } catch {
      console.error("Unable to record donor verification audit event");
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "The decision could not be saved. Please try again." }, { status: 503 });
  }
}
