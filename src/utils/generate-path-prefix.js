const generatePathPrefix = ({ parserBranch, project, snootyBranch, user }) => {
  return `/${parserBranch}/${project}/${user}/${snootyBranch}`;
};

// TODO: switch to ES6 export syntax if Gatsby implements support for ES6 module imports
// https://github.com/gatsbyjs/gatsby/issues/7810
module.exports.generatePathPrefix = generatePathPrefix;
