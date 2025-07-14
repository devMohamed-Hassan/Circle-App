"use client";
import PostDetails from "@/app/_postDetails/page";
import { getPost } from "@/app/_redux/postsSlice";
import { RootState, StoreDispatch } from "@/app/_redux/store";
import Loading from "@/app/loading";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  return <>{post && <PostDetails post={post} />}</>;
}
