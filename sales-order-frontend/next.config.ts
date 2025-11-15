import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  typescript: {
    // Type checking during build
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
