const path = require('path');
const fs = require('fs').promises;
const mkdirp = require('mkdirp');
const { Stitch, AnonymousCredential } = require('mongodb-stitch-server-sdk');
const { validateEnvVariables } = require('./src/utils/setup/validate-env-variables');
const { getNestedValue } = require('./src/utils/get-nested-value');
const { getTemplate } = require('./src/utils/get-template');
const { getGuideMetadata } = require('./src/utils/get-guide-metadata');
const { getPageSlug } = require('./src/utils/get-page-slug');
const { siteMetadata } = require('./src/utils/site-metadata');

const DB = siteMetadata.database;
const DOCUMENTS_COLLECTION = 'documents';
const ASSETS_COLLECTION = 'assets';
const METADATA_COLLECTION = 'metadata';

const constructPageIdPrefix = ({ project, parserUser, parserBranch }) => `${project}/${parserUser}/${parserBranch}`;

const constructBuildFilter = ({ commitHash, ...rest }) => {
  const pageIdPrefix = constructPageIdPrefix(rest);
  return {
    page_id: { $regex: new RegExp(`^${pageIdPrefix}/*`) },
    commit_hash: commitHash || { $exists: false },
  };
};

const SNOOTY_STITCH_ID = 'snooty-koueq';
const buildFilter = constructBuildFilter(siteMetadata);

// different types of references
const PAGES = [];
const GUIDES_METADATA = {};

// in-memory object with key/value = filename/document
let RESOLVED_REF_DOC_MAPPING = {};

// stich client connection
let stitchClient;

const setupStitch = () => {
  return new Promise((resolve, reject) => {
    stitchClient = Stitch.hasAppClient(SNOOTY_STITCH_ID)
      ? Stitch.getAppClient(SNOOTY_STITCH_ID)
      : Stitch.initializeAppClient(SNOOTY_STITCH_ID);
    stitchClient.auth
      .loginWithCredential(new AnonymousCredential())
      .then(user => {
        console.log('logged into stitch');
        resolve();
      })
      .catch(console.error);
  });
};

const saveAssetFile = async asset => {
  return new Promise((resolve, reject) => {
    // Create nested directories as specified by the asset filenames if they do not exist
    mkdirp(path.join('static', path.dirname(asset.filename)), err => {
      if (err) return reject(err);
      fs.writeFile(path.join('static', asset.filename), asset.data.buffer, 'binary', err => {
        if (err) reject(err);
      });
      resolve();
    });
  });
};

// Write all assets to static directory
const saveAssetFiles = async assets => {
  const promises = [];
  const assetQuery = { _id: { $in: assets } };
  const assetDataDocuments = await stitchClient.callFunction('fetchDocuments', [DB, ASSETS_COLLECTION, assetQuery]);
  assetDataDocuments.forEach(asset => {
    promises.push(saveAssetFile(asset));
  });
  return Promise.all(promises);
};

exports.sourceNodes = async () => {
  // setup env variables
  const envResults = validateEnvVariables();

  if (envResults.error) {
    throw Error(envResults.message);
  }

  // wait to connect to stitch
  await setupStitch();

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
  const assets = [];
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

  await saveAssetFiles(assets);
};

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;
  const metadata = await stitchClient.callFunction('fetchDocument', [DB, METADATA_COLLECTION, buildFilter]);

  return new Promise((resolve, reject) => {
    PAGES.forEach(page => {
      const pageNodes = RESOLVED_REF_DOC_MAPPING[page];

      const template = getTemplate(
        process.env.GATSBY_SITE,
        page,
        getNestedValue(['ast', 'options', 'template'], pageNodes)
      );
      const slug = getPageSlug(page);
      if (RESOLVED_REF_DOC_MAPPING[page] && Object.keys(RESOLVED_REF_DOC_MAPPING[page]).length > 0) {
        createPage({
          path: slug,
          component: path.resolve(`./src/templates/${template}.js`),
          context: {
            metadata,
            slug,
            snootyStitchId: SNOOTY_STITCH_ID,
            __refDocMapping: pageNodes,
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
