import { Node } from '../types/ast';
import { isParentNode } from '../types/ast-utils';

function hasStringKey(obj: unknown, key: string): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj;
}

/**
 * Recursively searches child nodes to find the specified key/value pair.
 * Prevents us from having to rely on a fixed depth for properties in the AST.
 */
const findKeyValuePair = (nodes: Node[], key: string, value: string): Node | undefined => {
  let result;
  const iter = (node: Node) => {
    if (hasStringKey(node, key) && node[key] === value) {
      result = node;
      return true;
    }
    return isParentNode(node) && Array.isArray(node.children) && node.children.some(iter);
  };

  nodes.some(iter);
  return result;
};

// TODO: switch to ES6 export syntax if Gatsby implements support for ES6 module imports
// https://github.com/gatsbyjs/gatsby/issues/7810
module.exports.findKeyValuePair = findKeyValuePair;
