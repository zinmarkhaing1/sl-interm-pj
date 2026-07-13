import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type { LoginValues } from "../types/Form";
import type {RegisterValues} from "../types/Form";

const BaseUrl = import.meta.env.VITE_BASE_URL as string || 'http://localhost:5000/api';

export const authApi = createApi ({
    reducerPath : 'authApi',
    baseQuery : fetchBaseQuery({baseUrl:`${BaseUrl}`,
        prepareHeaders : (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("authorization",`Bearer ${token}`);

            }
            return headers;
        }
    }),
    endpoints : (builder) => ({
        signup : builder.mutation<any , RegisterValues>({
             query : (credentials) => ({
                url : '/auth/signup',
                method : "POST",
                body: credentials,
        }),
    }),
           
        
        login : builder.mutation<any , LoginValues>({
              query : (credentials) => ({
                url : '/auth/login',
                method :"POST", 
                body : credentials,
            }),
        }),
    }),  
});

export const {useSignupMutation, useLoginMutation} = authApi;