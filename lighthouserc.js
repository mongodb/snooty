const runningEnv = process.env.NODE_ENV || 'production';

require('dotenv').config({
  path: `.env.${runningEnv}`,
});

module.exports = {
  ci: {
    collect: {
      staticDistDir: './public',
      startServerCommand: 'npm run serve',
      url: ['http://localhost:9000/master/docs/docs-builder-bot/DOP-4165-lhci'], // change to main before merge
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: 'https://docs-lighthouse-server.docs.prod.corp.mongodb.com/',
      token: process.env.LIGHTHOUSE_BUILD_TOKEN,
    },
  },
};
