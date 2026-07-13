

// import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
// import type { Comment, Note, Notification } from '../types/Note';
// const BaseUrl = import.meta.env.VITE_BASE_URL;

// export const noteApi = createApi({
//   reducerPath :'noteApi',

//   baseQuery : fetchBaseQuery({
//     baseUrl:`${BaseUrl}`,
//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         headers.set("authorization", `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
  
//   tagTypes :['Note'],

//   endpoints : (builder) => ({

//     // getNotes : builder.query<Note [], {status?: string; assignee?: string; shareScope?: "category" | "note" | "board"|"note-form"} | void> ({
//     //   query : (params) => {
//     //     if (!params) return '/notes';
//     //     const qs = new URLSearchParams();
//     //     qs.set('populate', 'user');
//     //     if(params){
//     //         if (params.status) qs.set('status', params.status);
//     //     if (params.assignee) qs.set('assignee', params.assignee);
//     //     if (params.shareScope) qs.set('shareScope', params.shareScope);
//     //     }
      
//     //     const q = qs.toString();
//     //     return q ? `/notes?${q}` : '/notes';
//     //   },
//     //   providesTags : ['Note'],
//     // }),

//     // In noteApi.ts
// getNotes: builder.query<Note[], { status?: string; assignee?: string; shareScope?: "category" | "note" | "board" | "note-form"; noteId?: string } | void>({
//   query: (params) => {
//     if (!params) return '/notes';
//     const qs = new URLSearchParams();
//     qs.set('populate', 'user');
//     if (params.status) qs.set('status', params.status);
//     if (params.assignee) qs.set('assignee', params.assignee);
//     if (params.shareScope) qs.set('shareScope', params.shareScope);
//     if (params.noteId) qs.set('noteId', params.noteId); // Add noteId filter
    
//     const q = qs.toString();
//     return q ? `/notes?${q}` : '/notes';
//   },
//   providesTags: ['Note'],
// }),
//     getNoteById : builder.query({
//       query : (id) => `/notes/${id}`,
//       providesTags: (_result, _error, id) => [{ type: 'Note' as const, id }],
//     }),
//     createNote : builder.mutation<Note ,Partial<Note>>({
//       query : (noteData) => ({
//         url :`/notes`,
//         method :'POST',
//         body : noteData,
//       }),
//       invalidatesTags : ['Note'],
//     }),
//     deleteNote : builder.mutation<{ message: string }, string>({
//       query : (noteID) => ({
//         url : `/notes/${encodeURIComponent(noteID)}`,
//         method : 'DELETE',
//       }),
//       invalidatesTags : ['Note'],
//     }),
//     updateNote : builder.mutation<Note,{id:string;body:Partial<Note>}>({
//       query :({id,body}) => ({
//         url : `/notes/${id}`,
//         method :'PUT',
//         body,
//       }),
//       invalidatesTags:["Note"],
//     }),
//     getComments: builder.query<{ comments: Comment[] }, string>({
//       query: (id) => `/notes/${id}/comments`,
//       providesTags: (_result, _error, id) => [{ type: 'Note' as const, id }],
//     }),
//     addComment: builder.mutation<{ comment: Comment }, { id: string; text: string; userName?: string ;userEmail?: string}>({
//       query: ({ id, text, userName,userEmail }) => ({
//         url: `/notes/${id}/comments`,
//         method: 'POST',
//         body: { text, userName,userEmail },
//       }),
//       invalidatesTags: (_result, _error, arg) => [{ type: 'Note' as const, id: arg.id }],
//     }),

//     //notification
//     getNotifications: builder.query<{ notifications: Notification[] }, void>({
//       query: () => '/api/notifications',
//       providesTags: ['Note'],
//     }),
//     markNotificationRead: builder.mutation<{ notification: Notification }, string>({
//       query: (id) => ({
//         url: `/api/notifications/${id}/read`,
//         method: 'PUT',
//       }),
//       invalidatesTags: ['Note'],
//     }),
//     getCollaborators: builder.query<{ collaborators: any[] }, void>({
//       query: () => '/api/share/collaborators',
//       providesTags: ['Note'],
//     }),
//     getInvitations: builder.query<{ invitations: any[] }, void>({
//       query: () => '/api/share/invitations',
//       providesTags: ['Note'],
//     }),
//   }),

  
// });
// export const {
//   useGetNotesQuery,
//   useGetNoteByIdQuery,
//   useCreateNoteMutation,
//   useDeleteNoteMutation,
//   useUpdateNoteMutation,
//   useGetCommentsQuery,
//   useAddCommentMutation,
//   useGetNotificationsQuery,
//   useMarkNotificationReadMutation,
//   useGetCollaboratorsQuery,
//   useGetInvitationsQuery,
// } = noteApi;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Comment, Note, Notification } from '../types/Note';

