import express from "express";
import { login,signup, getUsers } from "../../controllers/auth/index";
import { verifyToken } from "../../middleware/auth";

const router = express.Router();
router.post("/login",login);
router.post("/signup",signup);
router.get("/users", verifyToken, getUsers);

export default router;
