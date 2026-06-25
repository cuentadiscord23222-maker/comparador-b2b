import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/comparador-b2b",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
