// // // import mongoose from "mongoose";
// // // import Note from "../../models/Note";
// // // import Comment from "../../models/Comment";
// // // import ShareInvitation from "../../models/ShareInvitation";
// // // import WorkspaceAccess from "../../models/WorkspaceAccess";
// // // import Notification from "../../models/Notification";
// // // import Auth from "../../models/Auth";
// // // import { Request, Response} from "express";

// // // interface AuthRequest extends Request {
// // //   user?: {
// // //     id: string;
// // //   };
// // // }

// // // const getOwnerMap = async (notes: any[]) => {
// // //   const ownerIds = Array.from(
// // //     new Set(
// // //       notes
// // //         .map((note) => note.user?.toString())
// // //         .filter((id): id is string => Boolean(id)),
// // //     ),
// // //   );

// // //   const owners = ownerIds.length > 0
// // //     ? await Auth.find({ _id: { $in: ownerIds } }).select("firstName lastName email").lean()
// // //     : [];

// // //   return new Map(
// // //     owners.map((owner: any) => [
// // //       owner._id.toString(),
// // //       {
// // //         _id: owner._id.toString(),
// // //         firstName: owner.firstName,
// // //         lastName: owner.lastName,
// // //         email: owner.email,
// // //       },
// // //     ]),
// // //   );
// // // };

// // // const addOwner = (note: any, ownerById: Map<string, any>) => ({
// // //   ...note,
// // //   owner: ownerById.get(note.user?.toString()) || null,
// // // });

// // // const createNotification = async ({
// // //   fromUser,
// // //   toUser,
// // //   noteId,
// // //   type,
// // //   message,
// // // }: {
// // //   fromUser: string;
// // //   toUser: string;
// // //   noteId: mongoose.Types.ObjectId;
// // //   type: "view" | "edit" | "comment";
// // //   message: string;
// // // }) => {
// // //   if (!fromUser || !toUser || fromUser === toUser) return;

// // //   const recentNotification = await Notification.findOne({
// // //     fromUser,
// // //     toUser,
// // //     noteId,
// // //     type,
// // //   }).sort({ createdAt: -1 });

// // //   if (recentNotification) {
// // //     const ageMs = Date.now() - new Date(recentNotification.createdAt).getTime();
// // //     if (ageMs < 5 * 60 * 1000) {
// // //       return;
// // //     }
// // //   }

// // //   await Notification.create({
// // //     fromUser,
// // //     toUser,
// // //     noteId,
// // //     type,
// // //     message,
// // //   });
// // // };

// // // export const createNote = async (
// // //     req:AuthRequest, 
// // //     res:Response):Promise<void> => {
// // //   try {
// // //     const { title, content, description, category, priority, assignee,task, startDate, endDate } = req.body;

// // //     const note = new Note({
// // //       title,
// // //       content: content || description,
// // //       description,
// // //       category,
// // //       priority,
// // //       assignee,
// // //       task: task && task.trim().length > 0 ? task : "Not Started",
// // //       startDate,
// // //       endDate,
// // //       user: req.user?.id,
// // //     });

// // //     const savedNote = await note.save();

// // //     res.status(201).json(savedNote);
// // //   } catch (err: any) {
// // //     res.status(500).json({
// // //       message: err.message,
// // //     });
// // //   }
// // // };

// // // export const getNotes = async (
// // //   req: AuthRequest,
// // //   res: Response,
// // // ): Promise<void> => {
// // //   try {
// // //     const { status, assignee, shareScope } = req.query;
// // //     const requestedShareScope = typeof shareScope === "string" ? shareScope : undefined;

// // //     const ownedNotes = await Note.find({ user: req.user?.id }).sort({ createdAt: -1 }).lean();
// // //     const sharedAccessItems = await WorkspaceAccess.find({ userId: req.user?.id }).lean();
// // //     const categoryInvitations = await ShareInvitation.find({
// // //       userId: req.user?.id,
// // //       status: { $in: ["pending", "accepted"] },
// // //       $or: [
// // //         { source: "category_page" },
// // //         { pageUrl: /\/category(?:[/?#]|$)/ },
// // //       ],
// // //     }).select("invitedBy").lean();
// // //      const noteInvitations = await ShareInvitation.find({
// // //       userId: req.user?.id,
// // //       status: { $in: ["pending", "accepted"] },
// // //       $or: [
// // //         { source: "note_create_form_page" },
// // //         { pageUrl: /\/note-create-form(?:[/?#]|$)/ },
// // //       ],
// // //     }).select("invitedBy").lean();
// // //     const noteInviterIds = new Set(noteInvitations.map((item) => item.invitedBy.toString()));
// // //     const categoryInviterIds = new Set(categoryInvitations.map((item) => item.invitedBy.toString()));
// // //     const sharedAccess = sharedAccessItems.filter((item) => {
// // //       const accessScope = item.accessScope || (categoryInviterIds.has(item.grantedBy.toString()) ? "category" : "global") || (noteInviterIds.has(item.grantedBy.toString()) ? "note-create-form" : "global");
// // //       // const accessScope = item.accessScope || (categoryInviterIds.has(item.grantedBy.toString()) ? "category" : "global") || (noteInviterIds.has(item.grantedBy.toString()) ? "note-create-form" : "global");
// // //       if (requestedShareScope === "category") {
// // //         return accessScope === "global" || accessScope === "category";
// // //       }
// // //       return accessScope === "global";
// // //     });
// // //     const sharedNoteIds = sharedAccess.map((item) => item.noteId);
// // //     const sharedNotes = sharedNoteIds.length > 0
// // //       ? await Note.find({ _id: { $in: sharedNoteIds } }).sort({ createdAt: -1 }).lean()
// // //       : [];

// // //     // Apply optional server-side filtering by status/assignee
// // //     const applyFilters = (noteList: any[]) => {
// // //       return noteList.filter((note) => {
// // //         if (status && String(status) !== 'All') {
// // //           const noteStatus = (note.task && String(note.task)) || 'Todo';
// // //           if (noteStatus !== String(status)) return false;
// // //         }
// // //         if (assignee && String(assignee) !== 'All') {
// // //           const noteAssignee = (note.assignee && String(note.assignee)) || '';
// // //           if (noteAssignee !== String(assignee)) return false;
// // //         }
// // //         return true;
// // //       });
// // //     };

// // //     const accessByNoteId = new Map(sharedAccess.map((item) => [item.noteId.toString(), item.permission]));

// // //     const filteredOwned = applyFilters(ownedNotes);
// // //     const filteredShared = applyFilters(sharedNotes);

// // //     const notes = [
// // //       ...filteredOwned.map((note) => ({
// // //         ...note,
// // //         isOwned: true,
// // //         accessPermission: "owner",
// // //       })),
// // //       ...filteredShared
// // //         .filter((note) => !filteredOwned.some((owned) => owned._id.toString() === note._id.toString()))
// // //         .map((note) => ({
// // //           ...note,
// // //           isOwned: false,
// // //           accessPermission: accessByNoteId.get(note._id.toString()) || "view",
// // //         })),
// // //     ];

// // //     res.status(200).json(notes);
// // //   } catch (err: any) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // };

// // // export const getNoteById = async (
// // //   req: AuthRequest,
// // //   res: Response,
// // // ): Promise<void> => {
// // //   try {
// // //     const id = req.params.id;

// // //     if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
// // //       res.status(400).json({ message: "Invalid note id." });
// // //       return;
// // //     }

// // //     const note = await Note.findOne({ _id: id });
// // //     if (!note) {
// // //       res.status(404).json({ message: "Note not found." });
// // //       return;
// // //     }

// // //     const hasOwnerAccess = note.user.toString() === req.user?.id;
// // //     const sharedAccess = await WorkspaceAccess.findOne({ userId: req.user?.id, noteId: note._id });
// // //     if (!hasOwnerAccess && !sharedAccess) {
// // //       res.status(403).json({ message: "You do not have access to this note." });
// // //       return;
// // //     }

// // //     if (!hasOwnerAccess && sharedAccess) {
// // //       await createNotification({
// // //         fromUser: req.user!.id,
// // //         toUser: note.user.toString(),
// // //         noteId: note._id,
// // //         type: "view",
// // //         message: "A collaborator viewed your note.",
// // //       });
// // //     }

// // //     const noteObject = note.toObject();
// // //     const responsePayload = {
// // //       ...noteObject,
// // //       accessPermission: hasOwnerAccess ? "owner" : sharedAccess?.permission || "view",
// // //       isOwned: hasOwnerAccess,
// // //     };

