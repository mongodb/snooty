const urlsToRunPerProject = {
  docs: [
    `http://localhost:9000/docs/runner/master/?desktop`,
    `http://localhost:9000/docs/runner/master/changeStreams/?desktop`,
    `http://localhost:9000/docs/runner/master/replication/?desktop`,
  ],
  'cloud-docs': [
    `http://localhost:9000/cloud-docs/runner/master/?desktop`,
    `http://localhost:9000/cloud-docs/runner/master/atlas-search/atlas-search-overview/?desktop`,
    `http://localhost:9000/cloud-docs/runner/master/manage-clusters/?desktop`,
  ],
};
module.exports = {
  ci: {
    collect: {
      settings: {
        additive: 'true',
        preset: 'desktop',
      },
      // "staticDistDir": "./public",
      url: urlsToRunPerProject[process.env.GATSBY_SITE],
    },
  },
};
