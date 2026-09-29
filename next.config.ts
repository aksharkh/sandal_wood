import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The home directory has its own lockfile; pin the workspace root to this app.
  turbopack: { root: __dirname },
};

export default nextConfig;
