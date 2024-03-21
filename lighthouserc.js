const urlsToRunPerProject = {
  docs: [
    `http://localhost:9000/docs/runner/master/`,
    `http://localhost:9000/docs/runner/master/changeStreams/`,
    `http://localhost:9000/docs/runner/master/replication/`,
  ],
  'cloud-docs': [
    `http://localhost:9000/cloud-docs/runner/master/`,
    `http://localhost:9000/cloud-docs/runner/master/atlas-search/atlas-search-overview/`,
    `http://localhost:9000/cloud-docs/runner/master/manage-clusters/`,
  ],
};

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run serve',
      url: urlsToRunPerProject[process.env.GATSBY_SITE],
      numberOfRuns: 3,
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: process.env.LIGHTHOUSE_SERVER_URL,
      token: process.env.LIGHTHOUSE_BUILD_TOKEN,
    },
  },
};
