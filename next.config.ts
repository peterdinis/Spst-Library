import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  compress: true,
  experimental: {
    cssChunking: true
  }
};

export default nextConfig;
