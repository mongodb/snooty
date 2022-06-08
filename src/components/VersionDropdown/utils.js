import { generatePathPrefix } from '../../utils/generate-path-prefix';

/**
 * Generates the prefix to be used for a version's URL. The prefix will typically consist of the docs repo's
 * set prefix, with the new version appended at the end. Different environments may return different
 * prefixes because of what's passed into the frontend.
 * @param {string} version The version to include at the end of the prefix.
 * @param {Object} siteMetadata Metadata about the site, including its pathPrefix, project, and snootyEnv.
 * @param {string} siteBasePrefix The current docs site's base prefix to append the version to.
 */
export const generatePrefix = (version, siteMetadata, siteBasePrefix) => {
  const { pathPrefix, snootyEnv } = siteMetadata;

  // pathPrefix is typically passed in for deploy jobs. For development purposes,
  // the returned prefix should follow the same pattern (even though the resulting URL might 404).
  if (!!pathPrefix || snootyEnv === 'development') {
    return `/${siteBasePrefix}/${version}`;
  }

  // For staging, replace current version in dynamically generated path prefix
  return generatePathPrefix({ ...siteMetadata, parserBranch: version });
};
