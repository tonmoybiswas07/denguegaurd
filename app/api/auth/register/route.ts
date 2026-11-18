import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import { User, PatientProfile, DoctorProfile, AuditLog } from "@/models";
import { getJwtSecret, signToken, setAuthCookie } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, phone, bmdcRegistrationNumber, specialization, hospitalAffiliation } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const assignedRole = role === "doctor" ? "doctor" : "patient";

    getJwtSecret();
    await connectDB();

    // Check if email already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: assignedRole,
      phone: phone || "",
      isVerified: assignedRole === "patient", // patients verified by default, doctors need credential check
    });

    // Create role-specific profile
    if (assignedRole === "patient") {
      await PatientProfile.create({
        userId: user._id,
      });
    } else if (assignedRole === "doctor") {
      await DoctorProfile.create({
        userId: user._id,
        bmdcRegistrationNumber: bmdcRegistrationNumber || "BMDC-PENDING",
        specialization: specialization || "General Medicine",
        hospitalAffiliation: hospitalAffiliation || "General Hospital",
        verificationStatus: "pending",
      });
    }

    // Sign JWT and set cookie
    const token = signToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token);

    // Audit log
    await AuditLog.create({
      userId: user._id,
      action: "USER_REGISTERED",
      resource: "AUTH",
      details: { role: assignedRole, email: user.email },
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Registration is temporarily unavailable." },
      { status: 500 }
    );
  }
}

