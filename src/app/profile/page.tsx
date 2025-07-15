"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState, StoreDispatch } from "../../store/store";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../../types/index";
import { getUserPosts } from "../_features/posts/postsSlice";
import PostCard from "../_components/PostCard";

export default function Profile() {
  const { isLoading, posts } = useSelector(
    (state: RootState) => state.postsReducer
  );
  const dispatch = useDispatch<StoreDispatch>();

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const { user } = jwtDecode<DecodedToken>(token);
        setUserId(user);
        dispatch(getUserPosts(user));
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  }, [dispatch]);

  return (
    <>
      <h2>Profile</h2>

      {isLoading ? (
        <p>Loading your posts...</p>
      ) : posts.length > 0 ? (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      ) : (
        <p>You have not created any posts yet.</p>
      )}
    </>
  );
}
