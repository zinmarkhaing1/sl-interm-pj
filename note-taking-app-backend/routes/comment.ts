
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