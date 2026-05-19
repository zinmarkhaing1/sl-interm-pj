import mongoose from "mongoose";
import Note from "../../models/Note";
import { Request, Response} from "express";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

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
      task,
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
    const notes = await Note.find({
       user: req.user?.id }).sort({
      createdAt: -1,
    });
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

    const note = await Note.findOne({ _id: id, user: req.user?.id });
    if (!note) {
      res.status(404).json({ message: "Note not found." });
      return;
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

    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: id,
        user: req.user?.id,
      },
      req.body,
      {
        new: true,
      }
    );

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
