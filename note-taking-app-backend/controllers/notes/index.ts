import mongoose from "mongoose";
import Note from "../../models/Note";
import ShareInvitation from "../../models/ShareInvitation";
import WorkspaceAccess from "../../models/WorkspaceAccess";
import Notification from "../../models/Notification";
import { Request, Response} from "express";

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
  if (!fromUser || !toUser || fromUser === toUser) return;

  const recentNotification = await Notification.findOne({
    fromUser,
    toUser,
    noteId,
    type,
  }).sort({ createdAt: -1 });

  if (recentNotification) {
    const ageMs = Date.now() - new Date(recentNotification.createdAt).getTime();
    if (ageMs < 5 * 60 * 1000) {
      return;
    }
  }

  await Notification.create({
    fromUser,
    toUser,
    noteId,
    type,
    message,
  });
};

export const createNote = async (
    req:AuthRequest, 
    res:Response):Promise<void> => {
  try {
    const { title, content, description, category, priority, assignee,task, startDate, endDate } = req.body;

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
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getNotes = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { status, assignee } = req.query;

    const ownedNotes = await Note.find({ user: req.user?.id }).sort({ createdAt: -1 }).lean();
    const sharedAccess = await WorkspaceAccess.find({ userId: req.user?.id }).lean();
    const sharedNoteIds = sharedAccess.map((item) => item.noteId);
    const sharedNotes = sharedNoteIds.length > 0
      ? await Note.find({ _id: { $in: sharedNoteIds } }).sort({ createdAt: -1 }).lean()
      : [];

    // Apply optional server-side filtering by status/assignee
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

    const accessByNoteId = new Map(sharedAccess.map((item) => [item.noteId.toString(), item.permission]));

    const filteredOwned = applyFilters(ownedNotes);
    const filteredShared = applyFilters(sharedNotes);

    const notes = [
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

    res.status(200).json(notes);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

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

    const note = await Note.findOne({ _id: id });
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

    if (!hasOwnerAccess && sharedAccess) {
      await createNotification({
        fromUser: req.user!.id,
        toUser: note.user.toString(),
        noteId: note._id,
        type: "view",
        message: "A collaborator viewed your note.",
      });
    }

    res.status(200).json(note);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateNote = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({
        message: "Invalid note id",
      });
      return;
    }

    const note = await Note.findById(id);
    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    const hasOwnerAccess = note.user.toString() === req.user?.id;
    const sharedAccess = await WorkspaceAccess.findOne({ userId: req.user?.id, noteId: note._id });
    if (!hasOwnerAccess && (!sharedAccess || sharedAccess.permission !== "edit")) {
      res.status(403).json({ message: "You do not have permission to edit this note." });
      return;
    }

    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: id,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!hasOwnerAccess && sharedAccess) {
      await createNotification({
        fromUser: req.user!.id,
        toUser: note.user.toString(),
        noteId: note._id,
        type: "edit",
        message: "A collaborator edited your note.",
      });
    }

    if (!updatedNote) {
      res.status(404).json({
        message: "Note not found",
      });
      return;
    }

    res.status(200).json(updatedNote);
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const deleteNote = async (
    req:AuthRequest,
    res: Response):Promise<void> => {
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

    const hasOwnerAccess = note.user.toString() === req.user?.id;
    if (!hasOwnerAccess) {
      res.status(403).json({ message: "Only the owner can delete this note." });
      return;
    }

    const deletedNote = await Note.findOneAndDelete({ _id: id, user: req.user?.id });
    if (!deletedNote) {
      res.status(404).json({ message: "Note not found." });
      return;
    }

    res.status(200).json({ message: "Note deleted successfully." });
  } catch (err:any) {
    res.status(500).json({ message: err.message });
  }
};






// export const getNotes = async (
//     req : Request,
//      res: Response): Promise<void> => {
//     try {
//         const notes = await Note.find().populate('categories', 'name').populate('priority', 'name');
//         res.status(200).json(notes);
//     } catch (err:any) {
//         res.status(500).json({ message: err.message });
//     }
// };
// //get note by id
// interface NoteParams{
//     id : string;
// }

// export const getNoteById = async (
//     req:Request<NoteParams>,
//      res: Response):Promise<void> => {
    
//     try {
//         const { id } = req.params;

//         const note = await Note.findById(id)
//             .populate('priority', 'name')
//             .populate('categories', 'name');
//         if (!note) {
//             res.status(404).json({ message: "Note not found." });
//              return;
//         }
//         console.log('note', note);
//         res.status(200).json(note);
//     } catch (err:any) {
//         console.error("Error fetching note by ID:", err.message);
//         res.status(500).json({ message: "Server error while fetching book." });
//     }
// };

// //get saved note
// interface SavedNoteQuery{
//     ids?:string;
// }
// export const getSavedNoteById = async (
//     req  : Request<{},{},{},SavedNoteQuery>,
//      res: Response):Promise<void> => {
//   try {
//     const idsParam = req.query.ids;

//     if (!idsParam) {
//        res.status(200).json([]);
//        return;
//     }
//     const ids = idsParam.split(',').filter((id) => mongoose.Types.ObjectId.isValid(id));
//     if (ids.length === 0) {
//      res.status(200).json([]); 
//       return ;
//     }
//     const notes = await Note.find({ _id: { $in: ids } })
//       .populate('categories', 'name')
//       .populate('priority', 'name');
//     res.status(200).json(notes);
//   } catch (err) {
//     console.error('Error fetching saved note:', err);
//     res.status(500).json({ message: 'Server error while fetching saved notes.' });
//   }
// };
