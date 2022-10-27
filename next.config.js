/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'maudhio.000webhostapp.com'],
  },
}

module.exports = nextConfig
