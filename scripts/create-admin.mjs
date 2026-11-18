import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.ts";

const uri = process.env.MONGODB_URI?.trim();
const name = process.env.ADMIN_DEFAULT_NAME?.trim() || "System Administrator";
const email = process.env.ADMIN_DEFAULT_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_DEFAULT_PASSWORD;

if (!uri || !email || !password || password.length < 16 || Buffer.byteLength(password) > 72 || password === "Admin@DengueGuard2025!") {
  console.error("Set MONGODB_URI, ADMIN_DEFAULT_EMAIL, and a unique ADMIN_DEFAULT_PASSWORD of at least 16 characters and at most 72 bytes.");
  process.exitCode = 1;
} else {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    await User.init();
    if (await User.exists({ email })) {
      console.error("That email already has an account. Choose a new email or manage the existing account separately.");
      process.exitCode = 1;
    } else {
      await User.create({
        name,
        email,
        password: await bcrypt.hash(password, 12),
        role: "admin",
        isVerified: true,
      });
      console.log("Administrator account created.");
    }
  } catch {
    console.error("Could not create the administrator. Check the database connection and account settings.");
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
