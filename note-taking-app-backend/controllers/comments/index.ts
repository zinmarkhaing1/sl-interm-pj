import { Request, Response } from "express";
import mongoose from "mongoose";
import Note from "../../models/Note";
import Comment from "../../models/Comment";
import WorkspaceAccess from "../../models/WorkspaceAccess";
import Notification from "../../models/Notification";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

const createNotification = async ({
  fromUser,
  toUser,
  noteId,
  type,
  message,
}: {
  fromUser: string;
  toUser: string;
  noteId: mongoose.Types.ObjectId;
  type: "view" | "edit" | "comment";
  message: string;
}) => {
  if (fromUser === toUser) return;
  await Notification.create({
    fromUser,
    toUser,
    noteId,
    type,
    message,
  });
};

export const getComments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const noteId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      res.status(400).json({ message: "Invalid note id." });
      return;
    }

    const note = await Note.findById(noteId);
    if (!note) {
      res.status(404).json({ message: "Note not found." });
      return;
    }

    const hasOwnerAccess = note.user.toString() === req.user?.id;
    const sharedAccess = await WorkspaceAccess.findOne({ userId: req.user?.id, noteId: note._id });
    if (!hasOwnerAccess && !sharedAccess) {
      res.status(403).json({ message: "You do not have access to this note." });
      return;
    }

    const comments = await Comment.find({ noteId: note._id }).sort({ createdAt: 1 }).lean();
    res.status(200).json({ comments });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const noteId = req.params.id;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      res.status(400).json({ message: "Invalid note id." });
      return;
    }

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      res.status(400).json({ message: "Comment text is required." });
      return;
    }

    const note = await Note.findById(noteId);
    if (!note) {
      res.status(404).json({ message: "Note not found." });
      return;
    }

    const hasOwnerAccess = note.user.toString() === req.user?.id;
    const sharedAccess = await WorkspaceAccess.findOne({ userId: req.user?.id, noteId: note._id });
    if (!hasOwnerAccess && (!sharedAccess || sharedAccess.permission !== "comment")) {
      res.status(403).json({ message: "You do not have permission to comment on this note." });
      return;
    }

    const storedUser = req.user?.id;
    const authorName = req.body.userName || "Collaborator";
    const comment = await Comment.create({
      noteId: note._id,
      userId: storedUser,
      userName: authorName,
      text: text.trim(),
    });

    if (!hasOwnerAccess) {
      const message = `${authorName} commented on your note.`;
      await createNotification({
        fromUser: storedUser!,
        toUser: note.user.toString(),
        noteId: note._id,
        type: "comment",
        message,
      });
    }

    res.status(201).json({ comment });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
