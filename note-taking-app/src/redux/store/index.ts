
import {configureStore} from '@reduxjs/toolkit';
import {authApi } from "../../services/authApi";
import { userApi } from '../../services/userApi';
import {noteApi} from "../../services/noteApi";
// import { taskApi } from "../../services/taskApi";
import { projectApi } from '../../services/projectApi';
import { taskApi } from '../../services/taskApi';
import themeReducer from './themeSlice';
import {categoryApi} from "../../services/categoryApi";


export const store = configureStore({
    reducer:{
        [authApi.reducerPath] : authApi.reducer,
         [userApi.reducerPath]: userApi.reducer,  
        [noteApi.reducerPath] : noteApi.reducer,
        [taskApi.reducerPath] : taskApi.reducer,
        [projectApi.reducerPath] : projectApi.reducer,
        [categoryApi.reducerPath] : categoryApi.reducer,
        theme: themeReducer,
    },
    middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware,userApi.middleware,noteApi.middleware,taskApi.middleware,projectApi.middleware,categoryApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
