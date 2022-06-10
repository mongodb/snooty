const path = require('path');
const { transformBreadcrumbs } = require('./src/utils/setup/transform-breadcrumbs.js');
const { initStitch } = require('./src/utils/setup/init-stitch');
const { baseUrl } = require('./src/utils/base-url');
const { saveAssetFiles, saveStaticFiles } = require('./src/utils/setup/save-asset-files');
const { validateEnvVariables } = require('./src/utils/setup/validate-env-variables');
const { getNestedValue } = require('./src/utils/get-nested-value');
const { getPageSlug } = require('./src/utils/get-page-slug');
const { siteMetadata } = require('./src/utils/site-metadata');
const { assertTrailingSlash } = require('./src/utils/assert-trailing-slash');
const { DOCUMENTS_COLLECTION, METADATA_COLLECTION, BRANCHES_COLLECTION } = require('./src/build-constants');
const { constructPageIdPrefix } = require('./src/utils/setup/construct-page-id-prefix');
const { constructBuildFilter } = require('./src/utils/setup/construct-build-filter');
const { constructReposFilter } = require('./src/utils/setup/construct-repos-filter');

const DB = siteMetadata.database;
const reposDB = siteMetadata.reposDatabase;

const reposFilter = constructReposFilter(siteMetadata.project);
const buildFilter = constructBuildFilter(siteMetadata);

// different types of references
const PAGES = [];

// in-memory object with key/value = filename/document
let RESOLVED_REF_DOC_MAPPING = {};

// stich client connection
let stitchClient;

const assets = new Map();

exports.sourceNodes = async ({ actions, createContentDigest, createNodeId }) => {
  const { createNode } = actions;

  // setup env variables
  const envResults = validateEnvVariables();

  if (envResults.error) {
    throw Error(envResults.message);
  }

  // wait to connect to stitch
  stitchClient = await initStitch();

  const documents = await stitchClient.callFunction('fetchDocuments', [DB, DOCUMENTS_COLLECTION, buildFilter]);

  if (documents.length === 0) {
    console.error(
      'Snooty could not find AST entries for the',
      siteMetadata.parserBranch,
      'branch of',
      siteMetadata.project
    );
    process.exit(1);
  }
  const pageIdPrefix = constructPageIdPrefix(siteMetadata);
  documents.forEach((doc) => {
    const { page_id, ...rest } = doc;
    RESOLVED_REF_DOC_MAPPING[page_id.replace(`${pageIdPrefix}/`, '')] = rest;
  });

  // Identify page documents and parse each document for images
  Object.entries(RESOLVED_REF_DOC_MAPPING).forEach(([key, val]) => {
    const pageNode = getNestedValue(['ast', 'children'], val);
    const filename = getNestedValue(['filename'], val) || '';
    if (pageNode) {
      val.static_assets.forEach((asset) => {
        const checksum = asset.checksum;
        if (assets.has(checksum)) {
          assets.set(checksum, new Set([...assets.get(checksum), asset.key]));
        } else {
          assets.set(checksum, new Set([asset.key]));
        }
      });
    }

    if (filename.endsWith('.txt')) {
      PAGES.push(key);
    }
  });

  // Get all MongoDB products for the sidenav
  const products = await stitchClient.callFunction('fetchAllProducts', [siteMetadata.database]);
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

  const [, { static_files: staticFiles, ...metadataMinusStatic }] = await Promise.all([
    saveAssetFiles(assets, stitchClient),
    stitchClient.callFunction('fetchDocument', [DB, METADATA_COLLECTION, buildFilter]),
  ]);

  const { parentPaths, slugToTitle } = metadataMinusStatic;
  if (parentPaths) {
    transformBreadcrumbs(parentPaths, slugToTitle);
  }

  //Save files in the static_files field of metadata document, including intersphinx inventories
  if (staticFiles) {
    await saveStaticFiles(staticFiles);
  }

  createNode({
    children: [],
    id: createNodeId('metadata'),
    internal: {
      contentDigest: createContentDigest(metadataMinusStatic),
      type: 'SnootyMetadata',
    },
    parent: null,
    metadata: metadataMinusStatic,
  });
};

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  let repoBranches = null;
  try {
    const repoInfo = await stitchClient.callFunction('fetchDocument', [reposDB, BRANCHES_COLLECTION, reposFilter]);
    let errMsg = null;

    if (!repoInfo) {
      errMsg = `Repo data for ${siteMetadata.project} could not be found.`;
    }

    // We should expect the number of branches for a docs repo to be 1 or more.
    if (!repoInfo.branches?.length) {
      errMsg = `No version information found for ${siteMetadata.project}`;
    }

    if (errMsg) {
      throw errMsg;
    }

    // Handle inconsistent env names. Default to 'dotcomprd' when possible since this is what we will most likely use.
    // dotcom environments seem to be consistent.
    let envKey = siteMetadata.snootyEnv;
    if (!envKey || envKey === 'development') {
      envKey = 'dotcomprd';
    } else if (envKey === 'production') {
      envKey = 'prd';
    } else if (envKey === 'staging') {
      envKey = 'stg';
    }

    // We're overfetching data here. We only need branches and prefix at the least
    repoBranches = {
      branches: repoInfo.branches,
      siteBasePrefix: repoInfo.prefix[envKey],
    };

    if (repoInfo.groups?.length > 0) {
      repoBranches.groups = repoInfo.groups;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }

  return new Promise((resolve, reject) => {
    PAGES.forEach((page) => {
      const pageNodes = RESOLVED_REF_DOC_MAPPING[page]?.ast;

      const slug = getPageSlug(page);
      if (RESOLVED_REF_DOC_MAPPING[page] && Object.keys(RESOLVED_REF_DOC_MAPPING[page]).length > 0) {
        createPage({
          path: assertTrailingSlash(slug),
          component: path.resolve(__dirname, './src/components/DocumentBody.js'),
          context: {
            slug,
            repoBranches: repoBranches,
            template: pageNodes?.options?.template,
            page: pageNodes,
          },
        });
      }
    });

    resolve();
  });
};

// Prevent errors when running gatsby build caused by browser packages run in a node environment.
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
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
  `);
};
