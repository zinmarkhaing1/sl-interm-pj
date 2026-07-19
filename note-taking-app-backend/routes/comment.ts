// // backend/routes/commentRoutes.ts
// import express from 'express';
// import { 
//   getComments, 
//   addComment,
// //   deleteComment,
// //   deleteCommentsByUser
// } from '../controllers/comments/index';
// import { verifyToken } from '../middleware/auth';

// const router = express.Router();

// // ============ All routes require authentication ============

// // GET: Get all comments for a note
// // URL: /api/notes/:id/comments
// router.get('/:id/comments', verifyToken, getComments);

// // POST: Add a new comment to a note
// // URL: /api/notes/:id/comments
// router.post('/:id/comments', verifyToken, addComment);

// // DELETE: Delete a specific comment
// // URL: /api/comments/:commentId
// // router.delete('/comments/:commentId', verifyToken, deleteComment);

// // DELETE: Delete all comments by a user on a note
// // URL: /api/comments/delete-by-user?noteId=xxx&userEmail=xxx
// // router.delete('/comments/delete-by-user', verifyToken, deleteCommentsByUser);

// export default router;

// routes/commentRoutes.ts
// routes/commentRoutes.ts
import express from 'express';
import { 
  getComments, 
  addComment,
  deleteComment,
  // deleteCommentsByUser,
} from '../controllers/comments/index';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// GET: Get all comments for a note (private)
router.get('/:id',verifyToken, getComments);

// POST: Add a new comment
router.post('/:id',verifyToken, addComment);

// DELETE: Delete a specific comment
router.delete('/:commentId', verifyToken,deleteComment);

// DELETE: Delete all comments by a user (when removed from note)
// router.delete('/comments/delete-by-user', deleteCommentsByUser);

export default router;