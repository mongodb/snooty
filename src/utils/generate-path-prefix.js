const normalizePath = path => path.replace(/\/+/g, `/`);

const generatePathPrefix = ({ parserBranch, project, snootyBranch, user }) => {
  let prefix = '';
  if (process.env.COMMIT_HASH) {
    prefix = `/${process.env.COMMIT_HASH}`;
  }
  if (process.env.PATCH_ID) {
    prefix = `${prefix}/${process.env.PATCH_ID}`;
  }
  const base = `/${project}/${user}/${parserBranch}`;
  const path = process.env.SNOOTY_DEV
    ? `${prefix}/${parserBranch}/${project}/${user}/${snootyBranch}`
    : `${prefix}/${base}`;
  return normalizePath(path);
};

// TODO: switch to ES6 export syntax if Gatsby implements support for ES6 module imports
// https://github.com/gatsbyjs/gatsby/issues/7810
module.exports.generatePathPrefix = generatePathPrefix;
