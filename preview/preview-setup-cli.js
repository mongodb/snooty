const { Stitch, AnonymousCredential } = require('mongodb-stitch-browser-sdk');
const { validateEnvVariables } = require('../src/utils/setup/validate-env-variables');
const { getIncludeFile } = require('./get-include-file');
const { getNestedValue } = require('../src/utils/get-nested-value');
const { getTemplate } = require('../src/utils/get-template');
const { getPageMetadata } = require('../src/utils/get-page-metadata');
const { getPageUrl } = require('../src/utils/get-page-url');

// Atlas DB config
const DB = 'snooty';
const DOCUMENTS_COLLECTION = 'documents';
const ASSETS_COLLECTION = 'assets';
const SNOOTY_STITCH_ID = 'snooty-koueq';

// different types of references
const PAGES = [];
const INCLUDE_FILES = {};
const PAGE_METADATA = {};

// in-memory object with key/value = filename/document
const RESOLVED_REF_DOC_MAPPING = {};

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

  // start from index document
  const idPrefix = `${process.env.GATSBY_SITE}/${process.env.GATSBY_PARSER_USER}/${process.env.GATSBY_PARSER_BRANCH}`;
  const query = { _id: { $regex: new RegExp(`${idPrefix}/*`) } };
  const documents = await stitchClient.callFunction('fetchDocuments', [DB, DOCUMENTS_COLLECTION, query]);
  documents.forEach(doc => {
    const { _id, ...rest } = doc;
    RESOLVED_REF_DOC_MAPPING[_id.replace(`${idPrefix}/`, '')] = rest;
  });

  // Identify page documents and parse each document for images
  Object.entries(RESOLVED_REF_DOC_MAPPING).forEach(([key, val]) => {
    if (key.includes('includes/')) {
      INCLUDE_FILES[key] = val;
    } else if (!key.includes('curl') && !key.includes('https://')) {
      PAGES.push(key);
      PAGE_METADATA[key] = getPageMetadata(val);
    }
  });
};

// Similar to gatsby-node's createPage(). Return the data needed by a single page
export const getPageData = async () => {
  await sourceNodes();
  const page = process.env.PREVIEW_PAGE;
  const pageNodes = RESOLVED_REF_DOC_MAPPING[page];

  pageNodes.ast.children = populateIncludeNodes(getNestedValue(['ast', 'children'], pageNodes));

  const template = getTemplate(page, process.env.GATSBY_SITE);
  const pageUrl = getPageUrl(page);

  if (RESOLVED_REF_DOC_MAPPING[page] && Object.keys(RESOLVED_REF_DOC_MAPPING[page]).length > 0) {
    return {
      path: pageUrl,
      template,
      context: {
        snootyStitchId: SNOOTY_STITCH_ID,
        __refDocMapping: pageNodes,
        pageMetadata: PAGE_METADATA,
      },
    };
  }
  return null;
};

// Use checksum from a Figure component to return base64 data of image
export const getBase64Uri = async checksum => {
  const query = { _id: { $eq: checksum } };
  const [assetData] = await stitchClient.callFunction('fetchDocuments', [DB, ASSETS_COLLECTION, query]);

  const base64 = assetData.data.buffer.toString('base64');
  const fileFormat = assetData.filename.split('.')[-1];
  const prefix = `data:image/${fileFormat};base64,`;
  return prefix.concat(base64);
};
