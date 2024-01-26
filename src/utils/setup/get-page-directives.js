const storeDirectiveNames = (node, nodeTypeSet, directiveNameSet) => {
  if (node?.type === 'directive') {
    directiveNameSet.add(node.name);
  }
  nodeTypeSet.add(node.type);
  node?.children?.forEach((childNode) => {
    storeDirectiveNames(childNode, nodeTypeSet, directiveNameSet);
  });
};

/**
 * Traverse through the root nodes in page AST
 * and return the nodes and directives used in order of occurrence
 *
 * @param {node[]}    rootNodes
 */
const getPageDirectives = (rootNodes) => {
  const directiveNameSet = new Set();
  const nodeTypeSet = new Set();

  // there usually is only one root node, but safeguarding in case
  rootNodes.forEach((rootNode) => {
    storeDirectiveNames(rootNode, nodeTypeSet, directiveNameSet);
  });

  const nodeList = [...nodeTypeSet];
  const directiveList = [...directiveNameSet];

  return { nodeList, directiveList };
};

module.exports = { getPageDirectives };
