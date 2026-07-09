

import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type { Comment, Note, Notification } from '../types/Note';
const BaseUrl = import.meta.env.VITE_BASE_URL;

export const noteApi = createApi({
  reducerPath :'noteApi',

  baseQuery : fetchBaseQuery({
    baseUrl:`${BaseUrl}`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  
  tagTypes :['Note'],

  endpoints : (builder) => ({

    getNotes : builder.query<Note [], {status?: string; assignee?: string; shareScope?: "category" | "note-create-form "} | void> ({
      query : (params) => {
        if (!params) return '/notes';
        const qs = new URLSearchParams();
        qs.set('populate', 'user');
        if(params){
            if (params.status) qs.set('status', params.status);
        if (params.assignee) qs.set('assignee', params.assignee);
        if (params.shareScope) qs.set('shareScope', params.shareScope);
        }
      
        const q = qs.toString();
        return q ? `/notes?${q}` : '/notes';
      },
      providesTags : ['Note'],
    }),
    getNoteById : builder.query({
      query : (id) => `/notes/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Note' as const, id }],
    }),
    createNote : builder.mutation<Note ,Partial<Note>>({
      query : (noteData) => ({
        url :`/notes`,
        method :'POST',
        body : noteData,
      }),
      invalidatesTags : ['Note'],
    }),
    deleteNote : builder.mutation<{ message: string }, string>({
      query : (noteID) => ({
        url : `/notes/${encodeURIComponent(noteID)}`,
        method : 'DELETE',
      }),
      invalidatesTags : ['Note'],
    }),
    updateNote : builder.mutation<Note,{id:string;body:Partial<Note>}>({
      query :({id,body}) => ({
        url : `/notes/${id}`,
        method :'PUT',
        body,
      }),
      invalidatesTags:["Note"],
    }),
    getComments: builder.query<{ comments: Comment[] }, string>({
      query: (id) => `/notes/${id}/comments`,
      providesTags: (_result, _error, id) => [{ type: 'Note' as const, id }],
    }),
    addComment: builder.mutation<{ comment: Comment }, { id: string; text: string; userName?: string ;userEmail?: string}>({
      query: ({ id, text, userName,userEmail }) => ({
        url: `/notes/${id}/comments`,
        method: 'POST',
        body: { text, userName,userEmail },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Note' as const, id: arg.id }],
    }),
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
    getCollaborators: builder.query<{ collaborators: any[] }, void>({
      query: () => '/collaborators',
      providesTags: ['Note'],
    }),
    getInvitations: builder.query<{ invitations: any[] }, void>({
      query: () => '/invitations',
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
