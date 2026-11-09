import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBloodDonor extends Document {
  userId?: mongoose.Types.ObjectId;
  name: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  district: string;
  area: string;
  phone: string; // Stored securely; restricted from public reads
  isAvailable: boolean;
  isPlateletDonor: boolean; // Apheresis eligible
  lastDonationDate?: Date;
  totalDonations: number;
  verificationStatus: "Verified" | "Pending" | "Suspended";
  createdAt: Date;
  updatedAt: Date;
}

const BloodDonorSchema = new Schema<IBloodDonor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
      index: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    area: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      select: false, // Hidden by default to safeguard donor privacy
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    isPlateletDonor: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastDonationDate: {
      type: Date,
    },
    totalDonations: {
      type: Number,
      default: 0,
      min: 0,
    },
    verificationStatus: {
      type: String,
      enum: ["Verified", "Pending", "Suspended"],
      default: "Verified",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const BloodDonor: Model<IBloodDonor> =
  mongoose.models.BloodDonor ||
  mongoose.model<IBloodDonor>("BloodDonor", BloodDonorSchema);

export default BloodDonor;

