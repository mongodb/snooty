const { normalizePath } = require('./normalize-path');

const generatePathPrefix = (
  { commitHash, parserBranch, patchId, pathPrefix, project: parserProject, snootyBranch, user },
  project,
  urlSlug
) => {
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

  // if urlSlug is present we're generating a canonical link
  // and want to replace the parser branch alias with the url slug
  const branch = urlSlug ?? parserBranch;

  // Uses the passed in project value if siteMetadata's project is undefined.
  // This is to maintain usability for both local/prod builds (uses siteMetadata) and Gatsby Cloud builds
  // (uses Snooty metadata for individual project + branch combination).
  const projectSlug = parserProject ?? project;
  // Include the Snooty branch in pathPrefix for Snooty developers. mut automatically
  // includes the git branch of the repo where it is called, so this parameter must
  // be present in the URL's path prefix in order to be mut-compatible.
  //
  // TODO: Simplify this logic when Snooty development is staged in integration environment
  const base = `${projectSlug}/${user}`;
  const path = process.env.GATSBY_SNOOTY_DEV
    ? `/${prefix}/${branch}/${base}/${snootyBranch}`
    : `/${prefix}/${base}/${branch}`;
  return normalizePath(path);
};

// TODO: switch to ES6 export syntax if Gatsby implements support for ES6 module imports
// https://github.com/gatsbyjs/gatsby/issues/7810
module.exports.generatePathPrefix = generatePathPrefix;
