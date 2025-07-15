import { AuthState } from "./types";
import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState: AuthState = {
  token: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
    },
    setDone: (state) => {
      state.isLoading = false;
    },
    setToken: (state, action) => {
      state.isLoading = false;
      state.token = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("userToken", action.payload);
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      toast.error(action.payload, {
        duration: 2000,
      });
    },
    removeToken: (state) => {
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("userToken");
      }
    },
  },
});

export const { setLoading, setToken, setError, removeToken, setDone } =
  authSlice.actions;

export const authReducer = authSlice.reducer;
