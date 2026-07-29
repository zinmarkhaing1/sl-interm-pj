

import mongoose from "mongoose";
import Note from "../../models/Note";
import Comment from "../../models/Comment";
import ShareInvitation from "../../models/ShareInvitation";
import WorkspaceAccess from "../../models/WorkspaceAccess";
import Notification from "../../models/Notification";
import Auth from "../../models/Auth";
import { Request, Response } from "express";
import PageAccess from "../../models/PageAccess";


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
    taskId: note.taskId || null,
  taskTitle: note.taskTitle || null,
});


// 1. CREATE NOTE

export const createNote = async (
  req: AuthRequest, 
  res: Response
): Promise<void> => {
  try {
    const { title, content, description,taskId, taskTitle ,category, priority, assignee, task, startDate, endDate,} = req.body;
 
    const note = new Note({
      title,
      content: content || description,
      description,
      category,
      priority,
      taskId,
      taskTitle,
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


export const getNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, assignee, shareScope, noteId,taskId } = req.query;
    const requestedShareScope = typeof shareScope === "string" ? shareScope : undefined;
    const userId = req.user?.id;

    console.log(" getNotes DEBUG START ===");
    console.log(" User ID:", userId);
    console.log("Share Scope:", requestedShareScope);

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    //  IF SPECIFIC NOTE ID 
    if (noteId && mongoose.Types.ObjectId.isValid(noteId as string)) {
      const targetNoteId = new mongoose.Types.ObjectId(noteId as string);

      const ownedNote = await Note.findOne({ _id: targetNoteId, user: userId }).lean();
      if (ownedNote) {
        const ownerMap = await getOwnerMap([ownedNote]);
        const noteWithOwner = addOwner(ownedNote, ownerMap);
        res.status(200).json([{ ...noteWithOwner, isOwned: true, accessPermission: "owner" }]);
        return;
      }

      const sharedAccess = await WorkspaceAccess.findOne({
        userId: userId,
        noteId: targetNoteId,
        accessScope: "note",
      }).lean();

      if (!sharedAccess) {
        res.status(403).json({ message: "You do not have access to this note." });
        return;
      }

      const sharedNote = await Note.findById(targetNoteId).lean();
      if (!sharedNote) {
        res.status(404).json({ message: "Note not found." });
        return;
      }

      const ownerMap = await getOwnerMap([sharedNote]);
      const noteWithOwner = addOwner(sharedNote, ownerMap);
      res.status(200).json([
        {
          ...noteWithOwner,
          isOwned: false,
          accessPermission: sharedAccess.permission || "view",
        },
      ]);
      return;
    }

    const ownedNotes = await Note.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
    console.log("📚 1. Owned notes:", ownedNotes.length);

    // STEP 2: Get PageAccess for CATEGORY
    const categoryPageAccesses = await PageAccess.find({
      userId: userId,
      pageType: "category",
    }).lean();

    // const categoryNamesFromAccess = categoryPageAccesses
    //   .map((pa) => pa.pageName)
    //   .filter((name): name is string => Boolean(name));

    // STEP 3: Get invitations for CATEGORY
    const categoryInvitations = await ShareInvitation.find({
      userId: userId,
      pageType: "category",
      status: { $in: ["pending", "accepted"] },

    }).lean();

    const hasCategoryAccess = categoryPageAccesses.length > 0  ||
    categoryInvitations.length > 0;
    console.log('Category Access:', hasCategoryAccess);

    // const categoryNamesFromInvitations = categoryInvitations
    //   .map((inv) => inv.pageName)
    //   .filter((name): name is string => Boolean(name));

    // Combine category names
    // const allCategoryNames = [...categoryNamesFromAccess, ...categoryNamesFromInvitations];
    // const uniqueCategoryNames = [...new Set(allCategoryNames)];
    // console.log("📂 2. Category names:", uniqueCategoryNames);

    // STEP 4: Get PageAccess for BOARD
    const boardPageAccesses = await PageAccess.find({
      userId: userId,
      pageType: "board",
    }).lean();

    // const boardNamesFromAccess = boardPageAccesses
    //   .map((pa) => pa.pageName)
    //   .filter((name): name is string => Boolean(name));

    // STEP 5: Get invitations for BOARD
    const boardInvitations = await ShareInvitation.find({
      userId: userId,
      pageType: "board",
      status: { $in: ["pending", "accepted"] },
    }).lean();

    const hasBoardAccess = boardPageAccesses.length > 0 || boardInvitations.length > 0;
    console.log("📂 3. Board Access:", hasBoardAccess);

    // const boardNamesFromInvitations = boardInvitations
    //   .map((inv) => inv.pageName)
    //   .filter((name): name is string => Boolean(name));

    // Combine board names
    // const allBoardNames = [...boardNamesFromAccess, ...boardNamesFromInvitations];
    // const uniqueBoardNames = [...new Set(allBoardNames)];
    // console.log(" 3. Board names:", uniqueBoardNames);



    // STEP 6: Get notes from CATEGORIES
    let categoryNotes: any[] = [];
    if (hasCategoryAccess) {
      categoryNotes = await Note.find({
        category: { $exists: true, $ne: "" },
      })
        .sort({ createdAt: -1 })
        .lean();
      console.log("📚 4. Category notes found (all):", categoryNotes.length);
    }
    // if (uniqueCategoryNames.length > 0) {
    //   const categoryRegexes = uniqueCategoryNames.map(
    //     (name) => new RegExp(`^${name}$`, "i")
    //   );
    //   categoryNotes = await Note.find({
    //     category: { $in: categoryRegexes },
    //   })
    //     .sort({ createdAt: -1 })
    //     .lean();
    //   console.log("📚 4. Category notes found:", categoryNotes.length);
    // }

   
    const sharedAccessItems = await WorkspaceAccess.find({
      userId: userId,
      accessScope: { $in: ["note", "note-form", "global"] },
    }).lean();

    const sharedNoteIds = sharedAccessItems
      .map((item) => item.noteId)
      .filter((id): id is mongoose.Types.ObjectId => Boolean(id));

    let workspaceNotes: any[] = [];
    if (sharedNoteIds.length > 0) {
      workspaceNotes = await Note.find({
        _id: { $in: sharedNoteIds },
      })
        .sort({ createdAt: -1 })
        .lean();
    }
    console.log("📚 5. Workspace notes:", workspaceNotes.length);

    // STEP 9: Combine all notes without duplicates
    const allNotes = [...ownedNotes, ...categoryNotes, ...workspaceNotes];

    const noteMap = new Map();
    allNotes.forEach((note) => {
      const noteId = note._id.toString();
      if (!noteMap.has(noteId)) {
        noteMap.set(noteId, note);
      }
    });

    const combinedNotes = Array.from(noteMap.values());
    console.log("📚 6. Total combined notes:", combinedNotes.length);

    // STEP 10: Apply status and assignee filters
    const applyFilters = (noteList: any[]) => {
      return noteList.filter((note) => {
        if (status && String(status) !== "All") {
          const noteStatus = (note.task && String(note.task)) || "Todo";
          if (noteStatus !== String(status)) return false;
        }
        if (assignee && String(assignee) !== "All") {
          const noteAssignee = (note.assignee && String(note.assignee)) || "";
          if (noteAssignee !== String(assignee)) return false;
        }
        if (taskId && note.taskId?.toString() !== String(taskId)) return false;
        return true;
      });
    };

    const filteredNotes = applyFilters(combinedNotes);
    console.log("📚 7. After filters:", filteredNotes.length);

    // STEP 11: Add owner info & access flags
    const ownerMap = await getOwnerMap(filteredNotes);
    let finalNotes = filteredNotes.map((note) => {
      const isOwned = note.user?.toString() === userId;
     
    const hasBoardAccess = boardPageAccesses.length > 0;
  const hasTask = note.task && note.task.trim().length > 0;
  const isBoardNote = hasBoardAccess && hasTask;

  const hasWorkspaceAccess = sharedAccessItems.some(
    (item) => item.noteId?.toString() === note._id.toString()
  );

      let accessPermission = "view";
      let sharedVia: "category" | "board" | "workspace" | undefined = undefined;

      if (isOwned) {
        accessPermission = "owner";
      } else if (hasWorkspaceAccess) {
        accessPermission = "edit";
        sharedVia = "workspace";
      // } else if (isInSharedCategory) {
      //   accessPermission = "view";
      //   sharedVia = "category";
      } else if (isBoardNote) {
        accessPermission = "view";
        sharedVia = "board";
      }

      return addOwner(
        {
          ...note,
          isOwned: isOwned,
          accessPermission: accessPermission,
          sharedVia: sharedVia,
          taskId: note.taskId || null,
      taskTitle: note.taskTitle || null,
        },
        ownerMap
      );
    });

    if (!requestedShareScope || requestedShareScope === "own") {
      finalNotes = finalNotes.filter((note) => note.isOwned === true);
      console.log("📤 Final Own Notes:", finalNotes.length);
    }

    // STEP 12:Specific ShareScope Filter (WITH OWN NOTES INCLUDED)
    if (requestedShareScope === "category") {
      finalNotes = finalNotes.filter((note) => {
        // const isSharedViaCategory = note.sharedVia === "category";
        // const isInCategory = uniqueCategoryNames.some(
        //   (name) => name.toLowerCase() === (note.category || "").toLowerCase()
        // );
        // 
        // return (isSharedViaCategory ) || note.isOwned === true;
        // const hasCategory = note.category && note.category.trim().length > 0;
        // return note.isOwned === true || (hasCategoryAccess && hasCategory);
         return note.isOwned === true || (hasCategoryAccess && note.category && note.category.trim().length > 0);
      });
      console.log("📤 8. Final Category Notes (with own):", finalNotes.length);
    }

    if (requestedShareScope === "board") {
      finalNotes = finalNotes.filter((note) => {
        const hasTask = note.task && note.task.trim().length > 0;
        // const isSharedViaBoard = note.sharedVia === "board";
        // const isInBoard = uniqueBoardNames.some(
        //   (name) => name.toLowerCase() === (note.category || "").toLowerCase()
        // );
       
        // return (isSharedViaBoard || isInBoard) || note.isOwned === true;
        return note.isOwned === true || (hasBoardAccess && hasTask);

        // if (note.isOwned) return true;
        // if (hasBoardAccess) return true;
        // return false;
      });
      console.log("📤 9. Final Board Notes (with own):", finalNotes.length);
    }

    // If no shareScope or "all", return all notes
    if (!requestedShareScope || requestedShareScope === "all") {
      console.log("📤 10. All notes:", finalNotes.length);
    }

    console.log("✅ Final notes count:", finalNotes.length);
    console.log("=== 🔍 getNotes DEBUG END ===");

    res.status(200).json(finalNotes);
  } catch (err: any) {
    console.error("❌ Error in getNotes:", err);
    res.status(500).json({
      message: err.message || "Internal server error",
    });
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

