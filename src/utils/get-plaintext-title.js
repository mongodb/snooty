/*
 * Given an array of text nodes with formatting (from get-page-title.js), retrieve the title.
 * Returns plaintext string indicating the nested title.
 */

export const getPlaintextTitle = nodeArray => {
  function extractText(title, node) {
    if (node.type === 'text') {
      return title + node.value;
    }
    /* Else we have a ComponentFactory function type */
    if (node.props.nodeData.type === 'text') {
      return title + node.props.nodeData.value;
    }
    if (node.props.nodeData.type === 'literal') {
      let subtitle = node.props.nodeData.children.reduce(extractText, '');
      return title + subtitle;
    }
  }

  return nodeArray ? nodeArray.reduce(extractText, '') : '';
};
