const userInfo = require('os').userInfo;
const { generatePathPrefix } = require('./src/utils/generate-path-prefix');
const { getGitBranch } = require('./src/utils/get-git-branch');

const runningEnv = process.env.NODE_ENV || 'production';

require('dotenv').config({
  path: `.env.${runningEnv}`,
});

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
