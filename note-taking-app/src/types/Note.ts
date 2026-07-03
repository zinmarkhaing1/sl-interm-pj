
export interface Note  {
    _id :string;
    id? :string;
    title :string;
    content? : string;
    description? : string;
    category? : string;
    task?:string;
    priority? : string;
    assignee? : string;
    startDate? : string;
    endDate? : string;
    input? :string;
    notetypes?:string;
    createdAt? : string;
    isOwned?: boolean;
    accessPermission?: "owner" | "edit" | "comment" | "view";
}

export interface Comment {
  _id?: string;
  noteId?: string;
  userId?: string;
  userName?: string;
  text: string;
  createdAt?: string;
}

export interface Notification {
  _id?: string;
  fromUser?: string;
  toUser?: string;
  noteId?: string;
  type?: "view" | "edit" | "comment";
  message?: string;
  isRead?: boolean;
  createdAt?: string;
}
