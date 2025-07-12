"use client";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Navbar from "./_navbar/page";
import { Provider } from "react-redux";
import { store } from "./_redux/store";
import { Container } from "@mui/material";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{ fontFamily: roboto.style.fontFamily }}
      >
        <Provider store={store}>
          <AppRouterCacheProvider>
            <Navbar />
            <Container maxWidth="sm" sx={{ mt: 10, color: "#000000" }}>
              {children}
              <Toaster />
            </Container>
          </AppRouterCacheProvider>
        </Provider>
      </body>
    </html>
  );
}
