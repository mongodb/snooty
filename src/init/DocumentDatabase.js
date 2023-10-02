const AdmZip = require('adm-zip');
const BSON = require('bson');
const { initRealm } = require('../utils/setup/init-realm');
const { DOCUMENTS_COLLECTION, METADATA_COLLECTION, ASSETS_COLLECTION } = require('../build-constants');
const { manifestMetadata, siteMetadata } = require('../utils/site-metadata');
const { constructBuildFilter } = require('../utils/setup/construct-build-filter');

const DB = siteMetadata.database;
const buildFilter = constructBuildFilter(siteMetadata);

class RealmInterface {
  constructor() {
    this.realmClient = null;
  }

  async connect() {
    this.realmClient = await initRealm();
  }

  fetchAllProducts() {
    return this.realmClient.callFunction('fetchAllProducts', siteMetadata.database);
  }

  async fetchDocuments(collection, buildFilter) {
    return this.realmClient.callFunction('fetchDocuments', DB, collection, buildFilter);
  }

  async getMetadata(buildFilter, findOptions) {
    return this.realmClient.callFunction('fetchDocument', DB, METADATA_COLLECTION, buildFilter, undefined, findOptions);
  }

  async fetchDocument(database, collectionName, query) {
    return this.realmClient.callFunction('fetchDocument', database, collectionName, query);
  }

  async fetchDocset(matchConditions = { project: siteMetadata.project }) {
    return this.realmClient.callFunction('fetchDocset', siteMetadata.reposDatabase, matchConditions);
  }

  async updateOAChangelogMetadata(metadata) {
    return this.realmClient.callFunction('updateOAChangelogMetadata', metadata);
  }
}

class ManifestDocumentDatabase {
  constructor(path) {
    this.zip = new AdmZip(path);
    this.realmInterface = new RealmInterface();
  }

  async connect() {
    await this.realmInterface.connect();
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
    return this.realmInterface.fetchAllProducts();
  }
}

class RealmDocumentDatabase {
  constructor() {
    this.realmInterface = new RealmInterface();
  }

  async connect() {
    await this.realmInterface.connect();
  }

  async getDocuments() {
    return this.realmInterface.fetchDocuments(DOCUMENTS_COLLECTION, buildFilter);
  }

  async getMetadata(queryFilters) {
    const filter = queryFilters || buildFilter;
    return this.realmInterface.getMetadata(filter);
  }

  async getAsset(checksum) {
    const assetQuery = { _id: checksum };
    const assetDataDocuments = await this.realmInterface.fetchDocuments(ASSETS_COLLECTION, assetQuery);

    for (const result of assetDataDocuments) {
      return result.data.buffer;
    }
    return null;
  }

  async fetchAllProducts() {
    return this.realmInterface.fetchAllProducts();
  }

  async fetchDocument(database, collectionName, query) {
    return this.realmInterface.fetchDocument(database, collectionName, query);
  }

  async fetchDocset(matchConditions) {
    return this.realmInterface.fetchDocset(matchConditions);
  }

  async updateOAChangelogMetadata(metadata) {
    return this.realmInterface.updateOAChangelogMetadata(metadata);
  }
}

exports.manifestDocumentDatabase = new ManifestDocumentDatabase(process.env.GATSBY_MANIFEST_PATH);
exports.realmDocumentDatabase = new RealmDocumentDatabase();
