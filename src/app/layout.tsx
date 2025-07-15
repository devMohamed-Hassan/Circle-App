"use client";

import { Roboto, Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Navbar from "./_components/common/Navbar";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { Container } from "@mui/material";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body
        style={{
          fontFamily: roboto.style.fontFamily,
          color: "var(--foreground)",
          backgroundColor: "var(--background)",
          ["--font-heading" as any]: inter.style.fontFamily,
        }}
      >
        <Provider store={store}>
          <AppRouterCacheProvider>
            <Navbar />
            <Container
              maxWidth="md"
              sx={{
                mt: 5,
                color: "#000000",
                background: "var(--background)",
                borderRadius: "var(--border-radius)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                p: { xs: 2, md: 4 },
              }}
            >
              {children}
            </Container>
            <Toaster position="top-right" />
          </AppRouterCacheProvider>
        </Provider>
      </body>
    </html>
  );
}
