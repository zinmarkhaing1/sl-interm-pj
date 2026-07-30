import { Request, Response } from "express";
import User from "../../models/Auth";

// GET /api/users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, "firstName lastName username email photo");

    res.status(200).json(users);
  } catch (error) {
    console.error("getUsers:", error);
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

// GET /api/users/:id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(
      id,
      "firstName lastName username email photo"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("getUserById:", error);
    res.status(500).json({
      message: "Failed to fetch user",
    });
  }
};