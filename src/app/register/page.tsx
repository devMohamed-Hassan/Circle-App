"use client";

import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  MenuItem,
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

export default function Register() {
  const isLoading = useSelector(
    (store: RootState) => store.authReducer.isLoading
  );
  const dispatch = useDispatch();
  const router = useRouter();

  async function register(values: {
    name: string;
    email: string;
    password: string;
    rePassword: string;
    dateOfBirth: string;
    gender: string;
  }) {
    try {
      dispatch(setLoading());

      const res = await fetch(
        `https://linked-posts.routemisr.com/users/signup`,
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
        dispatch(setError(data.message || "Registration failed"));
        toast.error(data.message || "Registration failed");
        return;
      }

      dispatch(setToken(data.token));
      toast.success("Account created successfully");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      dispatch(setError(err.message || "Unknown error"));
      toast.error(err.message || "Unknown error");
    } finally {
      dispatch(setDone());
    }
  }

  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "male",
    },
    onSubmit: register,
  });

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "500px",
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
          Create your account
        </Typography>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <TextField
            fullWidth
            label="Name"
            id="name"
            value={values.name}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Email"
            id="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            id="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Re-enter Password"
            id="rePassword"
            type="password"
            value={values.rePassword}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Date of Birth"
            id="dateOfBirth"
            type="date"
            value={values.dateOfBirth}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            select
            label="Gender"
            id="gender"
            value={values.gender}
            onChange={handleChange}
            variant="outlined"
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </TextField>

          <Button
            disabled={isLoading}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 1 }}
          >
            {!isLoading ? (
              "Register"
            ) : (
              <CircularProgress size={20} color="inherit" />
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
