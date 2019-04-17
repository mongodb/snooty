const runningEnv = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';

require('dotenv').config({
  path: `.env.${runningEnv}`,
});

console.log(`=== NODE_ENV IS SET TO ${runningEnv} ===`);

module.exports = {
  pathPrefix: process.env.GATSBY_PREFIX !== '' ? process.env.GATSBY_PREFIX : '/'
}