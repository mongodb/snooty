const generatePathPrefix = ({ commitHash, parserBranch, patchId, pathPrefix, project, snootyBranch, user }) => {
  // If user specified a PATH_PREFIX environment variable, ensure it begins with a prefix and use
  if (pathPrefix) {
    if (pathPrefix.startsWith('/')) {
      return pathPrefix;
    }
    return `/${pathPrefix}`;
  }
};

// TODO: switch to ES6 export syntax if Gatsby implements support for ES6 module imports
// https://github.com/gatsbyjs/gatsby/issues/7810
module.exports.generatePathPrefix = generatePathPrefix;
