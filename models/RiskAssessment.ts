import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRiskAssessment extends Document {
  userId?: mongoose.Types.ObjectId;
  ageGroup: string;
  feverDay: string;
  symptoms: string[];
  warningSigns: string[];
  plateletRange: string;
  triageLevel: "green" | "amber" | "red";
  recommendations: string[];
  ipAddress?: string;
  assessmentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RiskAssessmentSchema = new Schema<IRiskAssessment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    ageGroup: {
      type: String,
      required: true,
    },
    feverDay: {
      type: String,
      required: true,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    warningSigns: {
      type: [String],
      default: [],
    },
    plateletRange: {
      type: String,
      default: "unknown",
    },
    triageLevel: {
      type: String,
      enum: ["green", "amber", "red"],
      required: true,
      index: true,
    },
    recommendations: {
      type: [String],
      default: [],
    },
    ipAddress: {
      type: String,
    },
    assessmentDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const RiskAssessment: Model<IRiskAssessment> =
  mongoose.models.RiskAssessment ||
  mongoose.model<IRiskAssessment>("RiskAssessment", RiskAssessmentSchema);

export default RiskAssessment;

