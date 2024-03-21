// const runningEnv = process.env.NODE_ENV || 'production';

// require('dotenv').config({
//   path: `.env.${runningEnv}`,
// });

module.exports = {
  ci: {
    collect: {
      staticDistDir: './public',
      startServerCommand: 'npm run serve',
      url: [`http://localhost:9000/${process.env.PROJECT}/runner/master`], // change to main before merge?
      numberOfRuns: 3,
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: process.env.LIGHTHOUSE_SERVER_URL,
      token: process.env.LIGHTHOUSE_BUILD_TOKEN,
    },
  },
};
