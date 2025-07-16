"use client";
import { useEffect, useState } from "react";
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
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUserId(decoded.user);
      dispatch(getUserPosts(decoded.user));
    } catch (err) {
      console.error("Invalid token:", err);
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
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onPostDeleted={() => userId && dispatch(getUserPosts(userId))}
          />
        ))
      ) : (
        <Typography>No posts found.</Typography>
      )}
    </>
  );
}
