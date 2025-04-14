import { isString } from 'lodash';
import { Directive, Node, ParentNode, RoleName, TextNode } from './ast';

const isRoleName = (name: string): name is RoleName => {
  return [
    'abbr' ,
      'class' ,
      'command' ,
      'file' ,
      'guilabel' ,
      'icon' ,
      'highlight-blue' ,
      'highlight-green' ,
      'highlight-red' ,
      'highlight-yellow' ,
      'icon-fa5' ,
      'icon-fa5-brands' ,
      'icon-fa4' ,
      'icon-mms' ,
      'icon-charts' ,
      'icon-lg' ,
      'kbd' ,
      'red' ,
      'gold' ,
      'required' ,
      'sub' ,
      'subscript' ,
      'sup' ,
      'superscript' ,
      'link-new-tab',
  ].some((roleName) => roleName === name);
}

const isTextNode = (node: Node): node is TextNode => {
  return node.type === 'text' && 'value' in node && isString(node.value);
};

const isParentNode = (node: Node): node is ParentNode => {
  return 'children' in node && Array.isArray(node.children);
};

// TODO: More with arguments, etc.
const isDirectiveNode = (node: Node): node is Directive => {
  return node.type === 'directive' && 'name' in node && isString(node.name) && ('name' in node ? isString(node.name) : true);
}

export { isRoleName, isTextNode, isParentNode, isDirectiveNode };
