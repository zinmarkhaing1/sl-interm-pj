import mongoose from 'mongoose';
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

export const getUserIdentifiers = async (req: AuthRequest): Promise<string[]> => {
  const userId = req.user?.id;
  if (!userId) return [];

  const identifiers = [userId, userId.toLowerCase()];
  console.log("Identifiers:", identifiers);

  let email = req.user?.email?.toLowerCase().trim();

  if (!email) {
    const authUser = await Auth.findById(userId).select('email').lean();
    email = authUser?.email?.toLowerCase().trim();
  }

  if (email) {
    identifiers.push(email);
  }

  return Array.from(new Set(identifiers));
};

export const userHasAccess = (project: IProject | null | undefined, identifiers: string[]) => {
  if (!project || identifiers.length === 0) return false;
  const owners = (project.owners || []).map((v) => v.toLowerCase());
  const members = (project.members || []).map((v) => v.toLowerCase());
  return identifiers.some((id) => {
    const needle = id.toLowerCase();
    return owners.includes(needle) || members.includes(needle);
  });
};

/** Private → owner/member only. Public → any authenticated user. */
const canViewProject = (
  project: IProject | null | undefined,
  identifiers: string[],
) => {
  if (!project || identifiers.length === 0) return false;
  if (userHasAccess(project, identifiers)) return true;
  return project.isPrivate === false;
};

const userIsOwner = (project: IProject | null | undefined, identifiers: string[]) => {
  if (!project || identifiers.length === 0) return false;
  const owners = (project.owners || []).map((v) => v.toLowerCase());
  return identifiers.some((id) => owners.includes(id.toLowerCase()));
};

const resolveEmail = async (value: string | undefined): Promise<string | null> => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }

  if (mongoose.Types.ObjectId.isValid(trimmed)) {
    const user = await Auth.findById(trimmed).select('email').lean();
    return user?.email?.toLowerCase() || null;
  }

  return trimmed.toLowerCase();
};

const enrichProject = async (
  project: IProject | Record<string, any>,
  identifiers: string[] = [],
) => {
  const plain =
    typeof (project as any).toObject === 'function'
      ? (project as any).toObject()
      : { ...project };

  const ownerId = plain.owners?.[0];
  const ownerEmail = (await resolveEmail(ownerId)) || ownerId || null;

  return {
    ...plain,
    owners: ownerId ? [ownerId] : [],
    ownerEmail,
    isOwner: userIsOwner(plain as IProject, identifiers),
    isMember: userHasAccess(plain as IProject, identifiers),
  };
};

// ===== Create a new project =====
// export const createProject = async (req: AuthRequest, res: Response) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const { name, description, isPrivate, members } = req.body;

//     if (!name || name.trim().length < 3) {
//       return res.status(400).json({
//         error: 'Project name is required and must be at least 3 characters',
//       });
//     }

//     // Exactly one owner: the authenticated creator (stored as user id)
//     const ownerId = userId.toLowerCase();
//     // const ownerId = userId;
//     const memberList = uniqueStrings(members || []).filter((m) => m !== ownerId);

//     const project = new Project({
//       name: name.trim(),
//       description: description?.trim() || '',
//       isPrivate: isPrivate ?? true,
//       members: memberList,
//       owners: [ownerId],
//     });

//     await project.save();
//     const identifiers = await getUserIdentifiers(req);
//     res.status(201).json(await enrichProject(project, identifiers));
//   } catch (error: any) {
//     res.status(400).json({ error: error.message });
//   }
// };

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { name, description, isPrivate, members } = req.body;

    console.log('📥 Received body:', req.body);
    console.log('📥 Members from frontend:', members);

    if (!name || name.trim().length < 3) {
      return res.status(400).json({
        error: 'Project name is required and must be at least 3 characters',
      });
    }

    const ownerId = userId.toLowerCase();
    const memberList = uniqueStrings(members || []).filter((m) => m !== ownerId);

    console.log('👤 Owner ID:', ownerId);
    console.log('👥 Members after filtering:', memberList);

    const project = new Project({
      name: name.trim(),
      description: description?.trim() || '',
      isPrivate: isPrivate ?? true,
      members: memberList,
      owners: [ownerId],
    });

    await project.save();
    console.log(' Saved project:', project);

    const identifiers = await getUserIdentifiers(req);
    const enriched = await enrichProject(project, identifiers);
    console.log('📤 Enriched project:', enriched);
    res.status(201).json(enriched);
  } catch (error: any) {
    console.error(' Create project error:', error);
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
    console.log("Normalized:", normalizedIds);
    const projects = await Project.find({
      $or: [
        { owners: { $in: normalizedIds } },
        { members: { $in: normalizedIds } },
      ],
    }).sort({ createdAt: -1 });
    console.log("Projects:", projects);

    const allProjects = await Project.find();

console.log("ALL PROJECTS:", allProjects);

    const enriched = await Promise.all(
      projects.map((p) => enrichProject(p, identifiers)),
    );
    res.json(enriched);
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

    // Private projects: owner/members only. Public: any signed-in user with the link.
    if (!canViewProject(project, identifiers)) {
      return res.status(403).json({
        error: 'You do not have access to this private project',
        code: 'FORBIDDEN',
      });
    }

    res.json(await enrichProject(project, identifiers));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Update a project (owner only) =====
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
      return res.status(403).json({ error: 'Only the project owner can update this project' });
    }

    const { name, description, isPrivate, members } = req.body;

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

    // Preserve the single existing owner; never accept client-provided owners
    const ownerId = (project.owners?.[0] || req.user!.id).toLowerCase();
    project.owners = [ownerId];

    if (members !== undefined) {
      project.members = uniqueStrings(members).filter((m) => m !== ownerId);
    }

    await project.save();
    res.json(await enrichProject(project, identifiers));
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ===== Delete a project (owner only) =====
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
      return res.status(403).json({ error: 'Only the project owner can delete this project' });
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
