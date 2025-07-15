"use client";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ChangePassword from "../_components/User/ChangePassword";
import UserInfo from "../_components/User/UserInfo";
import MyPosts from "../_components/User/MyPosts";

const SECTIONS = ["My Info", "My Posts", "Change Password"];

export default function ProfileLayout() {
  const [active, setActive] = useState("My Info");

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#fafafa",
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        height: "80vh",
      }}
    >
      <Box
        sx={{
          width: 220,
          p: 2,
          bgcolor: "#fff",
          borderRight: "1px solid #ddd",
          borderRadius: "12px 0 0 12px",
        }}
      >
        <Typography variant="h6" mb={1} fontWeight="bold" color="primary">
          Profile
        </Typography>
        <List>
          {SECTIONS.map((section) => (
            <ListItemButton
              key={section}
              selected={active === section}
              onClick={() => setActive(section)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                py: 1,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                },
              }}
            >
              <ListItemText primary={section} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box
        sx={{
          flex: 1,
          p: 3,
          bgcolor: "#fff",
          borderRadius: "0 12px 12px 0",
          overflowY: "auto",
        }}
      >
        {active === "My Info" && <UserInfo />}
        {active === "My Posts" && <MyPosts />}
        {active === "Change Password" && <ChangePassword />}
      </Box>
    </Box>
  );
}
