import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../app/_features/auth/authSlice";
import { postsReducer } from "../app/_features/posts/postsSlice";

export let store = configureStore({
  reducer: {
    authReducer,
    postsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;
