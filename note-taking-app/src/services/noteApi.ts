

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
    getNoteById : builder.query({
      query : (id) => `/notes/${id}`,
      providesTags:(result,error,id) => [{type:'Note',id}],
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
    })

  }),

  
});
export const { useGetNotesQuery, useGetNoteByIdQuery,useCreateNoteMutation,useDeleteNoteMutation,useUpdateNoteMutation} = noteApi;
