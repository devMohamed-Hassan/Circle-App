"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Navbar from "./_components/common/Navbar";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { Container } from "@mui/material";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <title>Circle | Social App</title>
      </head>
      <body
        style={{
          fontFamily: inter.style.fontFamily,
          color: "var(--foreground)",
          background: "linear-gradient(to right, #f5f7fa, #c3cfe2)",
          minHeight: "100vh",
        }}
      >
        <Provider store={store}>
          <AppRouterCacheProvider>
            <Navbar />
            <Container
              maxWidth="md"
              sx={{
                mt: { xs: 4, md: 8 },
                mb: { xs: 4, md: 8 },
                borderRadius: "16px",
                p: { xs: 2, sm: 4 },
                minHeight: "calc(100vh - 160px)",
              }}
            >
              {children}
            </Container>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          </AppRouterCacheProvider>
        </Provider>
      </body>
    </html>
  );
}
