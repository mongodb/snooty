const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');
const contentful = require('contentful');
const mongoclient = require('mongodb').MongoClient;
const { Stitch, AnonymousCredential } = require('mongodb-stitch-server-sdk');

const LANGUAGES = [
  ['shell', 'Mongo Shell'],
  ['compass', 'Compass'],
  ['python', 'Python'],
  ['java-sync', 'Java (Sync)'],
  ['nodejs', 'Node.js'],
  ['php', 'PHP'],
  ['motor', 'Motor'],
  ['java-async', 'Java (Async)'],
  ['c', 'C'],
  ['cpp', 'C++11'],
  ['csharp', 'C#'],
  ['perl', 'Perl'],
  ['ruby', 'Ruby'],
  ['scala', 'Scala']
];

// ENV vars
const PREFIX = process.env.PREFIX.split('/');
const STITCH_ID = process.env.STITCH_ID;
const NAMESPACE = process.env.NAMESPACE;
const NAMESPACE_ASSETS = NAMESPACE.split('/')[0] + '/' + 'assets';

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
    stitchClient = Stitch.hasAppClient(STITCH_ID) ? Stitch.getAppClient(STITCH_ID) : Stitch.initializeAppClient(STITCH_ID);
    stitchClient.auth.loginWithCredential(new AnonymousCredential()).then((user) => {
      console.log('logged into stitch');
      resolve();
    });
  });
};

const saveAssetFile = async (name, objData) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`static/${name}`, objData.data.buffer, 'binary', (err) => {
      if (err) throw err;
      resolve();
    });
  });
}

exports.sourceNodes = async ({ actions }) => {

  const { createNode } = actions;
  const items = [];

  await setupStitch();

  // start from index document
  const query = { _id: `${ PREFIX.join('/') }/index` };

  // get index document
  const documents = await stitchClient.callFunction('fetchDocuments', [NAMESPACE, query]);

  // set data for index page
  RESOLVED_REF_DOC_MAPPING['index'] = (documents && documents.length > 0) ? documents[0] : {};

  // resolve references/urls to documents
  RESOLVED_REF_DOC_MAPPING = await stitchClient.callFunction('resolveReferences', [PREFIX, NAMESPACE, documents, RESOLVED_REF_DOC_MAPPING]);

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
    const githubRawUrl = url.replace('https://github.com', 'https://raw.githubusercontent.com').replace('blob/', '')
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

};

exports.createPages = ({ graphql, actions }) => {

  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    for (const page of PAGES) {
      const template = (page === 'index') ? 'index' : 'guide';
      const pageUrl = (page === 'index') ? '/' : page;
      if (RESOLVED_REF_DOC_MAPPING[page] && Object.keys(RESOLVED_REF_DOC_MAPPING[page]).length > 0) {
        createPage({
          path: pageUrl,
          component: path.resolve(`./src/templates/${ template }.js`),
          context: {
            __refDocMapping: RESOLVED_REF_DOC_MAPPING,
            __languageList: LANGUAGES,
            __stitchID: STITCH_ID
          }
        });
      }
    }
    resolve();
  });

};

