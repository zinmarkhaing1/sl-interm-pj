

import mongoose from "mongoose";
import Note from "../../models/Note";
import Comment from "../../models/Comment";
import ShareInvitation from "../../models/ShareInvitation";
import WorkspaceAccess from "../../models/WorkspaceAccess";
import Notification from "../../models/Notification";
import Auth from "../../models/Auth";
import { Request, Response } from "express";
import PageAccess from "../../models/PageAccess";
import router from '../../routes/note';

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


// 1. CREATE NOTE

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





// 2. GET NOTES

export const getNotes = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { status, assignee, shareScope, noteId } = req.query;
    const requestedShareScope = typeof shareScope === "string" ? shareScope : undefined;
    const userId = req.user?.id;

    console.log(' getNotes DEBUG ===');
    console.log('User ID:', userId);
    console.log(' Share Scope:', requestedShareScope);

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // ============ IF SPECIFIC NOTE ID IS PROVIDED ============
    if (noteId && mongoose.Types.ObjectId.isValid(noteId as string)) {
      const targetNoteId = new mongoose.Types.ObjectId(noteId as string);
      

    


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

      const sharedAccess = await WorkspaceAccess.findOne({
        userId: userId,
        noteId: targetNoteId,
        accessScope: "note"
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
    
    // STEP 1: Get user's own notes
    const ownedNotes = await Note.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
    console.log('📚 Owned notes:', ownedNotes.length);

    // STEP 2: Get PageAccess for this user
    const pageAccesses = await PageAccess.find({
      userId: userId,
      pageType: "category"
    }).lean();
    
    console.log('Page accesses found for category:', pageAccesses.length);

    const categoryInvitations = await ShareInvitation.find({
      userId: userId,
      pageType: "category",
      status: { $in: ["pending", "accepted"] }
    }).lean();
    console.log("Category invittations found:",categoryInvitations.length);
   console.log("📨 Category invitations details:", categoryInvitations.map(inv => ({
  pageName: inv.pageName,
  pageType: inv.pageType,
  status: inv.status,
  invitedEmail: inv.invitedEmail
})));
     const categoryNamesFromAccess = pageAccesses
      .map(pa => pa.pageName)
      .filter((name): name is string => Boolean(name));

    const categoryNamesFromInvitations = categoryInvitations
      .map(inv => inv.pageName)
      .filter((name): name is string => Boolean(name));

      const allCategoryNames = [...categoryNamesFromAccess, ...categoryNamesFromInvitations];
    const uniqueCategoryNames = [...new Set(allCategoryNames)];

    console.log('Category names from all sources:', uniqueCategoryNames);

    // STEP 3: Get category names & owner IDs from page access
    const categoryNames = pageAccesses
      .map(pa => pa.pageName)
      .filter((name): name is string => Boolean(name));
      console.log('Category names from page access:', categoryNames);
      
    

    // STEP 4: Get notes from categories
    let categoryNotes: any[] = [];
    if (uniqueCategoryNames.length > 0) {
      const categoryRegexes = uniqueCategoryNames.map(name => new RegExp(`^${name}$`, 'i'));
      categoryNotes = await Note.find({

           category: { $in: categoryRegexes } 
               
      })
      .sort({ createdAt: -1 })
      .lean();
      console.log(' Category notes found:', categoryNotes.length);
    }

    categoryNotes.forEach((note,i) => {
      console.log(`Note ${i + 1}: `, {
        title : note.title,
        category:note.category,
        user:note.user 
      });
    })

    // STEP 5: Get notes from WorkspaceAccess
    const sharedAccessItems = await WorkspaceAccess.find({ 
      userId: userId,
      accessScope: { $in: ["note", "note-form"] }
    }).lean();

    const sharedNoteIds = sharedAccessItems
      .map((item) => item.noteId)
      .filter((id): id is mongoose.Types.ObjectId => Boolean(id));
    
    let workspaceNotes: any[] = [];
    if (sharedNoteIds.length > 0) {
      workspaceNotes = await Note.find({ 
        _id: { $in: sharedNoteIds } 
      })
      .sort({ createdAt: -1 })
      .lean();
    }

    

    // STEP 6: Get notes from invitations (fallback)
    const userInvitations = await ShareInvitation.find({
      userId: userId,
      status: { $in: ["pending", "accepted"] }
    }).lean();

    const invitationNoteIds = userInvitations
      .filter(inv => inv.noteId)
      .map(inv => inv.noteId)
      .filter((id): id is mongoose.Types.ObjectId => Boolean(id));
    
    let invitationNotes: any[] = [];
    if (invitationNoteIds.length > 0) {
      invitationNotes = await Note.find({ 
        _id: { $in: invitationNoteIds } 
      })
      .sort({ createdAt: -1 })
      .lean();
    }

    // STEP 7: Combine all notes without duplicates
    const allNotes = [
      ...ownedNotes,
      ...categoryNotes,
      ...workspaceNotes,
      ...invitationNotes
    ];

    const noteMap = new Map();
    allNotes.forEach(note => {
      const noteId = note._id.toString();
      if (!noteMap.has(noteId)) {
        noteMap.set(noteId, note);
      }
    });
    
    const combinedNotes = Array.from(noteMap.values());

    // STEP 8: Apply status and assignee filters
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

    const filteredNotes = applyFilters(combinedNotes);

    // STEP 9: Add owner info & access flags
    const ownerMap = await getOwnerMap(filteredNotes);
    let finalNotes = filteredNotes.map((note) => {
      const isOwned = note.user?.toString() === userId;
      const isInSharedCategory = categoryNames.some(
        name => name.toLowerCase() === (note.category || "").toLowerCase());

      const hasWorkspaceAccess = sharedAccessItems.some(
        item => item.noteId?.toString() === note._id.toString()
      );

      // Determine access permission
      let accessPermission = "view";
      if (isOwned) {
        accessPermission = "owner";
      } else if (hasWorkspaceAccess) {
        accessPermission = "edit";
      } else if (isInSharedCategory) {
        accessPermission = "view";
      }

      return addOwner({
        ...note,
        isOwned: isOwned,
        accessPermission: accessPermission ,
                        //  hasWorkspaceAccess ? "edit" : 
                        //  isInSharedCategory ? "view" : "view",
        sharedVia: isInSharedCategory ? "category" : 
                   hasWorkspaceAccess ? "workspace" : undefined
      }, ownerMap);
    });


    

    // STEP 10: Specific ShareScope Filter
    if (requestedShareScope === "category") {
      finalNotes = finalNotes.filter(note => {
       const isCategoryMatch = categoryNames.some(
        name => name.toLowerCase() === (note.category || "").toLowerCase()
       );
        return note.sharedVia === "category" || isCategoryMatch;
      });
      console.log('📤 Final Filtered Category Notes Count:', finalNotes.length);
    }

    res.status(200).json(finalNotes);

  } catch (err: any) {
    console.error(' Error in getNotes:', err);
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

//delete notes
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

