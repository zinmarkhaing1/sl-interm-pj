
export interface Note  {
    _id :string;
    id? :string;
    title :string;
    content? : string;
    description? : string;
    category? : string;
    task?:string;
    taskId?:string;
    taskTitle?:string;
    priority? : string;
    assignee? : string;
    startDate? : string;
    endDate? : string;
    input? :string;
    notetypes?:string;
    createdAt? : string;
    isOwned?: boolean;
  // Owner fields: backend sometimes uses `authId`, `user`, or `userId`
  authId?: string;
  user?: string;
  userId?: string;
  // Accept both legacy and newer permission labels
  accessPermission?: "owner" | "edit" | "editor" | "comment" | "commenter" | "view";
  isShared?: boolean;
  sharedWith?: string[] | any[];
  project?: string | { _id: string; name: string };
 
  
}

export interface Comment {
  _id?: string;
  noteId?: string;
  userId?: string;
  userName?: string;
  text: string;
  userEmail?:string;
  createdAt?: string;
}

export interface Notification {
  _id?: string;
  fromUser?: string;
  toUser?: string;
  noteId?: string;
  type?: "view" | "edit" | "comment" | "invite";
  message?: string;
  isRead?: boolean;
  createdAt?: string;
}


//project
export interface Project {
  _id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  members: string[];      
  owners: string[];      
  createdAt: string;
}

// Task
export interface Task {
  _id: string;
  title: string;          
  description?: string;
  project: string | Project; 
  assignee: string;     
  status: 'Todo' | 'In Progress' | 'Complete' | 'Not Started';
  priority: 'Low' | 'Medium' | 'High';
  startDate?: string;
  dueDate?: string;
  createdAt: string;
}


export interface TaskNote {
  _id: string;
  task: string | Task;     
  content: string;         
  createdBy: string;       
  createdAt: string;
}