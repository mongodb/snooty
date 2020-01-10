const generatePathPrefix = ({ parserBranch, project, snootyBranch, user }) => {
  const base = `/${project}/${user}/${parserBranch}`;
  return process.env.SNOOTY_DEV ? `/${parserBranch}/${project}/${user}/${snootyBranch}` : base;
};

// TODO: switch to ES6 export syntax if Gatsby implements support for ES6 module imports
// https://github.com/gatsbyjs/gatsby/issues/7810
module.exports.generatePathPrefix = generatePathPrefix;
