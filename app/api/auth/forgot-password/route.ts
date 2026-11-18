import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { success: false, error: "Password reset by email is currently unavailable. Contact your account administrator for help." },
    { status: 503 },
  );
}
