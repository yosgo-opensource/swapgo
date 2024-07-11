module.exports = {
    siteUrl: 'https://go.swap.work',
    generateRobotsTxt: true,
    exclude: ['/SWAPGO', '/SWAPGO/go'],
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/SWAPGO', '/SWAPGO/go']
        },
      ],
    },
  }