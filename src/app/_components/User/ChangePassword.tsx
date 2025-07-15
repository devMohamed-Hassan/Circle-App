"use client";
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { updatePassword } from "@/app/services/userService";

export default function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPass !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("You must be logged in to change your password.");
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(current, newPass, token);

      toast.success("Password updated successfully");

      setCurrent("");
      setNewPass("");
      setConfirm("");

      setTimeout(() => {
        localStorage.removeItem("userToken");
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
      <Typography variant="h6" mb={2}>
        Change Password
      </Typography>
      <TextField
        label="Current Password"
        type="password"
        fullWidth
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        sx={{ mb: 2 }}
        required
      />
      <TextField
        label="New Password"
        type="password"
        fullWidth
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
        sx={{ mb: 2 }}
        required
      />
      <TextField
        label="Confirm New Password"
        type="password"
        fullWidth
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        sx={{ mb: 2 }}
        required
      />
      <Button type="submit" variant="contained" disabled={isLoading}>
        {isLoading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          "Update Password"
        )}
      </Button>
    </Box>
  );
}
