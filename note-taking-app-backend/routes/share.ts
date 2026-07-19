// // import express from "express";
// // import mongoose from "mongoose";
// // import type { Request, Response } from "express";
// // import { verifyToken } from "../middleware/auth";
// // import ShareInvitation from "../models/ShareInvitation";
// // import Notification from "../models/Notification";
// // let nodemailer: any = null;
// // try {
// //   // optional import; not required if SMTP not configured
// //   nodemailer = require('nodemailer');
// // } catch (err) {
// //   nodemailer = null;
// // }
// // import Auth from "../models/Auth";
// // import Comment from "../models/Comment";
// // import Note from "../models/Note";
// // import WorkspaceAccess from "../models/WorkspaceAccess";

// // interface AuthRequest extends Request {
// //   user?: {
// //     id: string;
// //   };
// // }

// // interface ShareRequestBody {
// //   emails?: string[];
// //   pageUrl?: string;
// //   source?: string;
// // }

// // interface RoleRequestBody {
// //   role?: "editor" | "viewer" | "commenter";
// // }

// // const router = express.Router();

// // const extractNoteId = (url?: string) => {
// //   if (!url) return null;
// //   const match = url.match(/note-form\/(?:detail|edit)\/([a-zA-Z0-9_-]{1,100})/);
// //   return match ? match[1] : null;
// // };

// // const getAccessScope = (pageUrl?: string, source?: string) => {
// //   if (source === "category_page" || /\/category(?:[/?#]|$)/.test(pageUrl || "")) {
// //     return "category" as const;
// //   }
// //   if(source === "note_page" || /\/note(?:[/?#] |$)/.test(pageUrl || "")){
// //     return "note" as const;
// //   }
// //   return "global" as const;
// // };




// // router.post("/multiple", verifyToken, async (req: AuthRequest, res: Response) => {
// //   try {
// //     const { emails = [], pageUrl, source } = req.body as ShareRequestBody;
// //     const normalizedEmails = Array.isArray(emails)
// //       ? emails
// //           .map((email) => email.trim().toLowerCase())
// //           .filter((email) => email.length > 0)
// //       : [];

// //     const validEmails = normalizedEmails.filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

// //     if (validEmails.length === 0) {
// //       res.status(400).json({ message: "Please provide at least one valid email address." });
// //       return;
// //     }

// //     const inviterId = req.user?.id;
// //     if (!inviterId) {
// //       res.status(401).json({ message: "You must be signed in to invite collaborators." });
// //       return;
// //     }

// //     const shareLink = pageUrl || `${req.protocol}://${req.get("host")}/`;
// //     const accessScope = getAccessScope(shareLink, source);
// //     const createdInvitations = [] as Array<{ id: string; email: string; status: string; role: string; pageUrl: string }>;
// //     const userNotes = await Note.find({ user: inviterId }).select("_id");

// //     // If the inviter provided a pageUrl that points to a specific note, prefer granting access for that note only
// //     const pageNoteId = extractNoteId(shareLink);
// //     // const pageNoteObjectId = pageNoteId && mongoose.Types.ObjectId.isValid(pageNoteId) ? mongoose.Types.ObjectId(pageNoteId) : null;
// //     const pageNoteObjectId = pageNoteId && mongoose.Types.ObjectId.isValid(pageNoteId) ? new mongoose.Types.ObjectId(pageNoteId) : null;

// //     for (const email of validEmails) {
// //       const existingUser = await Auth.findOne({ email });
// //       const status = existingUser ? "accepted" : "pending";

// //       let invitationSource = "default";
// //       if (accessScope === "category"){
// //         invitationSource = "category_page";
// //       }else if (accessScope === "note") {
// //         invitationSource ="note_page";
// //       }
// //       const invitation = await ShareInvitation.create({
// //         invitedBy: inviterId,
// //         invitedEmail: email,
// //         role: "editor",
// //         status,
// //         pageUrl: shareLink,
// //         source: invitationSource,
// //         noteId: pageNoteObjectId || undefined,
// //         userId: existingUser?._id,
// //       } as any);

// //       // If the invited email belongs to an existing user, create an invite notification
// //       if (existingUser) {
// //         try {
// //           await Notification.create({
// //             fromUser: inviterId,
// //             toUser: existingUser._id,
// //             type: "invite",
// //             message: `You were invited to collaborate (role: ${invitation.role}) by the user.`,
// //           });
// //         } catch (err) {
// //           // ignore notification failures
// //         }
// //       }
// //       // Determine which notes to grant access to: prefer the single note extracted from pageUrl
// //       const pageNoteId = extractNoteId(invitation.pageUrl || shareLink);
// //       const targetNoteIds = pageNoteId ? [pageNoteId] : userNotes.map((note) => note._id);

// //       if (existingUser) {
// //         await WorkspaceAccess.deleteMany({ userId: existingUser._id, noteId: { $in: targetNoteIds }, accessScope });
// //         // validate note ids exist when extracted from pageUrl
// //         const notesToGrant = pageNoteId
// //           ? await Note.find({ _id: pageNoteId, user: inviterId }).select("_id")
// //           : userNotes;

// //         if (notesToGrant.length > 0) {
// //           await WorkspaceAccess.insertMany(
// //             notesToGrant.map((note) => ({
// //               userId: existingUser._id,
// //               noteId: note._id,
// //               permission: invitation.role === "editor" ? "edit" : invitation.role === "commenter" ? "comment" : "view",
// //               accessScope,
// //               grantedBy: inviterId,
// //             })),
// //           );
// //         }
// //       }

// //       createdInvitations.push({
// //         id: invitation._id.toString(),
// //         email: invitation.invitedEmail,
// //         status: invitation.status,
// //         role: invitation.role,
// //         pageUrl: invitation.pageUrl || shareLink,
// //       });

