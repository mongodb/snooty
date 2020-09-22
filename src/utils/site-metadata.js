const { execSync } = require('child_process');
const userInfo = require('os').userInfo;

const runningEnv = process.env.NODE_ENV || 'production';

require('dotenv').config({
  path: `.env.${runningEnv}`,
});

const getDatabase = env => {
  switch (env) {
    case 'staging':
      return 'snooty_stage';
    case 'production':
      return 'snooty_prod';
    default:
      return 'snooty_dev';
  }
};

const gitBranch = execSync('git rev-parse --abbrev-ref HEAD')
  .toString('utf8')
  .replace(/[\n\r\s]+$/, '');

const getPathPrefix = pathPrefix => {
  if (!pathPrefix) {
    return '';
  }
  if (pathPrefix.startsWith('/')) {
    return pathPrefix;
  }
  return `/${pathPrefix}`;
};

/**
 * Get site metadata used to identify this build and query correct documents
 */
const siteMetadata = {
  commitHash: process.env.COMMIT_HASH || '',
  database: getDatabase(process.env.SNOOTY_ENV),
  parserBranch: process.env.GATSBY_PARSER_BRANCH,
  parserUser: process.env.GATSBY_PARSER_USER,
  patchId: process.env.PATCH_ID || '',
  pathPrefix: getPathPrefix(process.env.PATH_PREFIX),
  project: process.env.GATSBY_SITE,
  snootyBranch: gitBranch,
  snootyEnv: process.env.SNOOTY_ENV || 'development',
  user: userInfo().username,
};

module.exports.siteMetadata = siteMetadata;
