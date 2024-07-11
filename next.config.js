/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  experimental: { esmExternals: true },

  async redirects() {
    return [
      {
        source: '/SWAPGO',
        destination: '/SWAPGO/start',
        permanent: true,
      },
    ]
  },
};



module.exports = nextConfig;
