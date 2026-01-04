/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: 'nodejs',
  },
  // Disable image optimization for Cloudflare deployment
  images: {
    unoptimized: true,
  },
  // Output configuration for static export compatibility
  output: 'standalone',
  // Disable server-side features that aren't supported in Cloudflare Workers
  serverRuntimeConfig: {},
  publicRuntimeConfig: {},
}

module.exports = nextConfig
