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

const SECTIONS = ["Account", "Activity", "Update Password"];

export default function ProfileLayout() {
  const [active, setActive] = useState("Account");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        bgcolor: "#fafafa",
        p: { xs: 1, md: 2 },
        borderRadius: 2,
        boxShadow: 3,
        height: { xs: "auto", md: "60vh" },
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: "100%", md: 220 },
          p: 2,
          bgcolor: "#fff",
          borderRight: { md: "1px solid #ddd" },
          borderBottom: { xs: "1px solid #ddd", md: "none" },
          borderRadius: {
            xs: "12px 12px 0 0",
            md: "12px 0 0 12px",
          },
        }}
      >
        <Typography variant="h6" mb={1} fontWeight="bold" color="primary">
          Profile
        </Typography>
        <List
          sx={{
            display: "flex",
            flexDirection: { xs: "row", md: "column" },
            flexWrap: "wrap",
          }}
        >
          {SECTIONS.map((section) => (
            <ListItemButton
              key={section}
              selected={active === section}
              onClick={() => setActive(section)}
              sx={{
                borderRadius: 1,
                mb: { xs: 0, md: 0.5 },
                mr: { xs: 1, md: 0 },
                py: 1,
                px: 2,
                flex: { xs: "1 1 auto", md: "unset" },
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

      {/* Content Area */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 3 },
          bgcolor: "#fff",
          borderRadius: {
            xs: "0 0 12px 12px",
            md: "0 12px 12px 0",
          },
          overflowY: "auto",
        }}
      >
        {active === "Account" && <UserInfo />}
        {active === "Activity" && <MyPosts />}
        {active === "Update Password" && <ChangePassword />}
      </Box>
    </Box>
  );
}
