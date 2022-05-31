import { generatePathPrefix } from '../../utils/generate-path-prefix';

/**
 * Generates the prefix to be used for a version's URL. The prefix will typically consist of the docs repo's
 * set prefix, with the new version appended at the end. Different environments may return different
 * prefixes because of what's passed into the frontend.
 * @param {string} version The version to include at the end of the prefix.
 * @param {Object} siteMetadata Metadata about the site, including its pathPrefix, project, and snootyEnv.
 */
export const generatePrefix = (version, siteMetadata) => {
  const { pathPrefix, project, snootyEnv } = siteMetadata;

  // For production builds, append version after project name
  if (pathPrefix) {
    // Manual production is a special case because its pathPrefix does not use a project name
    const versionStartIndex =
      project === 'docs' ? pathPrefix.indexOf('/', 1) : pathPrefix.indexOf(project) + project.length;
    const projectPrefix = pathPrefix.substr(0, versionStartIndex);
    return `${projectPrefix}/${version}`;
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
