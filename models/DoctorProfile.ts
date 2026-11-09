import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDoctorProfile extends Document {
  userId: mongoose.Types.ObjectId;
  bmdcRegistrationNumber: string;
  specialization: string;
  hospitalAffiliation: string;
  yearsOfExperience: number;
  verificationStatus: "pending" | "approved" | "rejected";
  consultationFee: number;
  availableDays: string[];
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorProfileSchema = new Schema<IDoctorProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    bmdcRegistrationNumber: {
      type: String,
      required: [true, "BMDC Registration Number is required"],
      unique: true,
      trim: true,
      index: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
    },
    hospitalAffiliation: {
      type: String,
      required: [true, "Hospital affiliation is required"],
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      default: 1,
      min: 0,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    consultationFee: {
      type: Number,
      default: 0,
    },
    availableDays: {
      type: [String],
      default: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    },
    bio: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const DoctorProfile: Model<IDoctorProfile> =
  mongoose.models.DoctorProfile ||
  mongoose.model<IDoctorProfile>("DoctorProfile", DoctorProfileSchema);

export default DoctorProfile;

