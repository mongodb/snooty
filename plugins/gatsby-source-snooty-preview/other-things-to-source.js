const yaml = require('js-yaml');
const { baseUrl } = require('../../src/utils/base-url');
const { siteMetadata } = require('../../src/utils/site-metadata');
const { manifestDocumentDatabase, stitchDocumentDatabase } = require('../../src/init/DocumentDatabase.js');

let db;

const isAssociatedProductPerProjectAndBranch = {};
const associatedReposInfoPerProjectAndBranch = {};

// Creates node for RemoteMetadata, mostly used for Embedded Versions. If no associated products
// or data are found, the node will be null
const createRemoteMetadataNode = async ({ metadata, createNode, createNodeId, createContentDigest }) => {
  // fetch associated child products
  const productList = metadata?.associated_products || [];

  const projectAndBranchId = `${metadata.project}-${metadata.branch}`;

  let associatedReposInfo = associatedReposInfoPerProjectAndBranch[projectAndBranchId];
  if (!associatedReposInfo) {
    associatedReposInfo = associatedReposInfoPerProjectAndBranch[projectAndBranchId] = {};
  }

  let isAssociatedProduct = false;

  await Promise.all(
    productList.map(async (product) => {
      associatedReposInfo[product.name] = await db.stitchInterface.fetchRepoBranches(product.name);
    })
  );
  // check if product is associated child product
  try {
    const umbrellaProduct = await db.stitchInterface.getMetadata({
      'associated_products.name': metadata.project,
    });
    isAssociatedProduct = !!umbrellaProduct;
  } catch (e) {
    console.log('No umbrella product found. Not an associated product.');
    isAssociatedProduct = false;
  }

  isAssociatedProductPerProjectAndBranch[projectAndBranchId] = isAssociatedProduct;

  // get remote metadata for updated ToC in Atlas
  try {
    const filter = {
      project: metadata.project,
      branch: metadata.branch,
    };
    if (isAssociatedProduct || metadata?.associated_products?.length) {
      filter['is_merged_toc'] = true;
    }
    const findOptions = {
      sort: { build_id: -1 },
    };
    const remoteMetadata = await db.stitchInterface.getMetadata(filter, findOptions);

    createNode({
      children: [],
      id: createNodeId('remoteMetadata'),
      internal: {
        contentDigest: createContentDigest(remoteMetadata),
        type: 'RemoteMetadata',
      },
      parent: null,
      remoteMetadata: remoteMetadata,
    });
  } catch (e) {
    console.error('Error while fetching metadata from Atlas, falling back to manifest metadata');
    console.error(e);
  }
};

const atlasAdminChangelogS3Prefix = 'https://mms-openapi-poc.s3.eu-west-1.amazonaws.com/openapi';

const fetchChangelogData = async (runId, versions) => {
  try {
    /* Using metadata runId, fetch OpenAPI Changelog full change list */
    const changelogResp = await fetch(`${atlasAdminChangelogS3Prefix}/${runId}/changelog.yaml`);
    const changelogText = await changelogResp.text();
    const changelog = yaml.safeLoad(changelogText, 'utf8');

    /* Aggregate all Resources in changelog for frontend filter */
    const resourcesListSet = new Set();
    changelog.forEach((release) =>
      release.paths.forEach(({ httpMethod, path }) => resourcesListSet.add(`${httpMethod} ${path}`))
    );
    const changelogResourcesList = Array.from(resourcesListSet);

    /* Fetch most recent Resource Versions' diff */
    const mostRecentResourceVersions = versions.slice(-2);
    const mostRecentDiffLabel = mostRecentResourceVersions.join('_');
    const mostRecentDiffResp = await fetch(`${atlasAdminChangelogS3Prefix}/${runId}/${mostRecentDiffLabel}.yaml`);
    const mostRecentDiffText = await mostRecentDiffResp.text();
    const mostRecentDiffData = yaml.safeLoad(mostRecentDiffText, 'utf8');

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
const createOpenAPIChangelogNode = async ({ createNode, createNodeId, createContentDigest }) => {
  try {
    /* Fetch OpenAPI Changelog metadata */
    const indexResp = await fetch(`${atlasAdminChangelogS3Prefix}/index.yaml`);
    const indexText = await indexResp.text();
    const index = yaml.safeLoad(indexText, 'utf8');

    const { runId, versions } = index;

    if (!runId || typeof runId !== 'string')
      throw new Error('OpenAPI Changelog Error: `runId` not available in S3 index.yaml!');

    let changelogData = {
      index,
    };
    try {
      const receivedChangelogData = await fetchChangelogData(runId, versions);
      changelogData = { ...changelogData, ...receivedChangelogData };
      await db.stitchInterface.updateOAChangelogMetadata(index);
    } catch (error) {
      /* If any error occurs, fetch last successful metadata and build changelog node */
      const lastSuccessfulIndex = await db.stitchInterface.fetchDocument(
        'openapi_changelog',
        'atlas_admin_metadata',
        {}
      );
      const { runId: lastRunId, versions: lastVersions } = lastSuccessfulIndex;
      const receivedChangelogData = fetchChangelogData(lastRunId, lastVersions);
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
    db = stitchDocumentDatabase;
  }

  await db.connect();

  // Get all MongoDB products for the sidenav
  const products = await db.fetchAllProducts(siteMetadata.database);
  products.forEach((product) => {
    const url = baseUrl(product.baseUrl + product.slug);

    createNode({
      children: [],
      id: createNodeId(`Product-${product.title}`),
      internal: {
        contentDigest: createContentDigest(product),
        type: 'Product',
      },
      parent: null,
      title: product.title,
      url,
    });
  });

  const nodes = getNodesByType(`SnootyMetadata`);
  let hasCloudDocsProject = false;
  for (const { metadata } of nodes) {
    await createRemoteMetadataNode({ metadata, createNode, createNodeId, createContentDigest });
    if (metadata.project === `cloud-docs`) {
      hasCloudDocsProject = true;
    }
  }

  if (hasCloudDocsProject && hasOpenAPIChangelog)
    await createOpenAPIChangelogNode({ createNode, createNodeId, createContentDigest });

  return {
    _db: db,
    _isAssociatedProductPerProjectAndBranch: isAssociatedProductPerProjectAndBranch,
    _associatedReposInfoPerProjectAndBranch: associatedReposInfoPerProjectAndBranch,
  };
};

// Prevent errors when running gatsby build caused by browser packages run in a node environment.
exports.onCreateWebpackConfig = ({ stage, loaders, plugins, actions }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /mongodb-stitch-browser-sdk/,
            use: loaders.null(),
          },
        ],
      },
    });
  }

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

// Remove type inference, as our schema is too ambiguous for this to be useful.
// https://www.gatsbyjs.com/docs/scaling-issues/#switch-off-type-inference-for-sitepagecontext
exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type SitePage implements Node @dontInfer {
      path: String!
    }

    type SnootyMetadata implements Node @dontInfer {
      metadata: JSON!
    }

    type RemoteMetadata implements Node @dontInfer {
      remoteMetadata: JSON
    }

    type ChangelogData implements Node @dontInfer {
      changelogData: JSON
    }
  `);
};
