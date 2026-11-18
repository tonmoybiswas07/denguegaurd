import { z } from "zod";
import { BANGLADESH_DISTRICTS, BLOOD_GROUPS } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { BloodDonor, AuditLog } from "@/models";
import { MOCK_DONORS, type BloodDonorItem } from "@/lib/data/mockData";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const bloodGroup = searchParams.get("bloodGroup");
  const district = searchParams.get("district")?.trim().toLowerCase();
  const plateletOnly = searchParams.get("plateletOnly") === "true";
  let source: "registry" | "demo" = "registry";
  let donors: BloodDonorItem[];

  try {
    await connectDB();
    const records = await BloodDonor.find({ verificationStatus: "Verified" })
      .select("name bloodGroup district area isAvailable isPlateletDonor lastDonationDate totalDonations")
      .sort({ totalDonations: -1 })
      .lean();
    donors = records.map((record) => {
      const [firstName, ...otherNames] = record.name.trim().split(/\s+/);
      const lastInitial = otherNames.at(-1)?.[0];
      return {
        id: record._id.toString(),
        name: lastInitial ? `${firstName} ${lastInitial}.` : firstName,
        bloodGroup: record.bloodGroup,
        district: record.district,
        area: record.area,
        isAvailable: record.isAvailable,
        isPlateletDonor: record.isPlateletDonor,
        lastDonationDate: record.lastDonationDate?.toISOString().slice(0, 10) ?? "",
        totalDonations: record.totalDonations,
        verificationStatus: "Verified",
      };
    });
  } catch {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "The directory is temporarily unavailable." }, { status: 503 });
    }
    source = "demo";
    donors = MOCK_DONORS;
  }

  const data = donors.filter((donor) =>
    (!bloodGroup || bloodGroup === "All" || donor.bloodGroup === bloodGroup) &&
    (!district || district === "all" || donor.district.toLowerCase() === district) &&
    (!plateletOnly || donor.isPlateletDonor)
  );

  return NextResponse.json({ success: true, source, data });
}

const registrationSchema = z.object({
  name: z.string().trim().min(1).max(100),
  bloodGroup: z.enum(BLOOD_GROUPS),
  district: z.string().refine((district) => BANGLADESH_DISTRICTS.some((item) => item === district)),
  area: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(25).regex(/^\+?[0-9][0-9 ()-]*$/)
    .refine((phone) => {
      const digits = phone.replace(/\D/g, "").length;
      return digits >= 7 && digits <= 15;
    }),
  isPlateletDonor: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const registration = registrationSchema.safeParse(await req.json().catch(() => null));
  if (!registration.success) {
    return NextResponse.json(
      { success: false, error: "Check your name, blood group, district, area, and phone number." },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    const donor = await BloodDonor.create({
      ...registration.data,
      isAvailable: true,
      verificationStatus: "Pending",
    });

    try {
      await AuditLog.create({
        action: "DONOR_REGISTERED",
        resource: "BLOOD_DONOR",
        resourceId: donor._id.toString(),
        details: { bloodGroup: donor.bloodGroup, district: donor.district },
      });
    } catch {
      console.error("Unable to record donor registration audit event");
    }

    return NextResponse.json({
      success: true,
      message: "Registration received and pending verification. Your phone number stays private.",
      data: { id: donor._id, name: donor.name, bloodGroup: donor.bloodGroup, district: donor.district },
    }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Registration is temporarily unavailable. Please try again." }, { status: 503 });
  }
}