// Base URL 
const BaseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

console.log('noteApi base url',BaseUrl);

export const noteApi = createApi({
  reducerPath: 'noteApi',

  baseQuery: fetchBaseQuery({
    baseUrl: BaseUrl, // http://localhost:5000/api
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      console.log(' Token from localStorage:', token ? 'Present' : ' Missing')
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }else {
        console.log(' noteApi - No token found');
      }
      
      // Log all headers
      console.log(' noteApi - All Headers:', {
        'Authorization': headers.get('authorization'),
        'Content-Type': headers.get('content-type'),
      });
      
      return headers;
    },
  }),

  tagTypes: ['Note'],

  endpoints: (builder) => ({

    // GET ALL NOTES
    getNotes: builder.query<Note[], { 
      status?: string; 
      assignee?: string; 
      shareScope?: "category" | "note" | "board" | "note-form"; 
      noteId?: string 
    } | void>({
      query: (params) => {
        if (!params) return '/notes'; 
        const qs = new URLSearchParams();
        qs.set('populate', 'user');
        if (params.status) qs.set('status', params.status);
        if (params.assignee) qs.set('assignee', params.assignee);
        if (params.shareScope) qs.set('shareScope', params.shareScope);
        if (params.noteId) qs.set('noteId', params.noteId);
        
        const q = qs.toString();
        return q ? `/notes?${q}` : '/notes';
      },
       transformResponse: (response: any) => {
    console.log('📦 Raw API response:', response);
    console.log('📦 Response type:', typeof response);
    console.log('📦 Is array?', Array.isArray(response));
    
    // If response is already an array
    if (Array.isArray(response)) {
      console.log('📦 Response is array, length:', response.length);
      return response;
    
    }

   if (response && typeof response === 'object') {
      if (response.data && Array.isArray(response.data)) {
        console.log('📦 Response has data array, length:', response.data.length);
        return response.data;
      }
      if (response.notes && Array.isArray(response.notes)) {
        console.log('📦 Response has notes array, length:', response.notes.length);
        return response.notes;
      }
    }

    console.log('📦 Response is empty or invalid, returning empty array');
   
    return [];
  },
      providesTags: ['Note'],
    }),

    // GET NOTE BY ID
    getNoteById: builder.query({
      query: (id) => `/notes/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Note' as const, id }],
    }),

    // CREATE NOTE
    createNote: builder.mutation<Note, Partial<Note>>({
      query: (noteData) => ({
        url: `/notes`,
        method: 'POST',
        body: noteData,
      }),
      invalidatesTags: ['Note'],
    }),

    // DELETE NOTE
    deleteNote: builder.mutation<{ message: string }, string>({
      query: (noteID) => ({
        url: `/notes/${encodeURIComponent(noteID)}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Note'],
    }),

    // UPDATE NOTE
    updateNote: builder.mutation<Note, { id: string; body: Partial<Note> }>({
      query: ({ id, body }) => ({
        url: `/notes/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ["Note"],
    }),

    // COMMENTS
    getComments: builder.query<{ comments: Comment[] }, string>({
      query: (id) => `/notes/${id}/comments`,
      providesTags: (_result, _error, id) => [{ type: 'Note' as const, id }],
    }),

    addComment: builder.mutation<{ comment: Comment }, { id: string; text: string; userName?: string; userEmail?: string }>({
      query: ({ id, text, userName, userEmail }) => ({
        url: `/notes/${id}/comments`,
        method: 'POST',
        body: { text, userName, userEmail },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Note' as const, id: arg.id }],
    }),

    // NOTIFICATIONS - 
    getNotifications: builder.query<{ notifications: Notification[] }, void>({
      query: () => '/notifications',
      providesTags: ['Note'],
    }),

    markNotificationRead: builder.mutation<{ notification: Notification }, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`, 
        method: 'PUT',
      }),
      invalidatesTags: ['Note'],
    }),

    //
    getCollaborators: builder.query<{ collaborators: any[] }, void>({
      query: () => '/share/collaborators', 
      providesTags: ['Note'],
    }),

    getInvitations: builder.query<{ invitations: any[] }, void>({
      query: () => '/share/invitations', 
      providesTags: ['Note'],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useGetNoteByIdQuery,
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useGetCollaboratorsQuery,
  useGetInvitationsQuery,
} = noteApi;
