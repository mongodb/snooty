const path = require('path');
const fs = require('fs').promises;
const mkdirp = require('mkdirp');
const { Stitch, AnonymousCredential } = require('mongodb-stitch-browser-sdk');
const { getNestedValue } = require('../src/utils/get-nested-value');
const { findAllKeyValuePairs } = require('../src/utils/find-all-key-value-pairs');
const { findKeyValuePair } = require('../src/utils/find-key-value-pair');

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

// env variables for building site along with use in front-end
// https://www.gatsbyjs.org/docs/environment-variables/#defining-environment-variables
const validateEnvVariables = () => {
  // make sure necessary env vars exist
  if (!process.env.GATSBY_SITE || !process.env.PARSER_USER || !process.env.PARSER_BRANCH) {
    return {
      error: true,
      message: `${process.env.NODE_ENV} requires the variables GATSBY_SITE, PARSER_USER, and PARSER_BRANCH`,
    };
  }
  // create split prefix for use in stitch function
  return {
    error: false,
  };
};

const saveAssetFile = async (name, objData) => {
  return new Promise((resolve, reject) => {
    // Create nested directories as specified by the asset filenames if they do not exist
    mkdirp(path.join('static', path.dirname(name)), err => {
      if (err) return reject(err);
      fs.writeFile(path.join('static', name), objData.data.buffer, 'binary', err => {
        if (err) reject(err);
      });
      resolve();
    });
  });
};

// Write all assets to static directory
const saveAssetFiles = async assets => {
  const promises = [];
  const assetQuery = { _id: { $in: Object.keys(assets) } };
  const assetDataDocuments = await stitchClient.callFunction('fetchDocuments', [DB, ASSETS_COLLECTION, assetQuery]);
  assetDataDocuments.forEach(asset => {
    promises.push(saveAssetFile(assets[asset._id], asset));
  });
  return Promise.all(promises);
};

// Parse a page's AST to find all figure nodes and return a map of image checksums and filenames
const getImagesInPage = page => {
  const imageNodes = findAllKeyValuePairs(page, 'name', 'figure');
  return imageNodes.reduce((obj, node) => {
    const name = getNestedValue(['argument', 0, 'value'], node);
    const checksum = getNestedValue(['options', 'checksum'], node);
    obj[checksum] = name;
    return obj;
  }, {});
};

const sourceNodes = async () => {
  // setup env variables
  console.log("Validating environment variables");

  const envResults = validateEnvVariables();

  console.log("Validated environment variables");

  if (envResults.error) {
    throw Error(envResults.message);
  }

  console.log("Setting up stitch");

  // wait to connect to stitch
  await setupStitch();

  console.log("Stitch set up");

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
    const query = { _id: { $regex: new RegExp(`${idPrefix}/*`) } };
    const documents = await stitchClient.callFunction('fetchDocuments', [DB, DOCUMENTS_COLLECTION, query]);
    console.log("Documents fetched");
    documents.forEach(doc => {
      const { _id, ...rest } = doc;
      RESOLVED_REF_DOC_MAPPING[_id.replace(`${idPrefix}/`, '')] = rest;
    });
  }

  // Identify page documents and parse each document for images
  let assets = {};
  Object.entries(RESOLVED_REF_DOC_MAPPING).forEach(([key, val]) => {
    const pageNode = getNestedValue(['ast', 'children'], val);
    if (pageNode) {
      assets = { ...assets, ...getImagesInPage(pageNode) };
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

  console.log("RESOLVED_REF_DOC_MAPPING");
  console.log(RESOLVED_REF_DOC_MAPPING);

  console.log("RESOLVED_REF_DOC_MAPPING[server/delete]");
  console.log(RESOLVED_REF_DOC_MAPPING["server/delete"])

//   console.log("Saving asset files");

//   await saveAssetFiles(assets);

//   console.log("Asset files saved");

  // whenever we get latest data, always save latest version
//   if (!USE_TEST_DATA) {
//     const fullpathLatest = path.join(TEST_DATA_PATH, LATEST_TEST_DATA_FILE);
//     fs.writeFile(fullpathLatest, JSON.stringify(RESOLVED_REF_DOC_MAPPING), 'utf8', err => {
//       if (err) console.log(`ERROR saving test data into "${fullpathLatest}" file`, err);
//       console.log(`** Saved test data into "${fullpathLatest}"`);
//     });
//   }
};

const createPages = ({ actions }) => {
  const { createPage } = actions;
  const isSinglePage = process.env.SINGLE_PAGE !== undefined;

  return new Promise((resolve, reject) => {
    PAGES.forEach(page => {
      let template = 'document';
      if (process.env.GATSBY_SITE === 'guides') {
        template = page === 'index' ? 'guides-index' : 'guide';
      }
      const pageUrl = page === 'index' ? '/' : page;
      if ((!isSinglePage || process.env.SINGLE_PAGE === pageUrl) && RESOLVED_REF_DOC_MAPPING[page] && Object.keys(RESOLVED_REF_DOC_MAPPING[page]).length > 0) {
        console.log("MAKING", pageUrl);
        createPage({
          path: pageUrl,
          component: path.resolve(`./src/templates/${template}.js`),
          context: {
            snootyStitchId: SNOOTY_STITCH_ID,
            __refDocMapping: RESOLVED_REF_DOC_MAPPING[page],
            includes: INCLUDE_FILES,
            pageMetadata: PAGE_TITLE_MAP,
          },
        });
      }
    });
    resolve();
  });
};

// Prevent errors when running gatsby build caused by browser packages run in a node environment.
const onCreateWebpackConfig = ({ stage, loaders, actions }) => {
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

export const getPages = () => {
    console.log("getPages() called");
    sourceNodes();
    console.log("Returning pages");

    return PAGES;
}

// export const testStart = () => {
//     sourceNodes();
// }

export const getSnootyStitchId = () => {
    return SNOOTY_STITCH_ID;
}

export const getRefDocMapping = () => {
    return RESOLVED_REF_DOC_MAPPING;
}

export const getIncludeFiles = () => {
    return INCLUDE_FILES;
}

export const getPageTitleMap = () => {
    return PAGE_TITLE_MAP;
}

export const getPageData = async (page) => {
    await sourceNodes();
    console.log("PreviewPage: ", process.env.PREVIEW_PAGE);

    let template = 'document';
    if (process.env.GATSBY_SITE === 'guides') {
        template = page === 'index' ? 'guides-index' : 'guide';
    }
    const pageUrl = page === 'index' ? '/' : page;

    return {
        path: pageUrl,
        component: path.resolve(`./src/templates/${template}.js`),
        context: {
            snootyStitchId: SNOOTY_STITCH_ID,
            __refDocMapping: RESOLVED_REF_DOC_MAPPING[page],
            includes: INCLUDE_FILES,
            pageMetadata: PAGE_TITLE_MAP,
        }
    };
}