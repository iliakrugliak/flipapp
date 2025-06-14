/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
module.exports = nextConfig
module.exports = {
  images: {
    domains: ['unpkg.com'], // Если используете CDN для иконок
  },
};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // или укажите конкретные домены
      },
    ],
  },
}

