"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { Typography, CircularProgress } from "@mui/material";
import PostCard from "../common/PostCard";
import { RootState, StoreDispatch } from "@/store/store";
import { getUserPosts } from "../../_features/posts/postsSlice";
import { DecodedToken } from "@/types";

export default function MyPosts() {
  const dispatch = useDispatch<StoreDispatch>();
  const { posts, isLoading } = useSelector(
    (state: RootState) => state.postsReducer
  );

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      const { user: userId } = jwtDecode<DecodedToken>(token);
      dispatch(getUserPosts(userId));
    } catch (error) {
      console.error("Token decode failed:", error);
    }
  }, [dispatch]);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        My Posts
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : posts.length > 0 ? (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      ) : (
        <Typography>No posts found.</Typography>
      )}
    </>
  );
}
