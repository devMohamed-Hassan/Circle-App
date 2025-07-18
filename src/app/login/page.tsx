"use client";

import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  setDone,
  setError,
  setLoading,
  setToken,
} from "../_features/auth/authSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Login() {
  const isLoading = useSelector(
    (store: RootState) => store.authReducer.isLoading
  );
  const dispatch = useDispatch();
  const router = useRouter();

  async function login(values: { email: string; password: string }) {
    try {
      dispatch(setLoading());

      const res = await fetch(
        `${API_BASE_URL}/users/signin`,
        {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        dispatch(setError(data.message || "Login failed"));
        return;
      }
      dispatch(setToken(data.token));
      toast.success("Login success");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      dispatch(setError(err.message || "Unknown error"));
    } finally {
      dispatch(setDone());
    }
  }

  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: login,
  });

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          color="primary"
        >
          Login to your account
        </Typography>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <TextField
            fullWidth
            onChange={handleChange}
            value={values.email}
            id="email"
            label="Email"
            type="email"
            variant="outlined"
          />
          <TextField
            fullWidth
            onChange={handleChange}
            value={values.password}
            id="password"
            type="password"
            label="Password"
            variant="outlined"
          />

          <Button
            disabled={isLoading}
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ py: 1 }}
          >
            {!isLoading ? (
              "Login"
            ) : (
              <CircularProgress size={20} color="inherit" />
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
