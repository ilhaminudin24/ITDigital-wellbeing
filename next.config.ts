import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: Removed output: "export" for SSR with Vercel
  // Note: Removed basePath and assetPrefix (not needed for Vercel deployment)
  images: {
    // unoptimized: true, // Not needed for Vercel (has built-in image optimization)
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
      },
      // Supabase Storage domain
      {
        protocol: "https",
        hostname: "jipeqeqiugokhcxmqvgk.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
