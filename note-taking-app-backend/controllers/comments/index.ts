
// controllers/comment/index.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import Note from "../../models/Note";
import Comment from "../../models/Comment";
import WorkspaceAccess from "../../models/WorkspaceAccess";
import ShareInvitation from "../../models/ShareInvitation";
import Notification from "../../models/Notification";
import Auth from "../../models/Auth";


interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

// Helper: Generate conversation ID
const generateConversationId = (noteId: string, user1Id: string, user2Id: string) => {
  const ids = [user1Id, user2Id].sort();
  return `${noteId}_${ids.join('_')}`;
};

// Helper: Check note access
const checkNoteAccess = async (noteId: mongoose.Types.ObjectId, userId: string) => {
  const note = await Note.findById(noteId);
  if (!note) return { hasAccess: false, note: null, isOwner: false };

  const isOwner = note.user.toString() === userId;
  if (isOwner) return { hasAccess: true, note, isOwner: true };

  // Check if user has comment permission via WorkspaceAccess
  const sharedAccess = await WorkspaceAccess.findOne({
    userId: userId,
    noteId: note._id,
  });

  // Check if user has comment permission via ShareInvitation
  const invitation = await ShareInvitation.findOne({
    noteId: note._id,
    userId: userId,
    status: "accepted",
    role: { $in: ["commenter", "editor", "full"] }
  });

  const hasCommentPermission = 
    (sharedAccess && ["comment", "edit", "full"].includes(sharedAccess.permission)) ||
    (invitation && ["commenter", "editor", "full"].includes(invitation.role));

  if (hasCommentPermission) {
    return { hasAccess: true, note, isOwner: false, sharedAccess };
  }

  return { hasAccess: false, note: null, isOwner: false };
};

const createNotification = async ({
  fromUser,
  toUser,
  noteId,
  type,
  message,
}: {
  fromUser: string;
  toUser: string;
  noteId: mongoose.Types.ObjectId;
  type: "view" | "edit" | "comment" | "full";
  message: string;
}) => {
  if (fromUser === toUser) return;
  await Notification.create({
    fromUser,
    toUser,
    noteId,
    type : type as any,
    message,
  });
};

