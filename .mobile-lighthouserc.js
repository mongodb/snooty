const urlsToRunPerProject = {
  docs: [
    `http://localhost:9000/docs/runner/master/?mobile`,
    `http://localhost:9000/docs/runner/master/changeStreams/?mobile`,
    `http://localhost:9000/docs/runner/master/replication/?mobile`,
  ],
  'cloud-docs': [
    `http://localhost:9000/cloud-docs/runner/master/?mobile`,
    `http://localhost:9000/cloud-docs/runner/master/atlas-search/atlas-search-overview/?mobile`,
    `http://localhost:9000/cloud-docs/runner/master/manage-clusters/?mobile`,
  ],
};
module.exports = {
  ci: {
    collect: {
      settings: {
        additive: 'true',
      },
      // "staticDistDir": "./public",
      url: urlsToRunPerProject[process.env.GATSBY_SITE],
    },
  },
};
