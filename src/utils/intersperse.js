/*
 * Return an array with the separator interspersed between each element of the input array.
 */
export const intersperse = (arr, sep = ', ') => {
  if (arr.length === 0) {
    return [];
  }

  return arr.slice(1).reduce((xs, x) => xs.concat([sep, x]), [arr[0]]);
};
