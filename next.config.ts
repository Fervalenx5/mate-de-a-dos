import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'digaloconmatepormayor.com',
      },
    ],
  },
};

export default nextConfig;