// // //     res.status(200).json(responsePayload);
// // //   } catch (err: any) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // };

// // // export const updateNote = async (
// // //   req: AuthRequest,
// // //   res: Response
// // // ): Promise<void> => {
// // //   try {
// // //     const { id } = req.params;

// // //     if (!mongoose.Types.ObjectId.isValid(id as string)) {
// // //       res.status(400).json({
// // //         message: "Invalid note id",
// // //       });
// // //       return;
// // //     }

// // //     const note = await Note.findById(id);
// // //     if (!note) {
// // //       res.status(404).json({ message: "Note not found" });
// // //       return;
// // //     }

// // //     const hasOwnerAccess = note.user.toString() === req.user?.id;
// // //     const sharedAccess = await WorkspaceAccess.findOne({ userId: req.user?.id, noteId: note._id });
// // //     if (!hasOwnerAccess && (!sharedAccess || sharedAccess.permission !== "edit")) {
// // //       res.status(403).json({ message: "You do not have permission to edit this note." });
// // //       return;
// // //     }

// // //     const updatedNote = await Note.findOneAndUpdate(
// // //       {
// // //         _id: id,
// // //       },
// // //       req.body,
// // //       {
// // //         new: true,
// // //       }
// // //     );

// // //     if (!hasOwnerAccess && sharedAccess) {
// // //       await createNotification({
// // //         fromUser: req.user!.id,
// // //         toUser: note.user.toString(),
// // //         noteId: note._id,
// // //         type: "edit",
// // //         message: "A collaborator edited your note.",
// // //       });
// // //     }

// // //     if (!updatedNote) {
// // //       res.status(404).json({
// // //         message: "Note not found",
// // //       });
// // //       return;
// // //     }

// // //     res.status(200).json(updatedNote);
// // //   } catch (err: any) {
// // //     res.status(500).json({
// // //       message: err.message,
// // //     });
// // //   }
// // // };

// // // export const deleteNote = async (
// // //     req:AuthRequest,
// // //     res: Response):Promise<void> => {
// // //   try {
// // //     const id = req.params.id;

// // //     if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
// // //       res.status(400).json({ message: "Invalid note id." });
// // //       return;
// // //     }

// // //     const note = await Note.findById(id);
// // //     if (!note) {
// // //       res.status(404).json({ message: "Note not found." });
// // //       return;
// // //     }

// // //     const hasOwnerAccess = note.user.toString() === req.user?.id;
// // //     if (!hasOwnerAccess) {
// // //       res.status(403).json({ message: "Only the owner can delete this note." });
// // //       return;
// // //     }

// // //     const deletedNote = await Note.findOneAndDelete({ _id: id, user: req.user?.id });
// // //     if (!deletedNote) {
// // //       res.status(404).json({ message: "Note not found." });
// // //       return;
// // //     }

// // //     await Comment.deleteMany({ noteId: deletedNote._id });

// // //     res.status(200).json({ message: "Note deleted successfully." });
// // //   } catch (err:any) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // };






// // // // export const getNotes = async (
// // // //     req : Request,
// // // //      res: Response): Promise<void> => {
// // // //     try {
// // // //         const notes = await Note.find().populate('categories', 'name').populate('priority', 'name');
// // // //         res.status(200).json(notes);
// // // //     } catch (err:any) {
// // // //         res.status(500).json({ message: err.message });
// // // //     }
// // // // };
// // // // //get note by id
// // // // interface NoteParams{
// // // //     id : string;
// // // // }

// // // // export const getNoteById = async (
// // // //     req:Request<NoteParams>,
// // // //      res: Response):Promise<void> => {
    
// // // //     try {
// // // //         const { id } = req.params;

// // // //         const note = await Note.findById(id)
// // // //             .populate('priority', 'name')
// // // //             .populate('categories', 'name');
// // // //         if (!note) {
// // // //             res.status(404).json({ message: "Note not found." });
// // // //              return;
// // // //         }
// // // //         console.log('note', note);
// // // //         res.status(200).json(note);
// // // //     } catch (err:any) {
// // // //         console.error("Error fetching note by ID:", err.message);
// // // //         res.status(500).json({ message: "Server error while fetching book." });
// // // //     }
// // // // };

// // // // //get saved note
// // // // interface SavedNoteQuery{
// // // //     ids?:string;
// // // // }
// // // // export const getSavedNoteById = async (
// // // //     req  : Request<{},{},{},SavedNoteQuery>,
// // // //      res: Response):Promise<void> => {
// // // //   try {
// // // //     const idsParam = req.query.ids;

// // // //     if (!idsParam) {
// // // //        res.status(200).json([]);
// // // //        return;
// // // //     }
// // // //     const ids = idsParam.split(',').filter((id) => mongoose.Types.ObjectId.isValid(id));
// // // //     if (ids.length === 0) {
// // // //      res.status(200).json([]); 
// // // //       return ;
// // // //     }
// // // //     const notes = await Note.find({ _id: { $in: ids } })
// // // //       .populate('categories', 'name')
// // // //       .populate('priority', 'name');
// // // //     res.status(200).json(notes);
// // // //   } catch (err) {
// // // //     console.error('Error fetching saved note:', err);
// // // //     res.status(500).json({ message: 'Server error while fetching saved notes.' });
// // // //   }
// // // // };

// // import mongoose from "mongoose";
// // import Note from "../../models/Note";
// // import Comment from "../../models/Comment";
// // import ShareInvitation from "../../models/ShareInvitation";
// // import WorkspaceAccess from "../../models/WorkspaceAccess";
// // import Notification from "../../models/Notification";
// // import Auth from "../../models/Auth";
// // import { Request, Response } from "express";

// // interface AuthRequest extends Request {
// //   user?: {
// //     id: string;
// //   };
// // }

// // const getOwnerMap = async (notes: any[]) => {
// //   const ownerIds = Array.from(
// //     new Set(
// //       notes
// //         .map((note) => note.user?.toString())
// //         .filter((id): id is string => Boolean(id)),
// //     ),
// //   );

// //   const owners = ownerIds.length > 0
// //     ? await Auth.find({ _id: { $in: ownerIds } }).select("firstName lastName email").lean()
// //     : [];

// //   return new Map(
// //     owners.map((owner: any) => [
// //       owner._id.toString(),
// //       {
// //         _id: owner._id.toString(),
// //         firstName: owner.firstName,
// //         lastName: owner.lastName,
// //         email: owner.email,
// //       },
// //     ]),
// //   );
// // };

// // const addOwner = (note: any, ownerById: Map<string, any>) => ({
// //   ...note,
// //   owner: ownerById.get(note.user?.toString()) || null,
// // });

// // const createNotification = async ({
// //   fromUser,
// //   toUser,
// //   noteId,
// //   type,
// //   message,
// // }: {
// //   fromUser: string;
// //   toUser: string;
// //   noteId: mongoose.Types.ObjectId;
// //   type: "view" | "edit" | "comment";
// //   message: string;
// // }) => {
// //   if (!fromUser || !toUser || fromUser === toUser) return;

// //   const recentNotification = await Notification.findOne({
// //     fromUser,
// //     toUser,
// //     noteId,
// //     type,
// //   }).sort({ createdAt: -1 });

// //   if (recentNotification) {
// //     const ageMs = Date.now() - new Date(recentNotification.createdAt).getTime();
// //     if (ageMs < 5 * 60 * 1000) {
// //       return;
// //     }
// //   }

// //   await Notification.create({
// //     fromUser,
// //     toUser,
// //     noteId,
// //     type,
// //     message,
// //   });
// // };

// // export const createNote = async (
// //   req: AuthRequest, 
// //   res: Response
// // ): Promise<void> => {
// //   try {
// //     const { title, content, description, category, priority, assignee, task, startDate, endDate } = req.body;

// //     const note = new Note({
// //       title,
// //       content: content || description,
// //       description,
// //       category,
// //       priority,
// //       assignee,
// //       task: task && task.trim().length > 0 ? task : "Not Started",
// //       startDate,
// //       endDate,
// //       user: req.user?.id,
// //     });

// //     const savedNote = await note.save();
// //     res.status(201).json(savedNote);
// //   } catch (err: any) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // export const getNotes = async (
// //   req: AuthRequest,
// //   res: Response,
// // ): Promise<void> => {
// //   try {
// //     const { status, assignee, shareScope } = req.query;
// //     const requestedShareScope = typeof shareScope === "string" ? shareScope : undefined;

// //     const ownedNotes = await Note.find({ user: req.user?.id }).sort({ createdAt: -1 }).lean();
// //     const sharedAccessItems = await WorkspaceAccess.find({ userId: req.user?.id }).lean();
    
