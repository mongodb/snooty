import { normalizePath } from './normalize-path.mjs';

const generatePathPrefix = (
  { commitHash, parserBranch, patchId, pathPrefix, project: parserProject, snootyBranch, user },
  project
) => {
  // If user specified a PATH_PREFIX environment variable, ensure it begins with a prefix and use
  if (pathPrefix) {
    if (pathPrefix.startsWith('/')) {
      return pathPrefix;
    }
    return `/${pathPrefix}`;
  }

  let prefix = '';
  if (commitHash) prefix += `${commitHash}`;
  if (patchId) prefix += `/${patchId}`;

  // Uses the passed in project value if siteMetadata's project is undefined.
  // This is to maintain usability for both local/prod builds (uses siteMetadata) and Gatsby Cloud builds
  // (uses Snooty metadata for individual project + branch combination).
  const projectSlug = parserProject ?? project;
  // Include the Snooty branch in pathPrefix for Snooty developers. mut automatically
  // includes the git branch of the repo where it is called, so this parameter must
  // be present in the URL's path prefix in order to be mut-compatible.
  //
  // TODO: Simplify this logic when Snooty development is staged in integration environment
  const base = `${projectSlug}/${user}`;
  const path = process.env.GATSBY_SNOOTY_DEV
    ? `/${prefix}/${parserBranch}/${base}/${snootyBranch}`
    : `/${prefix}/${base}/${parserBranch}`;
  return normalizePath(path);
};

export { generatePathPrefix };
