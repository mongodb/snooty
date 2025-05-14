/**
 *  Order versions in the correct order such that V1.10 and V1.11 are sorted before V1.9
 *  Function to be passed into .Sort() on an array
 */

export const sortVersions = (a, b) =>
  a.text
    .toString()
    .replace(/\d+/g, (n) => +n + 1000)
    .localeCompare(b.text.toString().replace(/\d+/g, (n) => +n + 1000));
