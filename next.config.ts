import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root so a lockfile in a parent folder can't confuse Turbopack.
  turbopack: { root: __dirname },
};

export default nextConfig;
