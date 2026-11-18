import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Hospital } from "@/models";
import { MOCK_HOSPITALS, type HospitalItem } from "@/lib/data/mockData";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const district = searchParams.get("district")?.trim().toLowerCase();
  const query = searchParams.get("q")?.trim().toLowerCase();
  let source: "registry" | "demo" = "registry";
  let hospitals: HospitalItem[];

  try {
    await connectDB();
    const records = await Hospital.find({ isVerified: true }).sort({ availableDengueBeds: -1 }).lean();
    hospitals = records.map(({ _id, location, ...record }) => ({
      ...record,
      id: _id.toString(),
      lng: location?.coordinates?.[0],
      lat: location?.coordinates?.[1],
    }));
  } catch {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "The directory is temporarily unavailable." }, { status: 503 });
    }
    source = "demo";
    hospitals = MOCK_HOSPITALS;
  }

  const data = hospitals.filter((hospital) =>
    (!district || district === "all" || hospital.district.toLowerCase() === district) &&
    (!query || [hospital.name, hospital.area, hospital.district, hospital.address].some((value) => value.toLowerCase().includes(query)))
  );

  return NextResponse.json({ success: true, source, data });
}