// //       // send email invite if SMTP configured
// //       try {
// //         const smtpUrl = process.env.SMTP_URL;
// //         const smtpUser = process.env.SMTP_USER;
// //         const smtpPass = process.env.SMTP_PASS;
// //         const fromAddress = process.env.SMTP_FROM || 'no-reply@example.com';
// //         if (nodemailer && smtpUrl) {
// //           const transporter = nodemailer.createTransport(smtpUrl, { auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined });
// //           const mail = {
// //             from: fromAddress,
// //             to: email,
// //             subject: `You've been invited to collaborate`,
// //             text: `You were invited by a user to collaborate with role ${invitation.role}. Open: ${invitation.pageUrl || shareLink}`,
// //           };
// //           transporter.sendMail(mail).catch(() => null);
// //         }
// //       } catch (err) {
// //         // ignore mail errors
// //       }
// //     }

// //     res.status(200).json({
// //       message: "Invitations processed successfully.",
// //       shareLink,
// //       invitations: createdInvitations,
// //     });
// //   } catch (error) {
// //     const message = error instanceof Error ? error.message : "Unable to process invite";
// //     res.status(500).json({ message });
// //   }
// // });

// // router.get("/collaborators", verifyToken, async (req: AuthRequest, res: Response) => {
// //   try {
// //     const currentUserId = req.user?.id;
// //     if (!currentUserId) {
// //       res.status(401).json({ message: "You must be signed in to view collaborators." });
// //       return;
// //     }

// //     const invitations = await ShareInvitation.find({
// //       invitedBy: currentUserId,
// //       status: { $in: ["pending", "accepted"] },
// //     })
// //       .sort({ createdAt: -1 })
// //       .lean();

// //     res.status(200).json({ collaborators: invitations });
// //   } catch (error) {
// //     const message = error instanceof Error ? error.message : "Unable to load collaborators";
// //     res.status(500).json({ message });
// //   }
// // });

// // router.get("/invitations", verifyToken, async (req: AuthRequest, res: Response) => {
// //   try {
// //     const currentUserId = req.user?.id;
// //     if (!currentUserId) {
// //       res.status(401).json({ message: "You must be signed in to view invitations." });
// //       return;
// //     }

// //     const currentUser = await Auth.findById(currentUserId).select("email");
// //     const invitations = await ShareInvitation.find({
// //       $or: [
// //         { invitedEmail: currentUser?.email?.toLowerCase() },
// //         { userId: currentUserId },
// //       ],
// //       status: { $in: ["pending", "accepted"] },
// //     })
// //       .sort({ createdAt: -1 })
// //       .lean();

// //     res.status(200).json({ invitations });
// //   } catch (error) {
// //     const message = error instanceof Error ? error.message : "Unable to load invitations";
// //     res.status(500).json({ message });
// //   }
// // });

// // router.put("/:id/role", verifyToken, async (req: AuthRequest, res: Response) => {
// //   try {
// //     const { role } = req.body as RoleRequestBody;
// //     if (!role || !["editor", "viewer", "commenter"].includes(role)) {
// //       res.status(400).json({ message: "Please provide a valid role." });
// //       return;
// //     }

// //     const invitation = await ShareInvitation.findOne({
// //       _id: req.params.id,
// //       invitedBy: req.user?.id,
// //     });

// //     if (!invitation) {
// //       res.status(404).json({ message: "Invitation not found." });
// //       return;
// //     }

// //     invitation.role = role;
// //     await invitation.save();

// //     const pageNoteId = extractNoteId(invitation.pageUrl);
// //     const accessScope = getAccessScope(invitation.pageUrl, invitation.source);
// //     const userNotes = pageNoteId
// //       ? await Note.find({ _id: pageNoteId, user: req.user?.id }).select("_id")
// //       : await Note.find({ user: req.user?.id }).select("_id");
// //     const permission = role === "editor" ? "edit" : role === "commenter" ? "comment" : "view";

// //     await WorkspaceAccess.deleteMany({ userId: invitation.userId, noteId: { $in: userNotes.map((note) => note._id) }, accessScope });
// //     if (invitation.userId) {
// //       await WorkspaceAccess.insertMany(
// //         userNotes.map((note) => ({
// //           userId: invitation.userId,
// //           noteId: note._id,
// //           permission,
// //           accessScope,
// //           grantedBy: req.user?.id,
// //         })),
// //       );
// //     }

// //     res.status(200).json({ message: "Permission updated.", collaborator: invitation });
// //   } catch (error) {
// //     const message = error instanceof Error ? error.message : "Unable to update permission";
// //     res.status(500).json({ message });
// //   }
// // });

// // router.post("/invite", verifyToken, async (req: AuthRequest, res: Response) => {
// //   try {
// //     const { invitedEmail, email, pageUrl, role, source } = req.body;
// //     const targetEmail = String(invitedEmail || email || "").trim().toLowerCase();
// //     const inviteRole = ["editor", "viewer", "commenter"].includes(role) ? role : "viewer";

// //     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
// //       res.status(400).json({ message: "Please provide a valid email address." });
// //       return;
// //     }

// //     const inviterId = req.user?.id;
// //     if (!inviterId) {
// //       res.status(401).json({ message: "You must be signed in to invite collaborators." });
// //       return;
// //     }

// //     const shareLink = pageUrl || `${req.protocol}://${req.get("host")}/category`|| `${req.protocol}://${req.get("host")}/note`;
// //     const accessScope = getAccessScope(shareLink, source);
// //     const existingInvitation = await ShareInvitation.findOne({
// //       invitedBy: inviterId,
// //       invitedEmail: targetEmail,
// //       pageUrl: shareLink,
// //       status: { $in: ["pending", "accepted"] },
// //     });

// //     if (existingInvitation) {
// //       res.status(400).json({ message: "This email has already been invited to this page." });
// //       return;
// //     }

// //     const existingUser = await Auth.findOne({ email: targetEmail });
// //     const pageNoteId = extractNoteId(shareLink);
// //     const pageNoteObjectId = pageNoteId && mongoose.Types.ObjectId.isValid(pageNoteId)
// //       ? new mongoose.Types.ObjectId(pageNoteId)
// //       : undefined;

