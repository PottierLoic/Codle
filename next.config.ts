import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "strlen.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "rocq-prover.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "www.why3.org",
        pathname: "/**"
      },
    ]
  }
};

export default nextConfig;