// ============================================================
// GET COMMENTS - Both owner and collaborator see ALL comments
// ============================================================
export const getComments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const noteId = req.params.id;
    const userId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(noteId as string)) {
      console.log("Invalid not ID");
      res.status(400).json({ message: "Invalid note id." });
      return;
    }

    if (!userId) {
      console.log("No user Id");
      
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

     // Check if user has access
    const note = await Note.findById(noteId);
    console.log("Note found:", note ? "YES" : "NO");

    if (!note) {
      console.log("Note not found");
      
      res.status(404).json({ message: "Note not found." });
      return;
    }

    const isOwner = note.user.toString() === userId;
    console.log("Is owner:" ,isOwner);
    
    
    
    if (isOwner) {
      const comments = await Comment.find({ noteId: note._id })
        .sort({ createdAt: 1 })
        .lean();
      res.status(200).json({ comments });
      return;
    }

    // const { hasAccess } = await checkNoteAccess(
    //   new mongoose.Types.ObjectId(noteId as string),
    //   userId
    // );
    if(!isOwner){
      const hasAccess = await WorkspaceAccess.findOne({
      userId : userId,
      noteId : note._id,
    })
    console.log(" Has Access:", hasAccess ? "YES" : "NO");
    if (!hasAccess ) {
      console.log(" No access");
      res.status(403).json({ message: "You do not have access to this note." });
      return;
    }
    }
    

    

    // Get ALL comments for this note - both owner and collaborators see everything
    const comments = await Comment.find({ noteId:new mongoose.Types.ObjectId(note._id) })
      .sort({ createdAt: 1 })
      .lean();
      console.log(`Found ${comments.length} comments for note ${noteId}`);
          comments.forEach(c => {
      console.log(`- ${c.userName}: ${c.text.substring(0, 30)}`);
    });



    res.status(200).json({success:true, comments:comments,count:comments.length });
  } catch (err: any) {
    console.error("Get Comments Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ============================================================
// ADD COMMENT - Both owner and collaborators can comment
// ============================================================
// export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const noteId = req.params.id;
//     const { text, userName,userEmail } = req.body;
//     const userId = req.user?.id;
//     const authEmail = req.user?.email;

//      console.log("💬 ADD COMMENT DEBUG");
//     console.log("📝 Note ID:", noteId);
//     console.log("👤 User ID from auth:", userId);
//     console.log("📧 User Email from auth:", authEmail);
//     console.log("📧 User Email from body:", userEmail);
//     console.log("📝 Text:", text);
//     console.log("📝 User Name:", userName);

   

//     if (!mongoose.Types.ObjectId.isValid(noteId as string)) {
//       res.status(400).json({ message: "Invalid note id." });
//       return;
//     }

//     if (!userId) {
//       res.status(401).json({ message: "Unauthorized" });
//       return;
//     }

//     if (!text || typeof text !== "string" || text.trim().length === 0) {
//       res.status(400).json({ message: "Comment text is required." });
//       return;
//     }

//     // Check if note exists
//     const note = await Note.findById(noteId);
//     if (!note) {
//       res.status(404).json({ message: "Note not found." });
//       return;
//     }

//     const isOwner = note.user.toString() === userId;
//     console.log('Is owner:',isOwner);
    

//     // Check permission if not owner
//     if (!isOwner) {
//       const hasAccess = await WorkspaceAccess.findOne({
//         userId: userId,
//         noteId: note._id,
//       });
//       console.log("WorkspaceAccess = ",hasAccess);
//        if (!hasAccess || !["comment", "edit", "full"].includes(hasAccess.permission)) {
//         res.status(403).json({ message: "You don't have permission to comment." });
//         return;
//       }
//     }

//     // const { hasAccess, note, isOwner } = await checkNoteAccess(
//     //   new mongoose.Types.ObjectId(noteId as string),
//     //   userId
//     // );

//     // if (!hasAccess || !note) {
//     //   res.status(403).json({ message: "You do not have access to this note." });
//     //   return;
//     // }

//     // Check comment permission
//     if (!isOwner) {
//       const sharedAccess = await WorkspaceAccess.findOne({
//         userId: userId,
//         noteId: note._id,
//       });

//       const invitation = await ShareInvitation.findOne({
//         noteId: note._id,
//         userId: userId,
//         status: "accepted",
//         role: { $in: ["commenter", "editor", "full"] }
//       });

      
//       console.log("Share Invitation", invitation ? "Yes" :"No");
//       console.log("SharedAccess =", sharedAccess);
// console.log("Invitation =", invitation);
// console.log(
//     "permission =",
//     sharedAccess?.permission
// );
// console.log(
//     "role =",
//     invitation?.role
// );

//       const hasCommentPermission = 
//         (sharedAccess && ["comment", "edit", "full"].includes(sharedAccess.permission)) ||
//         (invitation && ["commenter", "editor", "full"].includes(invitation.role));

//       if (!hasCommentPermission) {
//         res.status(403).json({ message: "You do not have permission to comment." });
//         return;
//       }
//     }

//     const authorName = userName || "Collaborator";
//     const finalUserEmail = userEmail || authEmail || `user_${userEmail}@example.com`;

//     // Generate conversation ID for thread
//     let conversationId: string | undefined;
//     const ownerId = note.user.toString();
    
//     // Always create conversation ID for the thread
//     if (isOwner && req.body.replyToUserId) {
//       // Owner replying to specific collaborator
//       conversationId = generateConversationId(noteId as string, userId, req.body.replyToUserId);
//     } else if (!isOwner) {
//       // Collaborator commenting - conversation with owner
//       conversationId = generateConversationId(noteId as string, userId, ownerId);
//     } else {
//       // Owner default comment
//       conversationId = generateConversationId(noteId as string, userId, ownerId);
//     }

//     const comment = await Comment.create({
//       noteId: note._id,
//       userId: userId,
//       userName: authorName ,
//       userEmail: finalUserEmail,
//       text: text.trim(),
//       isPrivate: false, // Make comments visible to everyone with access
//       conversationId: conversationId,
//     });

//     // Notify owner if collaborator commented
//     if (!isOwner) {
//       await createNotification({
//         fromUser: userId,
//         toUser: note.user.toString(),
//         noteId: note._id,
//         type: "comment",
//         message: `${authorName} commented on your note: "${note.title}"`,
//       });
//     }

//     console.log("Comment created:", comment._id);
//     res.status(201).json({ success:true,comment });
//   } catch (err: any) {
//     console.error("Add Comment Error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// controllers/comments/index.ts

// export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const noteId = req.params.id;
//     const { text, userName, userEmail } = req.body;
//     const userId = req.user?.id;

//     console.log(" ADD COMMENT DEBUG");
//     console.log(" Note ID:", noteId);
//     console.log(" User ID:", userId);

//     // Validate
//     if (!mongoose.Types.ObjectId.isValid(noteId  as string)) {
//       res.status(400).json({ message: "Invalid note id." });
//       return;
//     }

//     if (!userId) {
//       res.status(401).json({ message: "Unauthorized" });
//       return;
//     }

//     if (!text || text.trim().length === 0) {
//       res.status(400).json({ message: "Comment text is required." });
//       return;
//     }

//     // Find note
//     const note = await Note.findById(noteId);
//     if (!note) {
//       res.status(404).json({ message: "Note not found." });
//       return;
//     }

    

//     // Check if user is owner
//     const isOwner = note.user.toString() === userId;
//     console.log(" Is owner:", isOwner);

//     let hasPermission = false;


//     // If not owner, check collaboration
//     if (!isOwner) {
//       hasPermission = true;
//     }else{
//          // Check WorkspaceAccess
//       const workspaceAccess = await WorkspaceAccess.findOne({
//         userId: userId,
//         noteId: note._id,
//         permission : {$in : ["comment","edit","full"]}
//       });
//       console.log(" WorkspaceAccess:", workspaceAccess ? "YES" : "NO");
//       if (workspaceAccess) {
//         hasPermission = true;
//       }
//       if (!hasPermission) {
        
//         let invitation = await ShareInvitation.findOne({
//           noteId: note._id,
//           userId: userId,
//           status: "accepted",
//           role: { $in: ["commenter", "editor", "full"] }
//         });

//          if (!invitation && userEmail) {
//           invitation = await ShareInvitation.findOne({
//             noteId: note._id,
//             invitedEmail: userEmail.toLowerCase(),
//             status: "accepted",
//             role: { $in: ["commenter", "editor", "full"] }
//           });
//         }

//         console.log("📨 Invitation found:", invitation ? "YES" : "NO");
//         if (invitation) {
//           hasPermission = true;
//         }
//       }
//     }
//     if (!hasPermission) {
//       res.status(403).json({ 
//         message: "You don't have permission to comment on this note.",
//         debug: {
//           isOwner,
//           noteOwner: note.user.toString(),
//           currentUser: userId,
//           userEmail: userEmail
//         }
//       });
//       return;
//     }
    
   

//       // Check ShareInvitation
      

     

//     // if (!hasPermission) {
//     //   res.status(403).json({ 
//     //     message: "You don't have permission to comment on this note.",
//     //     debug: {
//     //       isOwner,
//     //       noteOwner: note.user.toString(),
//     //       currentUser: userId
//     //     }
//     //   });
//     //   return;
//     // }

//     // Get user info
//     let finalUserName = userName || "User";
//     let finalUserEmail = userEmail;

//     // Try to get from database if not provided
//     if (!finalUserEmail || !finalUserName) {
//       const user = await Auth.findById(userId);
//       if (user) {
//         if (!finalUserName) finalUserName = user.firstName  || "User";
//         if (!finalUserEmail) finalUserEmail = user.email;
//       }
//     }

//     // Fallback
//     if (!finalUserEmail) {
//       finalUserEmail = `user_${userId}@example.com`;
//     }

//     console.log("📧 Final email:", finalUserEmail);
//     console.log("👤 Final name:", finalUserName);

//     // Create comment
//     const comment = await Comment.create({
//       noteId: note._id,
//       userId: userId,
//       userName: finalUserName,
//       userEmail: finalUserEmail,
//       text: text.trim(),
//       isPrivate: false,
//       conversationId: generateConversationId(noteId as string, userId, note.user.toString()),
//     });

//     console.log(" Comment created:", comment._id);

//     // Notify owner if collaborator
//     if (!isOwner) {
//       await Notification.create({
//         fromUser: userId,
//         toUser: note.user,
//         noteId: note._id,
//         type: "comment",
//         message: `${finalUserName} commented on your note: "${note.title}"`,
//       }).catch(() => null);
//     }

//     res.status(201).json({ success: true, comment });
//   } catch (err: any) {
//     console.error(" Add Comment Error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// controllers/comment/index.ts

export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const noteId = req.params.id;
    const { text, userName, userEmail } = req.body;
    const userId = req.user?.id;

    console.log("===== ADD COMMENT DEBUG =====");
    console.log("📝 Note ID:", noteId);
    console.log("👤 User ID from token:", userId);
    console.log("📧 User Email from body:", userEmail);

    // Validate
    if (!mongoose.Types.ObjectId.isValid(noteId as string)) {
      res.status(400).json({ message: "Invalid note id." });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!text || text.trim().length === 0) {
      res.status(400).json({ message: "Comment text is required." });
      return;
    }

    // Find note
    const note = await Note.findById(noteId);
    if (!note) {
      res.status(404).json({ message: "Note not found." });
      return;
    }

    // ✅ FIXED: isOwner ကို မှန်မှန်စစ်
    const noteOwnerId = note.user.toString();
    const currentUserId = userId.toString();
    const isOwner = noteOwnerId === currentUserId;
    
    console.log("👑 Note Owner ID:", noteOwnerId);
    console.log("👤 Current User ID:", currentUserId);
    console.log("👑 Is owner:", isOwner);

    // ✅ FIXED: hasPermission ကို အပြင်မှာ သတ်မှတ်
    let hasPermission = isOwner;
    console.log("🔑 Initial hasPermission (isOwner):", hasPermission);

    // Owner မဟုတ်ရင် Collaborator စစ်
    if (!isOwner) {
      console.log("🔍 Checking collaboration permissions...");
      
      // Check WorkspaceAccess
      const workspaceAccess = await WorkspaceAccess.findOne({
        userId: userId,
        noteId: note._id,
        permission: { $in: ["comment", "edit", "full"] }
      });
      console.log("📋 WorkspaceAccess found:", workspaceAccess ? "YES" : "NO");
      
      if (workspaceAccess) {
        hasPermission = true;
        console.log("✅ Permission granted via WorkspaceAccess");
      }

      // Check ShareInvitation
      if (!hasPermission) {
        // Check by userId
        let invitation = await ShareInvitation.findOne({
          noteId: note._id,
          userId: userId,
          status: "accepted",
          role: { $in: ["commenter", "editor", "full"] }
        });

        // Check by email if not found
        if (!invitation && userEmail) {
          invitation = await ShareInvitation.findOne({
            noteId: note._id,
            invitedEmail: userEmail.toLowerCase(),
            status: "accepted",
            role: { $in: ["commenter", "editor", "full"] }
          });
        }

        console.log("📨 Invitation found:", invitation ? "YES" : "NO");
        
        if (invitation) {
          hasPermission = true;
          console.log("✅ Permission granted via ShareInvitation");
        }
      }
    }

    console.log("🔑 Final hasPermission:", hasPermission);
    console.log("================================");

    // ❌ ဒီမှာ permission ကို ပြန်စစ်
    if (!hasPermission) {
      res.status(403).json({ 
        message: "You don't have permission to comment on this note.",
        debug: {
          isOwner,
          noteOwner: noteOwnerId,
          currentUser: currentUserId,
          userEmail: userEmail
        }
      });
      return;
    }

    // Get user info
    let finalUserName = userName || "User";
    let finalUserEmail = userEmail;

    // Try to get from database if not provided
    if (!finalUserEmail || !finalUserName) {
      const user = await Auth.findById(userId);
      if (user) {
        if (!finalUserName) finalUserName = user.firstName || "User";
        if (!finalUserEmail) finalUserEmail = user.email;
      }
    }

    // Fallback
    if (!finalUserEmail) {
      finalUserEmail = `user_${userId}@example.com`;
    }

    console.log("📧 Final email:", finalUserEmail);
    console.log("👤 Final name:", finalUserName);

    // Create comment
    const comment = await Comment.create({
      noteId: note._id,
      userId: userId,
      userName: finalUserName,
      userEmail: finalUserEmail,
      text: text.trim(),
      isPrivate: false,
      conversationId: generateConversationId(noteId as string, userId, note.user.toString()),
    });

    console.log("✅ Comment created:", comment._id);

    // Notify owner if collaborator
    if (!isOwner) {
      await Notification.create({
        fromUser: userId,
        toUser: note.user,
        noteId: note._id,
        type: "comment",
        message: `${finalUserName} commented on your note: "${note.title}"`,
      }).catch(() => null);
    }

    res.status(201).json({ success: true, comment });
  } catch (err: any) {
    console.error(" Add Comment Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ============================================================
// DELETE COMMENT
// ============================================================
export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
     console.log("DELETE COMMENT - Request params:", req.params);
    console.log("DELETE COMMENT - User ID:", req.user?.id);
    const commentId = req.params.commentId;
     console.log("DELETE COMMENT - Comment ID:", commentId);
    const userId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(commentId as string)) {
      res.status(400).json({ message: "Invalid comment id." });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ message: "Comment not found." });
      return;
    }
    

    const isAuthor = comment.userId.toString() === userId;
    const note = await Note.findById(comment.noteId);
     if (!note) {
      res.status(404).json({ message: "Note not found." });
      return;
    }
    const isOwner = note && note.user.toString() === userId;

    if (!isAuthor && !isOwner) {
      res.status(403).json({ message: "You do not have permission to delete this comment." });
      return;
    }

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (err: any) {
    console.error("Delete Comment Error:", err);
    res.status(500).json({ message: err.message });
  }
};