// //     const invitation = await ShareInvitation.create({
// //       invitedBy: inviterId,
// //       invitedEmail: targetEmail,
// //       role: inviteRole,
// //       status: existingUser ? "accepted" : "pending",
// //       pageUrl: shareLink,
// //       source: accessScope === "category" ? "category_page" : "note_page",
// //       noteId: pageNoteObjectId,
// //       userId: existingUser?._id,
// //       ...(pageNoteObjectId? {noteId:pageNoteObjectId} : {})
// //     });

// //     if (existingUser) {
// //       const notesToGrant = pageNoteId
// //         ? await Note.find({ _id: pageNoteId, user: inviterId }).select("_id")
// //         : await Note.find({ user: inviterId }).select("_id");
// //       const permission = inviteRole === "editor" ? "edit" : inviteRole === "commenter" ? "comment" : "view";

// //       if (notesToGrant.length > 0) {
// //         await WorkspaceAccess.deleteMany({
// //           userId: existingUser._id,
// //           noteId: { $in: notesToGrant.map((note) => note._id) },
// //           accessScope,
// //         });
// //         await WorkspaceAccess.insertMany(
// //           notesToGrant.map((note) => ({
// //             userId: existingUser._id,
// //             noteId: note._id,
// //             permission,
// //             accessScope,
// //             grantedBy: inviterId,
// //           })),
// //         );
// //       }

// //       await Notification.create({
// //         fromUser: inviterId,
// //         toUser: existingUser._id,
// //         type: "invite",
// //         message: `You were invited to collaborate (role: ${invitation.role}) by the user.`,
// //       }).catch(() => null);
// //     }

// //     res.status(201).json({
// //       message: "Collaborator invited successfully.",
// //       collaborator: invitation,
// //     });
// //   } catch (error) {
// //     const message = error instanceof Error ? error.message : "Unable to process invite";
// //     res.status(500).json({ message });
// //   }
// // });

// // router.delete("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
// //   try {
// //     const invitation = await ShareInvitation.findOne({
// //       _id: req.params.id,
// //       invitedBy: req.user?.id,
// //     });

// //     if (!invitation) {
// //       res.status(404).json({ message: "Invitation not found." });
// //       return;
// //     }

// //     const pageNoteId = extractNoteId(invitation.pageUrl);
// //     const accessScope = getAccessScope(invitation.pageUrl, invitation.source);
// //     const userNotes = pageNoteId
// //       ? await Note.find({ _id: pageNoteId, user: req.user?.id }).select("_id")
// //       : await Note.find({ user: req.user?.id }).select("_id");
// //     const noteIds = userNotes.map((note) => note._id);

// //     await WorkspaceAccess.deleteMany({ userId: invitation.userId, noteId: { $in: noteIds }, accessScope });
// //     await Comment.deleteMany({ userId: invitation.userId, noteId: { $in: noteIds } });
// //     await invitation.deleteOne();

// //     res.status(200).json({ message: "Collaborator removed." });
// //   } catch (error) {
// //     const message = error instanceof Error ? error.message : "Unable to remove collaborator";
// //     res.status(500).json({ message });
// //   }
// // });

// // export default router;



// // import express from "express";
// // import mongoose from "mongoose";
// // import type { Request, Response } from "express";
// // import { verifyToken } from "../middleware/auth";
// // import ShareInvitation from "../models/ShareInvitation";
// // import Notification from "../models/Notification";
// // import Auth from "../models/Auth";
// // import Comment from "../models/Comment";
// // import Note from "../models/Note";
// // import WorkspaceAccess from "../models/WorkspaceAccess";

// // // Nodemailer 
// // let nodemailer: any = null;
// // try {
// //   nodemailer = require('nodemailer');
// // } catch (err) {
// //   nodemailer = null;
// // }

// // interface AuthRequest extends Request {
// //   user?: {
// //     id: string;
// //   };
// // }

// // interface ShareRequestBody {
// //   emails?: string[];
// //   pageUrl?: string;
// //   source?: string;
// // }

// // interface RoleRequestBody {
// //   role?: "editor" | "viewer" | "commenter";
// // }

// // const router = express.Router();

// // const extractNoteId = (url?: string) => {
// //   if (!url) return null;
// //   const match = url.match(/note-form\/(?:detail|edit)\/([a-zA-Z0-9_-]{1,100})/);
// //   return match ? match[1] : null;
// // };

// // const getAccessScope = (pageUrl?: string, source?: string) => {
// //   if (source === "category_page" || /\/category(?:[/?#]|$)/.test(pageUrl || "")) {
// //     return "category" as const;
// //   }
// //   // Regex ထဲ
// //   if (source === "note_page" || /\/note(?:[/?#]|$)/.test(pageUrl || "")) {
// //     return "note" as const;
// //   }
// //   return "global" as const;
// // };

// // // MULTIPLE INVITATIONS
// // router.post("/multiple", verifyToken, async (req: AuthRequest, res: Response) => {
// //   try {
// //     const { emails = [], pageUrl, source } = req.body as ShareRequestBody;
// //     const normalizedEmails = Array.isArray(emails)
// //       ? emails
// //           .map((email) => email.trim().toLowerCase())
// //           .filter((email) => email.length > 0)
// //       : [];

// //     const validEmails = normalizedEmails.filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

// //     if (validEmails.length === 0) {
// //       res.status(400).json({ message: "Please provide at least one valid email address." });
// //       return;
// //     }

// //     const inviterId = req.user?.id;
// //     if (!inviterId) {
// //       res.status(401).json({ message: "You must be signed in to invite collaborators." });
// //       return;
// //     }

// //     const shareLink = pageUrl || `${req.protocol}://${req.get("host")}/`;
// //     const accessScope = getAccessScope(shareLink, source);
// //     const createdInvitations = [];
// //     const userNotes = await Note.find({ user: inviterId }).select("_id");

// //     const pageNoteId = extractNoteId(shareLink);
// //     const pageNoteObjectId = pageNoteId && mongoose.Types.ObjectId.isValid(pageNoteId) 
// //       ? new mongoose.Types.ObjectId(pageNoteId) 
// //       : null;