// //     // 1. Fetch category page invitations
// //     const categoryInvitations = await ShareInvitation.find({
// //       userId: req.user?.id,
// //       status: { $in: ["pending", "accepted"] },
// //       $or: [
// //         { source: "category_page" },
// //         { pageUrl: /\/category(?:[/?#]|$)/ },
// //       ],
// //     }).select("invitedBy").lean();

// //     // 2. Fetch note create page invitations (Fixed Typo from 'creact')
// //     const noteInvitations = await ShareInvitation.find({
// //       userId: req.user?.id,
// //       status: { $in: ["pending", "accepted"] },
// //       $or: [
// //         { source: "note_page" }, 
// //         { pageUrl: /\/note(?:[/?#]|$)/ },
// //       ],
// //     }).select("invitedBy").lean();

// //     const noteInviterIds = new Set(noteInvitations.map((item) => item.invitedBy.toString()));
// //     const categoryInviterIds = new Set(categoryInvitations.map((item) => item.invitedBy.toString()));

// //     // 3. Evaluate shared workspace access items based on scopes cleanly
// //     const sharedAccess = sharedAccessItems.filter((item) => {
// //       let accessScope = item.accessScope;
      
// //       // Fixed nested inline OR chain logic
// //       if (!accessScope) {
// //         if (categoryInviterIds.has(item.grantedBy.toString())) {
// //           accessScope = "category";
// //         } else if (noteInviterIds.has(item.grantedBy.toString())) {
// //           accessScope = "note-create-form";
// //         } else {
// //           accessScope = "global";
// //         }
// //       }

// //       if (requestedShareScope === "category") {
// //         return accessScope === "global" || accessScope === "category";
// //       }
// //       if (requestedShareScope === "note") {
// //         return accessScope === "global" || accessScope === "note";
// //       }
// //       return accessScope === "global";
// //     });

// //     const sharedNoteIds = sharedAccess.map((item) => item.noteId);
// //     const sharedNotes = sharedNoteIds.length > 0
// //       ? await Note.find({ _id: { $in: sharedNoteIds } }).sort({ createdAt: -1 }).lean()
// //       : [];

// //     const applyFilters = (noteList: any[]) => {
// //       return noteList.filter((note) => {
// //         if (status && String(status) !== 'All') {
// //           const noteStatus = (note.task && String(note.task)) || 'Todo';
// //           if (noteStatus !== String(status)) return false;
// //         }
// //         if (assignee && String(assignee) !== 'All') {
// //           const noteAssignee = (note.assignee && String(note.assignee)) || '';
// //           if (noteAssignee !== String(assignee)) return false;
// //         }
// //         return true;
// //       });
// //     };

// //     const accessByNoteId = new Map(sharedAccess.map((item) => [item.noteId.toString(), item.permission]));

// //     const filteredOwned = applyFilters(ownedNotes);
// //     const filteredShared = applyFilters(sharedNotes);

// //     const notes = [
// //       ...filteredOwned.map((note) => ({
// //         ...note,
// //         isOwned: true,
// //         accessPermission: "owner",
// //       })),
// //       ...filteredShared
// //         .filter((note) => !filteredOwned.some((owned) => owned._id.toString() === note._id.toString()))
// //         .map((note) => ({
// //           ...note,
// //           isOwned: false,
// //           accessPermission: accessByNoteId.get(note._id.toString()) || "view",
// //         })),
// //     ];

// //     res.status(200).json(notes);
// //   } catch (err: any) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // export const getNoteById = async (
// //   req: AuthRequest,
// //   res: Response,
// // ): Promise<void> => {
// //   try {
// //     const id = req.params.id;

// //     if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
// //       res.status(400).json({ message: "Invalid note id." });
// //       return;
// //     }

// //     const note = await Note.findOne({ _id: id });
// //     if (!note) {
// //       res.status(404).json({ message: "Note not found." });
// //       return;
// //     }

// //     const hasOwnerAccess = note.user.toString() === req.user?.id;
// //     const sharedAccess = await WorkspaceAccess.findOne({ userId: req.user?.id, noteId: note._id });
// //     if (!hasOwnerAccess && !sharedAccess) {
// //       res.status(403).json({ message: "You do not have access to this note." });
// //       return;
// //     }

// //     if (!hasOwnerAccess && sharedAccess) {
// //       await createNotification({
// //         fromUser: req.user!.id,
// //         toUser: note.user.toString(),
// //         noteId: note._id,
// //         type: "view",
// //         message: "A collaborator viewed your note.",
// //       });
// //     }

// //     const noteObject = note.toObject();
// //     const responsePayload = {
// //       ...noteObject,
// //       accessPermission: hasOwnerAccess ? "owner" : sharedAccess?.permission || "view",
// //       isOwned: hasOwnerAccess,
// //     };

// //     res.status(200).json(responsePayload);
// //   } catch (err: any) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // export const updateNote = async (
// //   req: AuthRequest,
// //   res: Response
// // ): Promise<void> => {
// //   try {
// //     const { id } = req.params;

// //     if (!mongoose.Types.ObjectId.isValid(id as string)) {
// //       res.status(400).json({ message: "Invalid note id" });
// //       return;
// //     }

// //     const note = await Note.findById(id);
// //     if (!note) {
// //       res.status(404).json({ message: "Note not found" });
// //       return;
// //     }

// //     const hasOwnerAccess = note.user.toString() === req.user?.id;
// //     const sharedAccess = await WorkspaceAccess.findOne({ userId: req.user?.id, noteId: note._id });
// //     if (!hasOwnerAccess && (!sharedAccess || sharedAccess.permission !== "edit")) {
// //       res.status(403).json({ message: "You do not have permission to edit this note." });
// //       return;
// //     }

// //     const updatedNote = await Note.findOneAndUpdate(
// //       { _id: id },
// //       req.body,
// //       { new: true }
// //     );

// //     if (!hasOwnerAccess && sharedAccess) {
// //       await createNotification({
// //         fromUser: req.user!.id,
// //         toUser: note.user.toString(),
// //         noteId: note._id,
// //         type: "edit",
// //         message: "A collaborator edited your note.",
// //       });
// //     }

// //     if (!updatedNote) {
// //       res.status(404).json({ message: "Note not found" });
// //       return;
// //     }

// //     res.status(200).json(updatedNote);
// //   } catch (err: any) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // export const deleteNote = async (
// //   req: AuthRequest,
// //   res: Response
// // ): Promise<void> => {
// //   try {
// //     const id = req.params.id;

// //     if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
// //       res.status(400).json({ message: "Invalid note id." });
// //       return;
// //     }

// //     const note = await Note.findById(id);
// //     if (!note) {
// //       res.status(404).json({ message: "Note not found." });
// //       return;
// //     }

// //     const hasOwnerAccess = note.user.toString() === req.user?.id;
// //     if (!hasOwnerAccess) {
// //       res.status(403).json({ message: "Only the owner can delete this note." });
// //       return;
// //     }

// //     const deletedNote = await Note.findOneAndDelete({ _id: id, user: req.user?.id });
// //     if (!deletedNote) {
// //       res.status(404).json({ message: "Note not found." });
// //       return;
// //     }

// //     await Comment.deleteMany({ noteId: deletedNote._id });
// //     res.status(200).json({ message: "Note deleted successfully." });
// //   } catch (err: any) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };


// // import mongoose from "mongoose";
// // import Note from "../../models/Note";
// // import Comment from "../../models/Comment";
// // import ShareInvitation from "../../models/ShareInvitation";
// // import WorkspaceAccess from "../../models/WorkspaceAccess";
// // import Notification from "../../models/Notification";
// // import Auth from "../../models/Auth";
// // import { Request, Response } from "express";

// // interface AuthRequest extends Request {
// //   user?: {
// //     id: string;
// //   };
// // }

// // const getOwnerMap = async (notes: any[]) => {
// //   const ownerIds = Array.from(
// //     new Set(
// //       notes
// //         .map((note) => note.user?.toString())
// //         .filter((id): id is string => Boolean(id)),
// //     ),
// //   );

// //   const owners = ownerIds.length > 0
// //     ? await Auth.find({ _id: { $in: ownerIds } }).select("firstName lastName email").lean()
// //     : [];

// //   return new Map(
// //     owners.map((owner: any) => [
// //       owner._id.toString(),
// //       {
// //         _id: owner._id.toString(),
// //         firstName: owner.firstName,
// //         lastName: owner.lastName,
// //         email: owner.email,
// //       },
// //     ]),
// //   );
// // };

