const path = require('path');
const fs = require('fs').promises;
const { Stitch, AnonymousCredential } = require('mongodb-stitch-browser-sdk');
const { getIncludeFile } = require('../src/utils/get-include-file');
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


const sourceNodes = async () => {
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
};

export const getPageData = async (page) => {
    await sourceNodes();
    const pageNodes = RESOLVED_REF_DOC_MAPPING[page];

    pageNodes.ast.children = populateIncludeNodes(getNestedValue(['ast', 'children'], pageNodes));

    let template = 'document';
    if (process.env.GATSBY_SITE === 'guides') {
        template = page === 'index' ? 'guides-index' : 'guide';
    }
    const pageUrl = page === 'index' ? '/' : page;
    if (RESOLVED_REF_DOC_MAPPING[page] && Object.keys(RESOLVED_REF_DOC_MAPPING[page]).length > 0) {
      return {
        path: pageUrl,
        template,
        context: {
            snootyStitchId: SNOOTY_STITCH_ID,
            __refDocMapping: pageNodes,
            pageMetadata: PAGE_TITLE_MAP,
        }
      };
    }
    return null;
}

export const getAssetData = async (checksum) => {
  const query = {_id: {$eq: checksum}}
  const assetData = await stitchClient.callFunction('fetchDocuments', [DB, ASSETS_COLLECTION, query]);
  return assetData[0];
}