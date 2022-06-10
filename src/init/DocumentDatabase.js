const { initStitch } = require('../utils/setup/init-stitch');
const { constructReposFilter } = require('../utils/setup/construct-repos-filter');
const {
  DOCUMENTS_COLLECTION,
  METADATA_COLLECTION,
  ASSETS_COLLECTION,
  BRANCHES_COLLECTION,
} = require('../build-constants');
const { siteMetadata } = require('../utils/site-metadata');
const { constructBuildFilter } = require('../utils/setup/construct-build-filter');
const AdmZip = require('adm-zip');
const BSON = require('bson');

const DB = siteMetadata.database;
const buildFilter = constructBuildFilter(siteMetadata);

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

  fetchRepoBranches() {
    return this.stitchClient.callFunction('fetchDocument', [
      siteMetadata.reposDatabase,
      BRANCHES_COLLECTION,
      constructReposFilter(siteMetadata.project),
    ]);
  }

  async fetchDocuments(collection, buildFilter) {
    return this.stitchClient.callFunction('fetchDocuments', [DB, collection, buildFilter]);
  }

  async getMetadata(buildFilter) {
    return this.stitchClient.callFunction('fetchDocument', [DB, METADATA_COLLECTION, buildFilter]);
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
    const zipEntries = this.zip.getEntries();
    for (const entry of zipEntries) {
      if (entry.entryName === 'site.bson') {
        const doc = BSON.deserialize(entry.getData());
        return doc;
      }
    }
  }

  async *getAssets(checksums) {
    for (const checksum of checksums) {
      const result = this.zip.getEntry(`assets/${checksum}`);
      if (result) {
        yield result.getData();
      }
    }
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

  async getMetadata() {
    return this.stitchInterface.getMetadata(buildFilter);
  }

  async *getAssets(checksums) {
    const assetQuery = { _id: { $in: Array.from(checksums) } };
    const assetDataDocuments = await this.stitchInterface.fetchDocuments(ASSETS_COLLECTION, assetQuery);

    for (const result of assetDataDocuments) {
      yield result.data.buffer;
    }
  }

  async fetchAllProducts() {
    return this.stitchInterface.fetchAllProducts();
  }
}

exports.ManifestDocumentDatabase = ManifestDocumentDatabase;
exports.StitchDocumentDatabase = StitchDocumentDatabase;
