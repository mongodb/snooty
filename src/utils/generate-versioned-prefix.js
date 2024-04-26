/**
 * Generates the prefix to be used for a version's URL. The prefix will typically consist of the docs repo's
 * set prefix, with the new version appended at the end.
 * @param {string} version The version to include at the end of the prefix.
 * @param {string} siteBasePrefix The current docs site's base prefix to append the version to.
 */
export const generateVersionedPrefix = (version, siteBasePrefix) => {
  return `/${siteBasePrefix}/${version}`;
};
