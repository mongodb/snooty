const { execSync } = require('child_process');
const userInfo = require('os').userInfo;

const runningEnv = process.env.NODE_ENV || 'production';

require('dotenv').config({
  path: `.env.${runningEnv}`,
});

const getGitBranch = () => {
  return execSync('git rev-parse --abbrev-ref HEAD')
    .toString('utf8')
    .replace(/[\n\r\s]+$/, '');
};

const getContentBranch = () => {
  return process.env.GATSBY_SNOOTY_DEV ? getGitBranch() : process.env.GATSBY_PARSER_BRANCH;
};

const getPathPrefix = () => {
  const user = userInfo().username;
  const branch = getContentBranch();

  return runningEnv === 'production' ? `/${process.env.GATSBY_SITE}/${user}/${branch}` : '/';
};

module.exports = {
  pathPrefix: getPathPrefix(),
  plugins: ['gatsby-plugin-react-helmet'],
  siteMetadata: {
    branch: getContentBranch(),
    project: process.env.GATSBY_SITE,
    title: 'MongoDB Guides',
    user: userInfo().username,
  },
};
