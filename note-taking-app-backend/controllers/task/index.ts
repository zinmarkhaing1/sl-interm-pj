import { Request, Response } from 'express';
import Task from '../../models/Task';
import Project from '../../models/Project';

// =============================================
// 1. CREATE TASK
// =============================================
export const createTask = async (req: Request, res: Response) => {
  try {
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

    // --- Check if project exists ---
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

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
export const getTasks = async (req: Request, res: Response) => {
  try {
    const { projectId, status, assignee } = req.query;

    // Build filter object
    const filter: any = {};
    if (projectId) filter.project = projectId;
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
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id).populate('project');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// =============================================
// 4. UPDATE TASK
// =============================================
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, assignee, status, priority, startDate, dueDate } =
      req.body;

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
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Optional: Also delete all associated TaskNotes here if needed

    res.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};