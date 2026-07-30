
import mongoose, { Document, Types } from "mongoose";
export interface IPageAccess extends Document {
  userId: Types.ObjectId;
  ownerId: Types.ObjectId;
  pageType: "category" | "board";
  pageUrl: string;
  pageName?:string;
  permission: "view";
  createdAt: Date;
  updatedAt: Date;
}

// For API responses
export type PageAccessResponse = {
  _id: string;
  userId: string;
  ownerId: string;
  pageType: "category" | "board";
  pageUrl: string;
  permission: "view";
  createdAt: string;
  updatedAt: string;
};

// For populated API responses
export type PageAccessPopulatedResponse = Omit<PageAccessResponse, 'userId' | 'ownerId'> & {
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  ownerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

const PageAccessSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    pageType: {
      type: String,
      enum: ["category", "board"],
      required: true,
    },
    pageUrl: {
      type: String,
      required: true,
    },
      pageName: {
    type: String,
    required: false,
    index: true,
  },

    permission: {
      type: String,
      enum: ["view"],
      default: "view",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PageAccessSchema.index({ userId: 1, pageType: 1 });
PageAccessSchema.index({ userId: 1, pageUrl: 1 });
PageAccessSchema.index({ ownerId: 1, pageType: 1 });

export default mongoose.model<IPageAccess>("PageAccess", PageAccessSchema);