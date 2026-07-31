import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Category, CreateCategoryPayload, UpdateCategoryPayload, DeleteCategoryPayload } from "../types/Category";

const BaseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BaseUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    // GET all categories
    getCategories: builder.query<Category[], void>({
      query: () => "/categories", 
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Category" as const, id: _id })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    // POST create
    createCategory: builder.mutation<Category, CreateCategoryPayload>({
      query: (body) => ({
        url: "/categories", 
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    // PUT update
    updateCategory: builder.mutation<Category, UpdateCategoryPayload>({
      query: ({ id, ...patch }) => ({
        url: `/categories/${id}`, 
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Category", id }],
    }),

   
    deleteCategory: builder.mutation<{ success: boolean }, DeleteCategoryPayload>({
      query: (id) => ({
        url: `/categories/${id}`, 
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Category", id }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;