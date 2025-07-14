"use client";

import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Input,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import toast from "react-hot-toast";

export default function CreatePost() {
  const router = useRouter();
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData();
      formData.append("body", form.body.value);
      const imageInput = form.image as HTMLInputElement;
      const imageFile = imageInput?.files?.[0];
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
      }, 2000);
    } catch (error: any) {
      console.error("Post submission failed:", error);
      toast.error(error.message || "Failed to create post. Please try again.");
    }
  }

  return (
    <>
      <Paper elevation={5} sx={{ p: 4, m: 3 }}>
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: 600, color: "primary.main" }}
        >
          Add Your Post Now
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
            fullWidth
            required
          />

          <FormControl>
            <InputLabel htmlFor="image"></InputLabel>
            <Input id="image" name="image" type="file" />
          </FormControl>

          <Button
            variant="contained"
            type="submit"
            size="large"
            sx={{ alignSelf: "flex-start" }}
          >
            Post
          </Button>
        </Box>
      </Paper>
    </>
  );
}
