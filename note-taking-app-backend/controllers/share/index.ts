
import { Request, Response } from "express";
import ShareInvitation from "../../models/ShareInvitation";
import Auth from "../../models/Auth";
import WorkspaceAccess from "../../models/WorkspaceAccess";
import PageAccess from "../../models/PageAccess";


// Role mapping function
const mapRoleToPermission = (role: string): "full" |"view" | "comment" | "edit" => {
  switch (role) {
    case "full":
      return "full";
    case "editor":
      return "edit";
    case "commenter":
      return "comment";
    case "viewer":
    default:
      return "view";
  }
};

// 1. Invite Collaborator
export const inviteCollaborator = async (req: Request, res: Response): Promise<void> => {
  try {
    const { invitedEmail, role, pageUrl, noteId, source ,pageType,pageName} = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!invitedEmail) {
      res.status(400).json({ message: "Email is required." });
      return;
    }

    const user = await Auth.findOne({ email: invitedEmail.toLowerCase().trim() });
    
    const existingInvitation = await ShareInvitation.findOne({
      invitedEmail: invitedEmail.toLowerCase().trim(),
      pageUrl,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingInvitation) {
      res.status(400).json({ message: "This email has already been invited to this page." });
      return;
    }

    // carefully role check
    const validRole = ["editor", "viewer", "commenter", "full"].includes(role) ? role : "viewer";

    const status = user ? "accepted" : "pending";

    const newInvitation = new ShareInvitation({
      invitedBy: userId,
      invitedEmail: invitedEmail.trim(),
      role: validRole,
      status: status,
      pageUrl: pageUrl || null,
      source: source || "default",
      noteId: noteId || null,
      userId: user?._id || null,
      pageType : pageType || null,
      pageName : pageName || null,
    });

    await newInvitation.save();

     if (user && (pageType === "category" || pageType === "board") && pageName) {
      await PageAccess.findOneAndUpdate(
        {
          userId: user._id,
          ownerId: userId,
          pageType: pageType,
          pageName: pageName,
        },
        {
          userId: user._id,
          ownerId: userId,
          pageType: pageType,
          pageName: pageName,
          pageUrl: pageUrl || "",
          permission: "view",
        },
        { upsert: true, new: true }
      );
      console.log(`✅ PageAccess created for ${pageType}: ${pageName}`);
    }

    if (user && noteId) {
      const permission = mapRoleToPermission(validRole);
      
      await WorkspaceAccess.findOneAndUpdate(
        {
          userId: user._id,
          noteId: noteId,
          accessScope: "note-form",
        },
        {
          userId: user._id,
          noteId: noteId,
          permission: permission,
          accessScope: "note-form",
          grantedBy: userId,
        },
        { upsert: true, new: true }
      );
    }

    res.status(201).json({
      message: "Collaborator invited successfully.",
      collaborator: newInvitation,
    });

  } catch (error: any) {
    console.error("Invite Error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error." });
  }
};

// 2. Get All Collaborators
// export const getCollaborators = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const userId = (req as any).user?.id;

//     if (!userId) {
//       res.status(401).json({ message: "Unauthorized" });
//       return;
//     }

//     const collaborators = await ShareInvitation.find({
//       invitedBy: userId,
//     })
//     .populate('invitedBy', 'firstName lastName email')
//     .sort({ createdAt: -1 });

//     res.status(200).json({ collaborators });
//   } catch (error: any) {
//     console.error("Get Collaborators Error:", error);
//     res.status(500).json({ message: error.message || "Internal Server Error." });
//   }
// };

export const getCollaborators = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const userId = (req as any).user?.id;
    const { noteId, pageUrl, source,pageName,pageType } = req.query;


    if (!userId) {
      res.status(401).json({
        message: "Unauthorized"
      });
      return;
    }


    const filter: any = {
      invitedBy: userId,
      status: {
        $in: ["pending", "accepted"]
      }
    };


    if (noteId) {
      filter.noteId = noteId;
    }


    if (pageUrl) {
      filter.pageUrl = pageUrl;
    }


    if (source) {
      filter.source = source;
    }
     if (pageType) filter.pageType = pageType;
    if (pageName) filter.pageName = pageName;


    const collaborators =
      await ShareInvitation.find(filter)
      .sort({
        createdAt: -1
      });


    res.status(200).json({
      collaborators
    });

    console.log(req.query);


  } catch(error:any){

    res.status(500).json({
      message:error.message
    });

  }

};

