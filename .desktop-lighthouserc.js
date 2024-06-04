const { urlsToRunPerProject } = require('./.github/constants/lighthouse-urls');

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run serve',
      settings: {
        additive: 'true',
        preset: 'desktop',
      },
      url: urlsToRunPerProject[process.env.GATSBY_SITE].map((url) => `${url}?desktop`),
      numberOfRuns: 3,
    },
  },
};
