import { siteMetadata } from '../../src/utils/site-metadata.mjs';
import { realmDocumentDatabase } from '../../src/init/DocumentDatabase.mjs';
import { createOpenAPIChangelogNode } from '../utils/openapi.mjs';
import { createProductNodes } from '../utils/products.mjs';

// Sources nodes for the preview plugin that are not directly related to data
// from the Snooty Data API
export const sourceNodes = async ({ hasOpenAPIChangelog, createNode, createContentDigest, createNodeId }) => {
  let db = realmDocumentDatabase;
  await db.connect();
  await createProductNodes({ db, createNode, createNodeId, createContentDigest });
  if (hasOpenAPIChangelog)
    await createOpenAPIChangelogNode({ createNode, createNodeId, createContentDigest, siteMetadata, db });
};
