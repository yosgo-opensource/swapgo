/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  experimental: { esmExternals: true },

  compiler : {
    isStyledComponents: true,
  },

  // async redirects() {
  //   return [
  //     {
  //       source: '/SWAPGO',
  //       destination: '/SWAPGO/start',
  //       permanent: true,
  //     }
  //   ]
  // },

  images: {
    domains: ['tactusmarketing.com', 'oaidalleapiprodscus.blob.core.windows.net'], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', 
        port: '',
        pathname: '/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' }, // 設置允許的源，或使用特定域名
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
