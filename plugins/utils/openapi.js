const { hideChanges, hideDiffChanges } = require('../../src/components/OpenAPIChangelog/utils/filterHiddenChanges');

const fetchChangelogMetadata = async (branch) => {
  const metadataResp = await fetch(
    `https://raw.githubusercontent.com/mongodb/openapi/${branch}/changelog/internal/metadata.json`
  );
  return metadataResp.json();
};

const fetchChangelog = async (branch) => {
  const changelogResp = await fetch(
    `https://raw.githubusercontent.com/mongodb/openapi/${branch}/changelog/changelog.json`
  );
  const unfilteredChangelog = await changelogResp.json();
  return hideChanges(unfilteredChangelog);
};

const fetchMostRecentDiff = async (metadata, branch) => {
  const mostRecentResourceVersions = metadata.versions.slice(-2);
  const mostRecentDiffLabel = mostRecentResourceVersions.join('_');

  const mostRecentDiffResp = await fetch(
    `https://raw.githubusercontent.com/mongodb/openapi/${branch}/changelog/version-diff/${mostRecentDiffLabel}.json`
  );
  const mostRecentUnfilteredDiffData = await mostRecentDiffResp.json();
  const mostRecentDiffData = hideDiffChanges(mostRecentUnfilteredDiffData);

  return {
    mostRecentDiffLabel,
    mostRecentDiffData,
  };
};

const fetchChangelogData = async (siteMetadata) => {
  const { snootyEnv } = siteMetadata;
  const branch = snootyEnv === 'staging' || snootyEnv === 'development' ? 'qa' : 'main';

  const metadata = await fetchChangelogMetadata(branch);
  const changelog = await fetchChangelog(branch);
  const mostRecentDiff = await fetchMostRecentDiff(metadata, branch);

  /* Aggregate all Resources in changelog for frontend filter */
  const resourcesListSet = new Set();
  changelog.forEach((release) =>
    release.paths.forEach(({ httpMethod, path }) => resourcesListSet.add(`${httpMethod} ${path}`))
  );
  const changelogResourcesList = Array.from(resourcesListSet);

  return {
    changelogMetadata: metadata,
    changelog,
    changelogResourcesList,
    mostRecentDiff,
  };
};

/* Creates node for ChangelogData, currently only used for OpenAPI Changelog in cloud-docs. */
const createOpenAPIChangelogNode = async ({ createNode, createNodeId, createContentDigest, siteMetadata }) => {
  try {
    const changelogData = await fetchChangelogData(siteMetadata);

    /* Create Node for useStaticQuery with all Changelog data */
    createNode({
      children: [],
      id: createNodeId('changelogData'),
      internal: {
        contentDigest: createContentDigest(changelogData),
        type: 'ChangelogData',
      },
      parent: null,
      changelogData: changelogData,
    });
  } catch (e) {
    console.error('Error while fetching OpenAPI Changelog data from Github');
    console.error(e);

    /* Create empty Node for useStaticQuery to ensure successful build */
    createNode({
      children: [],
      id: createNodeId('changelogData'),
      internal: {
        contentDigest: createContentDigest({}),
        type: 'ChangelogData',
      },
      parent: null,
      changelogData: {},
    });
  }
};

module.exports = {
  createOpenAPIChangelogNode,
};
