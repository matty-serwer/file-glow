/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['groovy-ptarmigan-977.convex.cloud'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'groovy-ptarmigan-977.convex.cloud',
        port: '',
        pathname: '/api/storage/**',
      },
    ],
  },
};

export default nextConfig;
