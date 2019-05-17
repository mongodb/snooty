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

export const getPrefix = () =>
  process.env.GATSBY_PREFIX ||
  (process.env.NODE_ENV === 'production'
    ? `/${process.env.GATSBY_SITE}/${process.env.GATSBY_USER}/${process.env.GATSBY_BRANCH}`
    : '');

/*
 * Limit the rate at which a function is called (for example, useful to limit invokation of a scroll event listener)
 */
export const throttle = (func, wait) => {
  let args = null;
  let result = null;
  let timeout = null;
  let previous = 0;

  const later = () => {
    previous = Date.now();
    timeout = null;
    result = func.apply(...args);
    if (!timeout) {
      args = null;
    }
  };

  return (...newArgs) => {
    const now = Date.now();
    const remaining = wait - (now - previous);
    args = newArgs;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        window.clearTimeout(timeout);
        timeout = null;
      }

      previous = now;
      result = func(...args);
      if (!timeout) {
        args = null;
      }
    } else if (!timeout) {
      timeout = window.setTimeout(later, remaining);
    }

    return result;
  };
};

export const slugifyTitle = title => title.toLowerCase().replace(/\W+/g, '-');
