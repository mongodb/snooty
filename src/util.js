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

export const reportAnalytics = (eventName, data) => {
  try {
    window.analytics.track(eventName, data);
  } catch (err) {
    console.error(`Error reporting analytics: ${eventName}`, err);
  }
};
