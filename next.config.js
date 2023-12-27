/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mild-lemur-364.convex.cloud",
      },
    ],
  },
};

module.exports = nextConfig;
