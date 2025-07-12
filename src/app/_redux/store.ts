import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";

export let store = configureStore({
  reducer: {
    authReducer,
  },
});

export type RootState  = ReturnType<typeof store.getState>;
