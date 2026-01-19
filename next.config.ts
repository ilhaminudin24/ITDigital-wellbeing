import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",  // <=== Enables static exports
  basePath: "/ITDigital-wellbeing",      // <=== Required for GitHub Pages subdirectory
  assetPrefix: "/ITDigital-wellbeing/",  // <=== Required for static assets on GitHub Pages
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
