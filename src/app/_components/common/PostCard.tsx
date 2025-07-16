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
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import { Post } from "../../_features/posts/types";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";

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
  onPostDeleted?: (userID?: string) => void;
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
  const router = useRouter();
  // console.log("user: ", user);
  // console.log("user of post: ", post.user);

  const handleExpandClick = () => {
    setExpanded(!expanded);
    if (!expanded) setShowAllComments(false);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    commentId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCommentId(null);
  };

  const handlePostMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setPostAnchorEl(event.currentTarget);
  };

  const handlePostMenuClose = () => {
    setPostAnchorEl(null);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("userToken");
      if (!token) return alert("You must be logged in to comment.");
      const res = await fetch("https://linked-posts.routemisr.com/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: ` ${token}`,
        },
        body: JSON.stringify({
          content: newComment,
          post: post._id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to post comment");
      if (data.comments?.length) {
        setLocalComments((prev) => [data.comments[0], ...prev]);
      }
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const token = localStorage.getItem("userToken");
    if (!token) return alert("You must be logged in to delete comments.");
    const confirmed = confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;
    try {
      const res = await fetch(
        `https://linked-posts.routemisr.com/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            token: `${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete comment");
      setLocalComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment.");
    } finally {
      handleMenuClose();
    }
  };

  const handleDeletePost = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return alert("You must be logged in to delete this post.");
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;
    try {
      const res = await fetch(
        `https://linked-posts.routemisr.com/posts/${post._id}`,
        {
          method: "DELETE",
          headers: {
            token: `${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete post");
      alert("Post deleted successfully.");
      onPostDeleted?.();
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post.");
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
              <IconButton aria-label="settings" onClick={handlePostMenuOpen}>
                <MoreVertIcon />
              </IconButton>
            )}
            <Menu
              anchorEl={postAnchorEl}
              open={Boolean(postAnchorEl)}
              onClose={handlePostMenuClose}
            >
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
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {post.body}
        </Typography>
      </CardContent>
      {post.image && (
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
        <IconButton aria-label="like" sx={{ color: "#777" }}>
          <ThumbUpIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show comments"
        >
          <CommentIcon />
        </ExpandMore>
        <IconButton aria-label="share" sx={{ color: "#777" }}>
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
                        {comment.content}
                      </Typography>
                    </Box>
                    <IconButton
                      aria-label="options"
                      size="small"
                      onClick={(e) => handleMenuOpen(e, comment._id)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
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
                    handleDeleteComment(selectedCommentId);
                  }
                }}
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
