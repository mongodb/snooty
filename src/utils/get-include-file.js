const { getNestedValue } = require('./get-nested-value');

const getIncludeFile = (includeObj, filename) => {
  let key = filename;
  if (key.startsWith('/')) {
    key = key.substr(1);
  } else {
    console.warn(`include file ${filename} does not begin with '/'`);
  }

  if (key.endsWith('.rst')) key = key.replace('.rst', '');

  return getNestedValue([key, 'ast', 'children'], includeObj) || [];
};

// TODO: switch to ES6 export syntax if Gatsby implements support for ES6 module imports
// https://github.com/gatsbyjs/gatsby/issues/7810
module.exports.getIncludeFile = getIncludeFile;
