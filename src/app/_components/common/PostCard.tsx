"use client";

import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import { Post } from "../../_features/posts/types";
import Image from "next/image";
import Link from "next/link";

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

export default function PostCard({ post }: { post: Post }) {
  const [expanded, setExpanded] = React.useState(false);
  const [showAllComments, setShowAllComments] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
    if (!expanded) {
      setShowAllComments(false);
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
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
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
        sx={{
          px: 2,
          pt: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
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
        {post.comments.length > 0 && (
          <CardContent
            sx={{
              bgcolor: "#f9f9f9",
              borderRadius: 2,
              boxShadow: 1,
              mt: 1,
              p: 2,
            }}
          >
            {post.comments
              .slice(0, showAllComments ? post.comments.length : 2)
              .map((comment, index) => (
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
                    {!comment.commentCreator.photo.includes("undefined") ? (
                      <Image
                        src={comment.commentCreator.photo}
                        alt={comment.commentCreator.name}
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
                      comment.commentCreator.name.slice(0, 1)
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
                        {comment.commentCreator.name}
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

                  <IconButton aria-label="options" size="small">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}

            {post.comments.length > 2 && (
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
                  : `Show more (${post.comments.length - 2} more)`}
              </Button>
            )}
          </CardContent>
        )}
      </Collapse>
    </Card>
  );
}
