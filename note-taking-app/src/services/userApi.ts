
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BaseUrl = import.meta.env.VITE_BASE_URL as string || 'http://localhost:5000/api';

export const userApi = createApi({
  reducerPath: 'userApi',
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
  endpoints: (builder) => ({
    
    getUsers: builder.query<
      { _id: string; username: string; email: string }[],
      void
    >({
      query: () => 'users', 
    }),
   
    getUserById: builder.query<
      { _id: string; username: string; email: string },
      string
    >({
      query: (id) => `users/${id}`,
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery } = userApi;