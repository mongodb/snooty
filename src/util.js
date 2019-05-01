/**
 * Recursively searches child nodes to find the specified key/value pair.
 * Prevents us from having to rely on a fixed depth for properties in the AST.
 */
export const findKeyValuePair = (nodes, key, value) => {
  let result;
  const iter = node => {
    if (node[key] === value) {
      result = node;
      return true;
    }
    return Array.isArray(node.children) && node.children.some(iter);
  };

  nodes.some(iter);
  return result;
};

// export const getPrefix = () => process.env.GATSBY_PREFIX || ''
export const getPrefix = () =>
  process.env.GATSBY_PREFIX ||
  (process.env.NODE_ENV === 'development'
    ? ''
    : `/${process.env.GATSBY_SITE}/${process.env.GATSBY_USER}/${process.env.GATSBY_BRANCH}`);
