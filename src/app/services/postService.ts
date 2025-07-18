const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const addComment = async (
  postId: string,
  content: string,
  token: string
) => {
  const res = await fetch(`${API_BASE_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", token: ` ${token}` },
    body: JSON.stringify({ content, post: postId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.comments?.[0];
};

export const deleteComment = async (commentId: string, token: string) => {
  const res = await fetch(
    `${API_BASE_URL}/comments/${commentId}`,
    {
      method: "DELETE",
      headers: { token },
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return true;
};

export const editComment = async (
  commentId: string,
  content: string,
  token: string
) => {
  const res = await fetch(
    `${API_BASE_URL}/comments/${commentId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", token },
      body: JSON.stringify({ content }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const editPost = async (
  postId: string,
  body: string,
  token: string,
  image: File | null
) => {
  const formData = new FormData();
  formData.append("body", body);
  if (image) formData.append("image", image);

  const res = await fetch(
    `${API_BASE_URL}/posts/${postId}`,
    {
      method: "PUT",
      headers: { token },
      body: formData,
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data.post;
};

export const deletePost = async (postId: string, token: string) => {
  const res = await fetch(
    `${API_BASE_URL}/posts/${postId}`,
    {
      method: "DELETE",
      headers: { token },
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return true;
};
