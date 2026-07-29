


import express from "express";
import mongoose from "mongoose";
import type { Request, Response } from "express";
import { verifyToken } from "../middleware/auth";
import ShareInvitation from "../models/ShareInvitation";
import Notification from "../models/Notification";
import Auth from "../models/Auth";
import Comment from "../models/Comment";
import Note from "../models/Note";
import WorkspaceAccess from "../models/WorkspaceAccess";
import PageAccess from "../models/PageAccess";
import { PageAccessResponse,PageAccessPopulatedResponse } from "../models/PageAccess";

// Nodemailer setup
let nodemailer: any = null;
try {
  nodemailer = require('nodemailer');
} catch (err) {
  nodemailer = null;
}

interface AuthRequest extends Request {
  user?: { id: string };
}

interface ShareRequestBody {
  emails?: string[];
  invitedEmail?: string;
  email?: string;
  pageUrl?: string;
  source?: string;
  role?: "editor" | "viewer" | "commenter" | "full";
  noteId?: string;
  pageType?:"category" | "board";
  pageName?:string;
}

const router = express.Router();

// --- HELPER FUNCTIONS ---

const extractNoteId = (url?: string): string | null => {
  if (!url) return null;
  const match = url.match(/note-form\/(?:detail|edit)\/([a-zA-Z0-9_-]{1,100})/);
  return match ? match[1] : null;
};

