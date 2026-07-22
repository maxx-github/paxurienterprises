/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image Optimization Configuration
  images: {
    remotePatterns: [
      // 1. Unsplash (for hero carousel and demo images)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },

      // 2. Vercel Blob (for uploaded images: products, fundis, projects)
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },

      // 3. Your custom domain (if you host images on your own server)
      {
        protocol: 'https',
        hostname: 'paxuri-enterprises.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.paxuri-enterprises.com',
        port: '',
        pathname: '/**',
      },

      // 4. Cloudinary (if you decide to use it later)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },

      // 5. AWS S3 (if you decide to use it later)
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
        pathname: '/**',
      },

      // 6. Local development (localhost)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
    // Optional: Set maximum image size for optimization (default is 3840px)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Optional: Set image formats to generate
    formats: ['image/webp', 'image/avif'],
  },
  // Redirects (optional: force HTTPS in production)
  async redirects() {
    return [];
  },
  // Headers (optional: add security headers)
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
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'; base-uri 'self'; form-action 'self'"
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;