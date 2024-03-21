module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run serve',
      url: [`http://localhost:9000/${process.env.GATSBY_SITE}/runner/master`],
      numberOfRuns: 3,
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: process.env.LIGHTHOUSE_SERVER_URL,
      token: process.env.LIGHTHOUSE_BUILD_TOKEN,
    },
  },
};
