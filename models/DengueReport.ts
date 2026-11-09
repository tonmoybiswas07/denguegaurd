import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDengueReport extends Document {
  patientId?: mongoose.Types.ObjectId;
  district: string;
  area: string;
  dateOfDiagnosis: Date;
  serotype: "DENV-1" | "DENV-2" | "DENV-3" | "DENV-4" | "Unknown";
  severity: "Mild" | "Moderate" | "Severe";
  hospitalized: boolean;
  hospitalId?: mongoose.Types.ObjectId;
  status: "pending" | "verified" | "rejected";
  verifiedBy?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DengueReportSchema = new Schema<IDengueReport>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
    dateOfDiagnosis: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    serotype: {
      type: String,
      enum: ["DENV-1", "DENV-2", "DENV-3", "DENV-4", "Unknown"],
      default: "Unknown",
    },
    severity: {
      type: String,
      enum: ["Mild", "Moderate", "Severe"],
      default: "Mild",
      index: true,
    },
    hospitalized: {
      type: Boolean,
      default: false,
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const DengueReport: Model<IDengueReport> =
  mongoose.models.DengueReport ||
  mongoose.model<IDengueReport>("DengueReport", DengueReportSchema);

export default DengueReport;

