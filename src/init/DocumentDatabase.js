const AdmZip = require('adm-zip');
const BSON = require('bson');
const fs = require('fs');
const { promisify } = require('util');
const { initRealm } = require('../utils/setup/init-realm');
const { DOCUMENTS_COLLECTION, METADATA_COLLECTION, ASSETS_COLLECTION } = require('../build-constants');
const { manifestMetadata, siteMetadata } = require('../utils/site-metadata');
const { constructBuildFilter } = require('../utils/setup/construct-build-filter');

const DB = siteMetadata.database;
const buildFilter = constructBuildFilter(siteMetadata);

const readFileAsync = promisify(fs.readFile);

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

  async getMetadata(buildFilter, projectionOptions, findOptions) {
    return this.realmClient.callFunction(
      'fetchDocumentSorted',
      DB,
      METADATA_COLLECTION,
      buildFilter,
      projectionOptions,
      findOptions
    );
  }

  async fetchDocument(database, collectionName, query) {
    return this.realmClient.callFunction('fetchDocumentSorted', database, collectionName, query);
  }

  async fetchDocset(matchConditions = { project: siteMetadata.project }) {
    return this.realmClient.callFunction('fetchDocset', siteMetadata.reposDatabase, matchConditions);
  }

  async fetchDocsets() {
    return this.realmClient.callFunction('fetchDocsets', siteMetadata.reposDatabase);
  }

  async updateOAChangelogMetadata(metadata) {
    return this.realmClient.callFunction('updateOAChangelogMetadata', metadata);
  }

  async fetchBanner(isDevBuild) {
    return this.realmClient.callFunction('getBanner', isDevBuild);
  }
}

class ManifestDocumentDatabase {
  constructor(path) {
    // Allow no zip if building artifact through Github Action
    this.zip = process.env.GATSBY_BUILD_FROM_JSON !== 'true' ? new AdmZip(path) : null;
    this.realmInterface = new RealmInterface();
  }

  async connect() {
    await this.realmInterface.connect();
  }

  async getDocuments() {
    const result = [];
    if (!this.zip && process.env.GATSBY_BUILD_FROM_JSON === 'true') {
      // Read documents from Gatsby Action download
      try {
        const documents = JSON.parse(await readFileAsync('snooty-documents.json'));
        return documents;
      } catch (err) {
        console.error('No Manifest Path was found.');
        return result;
      }
    } else {
      const zipEntries = this.zip.getEntries();
      for (const entry of zipEntries) {
        if (entry.entryName.startsWith('documents/')) {
          const doc = BSON.deserialize(entry.getData());
          result.push(doc);
        }
      }
    }
    return result;
  }

  async getMetadata() {
    return manifestMetadata;
  }

  async getAsset(checksum) {
    if (!this.zip && process.env.GATSBY_BUILD_FROM_JSON === 'true') {
      // Read assets from Gatsby Action download
      try {
        const asset = await readFileAsync(`assets/${checksum}`, { encoding: 'base64' });
        return Buffer.from(asset, 'base64');
      } catch (err) {
        console.error('No Manifest Path was found.');
        return null;
      }
    }
    const result = this.zip.getEntry(`assets/${checksum}`);
    if (result) {
      const buffer = result.getData();
      return buffer;
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