// //     for (const email of validEmails) {
// //       const existingUser = await Auth.findOne({ email });
// //       const status = existingUser ? "accepted" : "pending";

// //       let invitationSource = "default";
// //       if (accessScope === "category") {
// //         invitationSource = "category_page";
// //       } else if (accessScope === "note") {
// //         invitationSource = "note_page";
// //       }

// //       const invitation = await ShareInvitation.create({
// //         invitedBy: inviterId,
// //         invitedEmail: email,
// //         role: "editor",
// //         status,
// //         pageUrl: shareLink,
// //         source: invitationSource,
// //         noteId: pageNoteObjectId || undefined,
// //         userId: existingUser?._id,
// //       } as any);

// //       if (existingUser) {
// //         try {
// //           await Notification.create({
// //             fromUser: inviterId,
// //             toUser: existingUser._id,
// //             type: "invite",
// //             message: `You were invited to collaborate (role: ${invitation.role}) by the user.`,
// //           });
// //         } catch (err) {
// //           // ignore notification failures
// //         }
// //       }

      
// //       const targetNoteIds = pageNoteId ? [pageNoteId] : userNotes.map((note) => note._id);

// //       if (existingUser) {
// //         await WorkspaceAccess.deleteMany({ userId: existingUser._id, noteId: { $in: targetNoteIds }, accessScope });
        
// //         const notesToGrant = pageNoteId
// //           ? await Note.find({ _id: pageNoteId, user: inviterId }).select("_id")
// //           : userNotes;

// //         if (notesToGrant.length > 0) {
// //           await WorkspaceAccess.insertMany(
// //             notesToGrant.map((note) => ({
// //               userId: existingUser._id,
// //               noteId: note._id,
// //               permission: invitation.role === "editor" ? "edit" : invitation.role === "commenter" ? "comment" : "view",
// //               accessScope,
// //               grantedBy: inviterId,
// //             })),
// //           );
// //         }
// //       }

// //       createdInvitations.push({
// //         id: invitation._id.toString(),
// //         email: invitation.invitedEmail,
// //         status: invitation.status,
// //         role: invitation.role,
// //         pageUrl: invitation.pageUrl || shareLink,
// //       });

     
// //       try {
// //         const smtpUrl = process.env.SMTP_URL;
// //         const smtpUser = process.env.SMTP_USER;
// //         const smtpPass = process.env.SMTP_PASS;
// //         const fromAddress = process.env.SMTP_FROM || 'no-reply@example.com';
// //         if (nodemailer && smtpUrl) {
// //           const transporter = nodemailer.createTransport(smtpUrl, { auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined });
// //           const mail = {
// //             from: fromAddress,
// //             to: email,
// //             subject: `You've been invited to collaborate`,
// //             text: `You were invited by a user to collaborate with role ${invitation.role}. Open: ${invitation.pageUrl || shareLink}`,
// //           };
// //           transporter.sendMail(mail).catch(() => null);
// //         }
// //       } catch (err) {
// //         // ignore mail errors
// //       }
// //     }

// //     res.status(200).json({
// //       message: "Invitations processed successfully.",
// //       shareLink,
// //       invitations: createdInvitations,
// //     });
// //   } catch (error) {
// //     const message = error instanceof Error ? error.message : "Unable to process invite";
// //     res.status(500).json({ message });
// //   }
// // });

// // router.get("/collaborators", verifyToken, async (req: AuthRequest, res: Response) => {
// //   try {
// //     const currentUserId = req.user?.id;
// //     if (!currentUserId) {
// //       res.status(401).json({ message: "You must be signed in to view collaborators." });
// //       return;
// //     }

// //     const invitations = await ShareInvitation.find({
// //       invitedBy: currentUserId,
// //       status: { $in: ["pending", "accepted"] },
// //     })
// //       .sort({ createdAt: -1 })
// //       .lean();

// //     res.status(200).json({ collaborators: invitations });
// //   } catch (error) {
// //     const message = error instanceof Error ? error.message : "Unable to load collaborators";
// //     res.status(500).json({ message });
// //   }
// // });


// // router.get("/invitations", verifyToken, async (req: AuthRequest, res: Response) => {
// //   try {
// //     const currentUserId = req.user?.id;
// //     if (!currentUserId) {
// //       res.status(401).json({ message: "You must be signed in to view invitations." });
// //       return;
// //     }

// //     const currentUser = await Auth.findById(currentUserId).select("email");
// //     const invitations = await ShareInvitation.find({
// //       $or: [
// //         { invitedEmail: currentUser?.email?.toLowerCase() },
// //         { userId: currentUserId },
// //       ],
// //       status: { $in: ["pending", "accepted"] },
// //     })
// //       .sort({ createdAt: -1 })
// //       .lean();

// //     res.status(200).json({ invitations });
// //   } catch (error) {
// //     const message = error instanceof Error ? error.message : "Unable to load invitations";
// //     res.status(500).json({ message });
// //   }
// // });

// // // UPDATE ROLE
// // router.put("/:id/role", verifyToken, async (req: AuthRequest, res: Response) => {
// //   try {
// //     const { role } = req.body as RoleRequestBody;
// //     if (!role || !["editor", "viewer", "commenter"].includes(role)) {
// //       res.status(400).json({ message: "Please provide a valid role." });
// //       return;
// //     }

// //     const invitation = await ShareInvitation.findOne({
// //       _id: req.params.id,
// //       invitedBy: req.user?.id,
// //     });

// //     if (!invitation) {
// //       res.status(404).json({ message: "Invitation not found." });
// //       return;
// //     }

// //     invitation.role = role;
// //     await invitation.save();

// //     const pageNoteId = extractNoteId(invitation.pageUrl);
// //     const accessScope = getAccessScope(invitation.pageUrl, invitation.source);
// //     const userNotes = pageNoteId
// //       ? await Note.find({ _id: pageNoteId, user: req.user?.id }).select("_id")
// //       : await Note.find({ user: req.user?.id }).select("_id");
// //     const permission = role === "editor" ? "edit" : role === "commenter" ? "comment" : "view";

