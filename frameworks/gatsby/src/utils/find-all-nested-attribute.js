/**
 * Search all children nodes for attribute
 * @param   {node[]}    nodes
 * @param   {string}    attribute
 * @returns {string[]}
 */
export const findAllNestedAttribute = (nodes, attribute) => {
  const results = [];
  const searchNode = (node) => {
    if (Object.hasOwn(node, attribute)) {
      results.push(node[attribute]);
    }
    if (node.children) {
      node.children.forEach(searchNode);
    }
  };
  nodes.forEach(searchNode);
  return results;
};
