import express from "express";
import {createNote,getNotes,getNoteById,updateNote,deleteNote} from "../controllers/notes/index";
import { getComments, addComment } from "../controllers/comments/index";
import { verifyToken } from "../middleware/auth";
// import { inviteCollaborator } from "../controllers/share";

const router = express.Router();

//create note
router.get("/", verifyToken, getNotes);
router.get("/:id/comments", verifyToken, getComments);
router.post("/:id/comments", verifyToken, addComment);
router.get("/:id", verifyToken, getNoteById);
router.post("/",verifyToken,createNote);
router.delete("/:id", verifyToken, deleteNote);
router.put("/:id", verifyToken, updateNote);
// router.post("/invite", inviteCollaborator)



export default router;
