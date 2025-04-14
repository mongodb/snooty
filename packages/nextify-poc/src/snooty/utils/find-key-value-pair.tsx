import { Node } from "../types/ast";
import { isParentNode } from "../types/ast-utils";

export function hasStringKey(
  obj: unknown,
  key: string
): obj is Record<string, unknown> {
  return typeof obj === "object" && obj !== null && key in obj;
}

/**
 * Recursively searches child nodes to find the specified key/value pair.
 * Prevents us from having to rely on a fixed depth for properties in the AST.
 */
export const findKeyValuePair = (
  nodes: Node[],
  key: string,
  value: string
): Node | undefined => {
  let result;
  const iter = (node: Node) => {
    if (hasStringKey(node, key) && node[key] === value) {
      result = node;
      return true;
    }
    return (
      isParentNode(node) &&
      Array.isArray(node.children) &&
      node.children.some(iter)
    );
  };

  nodes.some(iter);
  return result;
};
