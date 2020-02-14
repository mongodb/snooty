/*
 * Given an array of text nodes with formatting (from get-page-title.js), retrieve the title.
 * Returns plaintext string indicating the nested title.
 */

export const getPlaintextTitle = nodeArray => {
  const extractText = (title, node) => {
    if (node.type === 'text') {
      return title + node.value;
    } else if (node.children) {
      return title + node.children.reduce(extractText, '');
    }
  };

  return nodeArray ? nodeArray.reduce(extractText, '') : '';
};
