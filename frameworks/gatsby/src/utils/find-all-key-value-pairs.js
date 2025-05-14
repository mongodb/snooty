/**
 * Searches child nodes to find all instances of the specified key/value pair in the `nodes` object.
 */
const findAllKeyValuePairs = (nodes, key, value) => {
  const results = [];
  const searchNode = (node) => {
    if (node[key] === value) {
      results.push(node);
    }
    if (node.children) {
      return node.children.forEach(searchNode);
    }
    return null;
  };
  nodes.forEach(searchNode);
  return results;
};

// TODO: switch to ES6 export syntax if Gatsby implements support for ES6 module imports
// https://github.com/gatsbyjs/gatsby/issues/7810
module.exports.findAllKeyValuePairs = findAllKeyValuePairs;
