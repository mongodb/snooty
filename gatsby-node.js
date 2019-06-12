const path = require('path');
const fs = require('fs');
const { Stitch, AnonymousCredential } = require('mongodb-stitch-server-sdk');

// Atlas DB config
const DB = 'snooty';
const DOCUMENTS_COLLECTION = 'documents';
const ASSETS_COLLECTION = 'assets';
const SNOOTY_STITCH_ID = 'ref_data-bnbxq';

// test data properties
const USE_TEST_DATA = process.env.USE_TEST_DATA;
const TEST_DATA_PATH = 'tests/unit/data/site';
const LATEST_TEST_DATA_FILE = '__testDataLatest.json';

// different types of references
const PAGES = [];
const INCLUDE_FILES = [];
const ASSETS = [];

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

// env variables for building site along with use in front-end
// https://www.gatsbyjs.org/docs/environment-variables/#defining-environment-variables
const validateEnvVariables = () => {
  // make sure necessary env vars exist
  if (!process.env.SITE || !process.env.PARSER_USER || !process.env.PARSER_BRANCH) {
    return {
      error: true,
      message: `${process.env.NODE_ENV} requires the variables SITE, PARSER_USER, and PARSER_BRANCH`,
    };
  }
  // create split prefix for use in stitch function
  return {
    error: false,
  };
};

const saveAssetFile = async (name, objData) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`static/${name}`, objData.data.buffer, 'binary', err => {
      if (err) reject(err);
      resolve();
    });
  });
};

// Write all assets to static directory
const saveAssetFiles = async () => {
  const promises = [];
  ASSETS.forEach(async asset => {
    const [assetName, assetHash] = asset.split('#');
    const assetQuery = { _id: assetHash };
    const assetDataDocuments = await stitchClient.callFunction('fetchDocuments', [DB, ASSETS_COLLECTION, assetQuery]);
    if (assetDataDocuments && assetDataDocuments[0]) {
      promises.push(saveAssetFile(assetName, assetDataDocuments[0]));
    }
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
    const idPrefix = `${process.env.SITE}/${process.env.PARSER_USER}/${process.env.PARSER_BRANCH}`;
    const query = { _id: { $regex: new RegExp(`${idPrefix}/*`) } };
    const documents = await stitchClient.callFunction('fetchDocuments', [DB, DOCUMENTS_COLLECTION, query]);

    documents.forEach(doc => {
      const { _id, ...rest } = doc;
      RESOLVED_REF_DOC_MAPPING[_id.replace(`${idPrefix}/`, '')] = rest;
    });
  }

  // separate references into correct types, e.g. pages, include files, assets, etc.
  Object.keys(RESOLVED_REF_DOC_MAPPING).forEach(ref => {
    if (ref.includes('includes/')) {
      INCLUDE_FILES.push(ref);
    } else if (ref.includes('#')) {
      ASSETS.push(ref);
    } else if (!ref.includes('curl') && !ref.includes('https://')) {
      PAGES.push(ref);
    }
  });

  await saveAssetFiles();

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
      let template = 'document';
      if (process.env.SITE === 'guides') {
        template = page === 'index' ? 'guides-index' : 'guide';
      }
      const pageUrl = page === 'index' ? '/' : page;
      if (RESOLVED_REF_DOC_MAPPING[page] && Object.keys(RESOLVED_REF_DOC_MAPPING[page]).length > 0) {
        createPage({
          path: pageUrl,
          component: path.resolve(`./src/templates/${template}.js`),
          context: {
            __refDocMapping: RESOLVED_REF_DOC_MAPPING,
            snootyStitchId: SNOOTY_STITCH_ID,
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
