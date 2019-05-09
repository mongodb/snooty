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
  if (!window || !window.analytics) return;
  try {
    window.analytics.track(eventName, data);
  } catch (err) {
    console.error(`Error reporting analytics: ${eventName}`, err);
  }
};

export const copyCodeButton = code => {
  const tempElement = document.createElement('textarea');
  tempElement.style.position = 'fixed';
  document.body.appendChild(tempElement);
  tempElement.value = code;
  tempElement.select();
  try {
    const successful = document.execCommand('copy');
    if (!successful) {
      throw new Error('Failed to copy');
    }
  } catch (err) {
    console.error(err);
  }
};

export const getPrefix = () =>
  process.env.GATSBY_PREFIX ||
  (process.env.NODE_ENV === 'production'
    ? `/${process.env.GATSBY_SITE}/${process.env.GATSBY_USER}/${process.env.GATSBY_BRANCH}`
    : '');
