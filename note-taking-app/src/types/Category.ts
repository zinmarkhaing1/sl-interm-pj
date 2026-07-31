


export interface Category {
  _id: string;
  name: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}


export type CreateCategoryPayload = {
  name: string;
};


export type UpdateCategoryPayload = {
  id: string;
  name: string;
};


export type DeleteCategoryPayload = string;