import { hideChanges, hideDiffChanges } from '../../src/components/OpenAPIChangelog/utils/filterHiddenChanges.js';

const atlasAdminProdChangelogS3Prefix = 'https://mongodb-mms-prod-build-server.s3.amazonaws.com/openapi/changelog';
const atlasAdminDevChangelogS3Prefix = 'https://mongodb-mms-build-server.s3.amazonaws.com/openapi/changelog';

const fetchChangelogData = async (runId, versions, s3Prefix) => {
  try {
    /* Using metadata runId, fetch OpenAPI Changelog full change list */
    const changelogResp = await fetch(`${s3Prefix}/${runId}/changelog.json`);
    const unfilteredChangelog = await changelogResp.json();
    const changelog = hideChanges(unfilteredChangelog);

    /* Aggregate all Resources in changelog for frontend filter */
    const resourcesListSet = new Set();
    changelog.forEach((release) =>
      release.paths.forEach(({ httpMethod, path }) => resourcesListSet.add(`${httpMethod} ${path}`))
    );
    const changelogResourcesList = Array.from(resourcesListSet);

    /* Fetch most recent Resource Versions' diff */
    const mostRecentResourceVersions = versions.slice(-2);
    const mostRecentDiffLabel = mostRecentResourceVersions.join('_');
    const mostRecentDiffResp = await fetch(`${s3Prefix}/${runId}/${mostRecentDiffLabel}.json`);
    const mostRecentUnfilteredDiffData = await mostRecentDiffResp.json();
    const mostRecentDiffData = hideDiffChanges(mostRecentUnfilteredDiffData);

    return {
      changelog,
      changelogResourcesList,
      mostRecentDiff: {
        mostRecentDiffLabel,
        mostRecentDiffData,
      },
    };
  } catch (error) {
    console.warn('Changelog error: Most recent runId not successful. Using last successful runId to build Changelog.');
    throw error;
  }
};

/* Creates node for ChangelogData, cuyrrently only used for OpenAPI Changelog in cloud-docs. */
const createOpenAPIChangelogNode = async ({ createNode, createNodeId, createContentDigest, siteMetadata, db }) => {
  try {
    const { snootyEnv } = siteMetadata;
    let atlasAdminChangelogS3Prefix;
    let indexLocation;
    switch (snootyEnv) {
      case 'staging':
      case 'development':
        atlasAdminChangelogS3Prefix = atlasAdminDevChangelogS3Prefix;
        indexLocation = 'dev.json';
        break;
      case 'production':
      default:
        atlasAdminChangelogS3Prefix = atlasAdminProdChangelogS3Prefix;
        indexLocation = 'prod.json';
    }
    /* Fetch OpenAPI Changelog metadata */
    const indexResp = await fetch(`${atlasAdminChangelogS3Prefix}/${indexLocation}`);
    const index = await indexResp.json();

    const { runId, versions } = index;

    if (!runId || typeof runId !== 'string')
      throw new Error('OpenAPI Changelog Error: `runId` not available in S3 index.json!');

    let changelogData = {
      index,
    };
    try {
      const receivedChangelogData = await fetchChangelogData(runId, versions, atlasAdminChangelogS3Prefix);
      changelogData = { ...changelogData, ...receivedChangelogData };
      if (snootyEnv === 'production') await db.realmInterface.updateOAChangelogMetadata(index);
    } catch (error) {
      /* If any error occurs, fetch last successful metadata and build changelog node */
      const lastSuccessfulIndex = await db.realmInterface.fetchDocument(
        'openapi_changelog',
        'atlas_admin_metadata',
        {}
      );
      const { runId: lastRunId, versions: lastVersions } = lastSuccessfulIndex;
      const receivedChangelogData = fetchChangelogData(lastRunId, lastVersions, atlasAdminProdChangelogS3Prefix);
      changelogData = { index: lastSuccessfulIndex, ...receivedChangelogData };
    }

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
    console.error('Error while fetching OpenAPI Changelog data from S3');
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

export { createOpenAPIChangelogNode };
