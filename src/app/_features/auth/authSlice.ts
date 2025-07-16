import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { AuthState, User } from "./types";

const initialState: AuthState = {
  token: null,
  user: null,
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
    setUser: (state, action) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("userData", JSON.stringify(action.payload));
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
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
      }
    },
  },
});

export const { setLoading, setDone, setToken, setUser, setError, removeToken } =
  authSlice.actions;

export const authReducer = authSlice.reducer;
