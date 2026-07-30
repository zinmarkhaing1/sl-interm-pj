import { Router } from "express";
import { getUsers, getUserById } from "../controllers/users";
import {verifyToken} from "../middleware/auth";

const router = Router();

// GET /api/users
router.get("/",  verifyToken, getUsers);

// GET /api/users/:id
router.get("/:id", verifyToken, getUserById);

export default router;