import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHealthRecord extends Document {
  patientId: mongoose.Types.ObjectId;
  recordDate: Date;
  temperature: number; // in Fahrenheit e.g. 102.5
  plateletCount: number; // e.g. 145000 / μL
  hematocrit?: number; // e.g. 45% (PCV)
  wbcCount?: number; // e.g. 3500 / μL
  symptoms: string[];
  reportFileUrl?: string;
  notes?: string;
  enteredBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const HealthRecordSchema = new Schema<IHealthRecord>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recordDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    temperature: {
      type: Number,
      required: true,
      min: 94,
      max: 108,
    },
    plateletCount: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000,
    },
    hematocrit: {
      type: Number,
      min: 10,
      max: 80,
    },
    wbcCount: {
      type: Number,
      min: 500,
      max: 50000,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    reportFileUrl: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
    },
    enteredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

HealthRecordSchema.index({ patientId: 1, recordDate: -1 });

const HealthRecord: Model<IHealthRecord> =
  mongoose.models.HealthRecord ||
  mongoose.model<IHealthRecord>("HealthRecord", HealthRecordSchema);

export default HealthRecord;

