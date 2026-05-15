import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BaseUrl = import.meta.env.VITE_BASE_URL as string;

export type TaskType = "Todo" | "Important";

export interface Task {
  _id: string;
  input: string;
  notetypes: TaskType;
  createdAt: string;
}

export interface CreateTaskBody {
  input: string;
  notetypes: TaskType;
}

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BaseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => "/tasks",
      providesTags: ["Task"],
    }),
    createTask: builder.mutation<Task, CreateTaskBody>({
      query: (taskData) => ({
        url: "/tasks",
        method: "POST",
        body: taskData,
      }),
      invalidatesTags: ["Task"],
    }),
    deleteTask: builder.mutation<{ message: string }, string>({
      query: (taskId) => ({
        url: `/tasks/${encodeURIComponent(taskId)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
