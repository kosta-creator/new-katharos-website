/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: '/new-katharos-website',
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
