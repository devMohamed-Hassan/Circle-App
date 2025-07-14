import type { NextConfig } from "next";

const config: NextConfig = {
  //https://linked-posts.routemisr.com/uploads/default-profile.png
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "linked-posts.routemisr.com",
        pathname: "/uploads/**",
        search: "",
      },
    ],
  },
};

export default config;
