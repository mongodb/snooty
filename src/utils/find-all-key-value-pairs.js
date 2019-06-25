/**
 * Searches child nodes to find all instances of the specified key/value pair in the `nodes` object.
 */
export const findAllKeyValuePairs = (nodes, key, value) => {
  const results = [];
  const iter = node => {
    if (node[key] === value) {
      results.push(node);
    }
    if (node.children) {
      return node.children.forEach(iter);
    }
    return null;
  };
  nodes.forEach(iter);
  return results;
};
