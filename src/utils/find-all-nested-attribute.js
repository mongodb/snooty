/**
 * Search all children nodes for attribute
 * @param   {node[]}    nodes
 * @param   {string}    attribute
 * @returns {string[]}
 */
export const findAllNestedAttribute = (nodes, attribute) => {
  const results = [];
  const searchNode = (node) => {
    if (node[attribute]) {
      results.push(node[attribute]);
    }
    if (node.children) {
      return node.children.forEach(searchNode);
    }
    return null;
  };
  nodes.forEach(searchNode);
  return results;
};
