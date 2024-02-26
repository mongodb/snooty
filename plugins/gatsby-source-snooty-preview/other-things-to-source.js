const { siteMetadata } = require('../../src/utils/site-metadata');
const { realmDocumentDatabase } = require('../../src/init/DocumentDatabase.js');
const { createOpenAPIChangelogNode } = require('../utils/openapi');
const { createProductNodes } = require('../utils/products');
const { createDocsetNodes } = require('../utils/docsets');
const { createProjectParentNodes } = require('../utils/project-parents');

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
  await createProjectParentNodes({ db, createNode, createNodeId, createContentDigest, getNodesByType });
  if (hasOpenAPIChangelog)
    await createOpenAPIChangelogNode({ createNode, createNodeId, createContentDigest, siteMetadata, db });
};
