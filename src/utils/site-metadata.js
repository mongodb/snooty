const { execSync } = require('child_process');
const userInfo = require('os').userInfo;
const { fetchManifestMetadata } = require('../utils/setup/fetch-manifest-metadata');
const { DOTCOM_BASE_URL } = require('./base-url');

// loads vars from the .env file into process.env object
const runningEnv = process.env.NODE_ENV || 'production';

require('dotenv').config({
  path: `.env.${runningEnv}`,
});

const manifestMetadata = fetchManifestMetadata();

const getDatabase = (env) => {
  switch (env) {
    case 'staging':
      return 'snooty_stage';
    case 'production':
      return 'snooty_prod';
    case 'dotcomstg':
      return 'snooty_dotcomstg';
    case 'dotcomprd':
      return 'snooty_dotcomprd';
    default:
      return 'snooty_dev';
  }
};

const getReposDatabase = (env) => {
  switch (env) {
    case 'staging':
      return 'pool_test';
    case 'production':
      return 'pool';
    case 'dotcomstg':
      return 'pool_test';
    case 'dotcomprd':
      return 'pool';
    default:
      return 'pool_test';
  }
};

const gitBranch = execSync('git rev-parse --abbrev-ref HEAD')
  .toString('utf8')
  .replace(/[\n\r\s]+$/, '');

const getPathPrefix = (pathPrefix) => {
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

console.log(manifestMetadata)
const siteMetadata = {
  commitHash: process.env.COMMIT_HASH || '',
  database: getDatabase(process.env.SNOOTY_ENV),
  reposDatabase: getReposDatabase(process.env.SNOOTY_ENV),
  parserBranch: manifestMetadata['branch'] || process.env.GATSBY_PARSER_BRANCH || `master`,
  parserUser: process.env.GATSBY_PARSER_USER || userInfo().username,
  patchId: process.env.PATCH_ID || '',
  pathPrefix: getPathPrefix(process.env.PATH_PREFIX),
  project: manifestMetadata['project'] || process.env.GATSBY_SITE,
  siteUrl: DOTCOM_BASE_URL,
  snootyBranch: gitBranch,
  snootyEnv: process.env.SNOOTY_ENV || 'development',
  user: userInfo().username,
  manifestPath: process.env.GATSBY_MANIFEST_PATH,
};

module.exports.siteMetadata = siteMetadata;
module.exports.manifestMetadata = manifestMetadata;
