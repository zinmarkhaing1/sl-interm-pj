// import { Request, Response } from "express";
// import Category from "../../models/Category";

// // Get all categories
// export const getCategories = async (req: Request, res: Response) => {
//   try {
//     const categories = await Category.find().sort({ createdAt: -1 });
//     res.status(200).json(categories);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch categories", error });
//   }
// };

// // Create a new category
// export const createCategory = async (req: Request, res: Response) => {
//   try {
//     const { name } = req.body;
//     if (!name || !name.trim()) {
//       return res.status(400).json({ message: "Category name is required" });
//     }
//     const existing = await Category.findOne({ name: name.trim() });
//     if (existing) {
//       return res.status(409).json({ message: "Category already exists" });
//     }
//     const newCategory = new Category({ name: name.trim() });
//     await newCategory.save();
//     res.status(201).json(newCategory);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to create category", error });
//   }
// };

// // Update a category
// export const updateCategory = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { name } = req.body;
//     if (!name || !name.trim()) {
//       return res.status(400).json({ message: "Category name is required" });
//     }
//     const updated = await Category.findByIdAndUpdate(
//       id,
//       { name: name.trim() },
//       { new: true, runValidators: true }
//     );
//     if (!updated) {
//       return res.status(404).json({ message: "Category not found" });
//     }
//     res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update category", error });
//   }
// };

// // Delete a category
// export const deleteCategory = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Category.findByIdAndDelete(id);
//     if (!deleted) {
//       return res.status(404).json({ message: "Category not found" });
//     }
//     res.status(200).json({ success: true, message: "Category deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete category", error });
//   }
// };


import { Request, Response } from "express";
import Category from "../../models/Category";
import Project from "../../models/Project";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}


const userHasProjectAccess = async (userId: string, projectId: string): Promise<boolean> => {
  const project = await Project.findById(projectId).select("members owners").lean();
  if (!project) return false;

  const userIdStr = userId.toString();
  const members = (project.members || []).map((id: any) => id.toString());
  const owners = (project.owners || []).map((id: any) => id.toString());

  return members.includes(userIdStr) || owners.includes(userIdStr);
};


const getUserOwnerProjects = async (userId: string) => {
  return await Project.find({ owners: userId }).select("_id").lean();
};


const getUserMemberProjects = async (userId: string) => {
  return await Project.find({
    $and: [
      { members: userId },
      { owners: { $ne: userId } },
    ],
  }).select("_id").lean();
};

// ---- Get Categories ----
export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { projectId } = req.query;


    if (projectId && typeof projectId === "string") {
     
      const hasAccess = await userHasProjectAccess(userId, projectId);
      if (!hasAccess) {
        return res.status(403).json({ 
          message: "You don't have access to this project" 
        });
      }

     
      const categories = await Category.find({
        projectId: projectId,
      }).sort({ name: 1 });

      return res.status(200).json(categories);
    }

   
    const ownerProjects = await getUserOwnerProjects(userId);
    const ownerProjectIds = ownerProjects.map((p) => p._id);

   
    const memberProjects = await getUserMemberProjects(userId);
    const memberProjectIds = memberProjects.map((p) => p._id);

 
    let ownerCategories: any[] = [];
    if (ownerProjectIds.length > 0) {
      ownerCategories = await Category.find({
        projectId: { $in: ownerProjectIds },
      }).sort({ name: 1 });
    }

 
    let memberCategories: any[] = [];
    if (memberProjectIds.length > 0) {
      memberCategories = await Category.find({
        projectId: { $in: memberProjectIds },
      }).sort({ name: 1 });
    }

    let finalCategories: any[] = [];

  
    if (ownerProjectIds.length > 0) {
      const globalCategories = await Category.find({
        $or: [
          { projectId: { $exists: false } },
          { projectId: null },
        ],
      }).sort({ name: 1 });
      finalCategories = [...ownerCategories, ...globalCategories];
    } else {
     
      finalCategories = [...memberCategories];
    }


    const categoryMap = new Map();
    finalCategories.forEach((cat) => {
      const key = cat._id.toString();
      if (!categoryMap.has(key)) {
        categoryMap.set(key, cat);
      }
    });

    const result = Array.from(categoryMap.values());
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};

// ---- Create Category ----
export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, projectId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    if (projectId) {
      const hasAccess = await userHasProjectAccess(userId, projectId);
      if (!hasAccess) {
        return res.status(403).json({ 
          message: "You don't have access to this project" 
        });
      }
    }

    const existing = await Category.findOne({ 
      name: name.trim(),
      projectId: projectId || null,
    });
    if (existing) {
      return res.status(409).json({ 
        message: "Category already exists in this project" 
      });
    }

    const newCategory = new Category({
      name: name.trim(),
      projectId: projectId || null,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Failed to create category", error });
  }
};

// ---- Update Category ----
export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const { name, projectId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.projectId) {
      const hasAccess = await userHasProjectAccess(userId, category.projectId.toString());
      if (!hasAccess) {
        return res.status(403).json({ 
          message: "You don't have permission to update this category" 
        });
      }
    }

    const updated = await Category.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        ...(projectId !== undefined && { projectId: projectId || null }),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Failed to update category", error });
  }
};

// ---- Delete Category ----
export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.projectId) {
      const hasAccess = await userHasProjectAccess(userId, category.projectId.toString());
      if (!hasAccess) {
        return res.status(403).json({ 
          message: "You don't have permission to delete this category" 
        });
      }
    }

    await Category.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category", error });
  }
};