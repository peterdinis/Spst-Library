import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
    ],
  },
  typedRoutes: true,
  experimental: {
    browserDebugInfoInTerminal: true,
    typedEnv: true,
  },
};

export default nextConfig;