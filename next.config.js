/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kremerapp.s3.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
