import { Request, Response } from 'express';
import Task from '../../models/Task';
import Project, { IProject } from '../../models/Project';
import {
  getUserIdentifiers,
  userHasAccess,
} from '../project';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

const getAccessibleProjectIds = async (identifiers: string[]) => {
  const normalizedIds = identifiers.map((id) => id.toLowerCase());
  const projects = await Project.find({
    $or: [
      { owners: { $in: normalizedIds } },
      { members: { $in: normalizedIds } },
    ],
  }).select('_id');

  return projects.map((p) => p._id);
};

const assertProjectAccess = (
  project: IProject | null | undefined,
  identifiers: string[],
  res: Response,
) => {
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return false;
  }
  if (!userHasAccess(project, identifiers)) {
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }
  return true;
};

// =============================================
// 1. CREATE TASK
// =============================================
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const identifiers = await getUserIdentifiers(req);
    if (identifiers.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      title,
      description,
      projectId,
      assignee,
      status,
      priority,
      startDate,
      dueDate,
    } = req.body;

    // --- Validation ---
    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        error: 'Task title is required and must be at least 3 characters',
      });
    }

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    // --- Check if project exists and user has access ---
    const project = await Project.findById(projectId);
    if (!assertProjectAccess(project, identifiers, res)) return;

    // --- Create Task ---
    const task = new Task({
      title: title.trim(),
      description: description?.trim() || '',
      project: projectId,
      assignee: assignee?.trim() || 'Unassigned',
      status: status || 'Todo',
      priority: priority || 'Medium',
      startDate: startDate || undefined,
      dueDate: dueDate || undefined,
    });

    await task.save();
    await task.populate('project');

    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// =============================================
// 2. GET ALL TASKS (with filters)
// =============================================
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const identifiers = await getUserIdentifiers(req);
    if (identifiers.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { projectId, status, assignee } = req.query;
    const accessibleIds = await getAccessibleProjectIds(identifiers);

    if (accessibleIds.length === 0) {
      return res.json([]);
    }

    const filter: any = {
      project: { $in: accessibleIds },
    };

    if (projectId) {
      const requestedId = String(projectId);
      const allowed = accessibleIds.some(
        (id) => String(id) === requestedId,
      );
      if (!allowed) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      filter.project = requestedId;
    }

    if (status) filter.status = status;
    if (assignee) filter.assignee = assignee;

    const tasks = await Task.find(filter)
      .populate('project')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// =============================================
// 3. GET TASK BY ID
// =============================================
export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const identifiers = await getUserIdentifiers(req);
    if (identifiers.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const task = await Task.findById(id).populate('project');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const project =
      task.project && typeof task.project === 'object' && '_id' in task.project
        ? (task.project as unknown as IProject)
        : await Project.findById(task.project);

    if (!assertProjectAccess(project, identifiers, res)) return;

    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// =============================================
// 4. UPDATE TASK
// =============================================
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const identifiers = await getUserIdentifiers(req);
    if (identifiers.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { title, description, assignee, status, priority, startDate, dueDate } =
      req.body;

    const existing = await Task.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const project = await Project.findById(existing.project);
    if (!assertProjectAccess(project, identifiers, res)) return;

    const task = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        assignee,
        status,
        priority,
        startDate,
        dueDate,
      },
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validations
      }
    ).populate('project');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// =============================================
// 5. DELETE TASK
// =============================================
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const identifiers = await getUserIdentifiers(req);
    if (identifiers.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const existing = await Task.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const project = await Project.findById(existing.project);
    if (!assertProjectAccess(project, identifiers, res)) return;

    await Task.findByIdAndDelete(id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
