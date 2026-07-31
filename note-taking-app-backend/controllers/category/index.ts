import { Request, Response } from "express";
import Category from "../../models/Category";

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }
    const newCategory = new Category({ name: name.trim() });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Failed to create category", error });
  }
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const updated = await Category.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update category", error });
  }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error });
  }
};