import mongoose, { Document, Types } from "mongoose";

export interface IWorkspaceAccess extends Document {
  userId: Types.ObjectId;
  noteId: Types.ObjectId;
  permission: "view" | "comment" | "edit";
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
    grantedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  { timestamps: true },
);

WorkspaceAccessSchema.index({ userId: 1, noteId: 1 }, { unique: true });

const WorkspaceAccess = mongoose.model<IWorkspaceAccess>("WorkspaceAccess", WorkspaceAccessSchema);

export default WorkspaceAccess;
