

import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type { Note } from '../types/Note';
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

    getNotes : builder.query<Note [], void> ({
      query : () => '/notes',
      providesTags : ['Note'],
    }),
    getNoteById : builder.query<Note, string>({
      query : (noteID) => `/notes/${encodeURIComponent(noteID)}`,
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

  }),

  
});
export const { useGetNotesQuery, useGetNoteByIdQuery,useCreateNoteMutation,useDeleteNoteMutation} = noteApi;
