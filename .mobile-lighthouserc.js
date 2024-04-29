const { urlsToRunPerProject } = require('./.github/constants/lighthouse-urls');

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run serve',
      settings: {
        additive: 'true',
      },
      url: urlsToRunPerProject[process.env.GATSBY_SITE],
      numberOfRuns: 3,
    },
  },
};
