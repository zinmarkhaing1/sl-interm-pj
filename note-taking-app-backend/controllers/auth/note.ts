import mongoose from "mongoose";
import Note from "../../models/Note";
import { Request, Response} from "express";

export const getNotes = async (
    req : Request,
     res: Response): Promise<void> => {
    try {
        const notes = await Note.find().populate('categories', 'name').populate('priority', 'name');
        res.status(200).json(notes);
    } catch (err:any) {
        res.status(500).json({ message: err.message });
    }
};
//get note by id
interface NoteParams{
    id : string;
}

export const getNoteById = async (
    req:Request<NoteParams>,
     res: Response):Promise<void> => {
    
    try {
        const { id } = req.params;

        const note = await Note.findById(id)
            .populate('priority', 'name')
            .populate('categories', 'name');
        if (!note) {
            res.status(404).json({ message: "Note not found." });
             return;
        }
        console.log('note', note);
        res.status(200).json(note);
    } catch (err:any) {
        console.error("Error fetching note by ID:", err.message);
        res.status(500).json({ message: "Server error while fetching book." });
    }
};

//get saved note
interface SavedNoteQuery{
    ids?:string;
}
export const getSavedNoteById = async (
    req  : Request<{},{},{},SavedNoteQuery>,
     res: Response):Promise<void> => {
  try {
    const idsParam = req.query.ids;

    if (!idsParam) {
       res.status(200).json([]);
       return;
    }
    const ids = idsParam.split(',').filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (ids.length === 0) {
     res.status(200).json([]); 
      return ;
    }
    const notes = await Note.find({ _id: { $in: ids } })
      .populate('categories', 'name')
      .populate('priority', 'name');
    res.status(200).json(notes);
  } catch (err) {
    console.error('Error fetching saved note:', err);
    res.status(500).json({ message: 'Server error while fetching saved notes.' });
  }
};
