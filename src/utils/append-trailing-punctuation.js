// Append dangling punctuation to preceding Link's text
export const appendTrailingPunctuation = (nodes) => {
  const truncatedNodes = [];

  for (let i = 0; i < nodes.length; i++) {
    const currNode = nodes[i];
    const nextNode = nodes[i + 1];
    const isReference = currNode.type === 'reference' || currNode.type === 'ref_role';
    const hasDanglingSibling = nextNode?.type === 'text' && nextNode.value?.length === 1 && !nextNode.value.match(/\s/);
    // TODO: if issues arise, instead of matching for non-whitespace, we might consider checking FOR certain singular punctuation
    // ie: regex match for  .?!,:;)*"']}`

    if (isReference && hasDanglingSibling) {
      const copyOfNodeWithDeepCopiedChildren = deepCopyNodesChildren(currNode);
      copyOfNodeWithDeepCopiedChildren.children.push(nextNode);
      truncatedNodes.push(copyOfNodeWithDeepCopiedChildren);
      i++;
      continue;
    }
    truncatedNodes.push(currNode);
  }
  return truncatedNodes;
};

// Make a copy of node with a deep copy of the new child node
function deepCopyNodesChildren(refNode) {
  if (!refNode.children || !refNode.children.length) return { ...refNode };
  const copyOfChildren = [...refNode.children];

  const copyOfNode = {
    ...refNode,
    children: copyOfChildren,
  };
  return copyOfNode;
}
