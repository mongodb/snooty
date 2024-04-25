const { urlsToRunPerProject } = require('./lighthouserc');

module.exports = {
  ci: {
    collect: {
      settings: {
        additive: 'true',
        preset: 'desktop',
      },
      // "staticDistDir": "./public",
      url: [
        // "http://localhost/company/about/index.html?desktop",
        `${urlsToRunPerProject[process.env.GATSBY_SITE]}?desktop`,
      ],
    },
  },
};
