module.exports = {
  siteUrl: 'https://go.swap.work',
  generateRobotsTxt: true,
  exclude: ['/SWAPGO', '/SWAPGO/go'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/SWAPGO$', '/SWAPGO/go$'],
      },
      {
        userAgent: '*',
        allow: '/SWAPGO/go?*',
      },
      {
        userAgent: '*',
        allow: '/SWAPGO/start',
      },
    ],
  },
  additionalPaths: async (config) => [
    await config.transform(config, '/SWAPGO/go?id=1&side=1&player=SwapGo%20Player%201&difficulty=2&boardSize=9'),
    await config.transform(config, '/SWAPGO/go?id=2&side=1&player=SwapGo%20Player%201&difficulty=2&boardSize=9'),
    await config.transform(config, '/SWAPGO/go?id=3&side=1&player=SwapGo%20Player%201&difficulty=2&boardSize=9'),
  ],
};
