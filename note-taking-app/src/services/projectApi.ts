import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Project, Task, TaskNote } from '../types/Project'


const BaseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';
console.log('projectApi base url', BaseUrl);
export const projectApi = createApi({
  reducerPath: 'projectApi',
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
  tagTypes: ['Project', 'Task', 'TaskNote'],
  endpoints: (builder) => ({
    // Projects 
    getProjects: builder.query<Project[], void>({
      query: () => '/projects',

 transformResponse: (response: any) => {
    
    if (Array.isArray(response)) {
      return response;
    }
 
    if (response && response.projects && Array.isArray(response.projects)) {
      return response.projects;
    }
 
    return [];
  },
      providesTags: ['Project'],
    }),
    getProjectById: builder.query<Project, string>({
  query: (id) => `/projects/${id}`,
  providesTags: (result, error, id) => [
    { type: 'Project', id }
  ],
}),
    createProject: builder.mutation<Project, Partial<Project>>({
      query: (body) => ({ url: '/projects', method: 'POST', body }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation<Project, { id: string; body: Partial<Project> }>({
      query: ({ id, body }) => ({ url: `/projects/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Project'],
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({ url: `/projects/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Project'],
    }),

    //Tasks
    getTasks: builder.query<Task[], { projectId?: string; status?: string; assignee?: string }>({
      query: (params) => {
        const search = new URLSearchParams();
        if (params.projectId) search.set('projectId', params.projectId);
        if (params.status) search.set('status', params.status);
        if (params.assignee) search.set('assignee', params.assignee);
        return `tasks?${search.toString()}`;
      },
      providesTags: ['Task'],
    }),
    createTask: builder.mutation<Task, Partial<Task> & { projectId: string }>({
      query: (body) => ({ url: '/tasks', method: 'POST', body }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<Task, { id: string; body: Partial<Task> }>({
      query: ({ id, body }) => ({ url: `/tasks/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({ url: `/tasks/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Task'],
    }),

    // ===== Task Notes =====
    getTaskNotes: builder.query<TaskNote[], string>({
      query: (taskId) => `/task-notes/task/${taskId}`,
      providesTags: (result, error, taskId) => [{ type: 'TaskNote', id: taskId }],
    }),
    createTaskNote: builder.mutation<TaskNote, { taskId: string; content: string; createdBy: string }>({
      query: (body) => ({ url: '/task-notes', method: 'POST', body }),
      invalidatesTags: (result, error, { taskId }) => [{ type: 'TaskNote', id: taskId }],
    }),
    deleteTaskNote: builder.mutation<void, string>({
      query: (id) => ({ url: `/task-notes/${id}`, method: 'DELETE' }),
      invalidatesTags: ['TaskNote'],
    }),
  }),
});

export const {
 useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,

  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,

  useGetTaskNotesQuery,
  useCreateTaskNoteMutation,
  useDeleteTaskNoteMutation,
} = projectApi;