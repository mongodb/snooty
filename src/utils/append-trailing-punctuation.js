// Append dangling punctuation to preceding Link's text
export const appendTrailingPunctuation = (nodes) => {
  const truncatedNodes = [];

  for (let i = 0; i < nodes.length; i++) {
    const currNode = nodes[i];
    const nextNode = nodes[i + 1];
    const isReference = currNode.type === 'reference';
    const hasDanglingSibling = nextNode?.type === 'text' && nextNode.value?.length === 1;

    if (isReference && hasDanglingSibling) {
      const copyOfNodeWithDeepCopiedChildren = deepCopyNodesChildren(currNode, nextNode.value);
      truncatedNodes.push(copyOfNodeWithDeepCopiedChildren);
      i++;
      continue;
    }
    truncatedNodes.push(currNode);
  }
  return truncatedNodes;
};

// Make a copy of node with a deep copy of the new child node with added punctuation
function deepCopyNodesChildren(node, additionalValue) {
  if (!node.children || !node.children.length) return node;
  const deepCopyChildren = [...node.children];
  const lastChild = deepCopyChildren.pop();

  const deepCopyLastChild = {
    ...lastChild,
    value: lastChild.value + additionalValue,
  };

  deepCopyChildren.push(deepCopyLastChild);
  const copyOfNode = {
    ...node,
    children: deepCopyChildren,
  };
  return copyOfNode;
}
