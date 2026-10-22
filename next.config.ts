import type { NextConfig } from "next";

// GitHub Pages project sites live under /<repo>; set NEXT_PUBLIC_BASE_PATH=/<repo> for those builds.
// Leave it empty for Firebase Hosting or a <user>.github.io repository.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  // A stray package-lock.json in the parent folder would otherwise be picked as the workspace root
  turbopack: { root: process.cwd() },
};

export default nextConfig;
