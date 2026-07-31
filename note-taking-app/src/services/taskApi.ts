// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const BaseUrl = import.meta.env.VITE_BASE_URL as string;

// export type TaskType = "Todo" | "Important";

// export interface Task {
//   _id: string;
//   input: string;
//   notetypes: TaskType;
//   createdAt: string;
// }

// export interface CreateTaskBody {
//   input: string;
//   notetypes: TaskType;
// }

// export const taskApi = createApi({
//   reducerPath: "taskApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: BaseUrl,
//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         headers.set("authorization", `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   tagTypes: ["Task"],
//   endpoints: (builder) => ({
//     getTasks: builder.query<Task[], void>({
//       query: () => "/tasks",
//       providesTags: ["Task"],
//     }),
//     createTask: builder.mutation<Task, CreateTaskBody>({
//       query: (taskData) => ({
//         url: "/tasks",
//         method: "POST",
//         body: taskData,
//       }),
//       invalidatesTags: ["Task"],
//     }),
//     deleteTask: builder.mutation<{ message: string }, string>({
//       query: (taskId) => ({
//         url: `/tasks/${encodeURIComponent(taskId)}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Task"],
//     }),
//   }),
// });

// export const {
//   useGetTasksQuery,
//   useCreateTaskMutation,
//   useDeleteTaskMutation,
// } = taskApi;
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Task, TaskNote } from '../types/Project';

const BaseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

export const taskApi = createApi({
  reducerPath: 'taskApi',
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
  tagTypes: ['Task', 'TaskNote'],
  endpoints: (builder) => ({
    // GET tasks with populate
    getTasks: builder.query<
      Task[],
      { projectId?: string; status?: string; assignee?: string; categoryId?: string; populate?: string }
    >({
      query: (params) => {
        const search = new URLSearchParams();
        if (params?.projectId) search.set('projectId', params.projectId);
        if (params?.status) search.set('status', params.status);
        if (params?.assignee) search.set('assignee', params.assignee);
        if (params?.categoryId) search.set('categoryId', params.categoryId);
        search.set('populate', 'category assignee project');
        return `tasks?${search.toString()}`;
      },
      providesTags: (result) =>
        result
          ? result.map(({ _id }) => ({ type: 'Task', id: _id }))
          : ['Task'],
    }),

    
    createTask: builder.mutation<
      Task,
      Partial<Omit<Task, 'assignee' | 'category'>> & { 
        projectId: string; 
        assignee?: string; 
        categoryId?: string;  
      }
    >({
      query: (body) => ({
        url: 'tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Task'],
    }),

    // GET single task
    getTask: builder.query<Task, string>({
      query: (id) => `tasks/${id}?populate=category assignee project`,
      providesTags: (result, error, id) => [{ type: "Task", id }],
    }),

   
    updateTask: builder.mutation<
      Task,
      { 
        id: string; 
        body: Partial<Task> & { categoryId?: string }
      }
    >({
      query: ({ id, body }) => ({
        url: `tasks/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),

    getTaskNotes: builder.query<TaskNote[], string>({
      query: (taskId) => `task-notes/task/${taskId}`,
      providesTags: (result, error, taskId) => [{ type: 'TaskNote', id: taskId }],
    }),

    createTaskNote: builder.mutation<
      TaskNote,
      { taskId: string; content: string; createdBy: string }
    >({
      query: (body) => ({
        url: 'task-notes',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { taskId }) => [{ type: 'TaskNote', id: taskId }],
    }),

    deleteTaskNote: builder.mutation<void, string>({
      query: (id) => ({
        url: `task-notes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TaskNote'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetTaskNotesQuery,
  useCreateTaskNoteMutation,
  useDeleteTaskNoteMutation,
  useGetTaskQuery,
} = taskApi;