"use client";

import { Button, CircularProgress, Paper, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../_redux/store";
import { setDone, setError, setLoading, setToken } from "../_redux/authSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
        `https://linked-posts.routemisr.com/users/signin`,
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
      }, 2000);
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
    <>
      <Paper elevation={5} sx={{ p: 2, m: 3 }}>
        <h2 className="bg-gray-800">Login</h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            padding: "2rem",
          }}
        >
          <TextField
            onChange={handleChange}
            value={values.email}
            id="email"
            label="Email"
            type="email"
            variant="standard"
          />
          <TextField
            onChange={handleChange}
            value={values.password}
            id="password"
            type="password"
            label="Password"
            variant="standard"
          />

          <Button disabled={isLoading} variant="contained" type="submit">
            {!isLoading ? (
              "Login"
            ) : (
              <CircularProgress size={20} color="inherit" />
            )}
          </Button>
        </form>
      </Paper>
    </>
  );
}
