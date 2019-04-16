const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');
const { Stitch, AnonymousCredential } = require('mongodb-stitch-server-sdk');

// ENV vars
const PREFIX = process.env.PREFIX.split('/');
const STITCH_ID = process.env.STITCH_ID;
const NAMESPACE = process.env.NAMESPACE;
const NAMESPACE_ASSETS = NAMESPACE.split('/')[0] + '/' + 'assets';

// save env variables so that we can use them in front-end
// https://www.gatsbyjs.org/docs/environment-variables/#defining-environment-variables
// env.production is used for `gatsby build --prefix-paths`
// env.development is used for `gatsby develop` and should be empty string
const ENV_FILE = '.env.production';
const ENV_CONTENTS = `GATSBY_PREFIX=/${process.env.PREFIX}`;
fs.writeFile(ENV_FILE, ENV_CONTENTS, 'utf8', err => {
  if (err) console.log(`ERROR saving env variables into "${ENV_FILE}" file`, err);
  console.log(`** Saved env variables into "${ENV_FILE}"`);
});

const USE_TEST_DATA = process.env.USE_TEST_DATA;
const TEST_DATA_PATH = 'tests/unit/data/site';
const LATEST_TEST_DATA_FILE = '__testDataLatest.json';

// different types of references
const PAGES = [];
const INCLUDE_FILES = [];
const GITHUB_CODE_EXAMPLES = [];
const ASSETS = [];

// in-memory object with key/value = filename/document
let RESOLVED_REF_DOC_MAPPING = {};

// stich client connection
let stitchClient;

const setupStitch = () => {
  return new Promise((resolve, reject) => {
    stitchClient = Stitch.hasAppClient(STITCH_ID)
      ? Stitch.getAppClient(STITCH_ID)
      : Stitch.initializeAppClient(STITCH_ID);
    stitchClient.auth
      .loginWithCredential(new AnonymousCredential())
      .then(user => {
        console.log('logged into stitch');
        resolve();
      })
      .catch(console.error);
  });
};

const saveAssetFile = async (name, objData) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`static/${name}`, objData.data.buffer, 'binary', err => {
      if (err) console.log('ERROR with saving asset', err);
      resolve();
    });
  });
};

exports.sourceNodes = async ({ actions }) => {
  const { createNode } = actions;
  const items = [];

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
    const query = { _id: `${PREFIX.join('/')}/index` };
    const documents = await stitchClient.callFunction('fetchDocuments', [NAMESPACE, query]);

    // set data for index page
    RESOLVED_REF_DOC_MAPPING['index'] = documents && documents.length > 0 ? documents[0] : {};

    // resolve references/urls to documents
    RESOLVED_REF_DOC_MAPPING = await stitchClient.callFunction('resolveReferences', [
      PREFIX,
      NAMESPACE,
      documents,
      RESOLVED_REF_DOC_MAPPING,
    ]);
  }

  // separate references into correct types, e.g. pages, include files, assets, etc.
  for (const ref of Object.keys(RESOLVED_REF_DOC_MAPPING)) {
    if (ref.includes('includes/')) {
      INCLUDE_FILES.push(ref);
    } else if (ref.includes('https://github.com')) {
      GITHUB_CODE_EXAMPLES.push(ref);
    } else if (ref.includes('#')) {
      ASSETS.push(ref);
    } else if (!ref.includes('curl') && !ref.includes('https://')) {
      PAGES.push(ref);
    }
  }

  // get code examples for all github urls
  for (const url of GITHUB_CODE_EXAMPLES) {
    const githubRawUrl = url.replace('https://github.com', 'https://raw.githubusercontent.com').replace('blob/', '');
    const codeFile = await stitchClient.callFunction('fetchReferenceUrlContent', [githubRawUrl]);
    RESOLVED_REF_DOC_MAPPING[url] = codeFile;
  }

  // create images directory
  for (const asset of ASSETS) {
    const [assetName, assetHash] = asset.split('#');
    const assetQuery = { _id: assetHash };
    const assetDataDocuments = await stitchClient.callFunction('fetchDocuments', [NAMESPACE_ASSETS, assetQuery]);
    if (assetDataDocuments && assetDataDocuments[0]) {
      await saveAssetFile(assetName, assetDataDocuments[0]);
    }
  }

  console.log(11, PAGES);
  console.log(22, INCLUDE_FILES);
  console.log(33, GITHUB_CODE_EXAMPLES);
  console.log(44, ASSETS);
  //console.log(RESOLVED_REF_DOC_MAPPING);

  // whenever we get latest data, always save latest version
  if (!USE_TEST_DATA) {
    const fullpathLatest = path.join(TEST_DATA_PATH, LATEST_TEST_DATA_FILE);
    fs.writeFile(fullpathLatest, JSON.stringify(RESOLVED_REF_DOC_MAPPING), 'utf8', err => {
      if (err) console.log(`ERROR saving test data into "${fullpathLatest}" file`, err);
      console.log(`** Saved test data into "${fullpathLatest}"`);
    });
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    for (const page of PAGES) {
      const template = page === 'index' ? 'index' : 'guide';
      const pageUrl = page === 'index' ? '/' : page;
      if (RESOLVED_REF_DOC_MAPPING[page] && Object.keys(RESOLVED_REF_DOC_MAPPING[page]).length > 0) {
        createPage({
          path: pageUrl,
          component: path.resolve(`./src/templates/${template}.js`),
          context: {
            __refDocMapping: RESOLVED_REF_DOC_MAPPING,
            __stitchID: STITCH_ID,
          },
        });
      }
    }
    resolve();
  });
};
