"use client";

import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Button,
  TextField,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import { Post } from "../../_features/posts/types";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface ExpandMoreProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps & any) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})<ExpandMoreProps>(({ theme, expand }) => ({
  marginLeft: "auto",
  transform: expand ? "rotate(180deg)" : "rotate(0deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function PostCard({
  post,
  onPostDeleted,
}: {
  post: Post;
  onPostDeleted?: () => void;
}) {
  const { user } = useSelector((state: RootState) => state.authReducer);
  const [expanded, setExpanded] = React.useState(false);
  const [showAllComments, setShowAllComments] = React.useState(false);
  const [newComment, setNewComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [localComments, setLocalComments] = React.useState(post.comments);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedCommentId, setSelectedCommentId] = React.useState<
    string | null
  >(null);
  const [postAnchorEl, setPostAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const [editingCommentId, setEditingCommentId] = React.useState<string | null>(
    null
  );
  const [editedContent, setEditedContent] = React.useState("");
  const [isEditingPost, setIsEditingPost] = React.useState(false);
  const [editedPostBody, setEditedPostBody] = React.useState<string>(
    post.body ?? ""
  );
  const [editedPostImage, setEditedPostImage] = React.useState<File | null>(
    null
  );
  const [updatingPost, setUpdatingPost] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
    if (!expanded) setShowAllComments(false);
  };

  const handleMenuOpen = (
    e: React.MouseEvent<HTMLElement>,
    commentId: string
  ) => {
    setAnchorEl(e.currentTarget);
    setSelectedCommentId(commentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCommentId(null);
  };

  const handlePostMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setPostAnchorEl(e.currentTarget);
  };

  const handlePostMenuClose = () => {
    setPostAnchorEl(null);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("userToken");
      if (!token) return;
      const res = await fetch("https://linked-posts.routemisr.com/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json", token: ` ${token}` },
        body: JSON.stringify({ content: newComment, post: post._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      if (data.comments?.length)
        setLocalComments((prev) => [data.comments[0], ...prev]);
      setNewComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const token = localStorage.getItem("userToken");
    if (!token) return;
    const confirmed = confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;
    try {
      const res = await fetch(
        `https://linked-posts.routemisr.com/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { token },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setLocalComments((prev) => prev.filter((c) => c._id !== commentId));
    } finally {
      handleMenuClose();
    }
  };

  const handleEditComment = async () => {
    const token = localStorage.getItem("userToken");
    if (!token || !editingCommentId || editedContent.trim() === "") return;
    try {
      const res = await fetch(
        `https://linked-posts.routemisr.com/comments/${editingCommentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", token },
          body: JSON.stringify({ content: editedContent }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setLocalComments((prev) =>
        prev.map((c) =>
          c._id === editingCommentId ? { ...c, content: editedContent } : c
        )
      );
      setEditingCommentId(null);
      setEditedContent("");
    } catch {}
  };

  const handleEditPost = async () => {
    const token = localStorage.getItem("userToken");
    if (!token || editedPostBody.trim() === "") return;
    try {
      setUpdatingPost(true);
      const formData = new FormData();
      formData.append("body", editedPostBody);
      if (editedPostImage) formData.append("image", editedPostImage);
      const res = await fetch(
        `https://linked-posts.routemisr.com/posts/${post._id}`,
        {
          method: "PUT",
          headers: { token },
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      post.body = data.post.body;
      post.image = data.post.image;
      setIsEditingPost(false);
      setEditedPostImage(null);
    } finally {
      setUpdatingPost(false);
    }
  };

  const handleDeletePost = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;
    try {
      const res = await fetch(
        `https://linked-posts.routemisr.com/posts/${post._id}`,
        {
          method: "DELETE",
          headers: { token },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onPostDeleted?.();
    } finally {
      handlePostMenuClose();
    }
  };

  return (
    <Card className="postCard" elevation={4} sx={{ m: 4 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ width: 40, height: 40 }}>
            <Image
              src={post.user.photo}
              alt={post.user.name}
              width={40}
              height={40}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          </Avatar>
        }
        action={
          <>
            {user?._id === post.user._id && (
              <IconButton onClick={handlePostMenuOpen}>
                <MoreVertIcon />
              </IconButton>
            )}
            <Menu
              anchorEl={postAnchorEl}
              open={Boolean(postAnchorEl)}
              onClose={handlePostMenuClose}
            >
              <MenuItem
                onClick={() => {
                  setIsEditingPost(true);
                  setEditedPostBody(post.body ?? "");
                  handlePostMenuClose();
                }}
              >
                Edit Post
              </MenuItem>
              <MenuItem onClick={handleDeletePost}>Delete Post</MenuItem>
            </Menu>
          </>
        }
        title={post.user.name}
        subheader={new Date(post.createdAt).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      />
      <CardContent>
        {isEditingPost ? (
          <>
            <TextField
              fullWidth
              multiline
              size="small"
              value={editedPostBody}
              onChange={(e) => setEditedPostBody(e.target.value)}
            />
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" component="label" size="small">
                {editedPostImage ? "Change Image" : "Upload Image"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setEditedPostImage(file);
                  }}
                />
              </Button>
              {editedPostImage && (
                <Box sx={{ mt: 2 }}>
                  <Image
                    src={URL.createObjectURL(editedPostImage)}
                    alt="Preview"
                    width={700}
                    height={400}
                    style={{ width: "100%", height: "auto", borderRadius: 8 }}
                  />
                </Box>
              )}
            </Box>
            <Box sx={{ textAlign: "right", mt: 2 }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleEditPost}
                disabled={editedPostBody.trim() === "" || updatingPost}
              >
                {updatingPost ? <CircularProgress size={18} /> : "Save"}
              </Button>
              <Button
                size="small"
                sx={{ ml: 1 }}
                onClick={() => {
                  setIsEditingPost(false);
                  setEditedPostImage(null);
                }}
              >
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {post.body}
          </Typography>
        )}
      </CardContent>
      {post.image && !editedPostImage && (
        <Box sx={{ mt: 1 }}>
          <Image
            src={post.image}
            alt="post image"
            width={700}
            height={400}
            style={{ width: "100%", height: "auto" }}
          />
        </Box>
      )}
      <CardActions
        sx={{ px: 2, pt: 1, display: "flex", justifyContent: "space-between" }}
      >
        <IconButton sx={{ color: "#777" }}>
          <ThumbUpIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
        >
          <CommentIcon />
        </ExpandMore>
        <IconButton sx={{ color: "#777" }}>
          <ShareIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ display: "flex", gap: 2, mx: 2, my: 2 }}>
          <Avatar sx={{ width: 40, height: 40 }}>U</Avatar>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              multiline
            />
            <Box sx={{ textAlign: "right", mt: 1 }}>
              <Button
                size="small"
                variant="contained"
                onClick={handleAddComment}
                disabled={isSubmitting || newComment.trim() === ""}
              >
                {isSubmitting ? "Commenting ..." : "Comment"}
              </Button>
            </Box>
          </Box>
        </Box>
        {localComments.length > 0 && (
          <CardContent
            sx={{
              bgcolor: "#f9f9f9",
              borderRadius: 2,
              boxShadow: 1,
              mt: 1,
              p: 2,
            }}
          >
            {localComments
              .slice(0, showAllComments ? localComments.length : 2)
              .map((comment, index) => {
                const creator = comment.commentCreator;
                if (!creator) return null;
                return (
                  <Box
                    key={comment._id || index}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Avatar sx={{ width: 44, height: 44 }}>
                      {creator.photo && !creator.photo.includes("undefined") ? (
                        <Image
                          src={creator.photo}
                          alt={creator.name}
                          width={44}
                          height={44}
                          style={{
                            borderRadius: "50%",
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      ) : (
                        creator.name?.[0] || "?"
                      )}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={600}>
                          {creator.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.createdAt).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          color: "text.primary",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {editingCommentId === comment._id ? (
                          <>
                            <TextField
                              fullWidth
                              multiline
                              size="small"
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                            />
                            <Box sx={{ mt: 1, textAlign: "right" }}>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={handleEditComment}
                                disabled={editedContent.trim() === ""}
                              >
                                Save
                              </Button>
                              <Button
                                size="small"
                                sx={{ ml: 1 }}
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditedContent("");
                                }}
                              >
                                Cancel
                              </Button>
                            </Box>
                          </>
                        ) : (
                          comment.content
                        )}
                      </Typography>
                    </Box>
                    {user?._id === creator._id && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, comment._id)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                );
              })}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              disableAutoFocusItem
            >
              <MenuItem
                onClick={() => {
                  if (selectedCommentId) {
                    const c = localComments.find(
                      (c) => c._id === selectedCommentId
                    );
                    if (c) {
                      setEditedContent(c.content ?? "");
                      setEditingCommentId(selectedCommentId);
                    }
                    handleMenuClose();
                  }
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() =>
                  selectedCommentId && handleDeleteComment(selectedCommentId)
                }
              >
                Delete
              </MenuItem>
            </Menu>
            {localComments.length > 2 && (
              <Button
                onClick={() => setShowAllComments((prev) => !prev)}
                size="small"
                sx={{
                  mt: 1,
                  textTransform: "none",
                  fontWeight: 500,
                  color: "#1976d2",
                }}
              >
                {showAllComments
                  ? "Show less"
                  : `Show more (${localComments.length - 2} more)`}
              </Button>
            )}
          </CardContent>
        )}
      </Collapse>
    </Card>
  );
}
