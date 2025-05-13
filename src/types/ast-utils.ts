import { isObject, isString } from 'lodash';
import { Directive, ParentNode, TextNode, RoleName, HeadingNode } from './ast';

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
  return [
    'abbr',
    'class',
    'command',
    'file',
    'guilabel',
    'icon',
    'highlight-blue',
    'highlight-green',
    'highlight-red',
    'highlight-yellow',
    'icon-fa5',
    'icon-fa5-brands',
    'icon-fa4',
    'icon-mms',
    'icon-charts',
    'icon-lg',
    'kbd',
    'red',
    'gold',
    'required',
    'sub',
    'subscript',
    'sup',
    'superscript',
    'link-new-tab',
  ].some((roleName) => roleName === name);
};

const isHeadingNode = (node: unknown): node is HeadingNode => {
  return isParentNode(node) && 'type' in node && node.type === 'heading';
};

export { isTextNode, isParentNode, isDirectiveNode, isRoleName, isHeadingNode };
