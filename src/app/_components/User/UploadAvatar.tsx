"use client";
import { Avatar, Button, Box } from "@mui/material";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  userPhoto: string;
  uploading: boolean;
  onUpload: (file: File, preview: string) => void;
}

export default function UploadAvatar({
  userPhoto,
  uploading,
  onUpload,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image must be less than 4MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    onUpload(file, previewUrl);
  };

  return (
    <Box>
      <Avatar
        src={preview || userPhoto}
        sx={{
          width: 120,
          height: 120,
          mb: 2,
          mx: "auto",
          border: "3px solid #1976d2",
        }}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleChange}
      />
      <Button
        variant="contained"
        onClick={handleClick}
        disabled={uploading}
        sx={{ textTransform: "none" }}
      >
        {uploading ? "Uploading..." : "Upload Photo"}
      </Button>
    </Box>
  );
}
