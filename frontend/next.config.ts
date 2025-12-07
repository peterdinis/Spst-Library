import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*",
				port: "",
				pathname: "/**",
			},
		],
		deviceSizes: [640, 750, 828],
		imageSizes: [16, 32, 64],
	},
};

export default nextConfig;
