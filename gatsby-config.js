const runningEnv = process.env.NODE_ENV || 'production';

require('dotenv').config({
  path: `.env.${runningEnv}`,
});

const getPathPrefix = () =>
  process.env.GATSBY_PREFIX ||
  (runningEnv === 'production'
    ? `/${process.env.GATSBY_SITE}/${process.env.GATSBY_USER}/${process.env.GATSBY_BRANCH}`
    : '/');

module.exports = {
  pathPrefix: getPathPrefix(),
};
