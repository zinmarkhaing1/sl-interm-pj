import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/project';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Base path: /api/projects — all routes require auth
router.use(verifyToken);

router.post('/', createProject);          // POST  /api/projects
router.get('/', getProjects);             // GET   /api/projects
router.get('/:id', getProjectById);       // GET   /api/projects/:id
router.put('/:id', updateProject);        // PUT   /api/projects/:id
router.delete('/:id', deleteProject);     // DELETE /api/projects/:id

export default router;
