/*
 * Given an array of text nodes with formatting, retrieve the string.
 * Returns plaintext string indicating the nested title.
 */

import { Node } from '../types/ast';
import { isParentNode, isTextNode } from '../types/ast-utils';

export const getPlaintext = (nodeArray: Node[]) => {
  const extractText = (title: string, node: Node): string => {
    if (isTextNode(node)) {
      return title + node.value;
    } else if (isParentNode(node)) {
      return title + node.children.reduce(extractText, '');
    }
    return title;
  };

  return nodeArray && nodeArray.length > 0 ? nodeArray.reduce(extractText, '') : '';
};
