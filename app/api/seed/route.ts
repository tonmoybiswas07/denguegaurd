import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/db/seed";

export async function GET() {
  try {
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to seed database.",
        hint: "Ensure MongoDB service is running and MONGODB_URI is accessible.",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}

