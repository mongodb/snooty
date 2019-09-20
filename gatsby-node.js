const path = require('path');
const fs = require('fs').promises;
const mkdirp = require('mkdirp');
const { validateEnvVariables } = require('./src/utils/setup/validate-env-variables');
const { Stitch, AnonymousCredential } = require('mongodb-stitch-server-sdk');
const { getIncludeFile } = require('./src/utils/get-include-file');
const { getNestedValue } = require('./src/utils/get-nested-value');
const { findAllKeyValuePairs } = require('./src/utils/find-all-key-value-pairs');
const { findKeyValuePair } = require('./src/utils/find-key-value-pair');

// Atlas DB config
const DB = 'snooty';
const DOCUMENTS_COLLECTION = 'documents';
const ASSETS_COLLECTION = 'assets';
const SNOOTY_STITCH_ID = 'snooty-koueq';

// test data properties
const USE_TEST_DATA = process.env.USE_TEST_DATA;
const TEST_DATA_PATH = 'tests/unit/data/site';
const LATEST_TEST_DATA_FILE = '__testDataLatest.json';

// different types of references
const PAGES = [];
const INCLUDE_FILES = {};
const PAGE_TITLE_MAP = {};

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

// For each include node found in a page, set its 'children' property to be the array of include contents
const populateIncludeNodes = nodes => {
  const replaceInclude = node => {
    if (node.name === 'include') {
      const includeFilename = getNestedValue(['argument', 0, 'value'], node);
      const includeNode = getIncludeFile(INCLUDE_FILES, includeFilename);

      // Perform the same operation on include nodes inside this include file
      const replacedInclude = includeNode.map(replaceInclude);
      node.children = replacedInclude;
    } else if (node.children) {
      node.children.forEach(replaceInclude);
    }
    return node;
  };
  return nodes.map(replaceInclude);
};

exports.sourceNodes = async () => {
  // setup env variables
  const envResults = validateEnvVariables();

  if (envResults.error) {
    throw Error(envResults.message);
  }

  // wait to connect to stitch
  await setupStitch();

  // if running with test data
  if (USE_TEST_DATA) {
    // get data from test file
    try {
      const fullpath = path.join(TEST_DATA_PATH, USE_TEST_DATA);
      const fileContent = fs.readFileSync(fullpath, 'utf8');
      RESOLVED_REF_DOC_MAPPING = JSON.parse(fileContent);
      console.log(`*** Using test data from "${fullpath}"`);
    } catch (e) {
      throw Error(`ERROR with test data file: ${e}`);
    }
  } else {
    // start from index document
    const idPrefix = `${process.env.GATSBY_SITE}/${process.env.PARSER_USER}/${process.env.PARSER_BRANCH}`;
    const query = { _id: { $regex: new RegExp(`^${idPrefix}/*`) } };
    const documents = await stitchClient.callFunction('fetchDocuments', [DB, DOCUMENTS_COLLECTION, query]);

    documents.forEach(doc => {
      const { _id, ...rest } = doc;
      RESOLVED_REF_DOC_MAPPING[_id.replace(`${idPrefix}/`, '')] = rest;
    });
  }

  // Identify page documents and parse each document for images
  let assets = [];
  Object.entries(RESOLVED_REF_DOC_MAPPING).forEach(([key, val]) => {
    const pageNode = getNestedValue(['ast', 'children'], val);
    if (pageNode) {
      assets.push(...val.static_assets);
    }
    if (key.includes('includes/')) {
      INCLUDE_FILES[key] = val;
    } else if (!key.includes('curl') && !key.includes('https://')) {
      PAGES.push(key);
      PAGE_TITLE_MAP[key] = {
        title: getNestedValue(['ast', 'children', 0, 'children', 0, 'children', 0, 'value'], val),
        category: getNestedValue(
          ['argument', 0, 'value'],
          findKeyValuePair(getNestedValue(['ast', 'children'], val), 'name', 'category')
        ),
        completionTime: getNestedValue(
          ['argument', 0, 'value'],
          findKeyValuePair(getNestedValue(['ast', 'children'], val), 'name', 'time')
        ),
        languages: findKeyValuePair(getNestedValue(['ast', 'children'], val), 'name', 'languages'),
      };
    }
  });

  await saveAssetFiles(assets);

  // whenever we get latest data, always save latest version
  if (!USE_TEST_DATA) {
    const fullpathLatest = path.join(TEST_DATA_PATH, LATEST_TEST_DATA_FILE);
    fs.writeFile(fullpathLatest, JSON.stringify(RESOLVED_REF_DOC_MAPPING), 'utf8', err => {
      if (err) console.log(`ERROR saving test data into "${fullpathLatest}" file`, err);
      console.log(`** Saved test data into "${fullpathLatest}"`);
    });
  }
};

exports.createPages = ({ actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    PAGES.forEach(page => {
      const pageNodes = RESOLVED_REF_DOC_MAPPING[page];
      pageNodes.ast.children = populateIncludeNodes(getNestedValue(['ast', 'children'], pageNodes));
      let template = 'document';
      if (process.env.GATSBY_SITE === 'guides') {
        template = page === 'index' ? 'guides-index' : 'guide';
      }
      const pageUrl = page === 'index' ? '/' : page;
      if (RESOLVED_REF_DOC_MAPPING[page] && Object.keys(RESOLVED_REF_DOC_MAPPING[page]).length > 0) {
        createPage({
          path: pageUrl,
          component: path.resolve(`./src/templates/${template}.js`),
          context: {
            snootyStitchId: SNOOTY_STITCH_ID,
            __refDocMapping: pageNodes,
            pageMetadata: PAGE_TITLE_MAP,
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
        useSiteMetadata: path.resolve(__dirname, 'src/hooks/use-site-metadata.js'),
      },
    },
  });
};