// // const addOwner = (note: any, ownerById: Map<string, any>) => ({
// //   ...note,
// //   owner: ownerById.get(note.user?.toString()) || null,
// // });

// // const createNotification = async ({
// //   fromUser,
// //   toUser,
// //   noteId,
// //   type,
// //   message,
// // }: {
// //   fromUser: string;
// //   toUser: string;
// //   noteId: mongoose.Types.ObjectId;
// //   type: "view" | "edit" | "comment";
// //   message: string;
// // }) => {
// //   if (!fromUser || !toUser || fromUser === toUser) return;

// //   const recentNotification = await Notification.findOne({
// //     fromUser,
// //     toUser,
// //     noteId,
// //     type,
// //   }).sort({ createdAt: -1 });

// //   if (recentNotification) {
// //     const ageMs = Date.now() - new Date(recentNotification.createdAt).getTime();
// //     if (ageMs < 5 * 60 * 1000) {
// //       return;
// //     }
// //   }

// //   await Notification.create({
// //     fromUser,
// //     toUser,
// //     noteId,
// //     type,
// //     message,
// //   });
// // };

// // // 1. CREATE NOTE
// // export const createNote = async (
// //   req: AuthRequest, 
// //   res: Response
// // ): Promise<void> => {
// //   try {
// //     const { title, content, description, category, priority, assignee, task, startDate, endDate } = req.body;

// //     const note = new Note({
// //       title,
// //       content: content || description,
// //       description,
// //       category,
// //       priority,
// //       assignee,
// //       task: task && task.trim().length > 0 ? task : "Not Started",
// //       startDate,
// //       endDate,
// //       user: req.user?.id,
// //     });

// //     const savedNote = await note.save();
// //     res.status(201).json(savedNote);
// //   } catch (err: any) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // // 2. GET NOTES
// // export const getNotes = async (
// //   req: AuthRequest,
// //   res: Response,
// // ): Promise<void> => {
// //   try {
// //     const { status, assignee, shareScope } = req.query;
// //     const requestedShareScope = typeof shareScope === "string" ? shareScope : undefined;

// //     const ownedNotes = await Note.find({ user: req.user?.id }).sort({ createdAt: -1 }).lean();
// //     const sharedAccessItems = await WorkspaceAccess.find({ userId: req.user?.id }).lean();
    
// //     const categoryInvitations = await ShareInvitation.find({
// //       userId: req.user?.id,
// //       status: { $in: ["pending", "accepted"] },
// //       $or: [
// //         { source: "category_page" },
// //         { pageUrl: /\/category(?:[/?#]|$)/ },
// //       ],
// //     }).select("invitedBy").lean();

// //     const noteInvitations = await ShareInvitation.find({
// //       userId: req.user?.id,
// //       status: { $in: ["pending", "accepted"] },
// //       $or: [
// //         { source: "note_page" }, 
// //         { pageUrl: /\/note(?:[/?#]|$)/ },
// //       ],
// //     }).select("invitedBy").lean();

// //     const statusInvitations = await ShareInvitation.find({
// //       userId: req.user?.id,
// //       status: { $in: ["pending", "accepted"] },
// //       $or: [
// //         { source: "board_page" as any},
// //         { pageUrl: /\/board(?:[/?#]|$)/ },
// //       ],
// //     }).select("invitedBy").lean();

// //      const noteDetailInvitations = await ShareInvitation.find({
// //       userId: req.user?.id,
// //       status: { $in: ["pending", "accepted"] },
// //       $or: [
// //         { source: "note_detail_page" },
// //         { pageUrl: /\/note-detail(?:[/?#]|$)/ },
// //       ],
// //     }).select("invitedBy").lean();

// //     const noteInviterIds = new Set(noteInvitations.map((item) => item.invitedBy.toString()));
// //     const categoryInviterIds = new Set(categoryInvitations.map((item) => item.invitedBy.toString()));
// //     const noteDetailInviterIds = new Set(noteDetailInvitations.map((item) => item.invitedBy.toString()));
// //     const statusInviterIds = new Set(statusInvitations.map((item) => item.invitedBy.toString()));


// //     const sharedAccess = sharedAccessItems.filter((item) => {
// //       let accessScope = item.accessScope;
      
// //       if (!accessScope) {
// //         if (categoryInviterIds.has(item.grantedBy.toString())) {
// //           accessScope = "category";
// //         } else if (noteInviterIds.has(item.grantedBy.toString())) {
// //           accessScope = "note"; 
// //         }else if (statusInviterIds.has(item.grantedBy.toString())){
// //           accessScope = "board"
// //         } else if (noteDetailInviterIds.has(item.grantedBy.toString())){
// //           accessScope = "note-detail"
// //         }
// //          else {
// //           accessScope = "global";
// //         }
// //       }

// //       // if (requestedShareScope === "category") {
// //       //   return accessScope === "category";
// //       // }
// //       // if (requestedShareScope === "note") {
// //       //   return accessScope === "note" ;
// //       // }
// //       // if (requestedShareScope === "board"){
// //       //   return accessScope === "board";
// //       // }
// //       if(requestedShareScope){
// //         return accessScope === requestedShareScope;
// //       }
// //       return accessScope === "global";
// //     });

// //     const sharedNoteIds = sharedAccess.map((item) => item.noteId);
// //     const sharedNotes = sharedNoteIds.length > 0
// //       ? await Note.find({ _id: { $in: sharedNoteIds } }).sort({ createdAt: -1 }).lean()
// //       : [];

// //     const applyFilters = (noteList: any[]) => {
// //       return noteList.filter((note) => {
// //         if (status && String(status) !== 'All') {
// //           const noteStatus = (note.task && String(note.task)) || 'Todo';
// //           if (noteStatus !== String(status)) return false;
// //         }
// //         if (assignee && String(assignee) !== 'All') {
// //           const noteAssignee = (note.assignee && String(note.assignee)) || '';
// //           if (noteAssignee !== String(assignee)) return false;
// //         }
// //         return true;
// //       });
// //     };

// //     const accessByNoteId = new Map(sharedAccess.map((item) => [item.noteId.toString(), item.permission]));

// //     const filteredOwned = applyFilters(ownedNotes);
// //     const filteredShared = applyFilters(sharedNotes);

// //     const combinedNotes = [
// //       ...filteredOwned.map((note) => ({
// //         ...note,
// //         isOwned: true,
// //         accessPermission: "owner",
// //       })),
// //       ...filteredShared
// //         .filter((note) => !filteredOwned.some((owned) => owned._id.toString() === note._id.toString()))
// //         .map((note) => ({
// //           ...note,
// //           isOwned: false,
// //           accessPermission: accessByNoteId.get(note._id.toString()) || "view",
// //         })),
// //       ]

// //     const ownerMap = await getOwnerMap(combinedNotes);
// //     const finalNotes = combinedNotes.map((note) => addOwner(note, ownerMap));

// //     res.status(200).json(finalNotes);
// //   } catch (err: any) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // // 3. GET NOTE BY ID
// // export const getNoteById = async (
// //   req: AuthRequest,
// //   res: Response,
// // ): Promise<void> => {
// //   try {
// //     const id = req.params.id;

// //     if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
// //       res.status(400).json({ message: "Invalid note id." });
// //       return;
// //     }

// //     const note = await Note.findOne({ _id: id });
// //     if (!note) {
// //       res.status(404).json({ message: "Note not found." });
// //       return;
// //     }

  
// //     const hasOwnerAccess = note.user?.toString() === req.user?.id;
// //     const sharedAccess = await WorkspaceAccess.findOne({ userId: req.user?.id, noteId: note._id });
// //     if (!hasOwnerAccess && !sharedAccess) {
// //       res.status(403).json({ message: "You do not have access to this note." });
// //       return;
// //     }

// //     if (!hasOwnerAccess && sharedAccess && note.user) {
// //       await createNotification({
// //         fromUser: req.user!.id,
// //         toUser: note.user.toString(),
// //         noteId: note._id,
// //         type: "view",
// //         message: "A collaborator viewed your note.",
// //       });
// //     }

// //     const noteObject = note.toObject();
    
  
// //     const ownerMap = await getOwnerMap([noteObject]);
// //     const noteWithOwner = addOwner(noteObject, ownerMap);

// //     const responsePayload = {
// //       ...noteWithOwner,
// //       accessPermission: hasOwnerAccess ? "owner" : sharedAccess?.permission || "view",
// //       isOwned: hasOwnerAccess,
// //     };

// //     res.status(200).json(responsePayload);
// //   } catch (err: any) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // export const updateNote = async (
// //   req: AuthRequest,
// //   res: Response
// // ): Promise<void> => {
// //   try {
// //     const { id } = req.params;

