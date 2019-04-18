const runningEnv = process.env.NODE_ENV || 'production';

require('dotenv').config({
  path: `.env.${runningEnv}`,
});

module.exports = {
  pathPrefix: process.env.GATSBY_PREFIX !== '' ? process.env.GATSBY_PREFIX : '/'
}