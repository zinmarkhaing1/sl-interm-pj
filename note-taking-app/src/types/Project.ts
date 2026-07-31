// import { categories } from './../../../note-taking-app-backend/data/index';

import type { Category } from "./Category";


export interface Project {
  _id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  members: string[];
  /** Stored user id of the single project owner */
  owners: string[];
  /** Resolved email for display */
  ownerEmail?: string | null;
  isOwner?: boolean;
  isMember?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  project: Project | string; 
  category:{
    _id: string;
    name: string;
  } | string; 
  assignee: {
    _id: string;
    username: string;
    email?: string;
  } | string; 
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
  category:string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Re-export for convenience
export type { Project as ProjectType, Task as TaskType, TaskNote as TaskNoteType };