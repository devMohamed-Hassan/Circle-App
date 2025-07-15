"use client";

import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  Skeleton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function CreatePost() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData();
      formData.append("body", form.body.value);
      const imageFile = fileRef.current?.files?.[0];
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch("https://linked-posts.routemisr.com/posts", {
        method: "POST",
        body: formData,
        headers: {
          token: `${localStorage.getItem("userToken")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success(data.message);
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f8fafc"
      p={2}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          maxWidth: 500,
          width: "100%",
          borderRadius: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              bgcolor: "rgba(255,255,255,0.7)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton
              variant="rectangular"
              width={400}
              height={120}
              sx={{ borderRadius: 2 }}
            />
            <Skeleton
              variant="rectangular"
              width={120}
              height={40}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        )}
        <Typography
          variant="h5"
          fontWeight={600}
          color="primary"
          textAlign="center"
          mb={3}
        >
          Add Your Post
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <TextField
            name="body"
            label="What's on your mind?"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            required
          />

          <Button variant="outlined" component="label" color="primary">
            Upload Image
            <input
              ref={fileRef}
              name="image"
              type="file"
              hidden
              accept="image/*"
            />
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{
              color: "#fff",
              fontWeight: 600,
              borderRadius: 2,
              "&:hover": {
                background: "var(--primary-dark)",
              },
            }}
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
