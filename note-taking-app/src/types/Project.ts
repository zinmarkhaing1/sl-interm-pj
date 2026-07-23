import { categories } from './../../../note-taking-app-backend/data/index';
export interface Project {
  _id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  members: string[];
  owners: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  project: Project | string; 
  assignee: string;
  status: 'Todo' | 'In Progress' | 'Complete' | 'Not Started';
  priority: 'Low' | 'Medium' | 'High';
  startDate?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskNote {
  _id: string;
  task: Task | string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Re-export for convenience
export type { Project as ProjectType, Task as TaskType, TaskNote as TaskNoteType };