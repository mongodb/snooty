const { siteMetadata } = require('../../src/utils/site-metadata');
const { manifestDocumentDatabase, realmDocumentDatabase } = require('../../src/init/DocumentDatabase.js');
const { createOpenAPIChangelogNode } = require('../utils/openapi');
const { createProductNodes } = require('../utils/products');

let db;

exports.sourceNodes = async ({
  hasOpenAPIChangelog,
  createNode,
  createContentDigest,
  createNodeId,
  getNodesByType,
}) => {
  // wait to connect to stitch
  if (siteMetadata.manifestPath) {
    console.log('Loading documents from manifest');
    db = manifestDocumentDatabase;
  } else {
    console.log('Loading documents from stitch');
    db = realmDocumentDatabase;
  }

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
    await createOpenAPIChangelogNode({ createNode, createNodeId, createContentDigest, db });
};

// Prevent errors when running gatsby build caused by browser packages run in a node environment.
exports.onCreateWebpackConfig = ({ plugins, actions }) => {
  const providePlugins = {
    Buffer: ['buffer', 'Buffer'],
    process: require.resolve('./stubs/process.js'),
  };

  const fallbacks = { stream: require.resolve('stream-browserify'), buffer: require.resolve('buffer/') };

  actions.setWebpackConfig({
    plugins: [plugins.provide(providePlugins)],
    resolve: {
      fallback: fallbacks,
      alias: {
        process: 'process/browser',
      },
    },
  });
};
