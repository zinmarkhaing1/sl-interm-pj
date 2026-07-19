// import mongoose, { Document, Types } from "mongoose";

// export interface IComment extends Document {
//   noteId: Types.ObjectId;
//   userId: Types.ObjectId;
//   userName: string;
//   text: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const CommentSchema = new mongoose.Schema(
//   {
//     noteId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Note",
//       required: true,
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Auth",
//       required: true,
//     },
//     userName: {
//       type: String,
//       required: true,
//     },
//     text: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true },
// );

// const Comment = mongoose.model<IComment>("Comment", CommentSchema);
// export default Comment;


// models/Comment.ts
import mongoose, { Document, Types } from "mongoose";

export interface IComment extends Document {
  noteId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  userEmail?: string;
  text: string;
  // Private comment fields
  isPrivate: boolean;
  conversationId?: string;
  invitedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: false,
      index: true,
    },
    text: {
      type: String,
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
    conversationId: {
      type: String,
      required: false,
      index: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: false,
    },
  },
  { timestamps: true }
);

// Indexes
CommentSchema.index({ noteId: 1, conversationId: 1 });
CommentSchema.index({ noteId: 1, userId: 1 });

const Comment = mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;