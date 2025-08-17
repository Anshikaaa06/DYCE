import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});


const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol:"https",
        hostname:"bzkewhcxdorwlzqkxmgi.supabase.co"
      }
    ],
  },
};

export default nextConfig;
