const { getPageSlug } = require('../get-page-slug');

const storeDirectiveNames = (node, directiveNameSet) => {
  if (node && node.type) {
    directiveNameSet.add(node.type);
  }
  node?.children?.forEach((childNode) => {
    storeDirectiveNames(childNode, directiveNameSet);
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

  // there usually is only one root node, but safeguarding in case
  rootNodes.forEach((rootNode) => {
    storeDirectiveNames(rootNode, directiveNameSet);
  });

  const nodeList = [...directiveNameSet];
  createNode({
    children: [],
    id: createNodeId(`pageDirectives-${key}`),
    internal: {
      contentDigest: createContentDigest(nodeList),
      type: nodeType,
    },
    directives: nodeList,
    slug: getPageSlug(key),
  });
};

module.exports = { constructPageDirectives };
