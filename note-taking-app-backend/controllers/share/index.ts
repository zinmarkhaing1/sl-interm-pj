import { Request, Response } from "express";
// import ShareInvitation from "../models/ShareInvitation"; // သင့် Model ရှိရာ လမ်းကြောင်းအတိုင်း ပြင်ပါ
import ShareInvitation from "../../models/ShareInvitation";

export const inviteCollaborator = async (req: Request, res: Response): Promise<void> => {
  try {
    const { invitedEmail, role, pageUrl } = req.body;

    
    if (!invitedEmail) {
      res.status(400).json({ message: "Email is required." });
      return;
    }

    
    const existingInvitation = await ShareInvitation.findOne({
      invitedEmail: invitedEmail.toLowerCase().trim(),
      pageUrl,
      status: "pending",
    });

    if (existingInvitation) {
      res.status(400).json({ message: "This email has already been invited to this page." });
      return;
    }

    const newInvitation = new ShareInvitation({
      invitedBy: (req as any).user?.id || null, // အကယ်၍ Auth Middleware သုံးထားရင် လက်ရှိ User ID ဝင်သွားမယ်
      invitedEmail: invitedEmail.trim(),       // lowercase: true ပါရင် auto ပြောင်းပါလိမ့်မယ်
      role: role || "viewer",                  // Frontend က ပို့ပေးတဲ့ role (viewer)
      status: "pending",
      pageUrl,
    });

    await newInvitation.save();


    res.status(201).json({
      message: "Collaborator invited successfully.",
      collaborator: newInvitation,
    });

  } catch (error: any) {
    console.error("Invite Error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error." });
  }
};