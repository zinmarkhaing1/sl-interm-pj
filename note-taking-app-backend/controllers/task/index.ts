// import { Request, Response } from 'express';
// import Task from '../../models/Task';
// import Project, { IProject } from '../../models/Project';
// import {
//   getUserIdentifiers,
//   userHasAccess,
// } from '../project';
// import PageAccess from '../../models/PageAccess';

// interface AuthRequest extends Request {
//   user?: {
//     id: string;
//     email?: string;
//   };
// }

// const getAccessibleProjectIds = async (identifiers: string[]) => {
//   const normalizedIds = identifiers.map((id) => id.toLowerCase());
//   const projects = await Project.find({
//     $or: [
//       { owners: { $in: normalizedIds } },
//       { members: { $in: normalizedIds } },
//     ],
//   }).select('_id');

//   return projects.map((p) => p._id);
// };

// const assertProjectAccess = (
//   project: IProject | null | undefined,
//   identifiers: string[],
//   res: Response,
// ) => {
//   if (!project) {
//     res.status(404).json({ error: 'Project not found' });
//     return false;
//   }
//   if (!userHasAccess(project, identifiers)) {
//     res.status(403).json({ error: 'Forbidden' });
//     return false;
//   }
//   return true;
// };


// // 1. CREATE TASK

// export const createTask = async (req: AuthRequest, res: Response) => {
//   try {
//     const identifiers = await getUserIdentifiers(req);
//     if (identifiers.length === 0) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const {
//       title,
//       description,
//       projectId,
//       assignee,
//       status,
//       priority,
//       startDate,
//       dueDate,
//     } = req.body;

//     // --- Validation ---
//     if (!title || title.trim().length < 3) {
//       return res.status(400).json({
//         error: 'Task title is required and must be at least 3 characters',
//       });
//     }

//     if (!projectId) {
//       return res.status(400).json({ error: 'Project ID is required' });
//     }

//     // --- Check if project exists and user has access ---
//     const project = await Project.findById(projectId);
//     if (!assertProjectAccess(project, identifiers, res)) return;

//     // --- Create Task ---
//     const task = new Task({
//       title: title.trim(),
//       description: description?.trim() || '',
//       project: projectId,
//       assignee: assignee?.trim() || 'Unassigned',
//       status: status || 'Todo',
//       priority: priority || 'Medium',
//       startDate: startDate || undefined,
//       dueDate: dueDate || undefined,
//     });

//     await task.save();
//     await task.populate('project');

//     res.status(201).json(task);
//   } catch (error: any) {
//     res.status(400).json({ error: error.message });
//   }
// };


// // 2. GET ALL TASKS (with filters)
// // export const getTasks = async (req: AuthRequest, res: Response) => {
// //   try {
// //     const identifiers = await getUserIdentifiers(req);
// //     if (identifiers.length === 0) {
// //       return res.status(401).json({ error: 'Unauthorized' });
// //     }

// //     const { projectId, status, assignee } = req.query;
// //     const accessibleIds = await getAccessibleProjectIds(identifiers);

// //     if (accessibleIds.length === 0) {
// //       return res.json([]);
// //     }





// //     const filter: any = {
// //       project: { $in: accessibleIds },
// //     };

// //     if (projectId) {
// //       const requestedId = String(projectId);
// //       const allowed = accessibleIds.some(
// //         (id) => String(id) === requestedId,
// //       );
// //       if (!allowed) {
// //         return res.status(403).json({ error: 'Forbidden' });
// //       }
// //       filter.project = requestedId;
// //     }

// //     if (status) filter.status = status;
// //     if (assignee) filter.assignee = assignee;

// //     const tasks = await Task.find(filter)
// //       .populate('project')
// //       .sort({ createdAt: -1 });

// //     res.json(tasks);
// //   } catch (error: any) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// export const getTasks = async (req: AuthRequest, res: Response) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const identifiers = await getUserIdentifiers(req);
//     if (identifiers.length === 0) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const { projectId, status, assignee, shareScope } = req.query;


//     const ownedProjectIds = await getAccessibleProjectIds(identifiers);
//     const ownedIds = ownedProjectIds.map(id => id.toString());


//     const pageAccesses = await PageAccess.find({
//       userId: userId,
//       pageType: 'board',
//     }).lean();

