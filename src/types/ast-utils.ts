import { isString } from 'lodash';
import { Node, ParentNode, TextNode } from './ast';

const isTextNode = (node: Node): node is TextNode => {
  return node.type === 'text' && 'value' in node && isString(node.value);
};

const isParentNode = (node: Node): node is ParentNode => {
  return 'children' in node && Array.isArray(node.children);
};

export { isTextNode, isParentNode };
