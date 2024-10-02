const { normalizePath } = require('./normalize-path');

const generatePathPrefix = ({ commitHash, parserBranch, patchId, pathPrefix, project, snootyBranch, user }) => {
  // If user specified a PATH_PREFIX environment variable, ensure it begins with a prefix and use
  if (pathPrefix) {
    if (pathPrefix.startsWith('/')) {
      return pathPrefix;
    }
    return `/${pathPrefix}`;
  }

  let prefix = '';
  if (commitHash) prefix += `${commitHash}`;
  if (patchId) prefix += `/${patchId}`;

  // Include the Snooty branch in pathPrefix for Snooty developers. mut automatically
  // includes the git branch of the repo where it is called, so this parameter must
  // be present in the URL's path prefix in order to be mut-compatible.
  //
  // TODO: Simplify this logic when Snooty development is staged in integration environment
  const base = `${project}/${user}`;
  const path = process.env.GATSBY_SNOOTY_DEV
    ? `/${prefix}/${parserBranch}/${base}/${snootyBranch}`
    : `/${prefix}/${base}/${parserBranch}`;
  return normalizePath(path);
};

// TODO: switch to ES6 export syntax if Gatsby implements support for ES6 module imports
// https://github.com/gatsbyjs/gatsby/issues/7810
module.exports.generatePathPrefix = generatePathPrefix;
