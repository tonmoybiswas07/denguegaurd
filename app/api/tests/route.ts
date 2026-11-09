import { NextResponse } from "next/server";
import { runSecurityAndLogicTests } from "@/lib/test-suite";

export async function GET() {
  const results = await runSecurityAndLogicTests();
  const allPassed = results.every((r) => r.status === "PASSED");

  return NextResponse.json({
    success: allPassed,
    summary: `${results.filter((r) => r.status === "PASSED").length} of ${results.length} tests passed.`,
    tests: results,
  });
}

