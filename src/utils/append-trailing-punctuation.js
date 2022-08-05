// Append dangling punctuation to preceding Link's text
export const appendTrailingPunctuation = (nodes) => {
  const truncatedNodes = [];

  for (let i = 0; i < nodes.length; i++) {
    const currNode = nodes[i];
    const nextNode = nodes[i + 1];
    const isReference = currNode.type === 'reference';
    const hasDanglingSibling = nextNode?.type === 'text' && nextNode.value?.length === 1;

    if (isReference && hasDanglingSibling) {
      currNode.children[0].value += nextNode.value;
      i++;
    }
    truncatedNodes.push(currNode);
  }
  return truncatedNodes;
};
