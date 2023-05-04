/*
 * Safely remove  values from a deeply nested object.
 * Arguments:
 * - target: the target key to be deleted
 * - traversalKey: the target key to traverse
 * - arr: an array containing the objects to search for the target value
 */
const removeNestedValue = (target, traversalKey, arr) => {
  if (!arr) return;

  arr.forEach((entry) => {
    if (entry.hasOwnProperty(target)) {
      delete entry[target];
    }

    if (entry.hasOwnProperty(traversalKey)) {
      const children = entry[traversalKey];
      if (Array.isArray(children) && children.length) {
        removeNestedValue(target, traversalKey, children);
      }
    }
  });
};

module.exports.removeNestedValue = removeNestedValue;