// //     if (!mongoose.Types.ObjectId.isValid(id as string)) {
// //       res.status(400).json({ message: "Invalid note id" });
// //       return;
// //     }

// //     const note = await Note.findById(id);
// //     if (!note) {
// //       res.status(404).json({ message: "Note not found" });
// //       return;
// //     }

// //     const hasOwnerAccess = note.user?.toString() === req.user?.id;
// //     const sharedAccess = await WorkspaceAccess.findOne({ userId: req.user?.id, noteId: note._id });
// //     if (!hasOwnerAccess && (!sharedAccess || sharedAccess.permission !== "edit")) {
// //       res.status(403).json({ message: "You do not have permission to edit this note." });
// //       return;
// //     }

// //     const updatedNote = await Note.findOneAndUpdate(
// //       { _id: id },
// //       req.body,
// //       { new: true }
// //     );

// //     if (!hasOwnerAccess && sharedAccess && note.user) {
// //       await createNotification({
// //         fromUser: req.user!.id,
// //         toUser: note.user.toString(),
// //         noteId: note._id,
// //         type: "edit",
// //         message: "A collaborator edited your note.",
// //       });
// //     }

// //     if (!updatedNote) {
// //       res.status(404).json({ message: "Note not found" });
// //       return;
// //     }

// //     res.status(200).json(updatedNote);
// //   } catch (err: any) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // // 5. DELETE NOTE
// // export const deleteNote = async (
// //   req: AuthRequest,
// //   res: Response
// // ): Promise<void> => {
// //   try {
// //     const id = req.params.id;

// //     if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
// //       res.status(400).json({ message: "Invalid note id." });
// //       return;
// //     }

// //     const note = await Note.findById(id);
// //     if (!note) {
// //       res.status(404).json({ message: "Note not found." });
// //       return;
// //     }

// //     const hasOwnerAccess = note.user?.toString() === req.user?.id;
// //     if (!hasOwnerAccess) {
// //       res.status(403).json({ message: "Only the owner can delete this note." });
// //       return;
// //     }

// //     const deletedNote = await Note.findOneAndDelete({ _id: id, user: req.user?.id });
// //     if (!deletedNote) {
// //       res.status(404).json({ message: "Note not found." });
// //       return;
// //     }

// //     await Comment.deleteMany({ noteId: deletedNote._id });
// //     res.status(200).json({ message: "Note deleted successfully." });
// //   } catch (err: any) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };


// import mongoose from "mongoose";
// import Note from "../../models/Note";
// import Comment from "../../models/Comment";
// import ShareInvitation from "../../models/ShareInvitation";
// import WorkspaceAccess from "../../models/WorkspaceAccess";
// import Notification from "../../models/Notification";
// import Auth from "../../models/Auth";
// import { Request, Response } from "express";

// interface AuthRequest extends Request {
//   user?: {
//     id: string;
//   };
// }

// const getOwnerMap = async (notes: any[]) => {
//   const ownerIds = Array.from(
//     new Set(
//       notes
//         .map((note) => note.user?.toString())
//         .filter((id): id is string => Boolean(id)),
//     ),
//   );

//   const owners = ownerIds.length > 0
//     ? await Auth.find({ _id: { $in: ownerIds } }).select("firstName lastName email").lean()
//     : [];

//   return new Map(
//     owners.map((owner: any) => [
//       owner._id.toString(),
//       {
//         _id: owner._id.toString(),
//         firstName: owner.firstName,
//         lastName: owner.lastName,
//         email: owner.email,
//       },
//     ]),
//   );
// };

// const addOwner = (note: any, ownerById: Map<string, any>) => ({
//   ...note,
//   owner: ownerById.get(note.user?.toString()) || null,
// });

// const createNotification = async ({
//   fromUser,
//   toUser,
//   noteId,
//   type,
//   message,
// }: {
//   fromUser: string;
//   toUser: string;
//   noteId: mongoose.Types.ObjectId;
//   type: "view" | "edit" | "comment";
//   message: string;
// }) => {
//   if (!fromUser || !toUser || fromUser === toUser) return;

//   const recentNotification = await Notification.findOne({
//     fromUser,
//     toUser,
//     noteId,
//     type,
//   }).sort({ createdAt: -1 });

//   if (recentNotification) {
//     const ageMs = Date.now() - new Date(recentNotification.createdAt).getTime();
//     if (ageMs < 5 * 60 * 1000) {
//       return;
//     }
//   }

//   await Notification.create({
//     fromUser,
//     toUser,
//     noteId,
//     type,
//     message,
//   });
// };

// // 1. CREATE NOTE
// export const createNote = async (
//   req: AuthRequest, 
//   res: Response
// ): Promise<void> => {
//   try {
//     const { title, content, description, category, priority, assignee, task, startDate, endDate } = req.body;

//     const note = new Note({
//       title,
//       content: content || description,
//       description,
//       category,
//       priority,
//       assignee,
//       task: task && task.trim().length > 0 ? task : "Not Started",
//       startDate,
//       endDate,
//       user: req.user?.id,
//     });

//     const savedNote = await note.save();
//     res.status(201).json(savedNote);
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 2. GET NOTES (Debugged Filter Logic)
// // export const getNotes = async (
// //   req: AuthRequest,
// //   res: Response,
// // ): Promise<void> => {
// //   try {
// //     const { status, assignee, shareScope } = req.query;
// //     const requestedShareScope = typeof shareScope === "string" ? shareScope : undefined;

// //     const ownedNotes = await Note.find({ user: req.user?.id }).sort({ createdAt: -1 }).lean();
// //     const sharedAccessItems = await WorkspaceAccess.find({ userId: req.user?.id }).lean();
    
// //     const categoryInvitations = await ShareInvitation.find({
// //       userId: req.user?.id,
// //       status: { $in: ["pending", "accepted"] },
// //       $or: [
// //         { source: "category_page" },
// //         { pageUrl: /\/category(?:[/?#]|$)/ },
// //       ],
// //     }).select("invitedBy").lean();

// //     const noteInvitations = await ShareInvitation.find({
// //       userId: req.user?.id,
// //       status: { $in: ["pending", "accepted"] },
// //       $or: [
// //         { source: "note_page" }, 
// //         { pageUrl: /\/note(?:[/?#]|$)/ },
// //       ],
// //     }).select("invitedBy").lean();

// //     const statusInvitations = await ShareInvitation.find({
// //       userId: req.user?.id,
// //       status: { $in: ["pending", "accepted"] },
// //       $or: [
// //         { source: "board_page" as any},
// //         { pageUrl: /\/board(?:[/?#]|$)/ },
// //       ],
// //     }).select("invitedBy").lean();
// //     const noteFormInvitations = await ShareInvitation.find({
// //       userId: req.user?.id,
// //       status: { $in: ["pending", "accepted"] },
// //       $or: [
// //         { source: "note_form_page" as any},
// //         { pageUrl: /\/note-form(?:[/?#]|$)/ },
// //       ],
// //     }).select("invitedBy").lean();

// //     const noteInviterIds = new Set(noteInvitations.map((item) => item.invitedBy.toString()));
// //     const categoryInviterIds = new Set(categoryInvitations.map((item) => item.invitedBy.toString()));
// //     const statusInviterIds = new Set(statusInvitations.map((item) => item.invitedBy.toString()));
// //     const noteFormInviterIds = new Set(noteFormInvitations.map((item) => item.invitedBy.toString()));


// //     const sharedAccess = sharedAccessItems.filter((item) => {
// //       let accessScope = item.accessScope;
      
// //       if (!accessScope) {
// //         if (categoryInviterIds.has(item.grantedBy.toString())) {
// //           accessScope = "category";
// //         } else if (noteInviterIds.has(item.grantedBy.toString())) {
// //           accessScope = "note"; 
// //         } else if (statusInviterIds.has(item.grantedBy.toString())){
// //           accessScope = "board";
// //         }else if (noteFormInviterIds.has(item.grantedBy.toString())){
// //           accessScope = "note-form";
// //         }   else {
// //           accessScope = "global";
// //         }
// //       }

// //       // FIXED: If a specific scope is requested, match it. 
// //       // Otherwise, return all shared notes regardless of scope.
// //       if (requestedShareScope) {
// //         return accessScope === requestedShareScope;
// //       }
// //       return true;
// //     });

// //     const sharedNoteIds = sharedAccess.map((item) => item.noteId).filter(Boolean);
// //     const sharedNotes = sharedNoteIds.length > 0
// //       ? await Note.find({ _id: { $in: sharedNoteIds } }).sort({ createdAt: -1 }).lean()
// //       : [];

