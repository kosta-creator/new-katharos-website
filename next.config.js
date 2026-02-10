/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  // Disable ESLint during build (for deployment)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during build (for deployment)
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
