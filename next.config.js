/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'wtvnrjrbegnuubstikaj.supabase.co' },
    ],
    unoptimized: true,
  },
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://your-app.vercel.app',
  },
};

module.exports = nextConfig;
