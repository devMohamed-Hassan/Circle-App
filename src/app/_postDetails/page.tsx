import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import { Post } from "../interfaces";
import Image from "next/image";
import { Box } from "@mui/material";
import Link from "next/link";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));

export default function PostDetails({ post }: { post: Post }) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ m: 3 }} elevation={5}>
      <CardHeader
        avatar={
          <Avatar sx={{ width: 40, height: 40, p: 0 }}>
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
        <Image
          src={post.image}
          alt={`${post.user.name}'s post image`}
          width={400}
          height={400}
          layout="responsive"
        />
      )}

      <CardActions
        sx={{
          width: "70%",
          mx: "auto",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <IconButton aria-label="add to favorites">
          <ThumbUpIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <CommentIcon />
        </ExpandMore>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {post.comments.length > 0 && (
          <CardContent
            sx={{
              bgcolor: "#f5f5f5",
              borderRadius: 2,
              boxShadow: 1,
              mt: 1,
              p: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <Avatar sx={{ width: 44, height: 44 }}>
                {!post.comments[0].commentCreator.photo.includes(
                  "undefined"
                ) ? (
                  <Image
                    src={post.comments[0].commentCreator.photo}
                    alt={post.comments[0].commentCreator.name}
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
                  post.comments[0].commentCreator.name.slice(0, 1)
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
                    {post.comments[0].commentCreator.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.comments[0].createdAt).toLocaleString(
                      "en-US",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{ mt: 1, color: "text.primary", whiteSpace: "pre-line" }}
                >
                  {post.comments[0].content}
                </Typography>
              </Box>
              <IconButton aria-label="options" size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          </CardContent>
        )}
      </Collapse>
    </Card>
  );
}
