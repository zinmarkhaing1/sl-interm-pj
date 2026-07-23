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
import type { Note } from '../types/Note';

const BaseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';
console.log('projectApi base url', BaseUrl);

export const taskApi = createApi({
  reducerPath: 'taskApi',
   baseQuery: fetchBaseQuery({
      baseUrl: BaseUrl, // http://localhost:5000/api
      prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        console.log('Token from localStorage:', token ? 'Present' : ' Missing')
        if (token) {
          headers.set("authorization", `Bearer ${token}`);
          console.log('Authorization header set');
          
        }else {
          console.log(' projectApi - No token found');
        }
        
        // Log all headers
        console.log(' projectApi - All Headers:', {
          'Authorization': headers.get('authorization'),
          'Content-Type': headers.get('content-type'),
        });
        
        return headers;
      },
    }),

  tagTypes: ['Task', 'TaskNote'],
  endpoints: (builder) => ({
    // ===== GET ALL TASKS (with filters) =====
    getTasks: builder.query<
      Task[],
      { projectId?: string; status?: string; assignee?: string }
    >({
      query: (params) => {
        const search = new URLSearchParams();
        if (params?.projectId) search.set('projectId', params.projectId);
        if (params?.status) search.set('status', params.status);
        if (params?.assignee) search.set('assignee', params.assignee);
        return `tasks?${search.toString()}`;
      },
      providesTags: (result) =>
        result
          ? result.map(({ _id }) => ({ type: 'Task', id: _id }))
          : ['Task'],
    }),

    // ===== CREATE A NEW TASK =====
    createTask: builder.mutation<
      Task,
      Partial<Task> & { projectId: string }
    >({
      query: (body) => ({
        url: 'tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Task'],
    }),
    getTask: builder.query<Task, string>({
  query: (id) => `tasks/${id}`,
  providesTags: (result, error, id) => [
    { type: "Task", id },
  ],
}),

    // ===== UPDATE A TASK =====
    updateTask: builder.mutation<
      Task,
      { id: string; body: Partial<Task> }
    >({
      query: ({ id, body }) => ({
        url: `tasks/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
    }),

    // ===== DELETE A TASK =====
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),

    // ===== GET NOTES FOR A TASK =====
    getTaskNotes: builder.query<TaskNote[], string>({
      query: (taskId) => `task-notes/task/${taskId}`,
      providesTags: (result, error, taskId) => [{ type: 'TaskNote', id: taskId }],
    }),

    // ===== ADD A NOTE TO A TASK =====
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

    // ===== DELETE A NOTE =====
    deleteTaskNote: builder.mutation<void, string>({
      query: (id) => ({
        url: `task-notes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TaskNote'],
    }),
  }),
});

// ===== EXPORT HOOKS =====
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