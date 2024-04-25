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
      settings: {
        additive: 'true',
      },
      // "staticDistDir": "./public",
      url: [
        // "http://localhost/company/about/index.html?mobile",
        `${urlsToRunPerProject[process.env.GATSBY_SITE]}`,
      ],
    },
  },
};
