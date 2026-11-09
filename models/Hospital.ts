import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHospital extends Document {
  name: string;
  district: string;
  area: string;
  address: string;
  type: "Government" | "Private" | "Specialized";
  phone: string;
  emergencyPhone: string;
  totalBeds: number;
  availableDengueBeds: number;
  icuTotal: number;
  icuAvailable: number;
  hasDedicatedDengueUnit: boolean;
  isVerified: boolean;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt: Date;
  updatedAt: Date;
}

const HospitalSchema = new Schema<IHospital>(
  {
    name: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true,
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
    address: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Government", "Private", "Specialized"],
      default: "Government",
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    emergencyPhone: {
      type: String,
      required: true,
      trim: true,
    },
    totalBeds: {
      type: Number,
      required: true,
      default: 100,
    },
    availableDengueBeds: {
      type: Number,
      required: true,
      default: 0,
    },
    icuTotal: {
      type: Number,
      default: 0,
    },
    icuAvailable: {
      type: Number,
      default: 0,
    },
    hasDedicatedDengueUnit: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
      index: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [90.4125, 23.8103], // [lng, lat]
      },
    },
  },
  {
    timestamps: true,
  }
);

HospitalSchema.index({ location: "2dsphere" });

const Hospital: Model<IHospital> =
  mongoose.models.Hospital ||
  mongoose.model<IHospital>("Hospital", HospitalSchema);

export default Hospital;

