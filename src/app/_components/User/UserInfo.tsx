"use client";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Divider,
  Paper,
  Button,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { UserProfile } from "../../../types/index";
import toast from "react-hot-toast";

export default function UserInfo() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "https://linked-posts.routemisr.com/users/profile-data",
          {
            headers: {
              token: token,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

        setUser(data.user);
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeMB = 4;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`Image size must be less than ${maxSizeMB}MB`);
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setUploading(true);

      const res = await fetch(
        "https://linked-posts.routemisr.com/users/upload-photo",
        {
          method: "PUT",
          headers: {
            token: `${token}`,
          },
          body: formData,
        }
      );

      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await res.text();
        throw new Error("Unexpected response:\n" + text);
      }

      const data = await res.json();
      console.log("Upload response:", data);

      if (!res.ok) throw new Error(data.message || "Upload failed");

      const newPhoto = data?.user?.photo || data?.photo || preview;

      if (!newPhoto) {
        console.warn("Upload success but no photo returned from server");
        toast.success("Profile photo updated, but no image returned");
      } else {
        toast.success("Profile photo updated");
      }

      setUser((prev) =>
        prev && newPhoto ? { ...prev, photo: newPhoto } : prev
      );
      setPreview(null);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <CircularProgress />;

  if (!user)
    return (
      <Typography color="error">Failed to load user information.</Typography>
    );

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 500,
        mx: "auto",
        p: 4,
        borderRadius: 3,
        textAlign: "center",
        bgcolor: "#fdfdfd",
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
        My Info
      </Typography>

      <Avatar
        src={preview || user.photo || "/default-avatar.png"}
        sx={{
          width: 120,
          height: 120,
          mb: 1,
          mx: "auto",
          border: "3px solid #1976d2",
        }}
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />
      <Button
        variant="outlined"
        size="small"
        onClick={handleUploadClick}
        disabled={uploading}
        sx={{ mb: 2 }}
      >
        {uploading ? "Uploading..." : preview ? "Uploading..." : "Upload Photo"}
      </Button>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ textAlign: "left", px: 2 }}>
        <Typography sx={{ mb: 1 }}>
          <strong>Name:</strong> {user.name}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <strong>Gender:</strong> {user.gender}
        </Typography>
        <Typography>
          <strong>Date of Birth:</strong> {user.dateOfBirth}
        </Typography>
      </Box>
    </Paper>
  );
}
