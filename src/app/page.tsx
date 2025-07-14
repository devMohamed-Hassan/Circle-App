"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "./_redux/postsSlice";
import { RootState, StoreDispatch } from "./_redux/store";
import PostDetails from "./_postDetails/page";

export default function Home() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(true);
  const { isLoading, posts } = useSelector(
    (state: RootState) => state.postsReducer
  );
  const dispatch = useDispatch<StoreDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      router.push("/login");
    } else {
      setAuthenticated(false);
      dispatch(getPosts());
    }
  }, [router, dispatch]);

  if (authenticated) return null;
  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      {posts.map((post) => (
        <PostDetails key={post.id} post={post} />
      ))}
    </>
  );
}
