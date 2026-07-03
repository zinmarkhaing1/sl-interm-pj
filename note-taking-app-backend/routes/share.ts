import express from "express";
import type { Request, Response } from "express";
import { verifyToken } from "../middleware/auth";
import ShareInvitation from "../models/ShareInvitation";
import Auth from "../models/Auth";
import Note from "../models/Note";
import WorkspaceAccess from "../models/WorkspaceAccess";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

interface ShareRequestBody {
  emails?: string[];
  pageUrl?: string;
}

interface RoleRequestBody {
  role?: "editor" | "viewer" | "commenter";
}

const router = express.Router();

router.post("/multiple", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { emails = [], pageUrl } = req.body as ShareRequestBody;
    const normalizedEmails = Array.isArray(emails)
      ? emails
          .map((email) => email.trim().toLowerCase())
          .filter((email) => email.length > 0)
      : [];

    const validEmails = normalizedEmails.filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

    if (validEmails.length === 0) {
      res.status(400).json({ message: "Please provide at least one valid email address." });
      return;
    }

    const inviterId = req.user?.id;
    if (!inviterId) {
      res.status(401).json({ message: "You must be signed in to invite collaborators." });
      return;
    }

    const shareLink = pageUrl || `${req.protocol}://${req.get("host")}/`;
    const createdInvitations = [] as Array<{ id: string; email: string; status: string; role: string; pageUrl: string }>;
    const userNotes = await Note.find({ user: inviterId }).select("_id");

    for (const email of validEmails) {
      const existingUser = await Auth.findOne({ email });
      const status = existingUser ? "accepted" : "pending";
      const invitation = await ShareInvitation.create({
        invitedBy: inviterId,
        invitedEmail: email,
        role: "editor",
        status,
        pageUrl: shareLink,
        userId: existingUser?._id,
      });

      if (existingUser) {
        await WorkspaceAccess.deleteMany({ userId: existingUser._id, noteId: { $in: userNotes.map((note) => note._id) } });
        await WorkspaceAccess.insertMany(
          userNotes.map((note) => ({
            userId: existingUser._id,
            noteId: note._id,
            permission: invitation.role === "editor" ? "edit" : invitation.role === "commenter" ? "comment" : "view",
            grantedBy: inviterId,
          })),
        );
      }

      createdInvitations.push({
        id: invitation._id.toString(),
        email: invitation.invitedEmail,
        status: invitation.status,
        role: invitation.role,
        pageUrl: invitation.pageUrl || shareLink,
      });
    }

    res.status(200).json({
      message: "Invitations processed successfully.",
      shareLink,
      invitations: createdInvitations,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process invite";
    res.status(500).json({ message });
  }
});

router.get("/collaborators", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      res.status(401).json({ message: "You must be signed in to view collaborators." });
      return;
    }

    const invitations = await ShareInvitation.find({
      invitedBy: currentUserId,
      status: { $in: ["pending", "accepted"] },
    })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ collaborators: invitations });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load collaborators";
    res.status(500).json({ message });
  }
});

router.get("/invitations", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      res.status(401).json({ message: "You must be signed in to view invitations." });
      return;
    }

    const currentUser = await Auth.findById(currentUserId).select("email");
    const invitations = await ShareInvitation.find({
      $or: [
        { invitedEmail: currentUser?.email?.toLowerCase() },
        { userId: currentUserId },
      ],
      status: { $in: ["pending", "accepted"] },
    })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ invitations });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load invitations";
    res.status(500).json({ message });
  }
});

router.put("/:id/role", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body as RoleRequestBody;
    if (!role || !["editor", "viewer", "commenter"].includes(role)) {
      res.status(400).json({ message: "Please provide a valid role." });
      return;
    }

    const invitation = await ShareInvitation.findOne({
      _id: req.params.id,
      invitedBy: req.user?.id,
    });

    if (!invitation) {
      res.status(404).json({ message: "Invitation not found." });
      return;
    }

    invitation.role = role;
    await invitation.save();

    const userNotes = await Note.find({ user: req.user?.id }).select("_id");
    const permission = role === "editor" ? "edit" : role === "commenter" ? "comment" : "view";

    await WorkspaceAccess.deleteMany({ userId: invitation.userId, noteId: { $in: userNotes.map((note) => note._id) } });
    if (invitation.userId) {
      await WorkspaceAccess.insertMany(
        userNotes.map((note) => ({
          userId: invitation.userId,
          noteId: note._id,
          permission,
          grantedBy: req.user?.id,
        })),
      );
    }

    res.status(200).json({ message: "Permission updated.", collaborator: invitation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update permission";
    res.status(500).json({ message });
  }
});

router.delete("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const invitation = await ShareInvitation.findOne({
      _id: req.params.id,
      invitedBy: req.user?.id,
    });

    if (!invitation) {
      res.status(404).json({ message: "Invitation not found." });
      return;
    }

    await WorkspaceAccess.deleteMany({ userId: invitation.userId, noteId: { $in: (await Note.find({ user: req.user?.id }).select("_id")).map((note) => note._id) } });
    await invitation.deleteOne();
    res.status(200).json({ message: "Collaborator removed." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to remove collaborator";
    res.status(500).json({ message });
  }
});

export default router;
