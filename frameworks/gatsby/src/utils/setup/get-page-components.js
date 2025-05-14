const storeComponentNames = (node, componentNameSet) => {
  const componentNameProperty = node?.type === 'directive' || node?.type === 'role' ? 'name' : 'type';
  if (!node[componentNameProperty]) {
    console.error(
      `Node of type ${node.type} has no property ${componentNameProperty}: ${JSON.stringify({
        type: node.type,
        position: node.position,
      })}`
    );
  } else {
    componentNameSet.add(node[componentNameProperty]);
  }
  node?.children?.forEach((childNode) => {
    storeComponentNames(childNode, componentNameSet);
  });
};

/**
 * Traverse through the root nodes in page AST
 * and return the nodes and directives used in order of occurrence
 *
 * @param {node[]}    rootNodes
 */
const getPageComponents = (rootNodes) => {
  const componentNameSet = new Set();

  // there usually is only one root node, but safeguarding in case
  rootNodes.forEach((rootNode) => {
    storeComponentNames(rootNode, componentNameSet);
  });
  return [...componentNameSet];
};

module.exports = { getPageComponents };
