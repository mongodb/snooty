const { execSync } = require('child_process');
const userInfo = require('os').userInfo;
const { generatePathPrefix } = require('./src/utils/generate-path-prefix');

const runningEnv = process.env.NODE_ENV || 'production';

require('dotenv').config({
  path: `.env.${runningEnv}`,
});

const getGitBranch = () => {
  return execSync('git rev-parse --abbrev-ref HEAD')
    .toString('utf8')
    .replace(/[\n\r\s]+$/, '');
};

const metadata = {
  parserBranch: process.env.GATSBY_PARSER_BRANCH,
  project: process.env.GATSBY_SITE,
  snootyBranch: getGitBranch(),
  user: userInfo().username,
};

module.exports = {
  pathPrefix: generatePathPrefix(metadata),
  plugins: ['gatsby-plugin-react-helmet'],
  siteMetadata: {
    ...metadata,
    title: 'MongoDB Guides',
  },
};
