import mongoose, { Document, Types } from "mongoose";

export interface IWorkspaceAccess extends Document {
  userId: Types.ObjectId;
  noteId: Types.ObjectId;
  permission: "view" | "comment" | "edit";
  accessScope: "global" | "category" | "note-create-form";
  grantedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WorkspaceAccessSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },
    permission: {
      type: String,
      enum: ["view", "comment", "edit"],
      required: true,
    },
    accessScope: {
      type: String,
      enum: ["global", "category","note-create-form"],
      default: "global",
    },
    grantedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  { timestamps: true },
);

WorkspaceAccessSchema.index({ userId: 1, noteId: 1, accessScope: 1 }, { unique: true });

const WorkspaceAccess = mongoose.model<IWorkspaceAccess>("WorkspaceAccess", WorkspaceAccessSchema);

export default WorkspaceAccess;
