const { siteMetadata } = require('../../src/utils/site-metadata');
const { realmDocumentDatabase } = require('../../src/init/DocumentDatabase.js');
const { createOpenAPIChangelogNode } = require('../utils/openapi');
const { createProductNodes } = require('../utils/products');
const { createDocsetNodes } = require('../utils/docsets');
const { createBreadcrumbNodes } = require('../utils/breadcrumbs');

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
  await createDocsetNodes({ db, createNode, createNodeId, createContentDigest });
  await createBreadcrumbNodes({ db, createNode, createNodeId, createContentDigest });
  if (hasOpenAPIChangelog)
    await createOpenAPIChangelogNode({ createNode, createNodeId, createContentDigest, siteMetadata, db });
};