//     const boardNames = pageAccesses
//       .map(pa => pa.pageName)
//       .filter((name): name is string => Boolean(name));

   
//     let sharedProjectIds: string[] = [];
//     if (boardNames.length > 0) {
//       const regexPatterns = boardNames.map(name => new RegExp(`^${name}$`, 'i'));
//       const sharedProjects = await Project.find({
//         name: { $in: regexPatterns },
//       }).select('_id').lean();
//       sharedProjectIds = sharedProjects.map(p => p._id.toString());
//     }

    
//     const allAccessibleIds = [...new Set([...ownedIds, ...sharedProjectIds])];

//     if (allAccessibleIds.length === 0) {
//       return res.json([]);
//     }

   
//     let finalProjectIds = allAccessibleIds;
//     if (shareScope === 'board') {
      
//       finalProjectIds = sharedProjectIds;
//       if (finalProjectIds.length === 0) {
//         return res.json([]);
//       }
//     }


//     if (projectId) {
//       const requestedId = String(projectId);
//       if (!finalProjectIds.includes(requestedId)) {
//         return res.status(403).json({ error: 'Forbidden' });
//       }
//       finalProjectIds = [requestedId];
//     }

   
//     const filter: any = {
//       project: { $in: finalProjectIds },
//     };
//     if (status) filter.status = status;
//     if (assignee) filter.assignee = assignee;

//     const tasks = await Task.find(filter)
//       .populate('project')
//       .sort({ createdAt: -1 });

//     res.json(tasks);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // =============================================
// // 3. GET TASK BY ID
// // =============================================
// export const getTaskById = async (req: AuthRequest, res: Response) => {
//   try {
//     const identifiers = await getUserIdentifiers(req);
//     if (identifiers.length === 0) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const { id } = req.params;

//     const task = await Task.findById(id).populate('project');

//     if (!task) {
//       return res.status(404).json({ error: 'Task not found' });
//     }

//     const project =
//       task.project && typeof task.project === 'object' && '_id' in task.project
//         ? (task.project as unknown as IProject)
//         : await Project.findById(task.project);

//     if (!assertProjectAccess(project, identifiers, res)) return;

//     res.json(task);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // =============================================
// // 4. UPDATE TASK
// // =============================================
// export const updateTask = async (req: AuthRequest, res: Response) => {
//   try {
//     const identifiers = await getUserIdentifiers(req);
//     if (identifiers.length === 0) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const { id } = req.params;
//     const { title, description, assignee, status, priority, startDate, dueDate } =
//       req.body;

//     const existing = await Task.findById(id);
//     if (!existing) {
//       return res.status(404).json({ error: 'Task not found' });
//     }

//     const project = await Project.findById(existing.project);
//     if (!assertProjectAccess(project, identifiers, res)) return;

//     const task = await Task.findByIdAndUpdate(
//       id,
//       {
//         title,
//         description,
//         assignee,
//         status,
//         priority,
//         startDate,
//         dueDate,
//       },
//       {
//         new: true, // Return updated document
//         runValidators: true, // Run schema validations
//       }
//     ).populate('project');

//     if (!task) {
//       return res.status(404).json({ error: 'Task not found' });
//     }

//     res.json(task);
//   } catch (error: any) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // =============================================
// // 5. DELETE TASK
// // =============================================
// export const deleteTask = async (req: AuthRequest, res: Response) => {
//   try {
//     const identifiers = await getUserIdentifiers(req);
//     if (identifiers.length === 0) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     const { id } = req.params;

//     const existing = await Task.findById(id);
//     if (!existing) {
//       return res.status(404).json({ error: 'Task not found' });
//     }

//     const project = await Project.findById(existing.project);
//     if (!assertProjectAccess(project, identifiers, res)) return;

//     await Task.findByIdAndDelete(id);

//     res.json({ message: 'Task deleted successfully' });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };


