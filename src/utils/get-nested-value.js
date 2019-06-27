/*
 * Safely return a deeply nested value from an object. If the property is not found, return null.
 * Arguments:
 * - p: an array containing the path to the desired return value
 * - o: the object to be searched
 */
export const getNestedValue = (p, o) => {
  if (!o) return null;
  return p.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o);
};
