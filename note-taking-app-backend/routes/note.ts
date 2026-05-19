import express from "express";
import {createNote,getNotes,getNoteById,updateNote,deleteNote} from "../controllers/notes/index";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

//create note
router.get("/", verifyToken, getNotes);
router.get("/:id", verifyToken, getNoteById);
router.post("/",verifyToken,createNote);
router.delete("/:id", verifyToken, deleteNote);
router.put("/:id", verifyToken, updateNote);

export default router;
