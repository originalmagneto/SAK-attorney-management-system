/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,  // Required for static exports
    domains: ['example.com'], // Add domains for external images
  },
  output: 'export', // Ensures static build for Netlify
  // Prevent errors with CSS modules
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    });
    return config;
  },
};

module.exports = nextConfig;