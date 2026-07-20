// types/PageAccess.ts
export interface PageAccess {
  _id: string;
  userId: string;
  ownerId: string;
  pageType: "category" | "board";
  pageUrl: string;
  pageName: string;
  permission: "view";
  createdAt: string;
  updatedAt: string;
}

// For populated responses from backend
export interface PageAccessWithPopulatedUsers {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  ownerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  pageType: "category" | "board";
  pageUrl: string;
  pageName: string;
  permission: "view";
  createdAt: string;
  updatedAt: string;
}