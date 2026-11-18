import { NextRequest, NextResponse } from "next/server";
import { isObjectIdOrHexString } from "mongoose";
import { z } from "zod";
import { requireRole } from "@/lib/auth/rbac";
import { connectDB } from "@/lib/db/connect";
import { AuditLog, User } from "@/models";

const updateSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("edit"),
    name: z.string().trim().min(1).max(100),
    email: z.email().trim().toLowerCase().max(254),
    phone: z.string().trim().max(25),
  }),
  z.object({ action: z.literal("restore") }),
  z.object({ action: z.literal("deactivate") }),
]);

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(["admin"]);
  if (auth.error) return auth.error;

  const { id } = await params;
  if (!isObjectIdOrHexString(id)) {
    return NextResponse.json({ success: false, error: "Account not found." }, { status: 404 });
  }
  const result = updateSchema.safeParse(await req.json().catch(() => null));
  if (!result.success) {
    return NextResponse.json({ success: false, error: "Check the name, email address, and phone number." }, { status: 400 });
  }

  try {
    await connectDB();
    const change = result.data;
    const filter = { _id: id, role: { $in: ["doctor", "patient"] as ("doctor" | "patient")[] } };
    const account = change.action === "edit"
      ? await User.findOneAndUpdate(filter, { name: change.name, email: change.email, phone: change.phone }, { runValidators: true })
      : change.action === "restore"
        ? await User.findOneAndUpdate({ ...filter, deactivatedAt: { $ne: null } }, { $unset: { deactivatedAt: "" } })
        : await User.findOneAndUpdate({ ...filter, deactivatedAt: null }, { $set: { deactivatedAt: new Date() }, $inc: { sessionVersion: 1 } });

    if (!account) {
      return NextResponse.json({ success: false, error: "This account is unavailable or its status has already changed." }, { status: 409 });
    }

    try {
      await AuditLog.create({
        userId: auth.session.id,
        action: change.action === "edit" ? "ACCOUNT_UPDATED" : change.action === "restore" ? "ACCOUNT_RESTORED" : "ACCOUNT_DEACTIVATED",
        resource: "USER",
        resourceId: id,
        details: { role: account.role },
      });
    } catch {
      console.error("Unable to record account management audit event");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      return NextResponse.json({ success: false, error: "This email is already in use." }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "The account change could not be saved." }, { status: 503 });
  }
}
