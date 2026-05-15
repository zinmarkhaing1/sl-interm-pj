import mongoose from "mongoose";

import { Request, Response } from "express";
import NoteCategory from "../../models/NoteCategory";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const createTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { input, notetypes } = req.body;

    if (!input || !notetypes) {
      res.status(400).json({
        message: "Title and priority are required",
      });
      return;
    }

    const newTask = new NoteCategory({
      input,
      notetypes,
      user: req.user?.id,
    });

    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (err: unknown) {
    res.status(500).json({
      message: err instanceof Error ? err.message : "Failed to create task",
    });
  }
};
export const getTasks = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tasks = await NoteCategory.find({
      user: req.user?.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err: unknown) {
    res.status(500).json({
      message: err instanceof Error ? err.message : "Failed to get tasks",
    });
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({
        message: "Invalid task id",
      });
      return;
    }

    const deletedTask = await NoteCategory.findOneAndDelete({
      _id: id,
      user: req.user?.id,
    });

    if (!deletedTask) {
      res.status(404).json({
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (err: unknown) {
    res.status(500).json({
      message: err instanceof Error ? err.message : "Failed to delete task",
    });
  }
};