// //     if (invitation.userId) {
// //       await WorkspaceAccess.deleteMany({ userId: invitation.userId, noteId: { $in: userNotes.map((note) => note._id) }, accessScope });
// //       await WorkspaceAccess.insertMany(
// //         userNotes.map((note) => ({
// //           userId: invitation.userId,
// //           noteId: note._id,
// //           permission,
// //           accessScope,
// //           grantedBy: req.user?.id,
// //         })),
// //       );
// //     }

// //     res.status(200).json({ message: "Permission updated.", collaborator: invitation });
// //   } catch (error) {
// //     const message = error instanceof Error ? error.message : "Unable to update permission";
// //     res.status(500).json({ message });
// //   }
// // });


// // router.post("/invite", verifyToken, async (req: AuthRequest, res: Response) => {
// //   try {
// //     const { invitedEmail, email, pageUrl, role, source } = req.body;
// //     const targetEmail = String(invitedEmail || email || "").trim().toLowerCase();
// //     const inviteRole = ["editor", "viewer", "commenter"].includes(role) ? role : "viewer";

// //     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
// //       res.status(400).json({ message: "Please provide a valid email address." });
// //       return;
// //     }

// //     const inviterId = req.user?.id;
// //     if (!inviterId) {
// //       res.status(401).json({ message: "You must be signed in to invite collaborators." });
// //       return;
// //     }

    
// //     const shareLink = pageUrl || `${req.protocol}://${req.get("host")}/`;
// //     const accessScope = getAccessScope(shareLink, source);
    
// //     const existingInvitation = await ShareInvitation.findOne({
// //       invitedBy: inviterId,
// //       invitedEmail: targetEmail,
// //       pageUrl: shareLink,
// //       status: { $in: ["pending", "accepted"] },
// //     });

// //     if (existingInvitation) {
// //       res.status(400).json({ message: "This email has already been invited to this page." });
// //       return;
// //     }

// //     const existingUser = await Auth.findOne({ email: targetEmail });
// //     const pageNoteId = extractNoteId(shareLink);
// //     const pageNoteObjectId = pageNoteId && mongoose.Types.ObjectId.isValid(pageNoteId)
// //       ? new mongoose.Types.ObjectId(pageNoteId)
// //       : undefined;

// //     const invitation = await ShareInvitation.create({
// //       invitedBy: inviterId,
// //       invitedEmail: targetEmail,
// //       role: inviteRole,
// //       status: existingUser ? "accepted" : "pending",
// //       pageUrl: shareLink,
// //       source: accessScope === "category" ? "category_page" : accessScope === "note" ? "note_page" : accessScope === "board"? "board_page":"default",
// //       noteId: pageNoteObjectId,
// //       userId: existingUser?._id
// //     });

// //     if (existingUser) {
// //       const notesToGrant = pageNoteId
// //         ? await Note.find({ _id: pageNoteId, user: inviterId }).select("_id")
// //         : await Note.find({ user: inviterId }).select("_id");
// //       const permission = inviteRole === "editor" ? "edit" : inviteRole === "commenter" ? "comment" : "view";

// //       if (notesToGrant.length > 0) {
// //         await WorkspaceAccess.deleteMany({
// //           userId: existingUser._id,
// //           noteId: { $in: notesToGrant.map((note) => note._id) },
// //           accessScope,
// //         });
// //         await WorkspaceAccess.insertMany(
// //           notesToGrant.map((note) => ({
// //             userId: existingUser._id,
// //             noteId: note._id,
// //             permission,
// //             accessScope,
// //             grantedBy: inviterId,
// //           })),
// //         );
// //       }

// //       await Notification.create({
// //         fromUser: inviterId,
// //         toUser: existingUser._id,
// //         type: "invite",
// //         message: `You were invited to collaborate (role: ${invitation.role}) by the user.`,
// //       }).catch(() => null);
// //     }

// //     res.status(201).json({
// //       message: "Collaborator invited successfully.",
// //       collaborator: invitation,
// //     });
// //   } catch (error) {
// //     const message = error instanceof Error ? error.message : "Unable to process invite";
// //     res.status(500).json({ message });
// //   }
// // });

// // // DELETE COLLABORATOR
// // router.delete("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
// //   try {
// //     const invitation = await ShareInvitation.findOne({
// //       _id: req.params.id,
// //       invitedBy: req.user?.id,
// //     });

// //     if (!invitation) {
// //       res.status(404).json({ message: "Invitation not found." });
// //       return;
// //     }

// //     const pageNoteId = extractNoteId(invitation.pageUrl);
// //     const accessScope = getAccessScope(invitation.pageUrl, invitation.source);
// //     const userNotes = pageNoteId
// //       ? await Note.find({ _id: pageNoteId, user: req.user?.id }).select("_id")
// //       : await Note.find({ user: req.user?.id }).select("_id");
// //     const noteIds = userNotes.map((note) => note._id);

// //     if (invitation.userId) {
// //       await WorkspaceAccess.deleteMany({ userId: invitation.userId, noteId: { $in: noteIds }, accessScope });
// //       await Comment.deleteMany({ userId: invitation.userId, noteId: { $in: noteIds } });
// //     }
    
// //     await invitation.deleteOne();

// //     res.status(200).json({ message: "Collaborator removed." });
// //   } catch (error) {
// //     const message = error instanceof Error ? error.message : "Unable to remove collaborator";
// //     res.status(500).json({ message });
// //   }
// // });

// // export default router;


import express from "express";
import mongoose from "mongoose";
import type { Request, Response } from "express";
import { verifyToken } from "../middleware/auth";
import ShareInvitation from "../models/ShareInvitation";
import Notification from "../models/Notification";
import Auth from "../models/Auth";
import Comment from "../models/Comment";
import Note from "../models/Note";
import WorkspaceAccess from "../models/WorkspaceAccess";
import PageAccess from "../models/PageAccess";

// Nodemailer setup
let nodemailer: any = null;
try {
  nodemailer = require('nodemailer');
} catch (err) {
  nodemailer = null;
}

interface AuthRequest extends Request {
  user?: { id: string };
}

