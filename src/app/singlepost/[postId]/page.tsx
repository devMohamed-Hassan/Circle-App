"use client";
import PostCard from "@/app/_components/common/PostCard";
import { RootState, StoreDispatch } from "@/store/store";
import Loading from "@/app/loading";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPost } from "@/app/_features/posts/postsSlice";

export default function SinglePost() {
  const { postId } = useParams();
  const { isLoading, post } = useSelector(
    (state: RootState) => state.postsReducer
  );
  const dispatch = useDispatch<StoreDispatch>();
  useEffect(() => {
    dispatch(getPost(`${postId}`));
  }, []);
  if (isLoading) {
    return <Loading />;
  }
  return <>{post && <PostCard post={post} />}</>;
}
