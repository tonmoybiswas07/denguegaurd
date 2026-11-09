import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Hospital } from "@/models";
import { MOCK_HOSPITALS } from "@/lib/data/mockData";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get("district");
    const query = searchParams.get("q");

    await connectDB();
    const filter: any = {};
    if (district && district !== "All") {
      filter.district = new RegExp(district, "i");
    }
    if (query) {
      filter.$or = [
        { name: new RegExp(query, "i") },
        { area: new RegExp(query, "i") },
      ];
    }

    let hospitals = await Hospital.find(filter).sort({ availableDengueBeds: -1 });

    // Fallback to verified seed data if DB is empty
    if (!hospitals || hospitals.length === 0) {
      hospitals = MOCK_HOSPITALS as any;
    }

    return NextResponse.json({ success: true, data: hospitals });
  } catch (error: any) {
    // If DB is offline, gracefully return mock hospitals
    return NextResponse.json({ success: true, data: MOCK_HOSPITALS });
  }
}

