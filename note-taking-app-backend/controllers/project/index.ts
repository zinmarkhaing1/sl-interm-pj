import { Request, Response } from 'express';
import Project, { IProject } from '../../models/Project';
import Auth from '../../models/Auth';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

const uniqueStrings = (values: string[]) =>
  Array.from(
    new Set(
      values
        .map((v) => v.trim().toLowerCase())
        .filter(Boolean),
    ),
  );

const getUserIdentifiers = async (req: AuthRequest): Promise<string[]> => {
  const userId = req.user?.id;
  if (!userId) return [];

  const identifiers = [userId];
  let email = req.user?.email?.toLowerCase().trim();

  if (!email) {
    const authUser = await Auth.findById(userId).select('email').lean();
    email = authUser?.email?.toLowerCase().trim();
  }

  if (email) {
    identifiers.push(email);
  }

  return identifiers;
};

const userHasAccess = (project: IProject | null | undefined, identifiers: string[]) => {
  if (!project || identifiers.length === 0) return false;
  const owners = (project.owners || []).map((v) => v.toLowerCase());
  const members = (project.members || []).map((v) => v.toLowerCase());
  return identifiers.some((id) => {
    const needle = id.toLowerCase();
    return owners.includes(needle) || members.includes(needle);
  });
};

const userIsOwner = (project: IProject | null | undefined, identifiers: string[]) => {
  if (!project || identifiers.length === 0) return false;
  const owners = (project.owners || []).map((v) => v.toLowerCase());
  return identifiers.some((id) => owners.includes(id.toLowerCase()));
};

// ===== Create a new project =====
export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, description, isPrivate, members, owners } = req.body;

    if (!name || name.trim().length < 3) {
      return res.status(400).json({
        error: 'Project name is required and must be at least 3 characters',
      });
    }

    const identifiers = await getUserIdentifiers(req);
    const ownerList = uniqueStrings([...(owners || []), userId, ...identifiers]);
    const memberList = uniqueStrings(members || []).filter(
      (m) => !ownerList.map((o) => o.toLowerCase()).includes(m.toLowerCase()),
    );

    const project = new Project({
      name: name.trim(),
      description: description?.trim() || '',
      isPrivate: isPrivate ?? true,
      members: memberList,
      owners: ownerList,
    });

    await project.save();
    res.status(201).json(project);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ===== Get projects the current user owns or is a member of =====
export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const identifiers = await getUserIdentifiers(req);
    if (identifiers.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const normalizedIds = identifiers.map((id) => id.toLowerCase());
    const projects = await Project.find({
      $or: [
        { owners: { $in: normalizedIds } },
        { members: { $in: normalizedIds } },
      ],
    }).sort({ createdAt: -1 });

    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Get a single project by ID =====
export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const identifiers = await getUserIdentifiers(req);
    if (identifiers.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!userHasAccess(project, identifiers)) {
      return res.status(403).json({ error: 'You do not have access to this project' });
    }

    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Update a project (owners only) =====
export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const identifiers = await getUserIdentifiers(req);
    if (identifiers.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!userIsOwner(project, identifiers)) {
      return res.status(403).json({ error: 'Only project owners can update this project' });
    }

    const { name, description, isPrivate, members, owners } = req.body;

    if (name !== undefined) {
      if (!name || name.trim().length < 3) {
        return res.status(400).json({
          error: 'Project name is required and must be at least 3 characters',
        });
      }
      project.name = name.trim();
    }
    if (description !== undefined) {
      project.description = description?.trim() || '';
    }
    if (isPrivate !== undefined) {
      project.isPrivate = Boolean(isPrivate);
    }

    // Always keep the current user as an owner so they cannot lock themselves out
    const nextOwners = uniqueStrings([...(owners ?? project.owners), ...identifiers]);
    const nextMembers = uniqueStrings(members ?? project.members).filter(
      (m) => !nextOwners.map((o) => o.toLowerCase()).includes(m.toLowerCase()),
    );

    project.owners = nextOwners;
    project.members = nextMembers;

    await project.save();
    res.json(project);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ===== Delete a project (owners only) =====
export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const identifiers = await getUserIdentifiers(req);
    if (identifiers.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!userIsOwner(project, identifiers)) {
      return res.status(403).json({ error: 'Only project owners can delete this project' });
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
