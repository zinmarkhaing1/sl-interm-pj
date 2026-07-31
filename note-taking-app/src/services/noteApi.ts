import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Comment, Note, Notification } from '../types/Note';
import type { PageAccess } from '../types/PageAccess';

// Base URL 
const BaseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

console.log('noteApi base url',BaseUrl);

export const noteApi = createApi({
  reducerPath: 'noteApi',

  baseQuery: fetchBaseQuery({
    baseUrl: BaseUrl, // http://localhost:5000/api
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      console.log('Token from localStorage:', token ? 'Present' : ' Missing')
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
        console.log('Authorization header set');
        
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

  tagTypes: ['Note','Comment',"PageAccess"],

  endpoints: (builder) => ({

    // GET ALL NOTES
    getNotes: builder.query<Note[], { 
      status?: string; 
      assignee?: string; 
      shareScope?: "category" | "board" | "note-form" ; 
      noteId?: string ;
      populate?:string;
      projectId?:string;
      taskId?:string;
    } | void>({
      query: (params) => {
        if (!params) return '/notes'; 
        const qs = new URLSearchParams();
        qs.set('populate', 'user');
        if (params.status) qs.set('status', params.status);
        if (params.assignee) qs.set('assignee', params.assignee);
        if (params.shareScope) qs.set('shareScope', params.shareScope);
        if (params.noteId) qs.set('noteId', params.noteId);
        if (params.projectId) qs.set('projectId', params.projectId);   
    if (params.taskId) qs.set('taskId', params.taskId);  
        
        const q = qs.toString();
        const url = q ? `/notes?${q}` : '/notes';
        console.log('Final URL:', url);
        return url;
        
      },
       transformResponse: (response: any) => {
    console.log(' Raw API response:', response);
    console.log('Response type:', typeof response);
    console.log('Is array?', Array.isArray(response));
    console.log('Response keys:', response ? Object.keys(response) : 'null');
    
    
    // If response is already an array
    if (Array.isArray(response)) {
      console.log('Response is array, length:', response.length);
      if(response.length > 0) {
        console.log('First note:', response[0]); 
      }
      return response;
    
    }

   if (response && typeof response === 'object') {
      if (response.data && Array.isArray(response.data)) {
        console.log(' Response has data array, length:', response.data.length);
        if (response.data.length > 0) {
          console.log('First note in data:', response.data[0]);   
        }
        return response.data;
      }
      if (response.notes && Array.isArray(response.notes)) {
        console.log(' Response has notes array, length:', response.notes.length);
        if(response.notes.length > 0) {
          console.log('First note in notes:',response.notes[0]);
          
        }
        return response.notes;
      }
      if (response.results && Array.isArray(response.results)) {
            console.log(' Response has results array, length:', response.results.length);
            return response.results;
          }

           if (response._id && response.title) {
            console.log(' Response is a single note object');
            return [response];
          }
    }

    console.log(' Response is empty or invalid, returning empty array');
   
    return [];
  },
      providesTags: ['Note'],

      //add onquerystarted
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          console.log(' Query completed successfully:', result.data?.length || 0, 'notes');
        } catch (err) {
          console.error(' Query failed:', err);
        }
      },
    
    }),

     getPageAccess: builder.query<
      { count: number; pageAccesses: PageAccess[] },
      { pageType?: string; pageName?: string }
    >({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params.pageType) qs.set("pageType", params.pageType);
        if (params.pageName) qs.set("pageName", params.pageName);
        return `/share/debug/page-access?${qs.toString()}`;
      },
       providesTags: ["PageAccess"],
      transformResponse: (response: any) => {
        console.log("getPageAccess response:", response);
        return response;
      },
    }),

    getPageAccessAll: builder.query<any, void>({
      query: () => "/share/debug/page-access-all",
      providesTags: ["PageAccess"],
    }),

   
    

    // GET NOTE BY ID
    getNoteById: builder.query({
      query: (id) => `/notes/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Note' as const, id }],
      transformResponse: (response: any) => {
        console.log('getNoteById response:', response);
        return response;
        
      }
    }),

    // CREATE NOTE
    createNote: builder.mutation<Note, Partial<Note>>({
      query: (noteData) => ({
        url: `/notes`,
        method: 'POST',
        body: noteData,
      }),
      invalidatesTags: ['Note'],
      transformResponse: (response: any) => {
        console.log('createNote response:', response);
        return response;
      },
    }),

    // DELETE NOTE
    deleteNote: builder.mutation<{ message: string }, string>({
      query: (noteID) => ({
        url: `/notes/${encodeURIComponent(noteID)}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Note'],
      transformResponse: (response: any) => {
        console.log('deleteNote response:', response);
        return response;
      },
    }),

    // UPDATE NOTE
    updateNote: builder.mutation<Note, { id: string; body: Partial<Note> }>({
      query: ({ id, body }) => ({
        url: `/notes/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ["Note"],
      transformResponse: (response: any) => {
        console.log(' updateNote response:', response);
        return response;
      },
    }),

    // COMMENTS
    getComments: builder.query<{ comments: Comment[] }, string>({
      // query: (id) => `/notes/${id}/comments`,
      query:(id) => `/comments/${id}`,
      providesTags: (_result, _error, id) => [
        { type: 'Comment', id },
      ],
      // Add transformResponse to handle response safely
      transformResponse: (response: any) => {
        console.log(' getComments response:', response);
        
        // If response is already the comments array
        if (Array.isArray(response)) {
          return { comments: response };
        }
        if (response && typeof response === 'object') {
          if (response.comments && Array.isArray(response.comments)) {
            return { comments: response.comments };
          }
          // If response is the comment object itself
          if (response._id) {
            return { comments: [response] };
          }
        }
        
        // Return empty array if nothing found
        return { comments: [] };
      },
       
    }),

    addComment: builder.mutation<{ comment: Comment }, { id: string; text: string; userName?: string; userEmail?: string }>({
      query: ({ id, text, userName, userEmail }) => ({
        
        // url: `/notes/${id}/comments`,
        url: `/comments/${id}`,
        method: 'POST',
        body: { text, userName, userEmail : userEmail || '' },
      }),

      transformResponse: (response: any) => {
    console.log("API Response - addComment:", response);
    return response;
  },
  transformErrorResponse: (response: any) => {
    console.log(" API Error - addComment:", response);
    return response;
  },
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Note' as const, id: arg.id },
        {type :'Comment' as const,id:arg.id}
      ],
    }),

    // DELETE COMMENT - Add this if not already present
    deleteComment: builder.mutation<{ message: string }, string>({
      query: (commentId) => ({
        url: `/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comment'],
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
       transformResponse: (response: any) => {
        console.log('getCollaborators response:', response);
        return response;
      },
    }),

    getInvitations: builder.query<{ invitations: any[] }, void>({
      query: () => '/share/invitations', 
      providesTags: ['Note'],
       transformResponse: (response: any) => {
        console.log(' getInvitations response:', response);
        return response;
      },
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
  useDeleteCommentMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useGetCollaboratorsQuery,
  useGetInvitationsQuery,
  useGetPageAccessQuery,
  useGetPageAccessAllQuery
} = noteApi;
