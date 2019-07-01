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

const getPathPrefix = () => {
  const user = userInfo().username;
  const gitBranch = getGitBranch();

  return runningEnv === 'production' ? `/${process.env.GATSBY_SITE}/${user}/${gitBranch}` : '/';
};

module.exports = {
  pathPrefix: getPathPrefix(),
  plugins: ['gatsby-plugin-react-helmet'],
  siteMetadata: {
    branch: getGitBranch(),
    project: process.env.GATSBY_SITE,
    title: 'MongoDB Guides',
    user: userInfo().username,
  },
};
