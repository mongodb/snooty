import { isObject, isString } from 'lodash';
import { Directive, ParentNode, TextNode, RoleName, HeadingNode, roleNames, FootnoteReferenceNode } from './ast';

const isTextNode = (node: unknown): node is TextNode => {
  return isObject(node) && 'type' in node && node.type === 'text' && 'value' in node && isString(node.value);
};

const isParentNode = (node: unknown): node is ParentNode => {
  return isObject(node) && 'children' in node && Array.isArray(node.children);
};

const isDirectiveNode = (node: unknown): node is Directive => {
  return (
    isParentNode(node) && 'name' in node && isString(node.name) && 'argument' in node && Array.isArray(node.argument)
  );
};

const isRoleName = (name: string): name is RoleName => {
  return roleNames.includes(name);
};

const isHeadingNode = (node: unknown): node is HeadingNode => {
  return isParentNode(node) && node.type === 'heading';
};

const isFootnoteReferenceNode = (node: unknown): node is FootnoteReferenceNode => {
  return isParentNode(node) && node.type === 'footnote_reference';
};

export { isTextNode, isParentNode, isDirectiveNode, isFootnoteReferenceNode, isRoleName, isHeadingNode };
