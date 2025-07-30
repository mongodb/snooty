import { VersionChoice } from '../components/DeprecatedVersionSelector';

/**
 *  Order versions in the correct order such that V1.10 and V1.11 are sorted before V1.9
 *  Function to be passed into .Sort() on an array
 */
export const sortVersions = (a: VersionChoice, b: VersionChoice) =>
  a.text
    .toString()
    .replace(/\d+/g, (n) => String(+n + 1000))
    .localeCompare(b.text.toString().replace(/\d+/g, (n) => String(+n + 1000)));
