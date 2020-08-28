const path = require('path');
const { initStitch } = require('./src/utils/setup/init-stitch');
const { saveAssetFiles, saveStaticFiles } = require('./src/utils/setup/save-asset-files');
const { validateEnvVariables } = require('./src/utils/setup/validate-env-variables');
const { getNestedValue } = require('./src/utils/get-nested-value');
const { getGuideMetadata } = require('./src/utils/get-guide-metadata');
const { getPageSlug } = require('./src/utils/get-page-slug');
const { siteMetadata } = require('./src/utils/site-metadata');
const { DOCUMENTS_COLLECTION, METADATA_COLLECTION } = require('./src/build-constants');

const DB = siteMetadata.database;

const constructPageIdPrefix = ({ project, parserUser, parserBranch }) => `${project}/${parserUser}/${parserBranch}`;

const constructBuildFilter = ({ commitHash, patchId, ...rest }) => {
  const pageIdPrefix = constructPageIdPrefix(rest);
  return {
    page_id: { $regex: new RegExp(`^${pageIdPrefix}/*`) },
    commit_hash: commitHash || { $exists: false },
    patch_id: patchId || { $exists: false },
  };
};

const buildFilter = constructBuildFilter(siteMetadata);

// different types of references
const PAGES = [];
const GUIDES_METADATA = {};

// in-memory object with key/value = filename/document
let RESOLVED_REF_DOC_MAPPING = {};

// stich client connection
let stitchClient;

const assets = [];

exports.sourceNodes = async () => {
  // setup env variables
  const envResults = validateEnvVariables();

  if (envResults.error) {
    throw Error(envResults.message);
  }

  // wait to connect to stitch
  stitchClient = await initStitch();

  const documents = await stitchClient.callFunction('fetchDocuments', [DB, DOCUMENTS_COLLECTION, buildFilter]);

  if (documents.length === 0) {
    console.error('No documents matched your query.');
    process.exit(1);
  }

  const pageIdPrefix = constructPageIdPrefix(siteMetadata);
  documents.forEach(doc => {
    const { page_id, ...rest } = doc;
    RESOLVED_REF_DOC_MAPPING[page_id.replace(`${pageIdPrefix}/`, '')] = rest;
  });

  // Identify page documents and parse each document for images
  Object.entries(RESOLVED_REF_DOC_MAPPING).forEach(([key, val]) => {
    const pageNode = getNestedValue(['ast', 'children'], val);
    const filename = getNestedValue(['filename'], val) || '';
    if (pageNode) {
      assets.push(...val.static_assets);
    }

    if (filename.endsWith('.txt')) {
      PAGES.push(key);
      if (process.env.GATSBY_SITE === 'guides') {
        GUIDES_METADATA[key] = getGuideMetadata(val);
      }
    }
  });
};

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;
  const [, metadata] = await Promise.all([
    saveAssetFiles(assets, stitchClient),
    stitchClient.callFunction('fetchDocument', [DB, METADATA_COLLECTION, buildFilter]),
  ]);

  // Save files in the static_files field of metadata document, including intersphinx inventories
  if (metadata.static_files) {
    await saveStaticFiles(metadata.static_files);
  }

  return new Promise((resolve, reject) => {
    PAGES.forEach(page => {
      const pageNodes = RESOLVED_REF_DOC_MAPPING[page];

      const slug = getPageSlug(page);
      if (RESOLVED_REF_DOC_MAPPING[page] && Object.keys(RESOLVED_REF_DOC_MAPPING[page]).length > 0) {
        createPage({
          path: slug,
          component: path.resolve(__dirname, './src/components/DocumentBody.js'),
          context: {
            metadata,
            slug,
            layout: getNestedValue(['ast', 'options', 'template'], pageNodes),
            refDocMapping: pageNodes,
            guidesMetadata: GUIDES_METADATA,
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
  actions.setWebpackConfig({
    resolve: {
      alias: {
        // Use noop file to prevent any preview-setup errors
        previewSetup: path.resolve(__dirname, 'preview/noop.js'),
        useSiteMetadata: path.resolve(__dirname, 'src/hooks/use-site-metadata.js'),
      },
    },
  });
};
