/*
 * Given an array of text nodes with formatting, retrieve the string.
 * Returns plaintext string indicating the nested title.
 */

const getPlaintext = (nodeArray) => {
  const extractText = (title, node) => {
    if (node.type === 'text') {
      return title + node.value;
    } else if (node.children) {
      return title + node.children.reduce(extractText, '');
    }
  };

  return nodeArray && nodeArray.length > 0 ? nodeArray.reduce(extractText, '') : '';
};

module.exports = { getPlaintext };
