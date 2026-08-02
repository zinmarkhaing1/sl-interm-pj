import express from "express";
import type { Request, Response } from "express";
import { verifyToken } from "../middleware/auth";
import Notification from "../models/Notification";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}
const router = express.Router();
router.get("/", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const notifications = await Notification.find({ toUser: userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ notifications });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load notifications";
    res.status(500).json({ message });
  }
});

router.put("/:id/read", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, toUser: userId },
      { isRead: true },
      { new: true },
    ).lean();

    if (!notification) {
      res.status(404).json({ message: "Notification not found." });
      return;
    }

    res.status(200).json({ notification });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update notification";
    res.status(500).json({ message });
  }
});


router.delete("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      toUser: userId,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notification" });
  }
});

export default router;
