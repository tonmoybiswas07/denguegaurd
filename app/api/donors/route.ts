import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { BloodDonor, AuditLog } from "@/models";
import { MOCK_DONORS } from "@/lib/data/mockData";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bloodGroup = searchParams.get("bloodGroup");
    const district = searchParams.get("district");
    const plateletOnly = searchParams.get("plateletOnly") === "true";

    await connectDB();
    const filter: any = {};
    if (bloodGroup && bloodGroup !== "All") filter.bloodGroup = bloodGroup;
    if (district && district !== "All") filter.district = new RegExp(district, "i");
    if (plateletOnly) filter.isPlateletDonor = true;

    // Notice .select("-phone") strictly enforces donor privacy
    let donors = await BloodDonor.find(filter).select("-phone").sort({ totalDonations: -1 });

    if (!donors || donors.length === 0) {
      donors = MOCK_DONORS as any;
    }

    return NextResponse.json({ success: true, data: donors });
  } catch (error: any) {
    return NextResponse.json({ success: true, data: MOCK_DONORS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, bloodGroup, district, area, phone, isPlateletDonor } = body;

    if (!name || !bloodGroup || !district || !area || !phone) {
      return NextResponse.json(
        { success: false, error: "Name, blood group, district, area, and phone are required." },
        { status: 400 }
      );
    }

    await connectDB();
    const donor = await BloodDonor.create({
      name,
      bloodGroup,
      district,
      area,
      phone, // Stored safely, excluded from public reads
      isPlateletDonor: !!isPlateletDonor,
      isAvailable: true,
      verificationStatus: "Verified",
    });

    await AuditLog.create({
      action: "DONOR_REGISTERED",
      resource: "BLOOD_DONOR",
      resourceId: donor._id.toString(),
      details: { bloodGroup, district },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for registering as a blood donor. Your contact details remain confidential.",
      data: {
        id: donor._id,
        name: donor.name,
        bloodGroup: donor.bloodGroup,
        district: donor.district,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

