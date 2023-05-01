/*
 * Safely remove  values from a deeply nested object.
 * Arguments:
 * - t: the target to have deleted
 * - k: the traversal target (key)
 * - arr: an array containing the objects to search for the target value
 */
const removeNestedValue = (t, k, arr) => {
  if (!arr) return undefined;

  arr.forEach((entry) => {
    Object.entries(entry).forEach(([key, val]) => {
      if (key === t) {
        delete entry[t];
      }

      if (key === k && !val.length) return;

      if (key === k && Array.isArray(val)) {
        removeNestedValue(t, k, val);
      }
    });
  });
};

module.exports.removeNestedValue = removeNestedValue;
