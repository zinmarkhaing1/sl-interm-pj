// import mongoose, { Document, Types } from "mongoose";

// export interface IShareInvitation extends Document {
//   invitedBy: Types.ObjectId;
//   invitedEmail: string;
//   role: "editor" | "viewer" | "commenter";
//   status: "pending" | "accepted" | "declined";
//   pageUrl?: string;
//   source?: "category_page" | "note_page" | "board_page" | "note_form_page" |"default";
//   noteId?: Types.ObjectId;
//   userId?: Types.ObjectId;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const ShareInvitationSchema = new mongoose.Schema(
//   {
//     invitedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Auth",
//       required: true,
//     },
//     invitedEmail: {
//       type: String,
//       required: true,
//       lowercase: true,
//       trim: true,
//     },
//     role: {
//       type: String,
//       enum: ["editor", "viewer", "commenter"],
//       default: "editor",
//     },
//     status: {
//       type: String,
//       enum: ["pending", "accepted", "declined"],
//       default: "pending",
//     },
//     pageUrl: {
//       type: String,
//     },
//     source: {
//       type: String,
//       enum: ["category_page", "note_page","board_page", "note_form_page","default"],
//       default: "default",
//     },
//     noteId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Note",
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Auth",
//     },
//   },
//   { timestamps: true },
// );

// ShareInvitationSchema.index({ invitedEmail: 1, status: 1 });

// const ShareInvitation = mongoose.model<IShareInvitation>("ShareInvitation", ShareInvitationSchema);

// export default ShareInvitation;


import mongoose, { Document, Types } from "mongoose";

export interface IShareInvitation extends Document {
  invitedBy: Types.ObjectId;
  invitedEmail: string;
  role: "editor" | "viewer" | "commenter" | "full"; // "full" ထည့်ပါ
  status: "pending" | "accepted" | "declined";
  pageUrl?: string;
  source?: "category_page" | "note_page" | "board_page" | "note_form_page" | "default";
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
      enum: ["editor", "viewer", "commenter", "full"], // "full" ထည့်ပါ
      default: "viewer", // default ကို viewer လို့ထားပါ
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    pageUrl: {
      type: String,
      required: false,
    },
    source: {
      type: String,
      enum: ["category_page", "note_page", "board_page", "note_form_page", "default"],
      default: "default",
    },
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: false,
    },
  },
  { timestamps: true },
);

// Indexes for better query performance
ShareInvitationSchema.index({ invitedEmail: 1, status: 1 });
ShareInvitationSchema.index({ invitedBy: 1, status: 1 });
ShareInvitationSchema.index({ noteId: 1, status: 1 });
ShareInvitationSchema.index({ pageUrl: 1 });

const ShareInvitation = mongoose.model<IShareInvitation>("ShareInvitation", ShareInvitationSchema);

export default ShareInvitation;