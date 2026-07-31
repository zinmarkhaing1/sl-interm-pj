import mongoose, { Document, Types } from "mongoose";

export interface INotification extends Document {
  fromUser: Types.ObjectId;
  toUser: Types.ObjectId;
  noteId: Types.ObjectId;
  type: "view" | "edit" | "comment" | "invite" |"invite_accepted"| "invite_declined";
  message: string;
  isRead: boolean;
  invitationId?:Types.ObjectId;
  pageUrl?:string;
  createdAt: Date;
  updatedAt: Date;
}


const NotificationSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: false, 
    },
    // type: {
    //   type: String,
    //   enum: ["view", "edit", "comment", "invite"],
    //   required: true,
    // },
    type: {
  type: String,
  enum: ["view", "edit", "comment", "invite", "invite_accepted", "invite_declined"],
  required: true,
},
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    invitationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShareInvitation", 
      required: false,
    },
    pageUrl: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);
const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;
