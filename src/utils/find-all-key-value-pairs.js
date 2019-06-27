/**
 * Searches child nodes to find all instances of the specified key/value pair in the `nodes` object.
 */
export const findAllKeyValuePairs = (nodes, key, value) => {
  const results = [];
  const searchNode = node => {
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
