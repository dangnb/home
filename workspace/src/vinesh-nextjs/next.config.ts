import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcrypt'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ],
  },
  // Bảo mật: Giới hạn kích thước body cho Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  // Powered-by header bị tắt → không lộ tech stack
  poweredByHeader: false,
};

export default nextConfig;