// 3. Update Collaborator Role
export const updateCollaboratorRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!role) {
      res.status(400).json({ message: "Role is required." });
      return;
    }

    // check role
    const validRole = ["editor", "viewer", "commenter", "full"].includes(role) ? role : "viewer";

    const invitation = await ShareInvitation.findOne({
      _id: id,
      invitedBy: userId,
    });

    if (!invitation) {
      res.status(404).json({ message: "Collaborator not found or you don't have permission." });
      return;
    }

    invitation.role = validRole as any;
    await invitation.save();

    if (invitation.userId && invitation.noteId) {
      const permission = mapRoleToPermission(validRole);
      
      await WorkspaceAccess.findOneAndUpdate(
        {
          userId: invitation.userId,
          noteId: invitation.noteId,
          accessScope:"note-form"
        },
        {
          permission: permission,
        }
      );
    }

    res.status(200).json({
      message: "Role updated successfully.",
      collaborator: invitation,
    });
  } catch (error: any) {
    console.error("Update Role Error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error." });
  }
};

// 4. Remove Collaborator
export const removeCollaborator = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const invitation = await ShareInvitation.findOneAndDelete({
      _id: id,
      invitedBy: userId,
    });

    if (!invitation) {
      res.status(404).json({ message: "Collaborator not found or you don't have permission." });
      return;
    }
    

    


    if (invitation.userId && invitation.noteId) {
      await WorkspaceAccess.findOneAndDelete({
        userId: invitation.userId,
        noteId: invitation.noteId,
      });
    }

    res.status(200).json({ message: "Collaborator removed successfully." });
  } catch (error: any) {
    console.error("Remove Collaborator Error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error." });
  }
};

// 5. Get Invitations
export const getInvitations = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await Auth.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const invitations = await ShareInvitation.find({
      invitedEmail: user.email,
      status: "pending",
    })
    .populate('invitedBy', 'firstName lastName email')
    .sort({ createdAt: -1 });

    res.status(200).json({ invitations });
  } catch (error: any) {
    console.error("Get Invitations Error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error." });
  }
};

// 6. Respond to Invitation
export const respondToInvitation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!status || !["accepted", "declined"].includes(status)) {
      res.status(400).json({ message: "Status must be 'accepted' or 'declined'." });
      return;
    }

    const user = await Auth.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const invitation = await ShareInvitation.findOne({
      _id: id,
      invitedEmail: user.email,
      status: "pending",
    });

    if (!invitation) {
      res.status(404).json({ message: "Invitation not found or already responded." });
      return;
    }

    invitation.status = status as any;
    await invitation.save();

    if (status === "accepted" && invitation.noteId) {
      const permission = mapRoleToPermission(invitation.role);
      
      await WorkspaceAccess.findOneAndUpdate(
        {
          userId: userId,
          noteId: invitation.noteId,
          accessScope: "note-form",
        },
        {
          userId: userId,
          noteId: invitation.noteId,
          permission: permission,
          accessScope: "note-form",
          grantedBy: invitation.invitedBy,
        },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({
      message: `Invitation ${status} successfully.`,
      invitation,
    });
  } catch (error: any) {
    console.error("Respond to Invitation Error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error." });
  }
};

// 7. Get Workspace Access
export const getWorkspaceAccess = async (req: Request, res: Response): Promise<void> => {
  try {
    const { noteId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const access = await WorkspaceAccess.find({
      noteId: noteId,
    })
    .populate('userId', 'firstName lastName email')
    .populate('grantedBy', 'firstName lastName email');

    res.status(200).json({ access });
  } catch (error: any) {
    console.error("Get Workspace Access Error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error." });
  }
};

