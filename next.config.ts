import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
	reactStrictMode: true,
	experimental: {
		typedEnv: true,
		viewTransition: true
	},
	cacheComponents: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
			{
				protocol: "http",
				hostname: "**",
			},
		],
	},
	typedRoutes: true,
};

export default nextConfig;
