const { urlsToRunPerProject } = require('./lighthouserc');

module.exports = {
  ci: {
    collect: {
      settings: {
        additive: 'true',
      },
      // "staticDistDir": "./public",
      url: [
        // "http://localhost/company/about/index.html?mobile",
        `${urlsToRunPerProject[process.env.GATSBY_SITE]}?mobile`,
      ],
    },
  },
};
