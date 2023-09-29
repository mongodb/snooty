const { siteMetadata } = require('../../src/utils/site-metadata');
const { realmDocumentDatabase } = require('../../src/init/DocumentDatabase.js');
const { createOpenAPIChangelogNode } = require('../utils/openapi');
const { createProductNodes } = require('../utils/products');

// Sources nodes for the preview plugin that are not directly related to data
// from the Snooty Data API
exports.sourceNodes = async ({ hasOpenAPIChangelog, createNode, createContentDigest, createNodeId }) => {
  let db = realmDocumentDatabase;
  await db.connect();
  await createProductNodes({ db, createNode, createNodeId, createContentDigest });
  if (hasOpenAPIChangelog)
    await createOpenAPIChangelogNode({ createNode, createNodeId, createContentDigest, siteMetadata, db });
};
