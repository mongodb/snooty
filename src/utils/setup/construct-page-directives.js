const { getPageSlug } = require('../get-page-slug');

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
 * Generates graphql nodes that contains the unique directives
 * used in a page, in order of first occurrence.
 * Use a page query using slug to fetch unique directives
 *
 * @param {node[]}    rootNodes
 * @param {string}    key
 * @param {function}  createNode
 * @param {function}  createNodeId
 * @param {function}  createContentDigest
 * @param {string}    nodeType
 */
const constructPageDirectives = ({ rootNodes, key, createNode, createNodeId, createContentDigest, nodeType }) => {
  const directiveNameSet = new Set();
  const nodeTypeSet = new Set();

  // there usually is only one root node, but safeguarding in case
  rootNodes.forEach((rootNode) => {
    storeDirectiveNames(rootNode, nodeTypeSet, directiveNameSet);
  });

  const nodeList = [...nodeTypeSet];
  const directiveList = [...directiveNameSet];
  createNode({
    children: [],
    id: createNodeId(`pageDirectives-${key}`),
    internal: {
      contentDigest: createContentDigest(nodeList),
      type: nodeType,
    },
    nodeTypes: nodeList,
    directiveTypes: directiveList,
    slug: getPageSlug(key),
  });
};

module.exports = { constructPageDirectives };