const getAccessScope = (pageUrl?: string, source?: string): "category"| "board" | "note" |"note-form" | "global" => {
  if (source === "category_page" || /\/category(?:[/?#]|$)/.test(pageUrl || "")) {
    return "category" as const;
  }
  if (source === "note_page" || /\/note(?:[/?#]|$)/.test(pageUrl || "")) {
    return "note" as const;
  } 
  if (source === "board_page" || /\/board(?:[/?#]|$)/.test(pageUrl || "")) {
    return "board" as const;
  }
  if (source === "note_form_page" || /\/note-form(?:[/?#]|$)/.test(pageUrl || "")) {
    return "note-form" as const;
  }
  return "global" as const;
};

const extractPageName = (url?: string, pageType?: string): string | null => {
  if (!url) return null;
  
  if (pageType === "category") {
    const match = url.match(/\/category\/([^\/?#]+)/);
    if (match) {
      // return decodeURIComponent(match[1]);
      const decoded = decodeURIComponent(match[1]);
      console.log('Extracted category name:', decoded);
      return decoded
    }
  } else if (pageType === "board") {
    const match = url.match(/\/board\/([^\/?#]+)/);
    if (match) {
     const decoded = decodeURIComponent(match[1]);
      console.log('Extracted board name:', decoded);
      return decoded
    }
  }

   const categoryMatch = url.match(/\/category\/([^\/?#]+)/);
  if (categoryMatch) {
   const decoded = decodeURIComponent(categoryMatch[1]);
    console.log(' Auto-detected category name:', decoded);
    return decoded;
  }
  
  const boardMatch = url.match(/\/board\/([^\/?#]+)/);
  if (boardMatch) {
    // return decodeURIComponent(boardMatch[1]);
    const decoded = decodeURIComponent(boardMatch[1]);
    console.log(' Auto-detected board name:', decoded);
    return decoded;
  }

  console.log('Could not extract page name from URL');
  return null;
};

///grantworkspaceaccess

const grantWorkspaceAccess = async ({
  userId,
  inviterId,
  pageNoteId,
  role,
  accessScope
}: {
  userId: string;
  inviterId: string;
  pageNoteId: string | null;
  role: "editor" | "viewer" | "commenter" | "full";
  accessScope:  "note" | "note-form" | "global";
}) => {
  console.log("GRANT WORKSPACE ACCESS:", {
    userId,
    inviterId,
    pageNoteId,
    role,
    accessScope
  });

  const permission =
    role === "editor" ? "edit" :
    role === "commenter" ? "comment" :
    role === "full" ? "full" : "view";


  // For specific note access
  if (pageNoteId) {
    const note = await Note.findOne({
      _id: pageNoteId,
      user: inviterId
    }).select("_id");

    if (note) {
      await WorkspaceAccess.findOneAndUpdate(
        {
          userId,
          noteId: note._id,
          accessScope: accessScope || "global",
        },
        {
          userId,
          noteId: note._id,
          permission,
          accessScope: accessScope || "global",
          grantedBy: inviterId,
        },
        {
          upsert: true,
          new: true,
        }
      );
      return [note._id];
    }
  }

  // For global access (if needed)
  if (accessScope === "global") {
    const notes = await Note.find({ user: inviterId }).select("_id");
    for (const note of notes) {
      await WorkspaceAccess.findOneAndUpdate(
        {
          userId,
          noteId: note._id,
          accessScope: "global",
        },
        {
          userId,
          noteId: note._id,
          permission,
          accessScope: "global",
          grantedBy: inviterId,
        },
        {
          upsert: true,
          new: true,
        }
      );
    }
    return notes.map((n) => n._id);
  }

  return [];
};

//grantpageaccess
const grantPageAccess = async ({
  userId,
  ownerId,
  pageType,
  pageUrl,

}: {
  userId: string;
  ownerId: string;
  pageType: "category" | "board" ;
  pageUrl: string;
  
}) => {
  console.log(" GRANT PAGE ACCESS:", {
    userId,
    ownerId,
    pageType,
    pageUrl,

  });


  const permission = "view"

  // Create page access with pageName
  await PageAccess.findOneAndUpdate(
    {
      userId,
      ownerId,
      pageType,

    },
    {
      userId,
      ownerId,
      pageType,
      pageUrl,

      permission
    },
    {
      upsert: true,
      new: true
    }
  );

  console.log(` PageAccess created for ${pageType}: ${ pageUrl}`);
};

const sendInviteEmail = async (email: string, role: string, shareLink: string) => {
  try {
    const smtpUrl = process.env.SMTP_URL;
    if (nodemailer && smtpUrl) {
      const transporter = nodemailer.createTransport(smtpUrl, {
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@example.com',
        to: email,
        subject: `You've been invited to collaborate`,
        text: `You were invited by a user to collaborate with role ${role}. Open: ${shareLink}`,
      });
    }
  } catch (err) {
    console.log('Email send error:', err);
  }
};

// --- ROUTES ---

// 1. MULTIPLE INVITATIONS
router.post("/multiple", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { emails = [], pageUrl, source, role = "editor" } = req.body as ShareRequestBody;
    const inviterId = req.user?.id;

    if (!inviterId) {
      res.status(401).json({ message: "You must be signed in to invite collaborators." });
      return;
    }

    const normalizedEmails = Array.isArray(emails)
      ? emails.map((e) => e.trim().toLowerCase()).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
      : [];

    if (normalizedEmails.length === 0) {
      res.status(400).json({ message: "Please provide at least one valid email address." });
      return;
    }

    const shareLink = pageUrl || `${req.protocol}://${req.get("host")}/`;
    const accessScope = getAccessScope(shareLink, source);
    const pageNoteId = extractNoteId(shareLink);
    const pageNoteObjectId = pageNoteId && mongoose.Types.ObjectId.isValid(pageNoteId) 
      ? new mongoose.Types.ObjectId(pageNoteId) 
      : null;

    const createdInvitations = [];

    for (const email of normalizedEmails) {
      const existingUser = await Auth.findOne({ email });
      const status = existingUser ? "accepted" : "pending";
      
      const invitationSource = accessScope === "category" ? "category_page" : 
                              accessScope === "note" ? "note_page" : 
                              accessScope === "board" ? "board_page" :
                              accessScope === "note-form" ? "note_form_page" : "default";
      
      const invitation = await ShareInvitation.create({
        invitedBy: inviterId,
        invitedEmail: email,
        role,
        status,
        pageUrl: shareLink,
        source: invitationSource,
        noteId: pageNoteObjectId || undefined,
        userId: existingUser?._id,
      });

      if (existingUser) {
        const pageNameExtracted = extractPageName(shareLink, accessScope === "category" ? "category" : 
                                                       accessScope === "board" ? "board" : undefined);
        
        if (accessScope === "category" || accessScope === "board") {
          await grantPageAccess({
            userId: existingUser._id.toString(),
            ownerId: inviterId,
            pageType: accessScope,
            pageUrl: shareLink,
      
          });
           console.log("PageAccess updated");
        }
if (accessScope === "note" || accessScope==="note-form"){
  await grantWorkspaceAccess({
          userId: existingUser._id.toString(),
          inviterId,
          pageNoteId,
          role,
          accessScope
        });

}
        

        await Notification.create({
          fromUser: inviterId,
          toUser: existingUser._id,
          type: "invite",
          message: `You were invited to collaborate (role: ${role}) by the user.`,
        }).catch(() => null);
      }

      createdInvitations.push({
        id: invitation._id.toString(),
        email: invitation.invitedEmail,
        status: invitation.status,
        role: invitation.role,
        pageUrl: invitation.pageUrl || shareLink,
      });

      sendInviteEmail(email, role, shareLink);
    }

    res.status(200).json({
      message: "Invitations processed successfully.",
      shareLink,
      invitations: createdInvitations,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process invite";
    res.status(500).json({ message });
  }
});


router.post("/invite", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { invitedEmail, email, pageUrl, role = "viewer", source, noteId ,pageType,pageName} = req.body as ShareRequestBody;
    const targetEmail = String(invitedEmail || email || "").trim().toLowerCase();
    const inviterId = req.user?.id;

    console.log('INVITE DEBUG:');
    console.log('Target Email:', targetEmail);
    console.log('Page URL:', pageUrl);
    console.log('Source:', source);
    console.log('Role:', role);
     console.log("Page Type:", pageType);
    console.log("Page Name:", pageName);

    if (!inviterId) {
      res.status(401).json({ message: "You must be signed in to invite collaborators." });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
      res.status(400).json({ message: "Please provide a valid email address." });
      return;
    }

    const shareLink = pageUrl || `${req.protocol}://${req.get("host")}/`;
    const accessScope = getAccessScope(shareLink, source);
    console.log("Access Scope:", accessScope);



    // Check for existing invitation
    // const existingInvitation = await ShareInvitation.findOne({
    //   invitedBy: inviterId,
    //   invitedEmail: targetEmail,
    //   pageType : pageType,
    //   pageName:pageName,
    //   pageUrl: shareLink,
    //   status: { $in: ["pending", "accepted"] },
    // });

    let existingInvitation = null;
    if (pageType === "category" || pageType === "board") {
      existingInvitation = await ShareInvitation.findOne({
        invitedBy: inviterId,
        invitedEmail: targetEmail,
        pageType: pageType,
        pageName: pageName,
        status: { $in: ["pending", "accepted"] },
      });
      } else {
      existingInvitation = await ShareInvitation.findOne({
        invitedBy: inviterId,
        invitedEmail: targetEmail,
        pageUrl: shareLink,
        status: { $in: ["pending", "accepted"] },
      });
    }

    if (existingInvitation) {
      res.status(400).json({ message: "This email has already been invited to this page." });
      return;
    }

    const existingUser = await Auth.findOne({ email: targetEmail });
    console.log('Existing user found:', existingUser ? "Yes" : "No");
    const pageNoteId = noteId || extractNoteId(shareLink);
    const pageNoteObjectId = pageNoteId && mongoose.Types.ObjectId.isValid(pageNoteId) 
      ? new mongoose.Types.ObjectId(pageNoteId) 
      : undefined;

    const invitationSource = accessScope === "category" ? "category_page" : 
                            accessScope === "note" ? "note_page" : 
                            accessScope === "board" ? "board_page" :
                            accessScope === "note-form" ? "note_form_page" : "default";


    let finalPageType: "category" | "board" | undefined = pageType;
    let finalPageName: string | undefined = pageName || undefined;

    if (accessScope === "board") {
      finalPageType = "board";
       if (!finalPageName || finalPageName === "all") {
        finalPageName = "all";
      }
    }

    if (accessScope === "category") {
      finalPageType = "category";
      // if (!finalPageName) {
      //   const extracted = extractPageName(shareLink, "category");
      //   finalPageName = extracted || undefined;
      // }
       if (!finalPageName || finalPageName === "all") {
        finalPageName = "all";
      }
    }

    // if (accessScope === "category" || accessScope === "board") {
    //   finalPageType = accessScope;
    //   if (!finalPageName) {
    //     const extracted = extractPageName(shareLink, accessScope);
    //     finalPageName = extracted || undefined;
    //   }
    // }                        
    const invitation = await ShareInvitation.create({
      invitedBy: inviterId,
      invitedEmail: targetEmail,
      role,
      status: existingUser ? "accepted" : "pending",
      pageUrl: shareLink,
      source: invitationSource,
      noteId: pageNoteObjectId,
      userId: existingUser?._id,
      pageType: finalPageType,
      pageName: finalPageName,
    });

    console.log(' Invitation created:', invitation._id);

    if (existingUser) {
      if (accessScope === "board") {
        await grantPageAccess({
          userId: existingUser._id.toString(),
          ownerId: inviterId,
          pageType: "board",
          pageUrl: shareLink,
        });
        console.log(` PageAccess granted for board`);
      }

       if (accessScope === "category") {
        let pageNameToUse = finalPageName;
        if (!pageNameToUse) {
          const match = shareLink.match(/\/category\/([^\/?#]+)/);
          if (match) {
            pageNameToUse = decodeURIComponent(match[1]);
          }
        }
   

      //  if (accessScope === "category" || accessScope === "board") {
    
        // if (!pageNameToUse) {
        //   const match = shareLink.match(/\/category\/([^\/?#]+)/);
        //   if (match) {
        //     pageNameToUse = decodeURIComponent(match[1]);
        //   }
        // }
        // console.log("Extracted page name:", pageNameToUse);

      //    if (pageNameToUse) {
      //     await grantPageAccess({
      //       userId: existingUser._id.toString(),
      //       ownerId: inviterId,
      //       pageType: accessScope,
      //       pageUrl: shareLink,
      //       pageName: pageNameToUse,
      //     });
      //     console.log(`PageAccess granted for ${accessScope}: ${pageNameToUse || shareLink}`);
      //   } else {
      //     console.log("Could not extract page name from URL:", shareLink);
      //   }
      // }

      if (accessScope === "category") {
  await grantPageAccess({
    userId: existingUser._id.toString(),
    ownerId: inviterId,
    pageType: "category",
    pageUrl: shareLink,
    
  });
  console.log(`PageAccess granted for category`);
  }
}

      if (accessScope === "note" || accessScope === "note-form"){
        await grantWorkspaceAccess({
        userId: existingUser._id.toString(),
        inviterId,
        pageNoteId: pageNoteId || null,
        role,
        accessScope
      });
      console.log(`WorkspaceAccess granted for ${accessScope}`);
      }

        if (accessScope === "global") {
        await grantWorkspaceAccess({
          userId: existingUser._id.toString(),
          inviterId,
          pageNoteId: null,
          role,
          accessScope: "global"
        });
        console.log(` WorkspaceAccess granted for global`);
      }
   
      

      // Create notification
      await Notification.create({
        fromUser: inviterId,
        toUser: existingUser._id,
        type: "invite",
        message: `You were invited to ${accessScope} page (role: ${role}) by the user.`,
      }).catch(() => null);
    }

    sendInviteEmail(targetEmail, role, shareLink);

    res.status(201).json({
      message: "Collaborator invited successfully.",
      collaborator: invitation,
    });
  } catch (error) {
    console.error(' Invite error:', error);
    const message = error instanceof Error ? error.message : "Unable to process invite";
    res.status(500).json({ message });
  }
});



// FIXED: GET COLLABORATORS

router.get("/collaborators", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    const { noteId, pageUrl, source ,pageType} = req.query;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const currentUser = await Auth.findById(currentUserId).select("email");

    const filter: any = {
      status: { $in: ["pending", "accepted"] },
      $or: [
        { invitedBy: currentUserId },
        { userId: currentUserId },
        { invitedEmail: currentUser?.email?.toLowerCase() }
      ]
    };

    if (noteId && mongoose.Types.ObjectId.isValid(noteId as string)) {
      filter.noteId = new mongoose.Types.ObjectId(noteId as string);
    }

   

    

    
    // Get page access for category/board
    let pageAccess = null;
    // if (pageUrl && (source === "category_page" || source === "board_page")) {
      // const pageType = source === "category_page" ? "category" : "board";
      // const pageName = extractPageName(pageUrl as string, pageType);
    //   if (pageType && (pageType === "category" || pageType === "board")) {
    //   filter.pageType = pageType;

    //    if (pageName) {
    //     filter.pageName = pageName;
    //   }
    // } else {

    if (pageType === "category") {
      filter.pageType = "category";
      if (pageName) filter.pageName = pageName;
    }else if (pageType === "board") {
      filter.pageType = "board";
      if (pageName) filter.pageName = pageName;
    } else {
     
      // if (noteId && mongoose.Types.ObjectId.isValid(noteId as string)) {
      //   filter.noteId = new mongoose.Types.ObjectId(noteId as string);
      // }

       if (noteId) filter.noteId = noteId;
      
    
  

     if (pageUrl) {
      filter.pageUrl = pageUrl;
    }

    if (source) {
      filter.source = source;
    }
  }

    const collaborators = await ShareInvitation.find(filter)
      .populate("userId", "name email firstName lastName")
      .lean();

      console.log(` Found ${collaborators.length} collaborators`);



    res.json({
      collaborators,
      pageAccess: pageAccess || null
    });
  } catch (error) {
    console.error(' Error loading collaborators:', error);
    res.status(500).json({ message: "Unable to load collaborators" });
  }

});

// GET INVITATIONS

router.get("/invitations", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      res.status(401).json({ message: "You must be signed in to view invitations." });
      return;
    }

    const currentUser = await Auth.findById(currentUserId).select("email");
    const invitations = await ShareInvitation.find({
      $or: [
        { invitedEmail: currentUser?.email?.toLowerCase() },
        { userId: currentUserId },
      ],
      status: { $in: ["pending", "accepted"] },
    }).sort({ createdAt: -1 }).lean();

    res.status(200).json({ invitations });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load invitations";
    res.status(500).json({ message });
  }
});


// UPDATE ROLE

router.put("/:id/role", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body as ShareRequestBody;
    const inviterId = req.user?.id;

    if (!inviterId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!role || !["editor", "viewer", "commenter", "full"].includes(role)) {
      res.status(400).json({ message: "Please provide a valid role." });
      return;
    }

    const invitation = await ShareInvitation.findOne({
      _id: req.params.id,
      invitedBy: inviterId,
    });

    if (!invitation) {
      res.status(404).json({ message: "Invitation not found." });
      return;
    }

    invitation.role = role;
    await invitation.save();

    if (invitation.userId) {
      const pageNoteId = extractNoteId(invitation.pageUrl);
      const accessScope = getAccessScope(invitation.pageUrl, invitation.source);

 if (accessScope === "category" || accessScope === "board") {
        const pageName = extractPageName(invitation.pageUrl, accessScope);
        await grantPageAccess({
          userId: invitation.userId.toString(),
          ownerId: inviterId,
          pageType: accessScope,
          pageUrl: invitation.pageUrl,
        
        });
        console.log(` PageAccess updated for ${accessScope}`);
      } else if (accessScope === "note" || accessScope === "note-form") {
        await grantWorkspaceAccess({
          userId: invitation.userId.toString(),
          inviterId,
          pageNoteId: pageNoteId || null,
          role,
          accessScope
        });
        console.log(` WorkspaceAccess updated for ${accessScope}`);
      } else if (accessScope === "global") {
        await grantWorkspaceAccess({
          userId: invitation.userId.toString(),
          inviterId,
          pageNoteId: null,
          role,
          accessScope: "global"
        });
        console.log(` WorkspaceAccess updated for global`);
      }
    }

    res.status(200).json({ message: "Permission updated.", collaborator: invitation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update permission";
    res.status(500).json({ message });
  }
});





// DEBUG: GET USER PAGE ACCESS AND NOTES

router.get("/debug/user-data", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log('🔍 Debug User Data:');
    console.log('User ID:', userId);

    // 1. Get PageAccess
    const pageAccesses = await PageAccess.find({
      userId: userId
    }).lean();
    console.log('📄 PageAccess:', pageAccesses);

    // 2. Get category names from page access
    const categoryNames = pageAccesses
      .filter(pa => pa.pageType === "category" || pa.pageType === "board")
      .map(pa => pa.pageName);
    console.log('📂 Category names:', categoryNames);

    // 3. Get notes from categories
    let categoryNotes: any[] = [];
    if (categoryNames.length > 0) {
      categoryNotes = await Note.find({
        category: { $in: categoryNames }
      }).lean();
    }
    console.log('📚 Category notes:', categoryNotes.length);



    // 4. Get all notes
    const allNotes = await Note.find({}).lean();
    console.log('📚 All notes:', allNotes.length);

    res.json({
      userId,
      pageAccesses,
      categoryNames,
      categoryNotes,
      categoryNotesCount: categoryNotes.length,
      allNotesCount: allNotes.length,
      allNotes: allNotes.slice(0, 10) // First 10 notes
    });
  } catch (error) {
    console.error(' Debug error:', error);
    res.status(500).json({ message: "Debug error" });
  }
});

// controllers/share/index.ts - Add debug route
router.get("/debug/invitations", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const invitations = await ShareInvitation.find({
      $or: [
        { invitedBy: userId },
        { userId: userId }
      ]
    }).lean();
    
    res.json({
      count: invitations.length,
      invitations: invitations.map(inv => ({
        _id: inv._id,
        invitedEmail: inv.invitedEmail,
        pageType: inv.pageType,
        pageName: inv.pageName,
        source: inv.source,
        status: inv.status
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});


// DELETE COLLABORATOR

router.delete("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const inviterId = req.user?.id;
    const invitation = await ShareInvitation.findOne({
      _id: req.params.id,
      invitedBy: inviterId,
    });

    if (!invitation) {
      res.status(404).json({ message: "Invitation not found." });
      return;
    }

    if (invitation.userId && inviterId) {
      const pageNoteId = extractNoteId(invitation.pageUrl);
      const accessScope = getAccessScope(invitation.pageUrl, invitation.source);
      

      if (accessScope === "category" || accessScope === "board") {
        const pageName = extractPageName(invitation.pageUrl, accessScope);
        await PageAccess.deleteMany({
          userId: invitation.userId,
          ownerId: inviterId,
          pageType: accessScope,
          pageName: pageName || undefined
        });
        console.log(`✅ PageAccess deleted for ${accessScope}`);
      } else if (accessScope === "note" || accessScope === "note-form" || accessScope === "global") {
        const userNotes = pageNoteId
          ? await Note.find({ _id: pageNoteId, user: inviterId }).select("_id")
          : await Note.find({ user: inviterId }).select("_id");
        const noteIds = userNotes.map((note) => note._id);

        await WorkspaceAccess.deleteMany({
          userId: invitation.userId,
          noteId: { $in: noteIds },
          accessScope: accessScope === "global" ? "global" : accessScope
        });
        console.log(` WorkspaceAccess deleted for ${accessScope}`);
      }
    }

    

      await invitation.deleteOne();
    res.status(200).json({ message: "Collaborator removed." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to remove collaborator";
    res.status(500).json({ message });
  }
});
    
    
   

// ============================================================
// DEBUG: GET PAGE ACCESS
// ============================================================
router.get("/debug/page-access", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { pageType, pageName } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const query: any = { userId: userId };
    if (pageType) query.pageType = pageType;
    if (pageName) query.pageName = pageName;

    const pageAccesses = await PageAccess.find(query)
      .populate('ownerId', 'firstName lastName email')
      .lean();

    res.json({
      count: pageAccesses.length,
      pageAccesses: pageAccesses
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ message: "Debug error" });
  }
});

// controllers/share/index.ts - Add debug route
router.get("/debug/page-access-for-user", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const pageAccesses = await PageAccess.find({
      userId: userId
    }).lean();
    
    res.json({
      count: pageAccesses.length,
      pageAccesses: pageAccesses.map(pa => ({
        _id: pa._id,
        pageType: pa.pageType,
        pageName: pa.pageName,
        permission: pa.permission
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});





router.get("/debug/page-access-all", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    // Get all PageAccess records regardless
    const allPageAccess = await PageAccess.find({})
      .populate('userId', 'firstName lastName email')
      .populate('ownerId', 'firstName lastName email')
      .lean();
    
    // Define type for userPageAccess
    let userPageAccess: any[] = []; // or use proper type
    if (userId) {
      userPageAccess = await PageAccess.find({ userId: userId })
        .populate('ownerId', 'firstName lastName email')
        .lean();
    }
    
    res.json({
      currentUserId: userId,
      userPageAccess: userPageAccess,
      allPageAccess: allPageAccess,
      stats: {
        userPageAccessCount: userPageAccess.length,
        totalPageAccessCount: allPageAccess.length
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ message: "Debug error" });
  }
});

router.get("/debug/workspace-access", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const workspaceAccess = await WorkspaceAccess.find({ userId: userId })
      .populate('noteId', 'title category')
      .lean();
res.json({
      count: workspaceAccess.length,
      workspaceAccess: workspaceAccess
    });
  } catch (error) {
    console.error(' Debug error:', error);
    res.status(500).json({ message: "Debug error" });
  }
});

export default router;

// import express from "express";
// import { 
//   inviteCollaborator, 
//   getCollaborators, 
//   updateCollaboratorRole, 
//   removeCollaborator,
//   getInvitations,
//   respondToInvitation,
//   getWorkspaceAccess
// } from "../controllers/share/index";
// import { verifyToken } from "../middleware/auth";

// const router = express.Router();

// // All share routes require authentication
// router.use(verifyToken);

// // Share routes
// router.post("/invite", inviteCollaborator);
// router.get("/collaborators", getCollaborators);
// router.put("/:id/role", updateCollaboratorRole);
// router.delete("/:id", removeCollaborator);
// router.get("/invitations", getInvitations);
// router.put("/invitations/:id/respond", respondToInvitation);
// router.get("/workspace/:noteId", getWorkspaceAccess);

// export default router;