interface ShareRequestBody {
  emails?: string[];
  invitedEmail?: string;
  email?: string;
  pageUrl?: string;
  source?: string;
  role?: "editor" | "viewer" | "commenter" | "full";
  noteId?: string;
}

const router = express.Router();

// --- HELPER FUNCTIONS ---

const extractNoteId = (url?: string): string | null => {
  if (!url) return null;
  const match = url.match(/note-form\/(?:detail|edit)\/([a-zA-Z0-9_-]{1,100})/);
  return match ? match[1] : null;
};

const getAccessScope = (pageUrl?: string, source?: string) => {
  if (source === "category_page" || /\/category(?:[/?#]|$)/.test(pageUrl || "")) {
    return "category" as const;
  }
  if (source === "note_page" || /\/note(?:[/?#]|$)/.test(pageUrl || "")) {
    return "note" as const;
  } 
  if (source === "board_page" || /\/board(?:[/?#]|$)/.test(pageUrl || "")) {
    return "board" as const;
  }
   if (source === "note_form_page" || /\/note-form(?:[/?#]|$)/.test(pageUrl || "")) {
    return "note-form" as const;
  }
  return "global" as const;
};


const grantWorkspaceAccess = async ({
  userId,
  inviterId,
  pageNoteId,
  role,
  accessScope
}: {
  userId:string;
  inviterId:string;
  pageNoteId:string|null;
  role:"editor"|"viewer"|"commenter" |"full";
  accessScope:"category"|"note"|"board"|"note-form"|"global";
}) => {


  
  if(
    accessScope === "category" ||
    accessScope === "board" ||
    accessScope === "global"
  ){
    return [];
  }


  if(!pageNoteId){
    return [];
  }


  const note = await Note.findOne({
    _id: pageNoteId,
    user: inviterId
  }).select("_id");


  
  if(!note){
    return [];
  }


  const permission =
    role==="editor"
      ? "edit"
      : role==="commenter"
      ? "comment"
      : role === "full"
      ? "full"
      : "view";



      console.log("GRANT ACCESS DEBUG!!!!!!", {
  role,
  permission,
  userId,
  inviterId,
  pageNoteId,
  accessScope
});


  await WorkspaceAccess.findOneAndUpdate(
    {
      userId,
      noteId:note._id,
      accessScope
    },
    {
      userId,
      noteId:note._id,
      permission,
      accessScope,
      grantedBy:inviterId
    },
    {
      upsert:true,
      new:true
    }
  );

  


  return [note._id];

};

const grantPageAccess = async({
 userId,
 ownerId,
 pageType,
 pageUrl,
 role
}:{
 userId:string;
 ownerId:string;
 pageType:"category"|"board"|"note-form";
 pageUrl:string;
 role:"editor"|"viewer"|"commenter" | "full";
})=>{


const permission =
 role==="editor"
 ? "edit"
 : role==="commenter"
 ? "comment"
 : role === "full"
 ?"full"
 :"view";


await PageAccess.findOneAndUpdate(
 {
  userId,
  ownerId,
  pageUrl
 },
 {
  userId,
  ownerId,
  pageType,
  pageUrl,
  permission
 },
 {
  upsert:true,
  new:true
 }
);


};

const sendInviteEmail = async (email: string, role: string, shareLink: string) => {
  try {
    const smtpUrl = process.env.SMTP_URL;
    if (nodemailer && smtpUrl) {
      const transporter = nodemailer.createTransport(smtpUrl, {
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@example.com',
        to: email,
        subject: `You've been invited to collaborate`,
        text: `You were invited by a user to collaborate with role ${role}. Open: ${shareLink}`,
      });
    }
  } catch (err) {
    // ignore
  }
};


// --- ROUTES ---

// 1. MULTIPLE INVITATIONS
router.post("/multiple", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { emails = [], pageUrl, source, role = "editor" } = req.body as ShareRequestBody;
    const inviterId = req.user?.id;

    if (!inviterId) {
      res.status(401).json({ message: "You must be signed in to invite collaborators." });
      return;
    }

    const normalizedEmails = Array.isArray(emails)
      ? emails.map((e) => e.trim().toLowerCase()).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
      : [];

    if (normalizedEmails.length === 0) {
      res.status(400).json({ message: "Please provide at least one valid email address." });
      return;
    }

    const shareLink = pageUrl || `${req.protocol}://${req.get("host")}/`;
    const accessScope = getAccessScope(shareLink, source);
    const pageNoteId = extractNoteId(shareLink);
    const pageNoteObjectId = pageNoteId && mongoose.Types.ObjectId.isValid(pageNoteId) ? new mongoose.Types.ObjectId(pageNoteId) : null;

    const createdInvitations = [];

    for (const email of normalizedEmails) {
      const existingUser = await Auth.findOne({ email });
      const status = existingUser ? "accepted" : "pending";
      
      // invitation source 
      const invitationSource = accessScope === "category" ? "category_page" : accessScope === "note" ? "note_page" : accessScope === "board" ? "board_page" :accessScope === "note-form" ? "note_form_page" :"default";
      const invitation = await ShareInvitation.create({
        invitedBy: inviterId,
        invitedEmail: email,
        role,
        status,
        pageUrl: shareLink,
        source: invitationSource,
        noteId: pageNoteObjectId || undefined,
        userId: existingUser?._id,
      } as any);

      if (existingUser) {
       if(
 accessScope==="category" ||
 accessScope==="board"
){

 await grantPageAccess({

  userId: existingUser._id.toString(),

  ownerId: inviterId,

  pageType:accessScope,

  pageUrl:shareLink,

  role

 });

}
else{

 await grantWorkspaceAccess({
  userId: existingUser._id.toString(),
  inviterId,
  pageNoteId,
  role,
  accessScope
 });

}

        await Notification.create({
          fromUser: inviterId,
          toUser: existingUser._id,
          type: "invite",
          message: `You were invited to collaborate (role: ${role}) by the user.`,
        }).catch(() => null);
      }

      createdInvitations.push({
        id: invitation._id.toString(),
        email: invitation.invitedEmail,
        status: invitation.status,
        role: invitation.role,
        pageUrl: invitation.pageUrl || shareLink,
      });

      sendInviteEmail(email, role, shareLink);
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


// router.post("/invite", verifyToken, async (req: AuthRequest, res: Response) => {
//   try {
//     const { invitedEmail, email, pageUrl, role = "viewer", source, noteId } = req.body as ShareRequestBody;
//     const targetEmail = String(invitedEmail || email || "").trim().toLowerCase();
//     const inviterId = req.user?.id;

//     if (!inviterId) {
//       res.status(401).json({ message: "You must be signed in to invite collaborators." });
//       return;
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
//       res.status(400).json({ message: "Please provide a valid email address." });
//       return;
//     }

//     const shareLink = pageUrl || `${req.protocol}://${req.get("host")}/`;
//     const accessScope = getAccessScope(shareLink, source);

//     // Check for existing invitation
//     const existingInvitation = await ShareInvitation.findOne({
//       invitedBy: inviterId,
//       invitedEmail: targetEmail,
//       pageUrl: shareLink,
//       status: { $in: ["pending", "accepted"] },
//     });

//     if (existingInvitation) {
//       res.status(400).json({ message: "This email has already been invited to this page." });
//       return;
//     }

//     const existingUser = await Auth.findOne({ email: targetEmail });
//     const pageNoteId = noteId || extractNoteId(shareLink); // Use provided noteId or extract from URL
//     const pageNoteObjectId = pageNoteId && mongoose.Types.ObjectId.isValid(pageNoteId) 
//       ? new mongoose.Types.ObjectId(pageNoteId) 
//       : undefined;

//     const invitationSource = accessScope === "category" 
//       ? "category_page" 
//       : accessScope === "note" 
//         ? "note_page" 
//         : accessScope === "board" 
//           ? "board_page"
//           : accessScope === "note-form"
//             ? "note_form_page"
//             : "default" as const; 

            

//     const invitation = await ShareInvitation.create({
//       invitedBy: inviterId,
//       invitedEmail: targetEmail,
//       role,
//       status: existingUser ? "accepted" : "pending",
//       pageUrl: shareLink,
//       source: invitationSource as any,
//       noteId: pageNoteObjectId, // Save noteId
//       userId: existingUser?._id
//     });
// console.log("CREATE PAGE ACCESS",{
//  existingUser: existingUser?._id,
//  accessScope,
//  shareLink
// });
//     if (existingUser) {
//        await grantWorkspaceAccess({
//     userId: existingUser._id.toString(),
//     inviterId,
//     pageNoteId,
//     role,
//     accessScope
//   });

//   console.log("PAGE ACCESS DATA",{
//  userId:existingUser._id,
//  ownerId:inviterId,
//  pageType:accessScope,
//  pageUrl:shareLink,
//  role
// });
// // page level access
//   if(
//     accessScope === "category" ||
//     accessScope === "board"
//   ){

//     await PageAccess.create({

//       userId: existingUser._id,

//       ownerId: inviterId,

//       pageType: accessScope,

//       pageUrl: shareLink,

//       permission:
//         role === "editor"
//           ? "edit"
//           : role === "commenter"
//           ? "comment"
//           : "view"

//     });

//   }

//       await Notification.create({
//         fromUser: inviterId,
//         toUser: existingUser._id,
//         type: "invite",
//         message: `You were invited to collaborate (role: ${role}) by the user.`,
//       }).catch(() => null);
//     }

//     sendInviteEmail(targetEmail, role, shareLink);

//     res.status(201).json({
//       message: "Collaborator invited successfully.",
//       collaborator: invitation,
//     });
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Unable to process invite";
//     res.status(500).json({ message });
//   }
// });


router.post("/invite", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { invitedEmail, email, pageUrl, role = "viewer", source, noteId } = req.body as ShareRequestBody;
    const targetEmail = String(invitedEmail || email || "").trim().toLowerCase();
    const inviterId = req.user?.id;

    if (!inviterId) {
      res.status(401).json({ message: "You must be signed in to invite collaborators." });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
      res.status(400).json({ message: "Please provide a valid email address." });
      return;
    }

    const shareLink = pageUrl || `${req.protocol}://${req.get("host")}/`;
    const accessScope = getAccessScope(shareLink, source);

    // Check for existing invitation
    const existingInvitation = await ShareInvitation.findOne({
      invitedBy: inviterId,
      invitedEmail: targetEmail,
      pageUrl: shareLink,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingInvitation) {
      res.status(400).json({ message: "This email has already been invited to this page." });
      return;
    }

    const existingUser = await Auth.findOne({ email: targetEmail });
    const pageNoteId = noteId || extractNoteId(shareLink);
    const pageNoteObjectId = pageNoteId && mongoose.Types.ObjectId.isValid(pageNoteId) 
      ? new mongoose.Types.ObjectId(pageNoteId) 
      : undefined;

    const invitationSource = accessScope === "category" 
      ? "category_page" 
      : accessScope === "note" 
        ? "note_page" 
        : accessScope === "board" 
          ? "board_page"
          : accessScope === "note-form"
            ? "note_form_page"
            : "default" as const;

    const invitation = await ShareInvitation.create({
      invitedBy: inviterId,
      invitedEmail: targetEmail,
      role,
      status: existingUser ? "accepted" : "pending",
      pageUrl: shareLink,
      source: invitationSource as any,
      noteId: pageNoteObjectId,
      userId: existingUser?._id
    });

    if (existingUser) {
      // Grant workspace access with proper permission
      const permissionMap: Record<string, string> = {
        "viewer": "view",
        "commenter": "comment",
        "editor": "edit",
        "full": "full"
      };
      
      await grantWorkspaceAccess({
        userId: existingUser._id.toString(),
        inviterId,
        pageNoteId: pageNoteId || null,
        role,
        accessScope
      });

      // Create notification
      await Notification.create({
        fromUser: inviterId,
        toUser: existingUser._id,
        type: "invite",
        message: `You were invited to collaborate (role: ${role}) by the user.`,
      }).catch(() => null);
    }

    sendInviteEmail(targetEmail, role, shareLink);

    res.status(201).json({
      message: "Collaborator invited successfully.",
      collaborator: invitation,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process invite";
    res.status(500).json({ message });
  }
});

// 3. UPDATE ROLE
router.put("/:id/role", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body as ShareRequestBody;
    const inviterId = req.user?.id;

   
    if (!inviterId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!role || !["editor", "viewer", "commenter","full"].includes(role)) {
      res.status(400).json({ message: "Please provide a valid role." });
      return;
    }

    const invitation = await ShareInvitation.findOne({
      _id: req.params.id,
      invitedBy: inviterId,
    });

    if (!invitation) {
      res.status(404).json({ message: "Invitation not found." });
      return;
    }

    invitation.role = role;
    await invitation.save();

    if (invitation.userId) {

      const permissionMap = {
        "viewer" : "view",
        "commenter" : "comment",
        "editor" : "edit",
        "full" : "full"
      }
      const pageNoteId = extractNoteId(invitation.pageUrl);
      const accessScope = getAccessScope(invitation.pageUrl, invitation.source);

      await grantWorkspaceAccess({
        userId: invitation.userId.toString(),
        inviterId,
        pageNoteId,
        role,
        accessScope
      });
    }

    res.status(200).json({ message: "Permission updated.", collaborator: invitation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update permission";
    res.status(500).json({ message });
  }
});

// GET /api/share/collaborators
// router.get("/collaborators", verifyToken, async (req: AuthRequest, res: Response) => {
//   try {
//     const currentUserId = req.user?.id;
//     const { noteId } = req.query;

//     if (!currentUserId) {
//       res.status(401).json({ message: "Unauthorized" });
//       return;
//     }

//     const currentUser = await Auth.findById(currentUserId).select("email");
//     const currentUserEmail = currentUser?.email?.toLowerCase();

//     let filter: any = {
//       $or: [
//         { invitedBy: currentUserId },
//         { invitedEmail: currentUserEmail },
//         { userId: currentUserId }
//       ],
//       status: { $in: ["pending", "accepted"] }
//     };

//     // Filter by noteId if provided
//     if (noteId && mongoose.Types.ObjectId.isValid(noteId as string)) {
//       filter.noteId = new mongoose.Types.ObjectId(noteId as string);
//     }

//     const collaborators = await ShareInvitation.find(filter)
//       .sort({ createdAt: -1 })
//       .lean();

//     res.json({ collaborators });

//   } catch (error) {
//     res.status(500).json({
//       message: "Unable to load collaborators"
//     });
//   }
// });

router.get("/collaborators", verifyToken, async (req: AuthRequest,res:Response)=>{
try{

 const currentUserId=req.user?.id;
 const {noteId} = req.query;

 if(!currentUserId){
   return res.status(401).json({
     message:"Unauthorized"
   });
 }


 const currentUser=await Auth.findById(currentUserId)
 .select("email");


 const {pageUrl, source}=req.query;


 const filter:any={
   status:{
     $in:["pending","accepted"]
   },
   $or:[
     {
       invitedBy:currentUserId
     },
     {
       userId:currentUserId
     },
     {
       invitedEmail:currentUser?.email?.toLowerCase()
     }
   ]
 };

  if (noteId && mongoose.Types.ObjectId.isValid(noteId as string)) {
      filter.noteId = new mongoose.Types.ObjectId(noteId as string);
    }


 if(pageUrl){
   filter.pageUrl=pageUrl;
 }


 if(source){
   filter.source=source;
 }


 const collaborators=await ShareInvitation.find(filter)
 .populate("userId","name email")
 .lean();

console.log(`Found ${collaborators.length} collaborators for note ${noteId || 'all'}`);

 res.json({
   collaborators
 });


}catch(error){

res.status(500).json({
 message:"Unable to load collaborators"
});

}

});

// 5. GET INVITATIONS
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
    }).sort({ createdAt: -1 }).lean();

    res.status(200).json({ invitations });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load invitations";
    res.status(500).json({ message });
  }
});

// 6. DELETE COLLABORATOR
router.delete("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const inviterId = req.user?.id;
    const invitation = await ShareInvitation.findOne({
      _id: req.params.id,
      invitedBy: inviterId,
    });

    if (!invitation) {
      res.status(404).json({ message: "Invitation not found." });
      return;
    }

    if (invitation.userId && inviterId) {
      const pageNoteId = extractNoteId(invitation.pageUrl);
      const accessScope = getAccessScope(invitation.pageUrl, invitation.source);
      
      const userNotes = pageNoteId
        ? await Note.find({ _id: pageNoteId, user: inviterId }).select("_id")
        : await Note.find({ user: inviterId }).select("_id");
      const noteIds = userNotes.map((note) => note._id);

      await WorkspaceAccess.deleteMany({ userId: invitation.userId, noteId: { $in: noteIds }, accessScope });
      await Comment.deleteMany({ userId: invitation.userId, noteId: { $in: noteIds } });
    }
    
    await invitation.deleteOne();
    res.status(200).json({ message: "Collaborator removed." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to remove collaborator";
    res.status(500).json({ message });
  }
});

export default router;

// import express from "express";
// import { 
//   inviteCollaborator, 
//   getCollaborators, 
//   updateCollaboratorRole, 
//   removeCollaborator,
//   getInvitations,
//   respondToInvitation,
//   getWorkspaceAccess
// } from "../controllers/share/index";
// import { verifyToken } from "../middleware/auth";

// const router = express.Router();

// // All share routes require authentication
// router.use(verifyToken);

// // Share routes
// router.post("/invite", inviteCollaborator);
// router.get("/collaborators", getCollaborators);
// router.put("/:id/role", updateCollaboratorRole);
// router.delete("/:id", removeCollaborator);
// router.get("/invitations", getInvitations);
// router.put("/invitations/:id/respond", respondToInvitation);
// router.get("/workspace/:noteId", getWorkspaceAccess);

// export default router;