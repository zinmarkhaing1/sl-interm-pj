import mongoose, { Document, Types } from "mongoose";

export interface IShareInvitation extends Document {
  invitedBy: Types.ObjectId;
  invitedEmail: string;
  role: "editor" | "viewer" | "commenter";
  status: "pending" | "accepted" | "declined";
  pageUrl?: string;
  source?: "category_page" | "note_create_form_page" | "default";
  noteId?: Types.ObjectId;
  userId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ShareInvitationSchema = new mongoose.Schema(
  {
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    invitedEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["editor", "viewer", "commenter"],
      default: "editor",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    pageUrl: {
      type: String,
    },
    source: {
      type: String,
      enum: ["category_page", "note_create_form_page", "default"],
      default: "default",
    },
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
  },
  { timestamps: true },
);

ShareInvitationSchema.index({ invitedEmail: 1, status: 1 });

const ShareInvitation = mongoose.model<IShareInvitation>("ShareInvitation", ShareInvitationSchema);

export default ShareInvitation;
