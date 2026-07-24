
import {configureStore} from '@reduxjs/toolkit';
import {authApi } from "../../services/authApi";
import {noteApi} from "../../services/noteApi";
// import { taskApi } from "../../services/taskApi";
import { projectApi } from '../../services/projectApi';
import { taskApi } from '../../services/taskApi';
import themeReducer from './themeSlice';


export const store = configureStore({
    reducer:{
        [authApi.reducerPath] : authApi.reducer,
        [noteApi.reducerPath] : noteApi.reducer,
        [taskApi.reducerPath] : taskApi.reducer,
        [projectApi.reducerPath] : projectApi.reducer,
        theme: themeReducer,
    },
    middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware,noteApi.middleware,taskApi.middleware,projectApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
