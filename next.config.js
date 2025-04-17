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
  },
  // Configure security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ]
      },
      {
        // Set correct MIME types for static assets
        source: '/_next/static/chunks/:file*',
        headers: [{ key: 'Content-Type', value: 'application/javascript' }]
      },
      {
        source: '/_next/static/css/:file*',
        headers: [{ key: 'Content-Type', value: 'text/css' }]
      },
      {
        source: '/_next/static/media/:file*.woff2',
        headers: [{ key: 'Content-Type', value: 'font/woff2' }]
      }
    ];
  }
};

module.exports = nextConfig;