// DELETE ALL COMMENTS BY USER (when removed from note)

export const deleteCommentsByUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {commentId} = req.params;
    const { noteId, userEmail } = req.query;
    const userId = req.user?.id;

     console.log("DELETE COMMENT - Comment ID:", commentId);
    console.log("DELETE COMMENT - User ID:", userId);

    // if (!mongoose.Types.ObjectId.isValid(commentId)) {
    //   res.status(400).json({ message: "Invalid comment id." });
    //   return;
    // }

    if (!noteId || !userEmail) {
      res.status(400).json({ message: "Note ID and user email are required." });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    // Find comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ message: "Comment not found." });
      return;
    }

    const note = await Note.findById(noteId);
    if (!note) {
      res.status(404).json({ message: "Note not found." });
      return;
    }

    const isOwner = note.user.toString() === userId;
    const isAuthor = comment.userId.toString() === userId;
    console.log("DELETE COMMENT - isOwner:", isOwner);
    console.log("DELETE COMMENT - isAuthor:", isAuthor);
    if (!isOwner && isAuthor) {
      res.status(403).json({ message: "Only the note owner can perform this action." });
      return;
    }

    const user = await mongoose.model('Auth').findOne({ email: userEmail });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const result = await Comment.deleteMany({
      noteId: note._id,
      userId: user._id,
    });

    res.status(200).json({
      message: `Deleted ${result.deletedCount} comments by ${userEmail}.`,
      deletedCount: result.deletedCount,
    });

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (err: any) {
    console.error("Delete User Comments Error:", err);
    res.status(500).json({ message: err.message });
  }
};

