import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Post } from "./types";

const initialState = {
  isLoading: false as boolean,
  posts: [] as Post[],
  post: null as Post | null,
  error: null as unknown,
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getPosts = createAsyncThunk("posts/getPosts", async () => {
  const response = await fetch(
    `${API_BASE_URL}/posts?limit=50&sort=-createdAt`,
    {
      method: "GET",
      headers: {
        token: `${localStorage.getItem("userToken")}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data.posts;
});

export const getPost = createAsyncThunk(
  "posts/getPost",
  async (postId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/posts/${postId}`,
      {
        method: "GET",
        headers: {
          token: `${localStorage.getItem("userToken")}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data.post;
  }
);

export const getUserPosts = createAsyncThunk(
  "posts/getUserPosts",
  async (userId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/posts`,
      {
        method: "GET",
        headers: {
          token: `${localStorage.getItem("userToken")}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data.posts);
    return [...data.posts].reverse();
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // all posts cases
    builder.addCase(getPosts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts = action.payload;
    });
    builder.addCase(getPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    // single post cases
    builder.addCase(getPost.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.post = action.payload;
    });
    builder.addCase(getPost.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    //user posts cases
    builder.addCase(getUserPosts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts = action.payload;
    });
    builder.addCase(getUserPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const postsReducer = postSlice.reducer;
