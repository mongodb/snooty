/*
 * Safely return a deeply nested value from an object. If the property is not found, return undefined.
 * Arguments:
 * - p: an array containing the path to the desired return value
 * - o: the object to be searched
 */
const getNestedValue = (p, o) => {
  if (!o) return undefined;
  return p.reduce((xs, x) => (xs && xs[x] ? xs[x] : undefined), o);
};

// TODO: switch to ES6 export syntax if Gatsby implements support for ES6 module imports
// https://github.com/gatsbyjs/gatsby/issues/7810
module.exports.getNestedValue = getNestedValue;
