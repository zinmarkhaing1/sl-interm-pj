


// export interface Category {
//   _id: string;
//   name: string;
//   createdAt: string; // ISO date string
//   updatedAt: string; // ISO date string
// }


// export type CreateCategoryPayload = {
//   name: string;
// };


// export type UpdateCategoryPayload = {
//   id: string;
//   name: string;
// };


// export type DeleteCategoryPayload = string;

// types/Category.ts
export interface Category {
  _id: string;
  name: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  projectId?: string; 
}

export interface UpdateCategoryPayload {
  id: string;
  name: string;
  projectId?: string; 
}

export type DeleteCategoryPayload = string;