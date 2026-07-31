import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category/index";

const router = express.Router();

router.get("/", getCategories);      // GET /api/categories
router.post("/", createCategory);    // POST /api/categories
router.put("/:id", updateCategory);  // PUT /api/categories/:id
router.delete("/:id", deleteCategory); // DELETE /api/categories/:id
export default router;