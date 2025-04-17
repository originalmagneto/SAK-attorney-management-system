/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,  // Required for static exports
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  },
  // Ensure fonts and assets are properly handled for Netlify deployment
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,
  // Add tracing for debugging routing issues
  distDir: process.env.NODE_ENV === 'production' ? '.next' : undefined,
  // Enable detailed logging for debugging
  onDemandEntries: {
    // Keep pages in memory for longer during development
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
  webpack(config) {
    return config;
  },
  // Handle JWT operations in Node.js runtime
  experimental: {
    serverComponentsExternalPackages: ['jsonwebtoken', 'jws']
  }
};

module.exports = nextConfig;