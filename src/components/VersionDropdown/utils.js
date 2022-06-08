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

  // For production builds, append version after project name
  if (pathPrefix) {
    return `/${siteBasePrefix}/${version}`;
  }

  // For development
  if (snootyEnv === 'development') {
    console.warn(
      `Applying experimental development environment-specific routing for versions.
       Behavior may differ in both staging and production. See VersionDropdown.js for more detail.`
    );
    return `/${version}`;
  }

  // For staging, replace current version in dynamically generated path prefix
  return generatePathPrefix({ ...siteMetadata, parserBranch: version });
};