// //     const applyFilters = (noteList: any[]) => {
// //       return noteList.filter((note) => {
// //         if (status && String(status) !== 'All') {
// //           const noteStatus = (note.task && String(note.task)) || 'Todo';
// //           if (noteStatus !== String(status)) return false;
// //         }
// //         if (assignee && String(assignee) !== 'All') {
// //           const noteAssignee = (note.assignee && String(note.assignee)) || '';
// //           if (noteAssignee !== String(assignee)) return false;
// //         }
// //         return true;
// //       });
// //     };

// //     const accessByNoteId = new Map(
// //       sharedAccess.map((item) => [item.noteId?.toString(), item.permission].filter(Boolean)) as [string, string][]
// //     );

// //     const filteredOwned = applyFilters(ownedNotes);
// //     const filteredShared = applyFilters(sharedNotes);

// //     const combinedNotes = [
// //       ...filteredOwned.map((note) => ({
// //         ...note,
// //         isOwned: true,
// //         accessPermission: "owner",
// //       })),
// //       ...filteredShared
// //         .filter((note) => !filteredOwned.some((owned) => owned._id.toString() === note._id.toString()))
// //         .map((note) => ({
// //           ...note,
// //           isOwned: false,
// //           accessPermission: accessByNoteId.get(note._id.toString()) || "view",
// //         })),
// //     ];

// //     const ownerMap = await getOwnerMap(combinedNotes);
// //     const finalNotes = combinedNotes.map((note) => addOwner(note, ownerMap));

// //     res.status(200).json(finalNotes);
// //   } catch (err: any) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };


// // 2. GET NOTES (Debugged Filter Logic)
// // export const getNotes = async (
// //   req: AuthRequest,
// //   res: Response,
// // ): Promise<void> => {
// //   try {
// //     const { status, assignee, shareScope, noteId } = req.query; // Add noteId
// //     const requestedShareScope = typeof shareScope === "string" ? shareScope : undefined;

// //     // --- OWNER'S NOTES ---
// //     const ownedNotes = await Note.find({ user: req.user?.id }).sort({ createdAt: -1 }).lean();

// //     // --- SHARED ACCESS ---
// //     const sharedAccessItems = await WorkspaceAccess.find({ userId: req.user?.id }).lean();
    
// //     // --- INVITATIONS ---
// //     const categoryInvitations = await ShareInvitation.find({
// //       userId: req.user?.id,
// //       status: { $in: ["pending", "accepted"] },
// //       $or: [
// //         { source: "category_page" },
// //         { pageUrl: /\/category(?:[/?#]|$)/ },
// //       ],
// //     }).select("invitedBy").lean();

// //     const noteInvitations = await ShareInvitation.find({
// //       userId: req.user?.id,
// //       status: { $in: ["pending", "accepted"] },
// //       $or: [
// //         { source: "note_page" }, 
// //         { pageUrl: /\/note(?:[/?#]|$)/ },
// //       ],
// //     }).select("invitedBy").lean();

// //     const statusInvitations = await ShareInvitation.find({
// //       userId: req.user?.id,
// //       status: { $in: ["pending", "accepted"] },
// //       $or: [
// //         { source: "board_page" as any},
// //         { pageUrl: /\/board(?:[/?#]|$)/ },
// //       ],
// //     }).select("invitedBy").lean();

// //     const noteFormInvitations = await ShareInvitation.find({
// //       userId: req.user?.id,
// //       status: { $in: ["pending", "accepted"] },
// //       $or: [
// //         { source: "note_form_page" as any},
// //         { pageUrl: /\/note-form(?:[/?#]|$)/ },
// //       ],
// //     }).select("invitedBy").lean();

// //     const noteInviterIds = new Set(noteInvitations.map((item) => item.invitedBy.toString()));
// //     const categoryInviterIds = new Set(categoryInvitations.map((item) => item.invitedBy.toString()));
// //     const statusInviterIds = new Set(statusInvitations.map((item) => item.invitedBy.toString()));
// //     const noteFormInviterIds = new Set(noteFormInvitations.map((item) => item.invitedBy.toString()));

// //     // --- FILTER SHARED ACCESS BASED ON SCOPE ---
// //     let sharedAccess = sharedAccessItems.filter((item) => {
// //       let accessScope = item.accessScope;
      
// //       if (!accessScope) {
// //         if (categoryInviterIds.has(item.grantedBy.toString())) {
// //           accessScope = "category";
// //         } else if (noteInviterIds.has(item.grantedBy.toString())) {
// //           accessScope = "note"; 
// //         } else if (statusInviterIds.has(item.grantedBy.toString())){
// //           accessScope = "board";
// //         } else if (noteFormInviterIds.has(item.grantedBy.toString())){
// //           accessScope = "note-form";
// //         } else {
// //           accessScope = "global";
// //         }
// //       }

// //       // If a specific scope is requested, match it
// //       if (requestedShareScope) {
// //         return accessScope === requestedShareScope;
// //       }
// //       return true;
// //     });

// //     // --- FILTER BY SPECIFIC NOTE ID (NEW) ---
// //     if (noteId && mongoose.Types.ObjectId.isValid(noteId as string)) {
// //       const targetNoteId = new mongoose.Types.ObjectId(noteId as string);
      
// //       // For shared notes: only include the specific note
// //       sharedAccess = sharedAccess.filter((item) => 
// //         item.noteId && item.noteId.toString() === targetNoteId.toString()
// //       );

// //       // For owned notes: if requesting specific note, only return that one
// //       // But only if the user is the owner
// //       const ownedNote = ownedNotes.find(n => n._id.toString() === targetNoteId.toString());
// //       if (ownedNote) {
// //         // Return only the specific owned note
// //         const ownerMap = await getOwnerMap([ownedNote]);
// //         const noteWithOwner = addOwner(ownedNote, ownerMap);
        
// //         // Check if there's any shared access for this note too
// //         const hasSharedAccess = sharedAccess.some(item => 
// //           item.noteId && item.noteId.toString() === targetNoteId.toString()
// //         );

// //         const responseNote = {
// //           ...noteWithOwner,
// //           isOwned: true,
// //           accessPermission: "owner",
// //         };

// //         // If there are shared collaborators, include them in the response
// //         // but we don't need to send all notes, just this one
// //         res.status(200).json([responseNote]);
// //         return;
// //       }

// //       // If not owner, check shared access
// //       if (sharedAccess.length === 0) {
// //         res.status(403).json({ message: "You do not have access to this note." });
// //         return;
// //       }

// //       // Get the specific shared note
// //       const sharedNoteIds = sharedAccess.map((item) => item.noteId).filter(Boolean);
// //       const sharedNotes = sharedNoteIds.length > 0
// //         ? await Note.find({ _id: { $in: sharedNoteIds } }).sort({ createdAt: -1 }).lean()
// //         : [];

// //       if (sharedNotes.length === 0) {
// //         res.status(403).json({ message: "You do not have access to this note." });
// //         return;
// //       }

// //       const accessByNoteId = new Map(
// //         sharedAccess.map((item) => [item.noteId?.toString(), item.permission].filter(Boolean)) as [string, string][]
// //       );

// //       const filteredShared = sharedNotes.map((note) => ({
// //         ...note,
// //         isOwned: false,
// //         accessPermission: accessByNoteId.get(note._id.toString()) || "view",
// //       }));

// //       const ownerMap = await getOwnerMap(filteredShared);
// //       const finalNotes = filteredShared.map((note) => addOwner(note, ownerMap));

// //       res.status(200).json(finalNotes);
// //       return;
// //     }

// //     // --- IF NO SPECIFIC NOTE ID, RETURN ALL NOTES (existing logic) ---
// //     const applyFilters = (noteList: any[]) => {
// //       return noteList.filter((note) => {
// //         if (status && String(status) !== 'All') {
// //           const noteStatus = (note.task && String(note.task)) || 'Todo';
// //           if (noteStatus !== String(status)) return false;
// //         }
// //         if (assignee && String(assignee) !== 'All') {
// //           const noteAssignee = (note.assignee && String(note.assignee)) || '';
// //           if (noteAssignee !== String(assignee)) return false;
// //         }
// //         return true;
// //       });
// //     };

// //     const accessByNoteId = new Map(
// //       sharedAccess.map((item) => [item.noteId?.toString(), item.permission].filter(Boolean)) as [string, string][]
// //     );

