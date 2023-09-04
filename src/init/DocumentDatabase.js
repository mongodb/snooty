const AdmZip = require('adm-zip');
const BSON = require('bson');
const { initStitch } = require('../utils/setup/init-stitch');
const { constructReposFilter } = require('../utils/setup/construct-repos-filter');
const {
  DOCUMENTS_COLLECTION,
  METADATA_COLLECTION,
  ASSETS_COLLECTION,
  BRANCHES_COLLECTION,
} = require('../build-constants');
const { manifestMetadata, siteMetadata } = require('../utils/site-metadata');
const { constructBuildFilter } = require('../utils/setup/construct-build-filter');

const DB = siteMetadata.database;
const buildFilter = constructBuildFilter({
  ...siteMetadata,
  project: process.env.GATSBY_SITE,
});

class StitchInterface {
  constructor() {
    this.stitchClient = null;
  }

  async connect() {
    this.stitchClient = await initStitch();
  }

  fetchAllProducts() {
    return this.stitchClient.callFunction('fetchAllProducts', [siteMetadata.database]);
  }

  fetchRepoBranches(project = process.env.GATSBY_SITE) {
    return this.stitchClient.callFunction('fetchDocument', [
      siteMetadata.reposDatabase,
      BRANCHES_COLLECTION,
      constructReposFilter(project, project === process.env.GATSBY_SITE),
    ]);
  }

  async fetchDocuments(collection, buildFilter) {
    return this.stitchClient.callFunction('fetchDocuments', [DB, collection, buildFilter]);
  }

  async getMetadata(buildFilter, findOptions) {
    return this.stitchClient.callFunction('fetchDocument', [
      DB,
      METADATA_COLLECTION,
      buildFilter,
      undefined,
      findOptions,
    ]);
  }

  async fetchDocument(database, collectionName, query) {
    return this.stitchClient.callFunction('fetchDocument', [database, collectionName, query]);
  }

  async updateOAChangelogMetadata(metadata) {
    return this.stitchClient.callFunction('updateOAChangelogMetadata', [metadata]);
  }
}

class ManifestDocumentDatabase {
  constructor(path) {
    this.zip = new AdmZip(path);
    this.stitchInterface = new StitchInterface();
  }

  async connect() {
    await this.stitchInterface.connect();
  }

  async getDocuments() {
    const result = [];
    const zipEntries = this.zip.getEntries();
    for (const entry of zipEntries) {
      if (entry.entryName.startsWith('documents/')) {
        const doc = BSON.deserialize(entry.getData());
        result.push(doc);
      }
    }
    return result;
  }

  async getMetadata() {
    return manifestMetadata;
  }

  async getAsset(checksum) {
    const result = this.zip.getEntry(`assets/${checksum}`);
    if (result) {
      return result.getData();
    }
    return null;
  }

  async fetchAllProducts() {
    return this.stitchInterface.fetchAllProducts();
  }
}

class StitchDocumentDatabase {
  constructor() {
    this.stitchInterface = new StitchInterface();
  }

  async connect() {
    await this.stitchInterface.connect();
  }

  async getDocuments() {
    return this.stitchInterface.fetchDocuments(DOCUMENTS_COLLECTION, buildFilter);
  }

  async getMetadata(queryFilters) {
    const filter = queryFilters || buildFilter;
    return this.stitchInterface.getMetadata(filter);
  }

  async getAsset(checksum) {
    const assetQuery = { _id: checksum };
    const assetDataDocuments = await this.stitchInterface.fetchDocuments(ASSETS_COLLECTION, assetQuery);

    for (const result of assetDataDocuments) {
      return result.data.buffer;
    }
    return null;
  }

  async fetchAllProducts() {
    return this.stitchInterface.fetchAllProducts();
  }

  async fetchDocument(database, collectionName, query) {
    return this.stitchInterface.fetchDocument(database, collectionName, query);
  }

  async updateOAChangelogMetadata(metadata) {
    return this.stitchInterface.updateOAChangelogMetadata(metadata);
  }
}

exports.manifestDocumentDatabase = new ManifestDocumentDatabase(process.env.GATSBY_MANIFEST_PATH);
exports.stitchDocumentDatabase = new StitchDocumentDatabase();