import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Task from '../../models/Task';
import Project, { IProject } from '../../models/Project';
import Auth from '../../models/Auth';
import {
  getUserIdentifiers,
  userHasAccess,
} from '../project';
import PageAccess from '../../models/PageAccess';
import ShareInvitation from '../../models/ShareInvitation';

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
      categoryId,          
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
      category: categoryId || null,  
      assignee: assignee?.trim() || 'Unassigned',
      status: status || 'Todo',
      priority: priority || 'Medium',
      startDate: startDate || undefined,
      dueDate: dueDate || undefined,
    });

    await task.save();
    await task.populate('project');
    await task.populate('category'); 

    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// 2. GET ALL TASKS (with filters + populate category)
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const identifiers = await getUserIdentifiers(req);
    if (identifiers.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { projectId, status, assignee, shareScope, categoryId } = req.query;
    const currentUser = await Auth.findById(userId).select('email').lean();
    const normalizedEmail = currentUser?.email?.toLowerCase();

    const ownedProjectIds = await getAccessibleProjectIds(identifiers);
    const ownedIds = ownedProjectIds.map(id => id.toString());

    const pageAccesses = await PageAccess.find({
      userId: userId,
      pageType: 'board',
    }).lean();

    const acceptedBoardInvitations = await ShareInvitation.find({
      pageType: 'board',
      status: 'accepted',
      $or: [
        { userId: userId },
        { invitedEmail: normalizedEmail },
      ],
    }).select('pageName projectId').lean();

    const boardNames = [
      ...pageAccesses.map(pa => pa.pageName).filter((name): name is string => Boolean(name)),
      ...acceptedBoardInvitations.map(inv => inv.pageName).filter((name): name is string => Boolean(name)),
    ];

    let sharedProjectIds: string[] = [];
    const invitationProjectIds = acceptedBoardInvitations.flatMap((inv) => {
      const id = typeof inv.projectId === 'string' ? inv.projectId : inv.projectId?.toString();
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return [];
      }
      return [id];
    });

    if (invitationProjectIds.length > 0) {
      const matchingProjects = await Project.find({
        _id: { $in: invitationProjectIds.map((id) => new mongoose.Types.ObjectId(id)) },
      }).select('_id').lean();
      sharedProjectIds = matchingProjects.map((project) => project._id.toString());
    }

    if (boardNames.length > 0) {
      const regexPatterns = [...new Set(boardNames)].map(name => new RegExp(`^${name}$`, 'i'));
      const sharedProjects = await Project.find({
        name: { $in: regexPatterns },
      }).select('_id').lean();
      sharedProjectIds = [...new Set([...sharedProjectIds, ...sharedProjects.map((project) => project._id.toString())])];
    }

    if (shareScope === 'board' && sharedProjectIds.length === 0) {
      const ownerIds = [...new Set(pageAccesses
        .map((access) => access.ownerId?.toString())
        .filter((id): id is string => Boolean(id)))];

      if (ownerIds.length > 0) {
        const ownerProjects = await Project.find({
          $or: ownerIds.map((ownerId) => ({ owners: { $in: [ownerId.toLowerCase()] } })),
        }).select('_id').lean();
        sharedProjectIds = ownerProjects.map((project) => project._id.toString());
      }
    }

    const allAccessibleIds = [...new Set([...ownedIds, ...sharedProjectIds])];

    if (allAccessibleIds.length === 0) {
      return res.json([]);
    }

    let finalProjectIds = allAccessibleIds;
    if (shareScope === 'board') {
      finalProjectIds = sharedProjectIds;
      if (finalProjectIds.length === 0) {
        return res.json([]);
      }
    }

    if (projectId) {
      const requestedId = String(projectId);
      if (!finalProjectIds.includes(requestedId)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      finalProjectIds = [requestedId];
    }

    const filter: any = {
      project: { $in: finalProjectIds },
    };
    if (status) filter.status = status;
    if (assignee) filter.assignee = assignee;
    if (categoryId) filter.category = categoryId; 

    const tasks = await Task.find(filter)
      .populate('project')
      .populate('category')      
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 3. GET TASK BY ID
export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const identifiers = await getUserIdentifiers(req);
    if (identifiers.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const task = await Task.findById(id)
      .populate('project')
      .populate('category'); 

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

// 4. UPDATE TASK
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const identifiers = await getUserIdentifiers(req);
    if (identifiers.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { title, description, assignee, status, priority, startDate, dueDate, categoryId } =
      req.body; 

    const existing = await Task.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const project = await Project.findById(existing.project);
    if (!assertProjectAccess(project, identifiers, res)) return;

    const updateData: any = {
      title,
      description,
      assignee,
      status,
      priority,
      startDate,
      dueDate,
    };
    if (categoryId !== undefined) updateData.category = categoryId || null; 

    const task = await Task.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('project')
      .populate('category'); 

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// 5. DELETE TASK
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