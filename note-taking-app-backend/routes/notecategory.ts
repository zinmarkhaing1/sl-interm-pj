import express from "express";

import { createTask,getTasks,deleteTask } from "../controllers/notes/notecategory";

import { verifyToken } from "../middleware/auth";

const router = express.Router();

//note category

router.post("/", verifyToken, createTask);
router.get("/", verifyToken, getTasks);
router.delete("/:id", verifyToken, deleteTask);

export default router;