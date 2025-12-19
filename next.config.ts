import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",  // <=== Enables static exports
  basePath: "",      // <=== If your repo is NOT at the root domain (e.g. username.github.io/repo-name), set this to "/repo-name"
  images: {
    unoptimized: true, // <=== Required for static export (Next.js Image component needs a server otherwise)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.tailwindcss.com",
      }
    ],
  },
};

export default nextConfig;
