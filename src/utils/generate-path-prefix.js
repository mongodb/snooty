const normalizePath = path => path.replace(/\/+/g, `/`);

const generatePathPrefix = ({ parserBranch, project, snootyBranch, user }) => {
  let prefix = '';
  if (process.env.COMMIT_HASH) prefix = `${process.env.COMMIT_HASH}`;

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