// //     const filteredOwned = applyFilters(ownedNotes);
// //     const sharedNoteIds = sharedAccess.map((item) => item.noteId).filter(Boolean);
// //     const sharedNotes = sharedNoteIds.length > 0
// //       ? await Note.find({ _id: { $in: sharedNoteIds } }).sort({ createdAt: -1 }).lean()
// //       : [];
// //     const filteredShared = applyFilters(sharedNotes);

// //     const combinedNotes = [
// //       ...filteredOwned.map((note) => ({
// //         ...note,
// //         isOwned: true,
// //         accessPermission: "owner",
// //       })),
// //       ...filteredShared
// //         .filter((note) => !filteredOwned.some((owned) => owned._id.toString() === note._id.toString()))
// //         .map((note) => ({
// //           ...note,
// //           isOwned: false,
// //           accessPermission: accessByNoteId.get(note._id.toString()) || "view",
// //         })),
// //     ];

// //     const ownerMap = await getOwnerMap(combinedNotes);
// //     const finalNotes = combinedNotes.map((note) => addOwner(note, ownerMap));

// //     res.status(200).json(finalNotes);
// //   } catch (err: any) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // In your note controller
// export const getNotes = async (
//   req: AuthRequest,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const { status, assignee, shareScope, noteId } = req.query;
//     const userId = req.user?.id;

//     if (!userId) {
//       res.status(401).json({ message: "Unauthorized" });
//       return;
//     }

//     // ============ IF SPECIFIC NOTE ID IS PROVIDED ============
//     if (noteId && mongoose.Types.ObjectId.isValid(noteId as string)) {
//       const targetNoteId = new mongoose.Types.ObjectId(noteId as string);
      
//       // Check if user is owner
//       const ownedNote = await Note.findOne({ 
//         _id: targetNoteId, 
//         user: userId 
//       }).lean();

//       if (ownedNote) {
//         // Owner - return the specific note
//         const ownerMap = await getOwnerMap([ownedNote]);
//         const noteWithOwner = addOwner(ownedNote, ownerMap);
        
//         res.status(200).json([{
//           ...noteWithOwner,
//           isOwned: true,
//           accessPermission: "owner",
//         }]);
//         return;
//       }

//       // Check if user has shared access
//       const sharedAccess = await WorkspaceAccess.findOne({
//         userId: userId,
//         noteId: targetNoteId,
//       }).lean();

//       if (!sharedAccess) {
//         res.status(403).json({ 
//           message: "You do not have access to this note." 
//         });
//         return;
//       }

//       // Get the shared note
//       const sharedNote = await Note.findById(targetNoteId).lean();
      
//       if (!sharedNote) {
//         res.status(404).json({ message: "Note not found." });
//         return;
//       }

//       const ownerMap = await getOwnerMap([sharedNote]);
//       const noteWithOwner = addOwner(sharedNote, ownerMap);

//       res.status(200).json([{
//         ...noteWithOwner,
//         isOwned: false,
//         accessPermission: sharedAccess.permission || "view",
//       }]);
//       return;
//     }

//     // ============ IF NO SPECIFIC NOTE ID - RETURN ALL NOTES ============
//     // ... rest of your existing code for getting all notes
//     // ... (your existing logic for ownedNotes, sharedAccess, etc.)

//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 3. GET NOTE BY ID
// export const getNoteById = async (
//   req: AuthRequest,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const id = req.params.id;

//     if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
//       res.status(400).json({ message: "Invalid note id." });
//       return;
//     }

//     const note = await Note.findById(id);
//     if (!note) {
//       res.status(404).json({ message: "Note not found." });
//       return;
//     }

//     const hasOwnerAccess = note.user?.toString() === req.user?.id;
//     const sharedAccess = await WorkspaceAccess.findOne({ userId: req.user?.id, noteId: note._id });
    
//     if (!hasOwnerAccess && !sharedAccess) {
//       res.status(403).json({ message: "You do not have access to this note." });
//       return;
//     }

//     if (!hasOwnerAccess && sharedAccess && note.user) {
//       await createNotification({
//         fromUser: req.user!.id,
//         toUser: note.user.toString(),
//         noteId: note._id,
//         type: "view",
//         message: "A collaborator viewed your note.",
//       });
//     }

//     const noteObject = note.toObject();
//     const ownerMap = await getOwnerMap([noteObject]);
//     const noteWithOwner = addOwner(noteObject, ownerMap);

//     const responsePayload = {
//       ...noteWithOwner,
//       accessPermission: hasOwnerAccess ? "owner" : sharedAccess?.permission || "view",
//       isOwned: hasOwnerAccess,
//     };

//     res.status(200).json(responsePayload);
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 4. UPDATE NOTE (Secured fields & Optimized queries)
// export const updateNote = async (
//   req: AuthRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id as string)) {
//       res.status(400).json({ message: "Invalid note id" });
//       return;
//     }

//     const note = await Note.findById(id);
//     if (!note) {
//       res.status(404).json({ message: "Note not found" });
//       return;
//     }

//     const hasOwnerAccess = note.user?.toString() === req.user?.id;
//     const sharedAccess = await WorkspaceAccess.findOne({ userId: req.user?.id, noteId: note._id });
    
//     if (!hasOwnerAccess && (!sharedAccess || sharedAccess.permission !== "edit")) {
//       res.status(403).json({ message: "You do not have permission to edit this note." });
//       return;
//     }

//     // FIXED: Destructured req.body to prevent payload injection altering 'user' ownership
//     const { title, content, description, category, priority, assignee, task, startDate, endDate } = req.body;

//     const updatedNote = await Note.findOneAndUpdate(
//       { _id: id },
//       { 
//         title, 
//         content: content || description, 
//         description, 
//         category, 
//         priority, 
//         assignee, 
//         task: task && task.trim().length > 0 ? task : note.task, 
//         startDate, 
//         endDate 
//       },
//       { new: true }
//     );

//     if (!hasOwnerAccess && sharedAccess && note.user) {
//       await createNotification({
//         fromUser: req.user!.id,
//         toUser: note.user.toString(),
//         noteId: note._id,
//         type: "edit",
//         message: "A collaborator edited your note.",
//       });
//     }

//     if (!updatedNote) {
//       res.status(404).json({ message: "Note not found" });
//       return;
//     }

//     res.status(200).json(updatedNote);
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 5. DELETE NOTE (Optimized performance)
// export const deleteNote = async (
//   req: AuthRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const id = req.params.id;

//     if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
//       res.status(400).json({ message: "Invalid note id." });
//       return;
//     }

//     // FIXED: Reduced two database round-trips into a smart singular filter delete
//     const deletedNote = await Note.findOneAndDelete({ _id: id, user: req.user?.id });
    
//     if (!deletedNote) {
//       const exists = await Note.exists({ _id: id });
//       if (exists) {
//         res.status(403).json({ message: "Only the owner can delete this note." });
//       } else {
//         res.status(404).json({ message: "Note not found." });
//       }
//       return;
//     }

//     await Comment.deleteMany({ noteId: deletedNote._id });
//     res.status(200).json({ message: "Note deleted successfully." });
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };


import mongoose from "mongoose";
import Note from "../../models/Note";
import Comment from "../../models/Comment";
import ShareInvitation from "../../models/ShareInvitation";
import WorkspaceAccess from "../../models/WorkspaceAccess";
import Notification from "../../models/Notification";
import Auth from "../../models/Auth";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

const getOwnerMap = async (notes: any[]) => {
  const ownerIds = Array.from(
    new Set(
      notes
        .map((note) => note.user?.toString())
        .filter((id): id is string => Boolean(id)),
    ),
  );

  const owners = ownerIds.length > 0
    ? await Auth.find({ _id: { $in: ownerIds } }).select("firstName lastName email").lean()
    : [];

  return new Map(
    owners.map((owner: any) => [
      owner._id.toString(),
      {
        _id: owner._id.toString(),
        firstName: owner.firstName,
        lastName: owner.lastName,
        email: owner.email,
      },
    ]),
  );
};

const addOwner = (note: any, ownerById: Map<string, any>) => ({
  ...note,
  owner: ownerById.get(note.user?.toString()) || null,
});

