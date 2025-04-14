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
