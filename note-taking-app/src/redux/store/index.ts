// import reducers from "../reducer";
import {configureStore} from '@reduxjs/toolkit';
import {authApi } from "../../services/authApi";
import {noteApi} from "../../services/noteApi";
import { taskApi } from "../../services/taskApi";


export const store = configureStore({
    reducer:{
        [authApi.reducerPath] : authApi.reducer,
        [noteApi.reducerPath] : noteApi.reducer,
        [taskApi.reducerPath] : taskApi.reducer,
    },
    middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware,noteApi.middleware,taskApi.middleware),
});

// export default store;
