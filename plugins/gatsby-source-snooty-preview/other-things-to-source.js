const { siteMetadata } = require('../../src/utils/site-metadata');
const { realmDocumentDatabase } = require('../../src/init/DocumentDatabase.js');
const { createOpenAPIChangelogNode } = require('../utils/openapi');
const { createProductNodes } = require('../utils/products');

// Sources nodes for the preview plugin that are not directly related to data
// from the Snooty Data API
exports.sourceNodes = async ({
  hasOpenAPIChangelog,
  createNode,
  createContentDigest,
  createNodeId,
  getNodesByType,
}) => {
  let db = realmDocumentDatabase;
  await db.connect();
  await createProductNodes({ db, createNode, createNodeId, createContentDigest });

  const nodes = getNodesByType(`SnootyMetadata`);
  let hasCloudDocsProject = false;
  for (const { metadata } of nodes) {
    if (metadata.project === `cloud-docs`) {
      hasCloudDocsProject = true;
      break;
    }
  }

  if (hasCloudDocsProject && hasOpenAPIChangelog)
    await createOpenAPIChangelogNode({ createNode, createNodeId, createContentDigest, siteMetadata, db });
};
