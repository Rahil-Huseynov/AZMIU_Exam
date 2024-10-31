import { configureStore, Store } from "@reduxjs/toolkit";
import { azmiu } from "../Services/Api/azmiu";
import azmiuSlice from "./slices/azmiuSlice";

export const store: Store = configureStore({
    reducer: {
        [azmiu.reducerPath]: azmiu.reducer,
        Azmiu: azmiuSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(azmiu.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
