import { Request, Response } from 'express';
import Project from '../../models/Project';

// ===== Create a new project =====
export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, isPrivate, members, owners } = req.body;

    // Basic validation
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ error: 'Project name is required and must be at least 3 characters' });
    }

    const project = new Project({
      name: name.trim(),
      description: description?.trim() || '',
      isPrivate: isPrivate ?? false,
      members: members || [],
      owners: owners || [],
    });

    await project.save();
    res.status(201).json(project);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ===== Get all projects =====
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Get a single project by ID =====
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Update a project =====
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { name, description, isPrivate, members, owners } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, isPrivate, members, owners },
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ===== Delete a project =====
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};