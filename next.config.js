/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization for Cloudflare deployment
  images: {
    unoptimized: true,
  },
  // Output configuration for static export compatibility
  output: 'standalone',
}


module.exports = nextConfig
