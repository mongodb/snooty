const runningEnv = process.env.NODE_ENV || 'production';

require('dotenv').config({
  path: `.env.${runningEnv}`,
});

module.exports = {
  ci: {
    collect: {
      staticDistDir: './public',
      startServerCommand: 'npm run serve',
      url: ['http://localhost:8080'],
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: 'http://localhost:9001',
      token: process.env.LHCI_BUILD_TOKEN,
    },
  },
};
