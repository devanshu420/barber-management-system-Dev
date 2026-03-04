/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["ik.imagekit.io"],
    qualities: [75, 85], // allow both
  },
};

export default nextConfig;
