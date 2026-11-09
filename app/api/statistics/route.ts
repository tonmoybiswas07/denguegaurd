import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { DengueReport } from "@/models";
import { MOCK_STATISTICS } from "@/lib/data/mockData";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get("district");

    let stats = { ...MOCK_STATISTICS };

    if (district && district !== "All") {
      stats.districtComparison = stats.districtComparison.filter((d) =>
        d.district.toLowerCase().includes(district.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    return NextResponse.json({ success: true, data: MOCK_STATISTICS });
  }
}

