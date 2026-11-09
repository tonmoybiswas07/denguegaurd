import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAwarenessArticle extends Document {
  title: string;
  slug: string;
  category: "Prevention" | "Clinical" | "Symptoms" | "Community";
  summary: string;
  content: string;
  authorId: mongoose.Types.ObjectId;
  isPublished: boolean;
  viewCount: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AwarenessArticleSchema = new Schema<IAwarenessArticle>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: ["Prevention", "Clinical", "Symptoms", "Community"],
      default: "Prevention",
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const AwarenessArticle: Model<IAwarenessArticle> =
  mongoose.models.AwarenessArticle ||
  mongoose.model<IAwarenessArticle>("AwarenessArticle", AwarenessArticleSchema);

export default AwarenessArticle;

