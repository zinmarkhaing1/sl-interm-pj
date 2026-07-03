import mongoose, { Document, Types } from "mongoose";

export interface IComment extends Document {
  noteId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Comment = mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;