// ============================================================
// 1. CREATE NOTE
// ============================================================
export const createNote = async (
  req: AuthRequest, 
  res: Response
): Promise<void> => {
  try {
    const { title, content, description, category, priority, assignee, task, startDate, endDate } = req.body;

    const note = new Note({
      title,
      content: content || description,
      description,
      category,
      priority,
      assignee,
      task: task && task.trim().length > 0 ? task : "Not Started",
      startDate,
      endDate,
      user: req.user?.id,
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ============================================================
// 2. GET NOTES (COMPLETE FIXED VERSION)
// ============================================================
export const getNotes = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { status, assignee, shareScope, noteId } = req.query;
    const requestedShareScope = typeof shareScope === "string" ? shareScope : undefined;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // ============ IF SPECIFIC NOTE ID IS PROVIDED ============
    if (noteId && mongoose.Types.ObjectId.isValid(noteId as string)) {
      const targetNoteId = new mongoose.Types.ObjectId(noteId as string);
      
      // Check if user is owner
      const ownedNote = await Note.findOne({ 
        _id: targetNoteId, 
        user: userId 
      }).lean();

      if (ownedNote) {
        const ownerMap = await getOwnerMap([ownedNote]);
        const noteWithOwner = addOwner(ownedNote, ownerMap);
        
        res.status(200).json([{
          ...noteWithOwner,
          isOwned: true,
          accessPermission: "owner",
        }]);
        return;
      }

      // Check if user has shared access
      const sharedAccess = await WorkspaceAccess.findOne({
        userId: userId,
        noteId: targetNoteId,
        accessScope:"note"
      }).lean();

      if (!sharedAccess) {
        res.status(403).json({ 
          message: "You do not have access to this note." 
        });
        return;
      }

      const sharedNote = await Note.findById(targetNoteId).lean();
      
      if (!sharedNote) {
        res.status(404).json({ message: "Note not found." });
        return;
      }

      const ownerMap = await getOwnerMap([sharedNote]);
      const noteWithOwner = addOwner(sharedNote, ownerMap);

      res.status(200).json([{
        ...noteWithOwner,
        isOwned: false,
        accessPermission: sharedAccess.permission || "view",
      }]);
      return;
    }

    // ============ GET ALL NOTES ============
    // Get owner's notes
    const ownedNotes = await Note.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    // Get shared access
    const sharedAccessItems = await WorkspaceAccess.find({ userId: userId }).lean();
    
    // Get invitations
    const categoryInvitations = await ShareInvitation.find({
      userId: userId,
      status: { $in: ["pending", "accepted"] },
      $or: [
        { source: "category_page" },
        { pageUrl: /\/category(?:[/?#]|$)/ },
      ],
    }).select("invitedBy").lean();

    const noteInvitations = await ShareInvitation.find({
      userId: userId,
      status: { $in: ["pending", "accepted"] },
      $or: [
        { source: "note_page" }, 
        { pageUrl: /\/note(?:[/?#]|$)/ },
      ],
    }).select("invitedBy").lean();

    const statusInvitations = await ShareInvitation.find({
      userId: userId,
      status: { $in: ["pending", "accepted"] },
      $or: [
        { source: "board_page" },
        { pageUrl: /\/board(?:[/?#]|$)/ },
      ],
    }).select("invitedBy").lean();

    const noteFormInvitations = await ShareInvitation.find({
      userId: userId,
      status: { $in: ["pending", "accepted"] },
      $or: [
        { source: "note_form_page" },
        { pageUrl: /\/note-form(?:[/?#]|$)/ },
      ],
    }).select("invitedBy").lean();

    const noteInviterIds = new Set(noteInvitations.map((item) => item.invitedBy.toString()));
    const categoryInviterIds = new Set(categoryInvitations.map((item) => item.invitedBy.toString()));
    const statusInviterIds = new Set(statusInvitations.map((item) => item.invitedBy.toString()));
    const noteFormInviterIds = new Set(noteFormInvitations.map((item) => item.invitedBy.toString()));

    // Filter shared access based on scope
    const filteredSharedAccess = sharedAccessItems.filter((item) => {
      let accessScope = item.accessScope;
      
      if (!accessScope) {
        if (categoryInviterIds.has(item.grantedBy.toString())) {
          accessScope = "category";
        } else if (noteInviterIds.has(item.grantedBy.toString())) {
          accessScope = "note"; 
        } else if (statusInviterIds.has(item.grantedBy.toString())) {
          accessScope = "board";
        } else if (noteFormInviterIds.has(item.grantedBy.toString())) {
          accessScope = "note-form";
        } else {
          accessScope = "global";
        }
      }

      if (requestedShareScope) {
        return accessScope === requestedShareScope;
      }
      return true;
    });

    // Apply filters
    const applyFilters = (noteList: any[]) => {
      return noteList.filter((note) => {
        if (status && String(status) !== 'All') {
          const noteStatus = (note.task && String(note.task)) || 'Todo';
          if (noteStatus !== String(status)) return false;
        }
        if (assignee && String(assignee) !== 'All') {
          const noteAssignee = (note.assignee && String(note.assignee)) || '';
          if (noteAssignee !== String(assignee)) return false;
        }
        return true;
      });
    };

    const accessByNoteId = new Map(
      filteredSharedAccess
        .filter(item => item.noteId)
        .map((item) => [item.noteId!.toString(), item.permission])
    );

    // Get shared notes
    const sharedNoteIds = filteredSharedAccess
      .map((item) => item.noteId)
      .filter((id): id is mongoose.Types.ObjectId => Boolean(id));
    
    const sharedNotes = sharedNoteIds.length > 0
      ? await Note.find({ _id: { $in: sharedNoteIds } })
          .sort({ createdAt: -1 })
          .lean()
      : [];

    const filteredOwned = applyFilters(ownedNotes);
    const filteredShared = applyFilters(sharedNotes);

    // Combine notes
    const combinedNotes = [
      ...filteredOwned.map((note) => ({
        ...note,
        isOwned: true,
        accessPermission: "owner",
      })),
      ...filteredShared
        .filter((note) => !filteredOwned.some((owned) => owned._id.toString() === note._id.toString()))
        .map((note) => ({
          ...note,
          isOwned: false,
          accessPermission: accessByNoteId.get(note._id.toString()) || "view",
        })),
    ];

    const ownerMap = await getOwnerMap(combinedNotes);
    const finalNotes = combinedNotes.map((note) => addOwner(note, ownerMap));

    res.status(200).json(finalNotes);
  } catch (err: any) {
    console.error('❌ Error in getNotes:', err);
    res.status(500).json({ message: err.message });
  }
};

// ============================================================
// 3. GET NOTE BY ID
// ============================================================
export const getNoteById = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid note id." });
      return;
    }

    const note = await Note.findById(id);
    if (!note) {
      res.status(404).json({ message: "Note not found." });
      return;
    }

    const hasOwnerAccess = note.user?.toString() === req.user?.id;
    const sharedAccess = await WorkspaceAccess.findOne({ userId: req.user?.id, noteId: note._id });
    
    if (!hasOwnerAccess && !sharedAccess) {
      res.status(403).json({ message: "You do not have access to this note." });
      return;
    }

    const noteObject = note.toObject();
    const ownerMap = await getOwnerMap([noteObject]);
    const noteWithOwner = addOwner(noteObject, ownerMap);

    const responsePayload = {
      ...noteWithOwner,
      accessPermission: hasOwnerAccess ? "owner" : sharedAccess?.permission || "view",
      isOwned: hasOwnerAccess,
    };

    res.status(200).json(responsePayload);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ============================================================
// 4. UPDATE NOTE
// ============================================================
export const updateNote = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ message: "Invalid note id" });
      return;
    }

    const note = await Note.findById(id);
    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    const hasOwnerAccess = note.user?.toString() === req.user?.id;
    const sharedAccess = await WorkspaceAccess.findOne({ userId: req.user?.id, noteId: note._id });
    
    if (!hasOwnerAccess && (!sharedAccess || sharedAccess.permission !== "edit")) {
      res.status(403).json({ message: "You do not have permission to edit this note." });
      return;
    }

    const { title, content, description, category, priority, assignee, task, startDate, endDate } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id },
      { 
        title, 
        content: content || description, 
        description, 
        category, 
        priority, 
        assignee, 
        task: task && task.trim().length > 0 ? task : note.task, 
        startDate, 
        endDate 
      },
      { new: true }
    );

    if (!updatedNote) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    res.status(200).json(updatedNote);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ============================================================
// 5. DELETE NOTE
// ============================================================
export const deleteNote = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid note id." });
      return;
    }

    const deletedNote = await Note.findOneAndDelete({ _id: id, user: req.user?.id });
    
    if (!deletedNote) {
      const exists = await Note.exists({ _id: id });
      if (exists) {
        res.status(403).json({ message: "Only the owner can delete this note." });
      } else {
        res.status(404).json({ message: "Note not found." });
      }
      return;
    }

    await Comment.deleteMany({ noteId: deletedNote._id });
    res.status(200).json({ message: "Note deleted successfully." });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};