const AdmZip = require('adm-zip');
const BSON = require('bson');
const fs = require('fs');
const { promisify } = require('util');
const { initRealm } = require('../utils/setup/init-realm');
const { manifestMetadata, siteMetadata } = require('../utils/site-metadata');

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

  async fetchDocset(matchConditions = { project: siteMetadata.project }) {
    return this.realmClient.callFunction('fetchDocset', siteMetadata.reposDatabase, matchConditions);
  }

  async fetchDocsets() {
    return this.realmClient.callFunction('fetchDocsets', siteMetadata.reposDatabase);
  }

  async updateOAChangelogMetadata(metadata) {
    return this.realmClient.callFunction('updateOAChangelogMetadata', metadata);
  }

  async fetchBreadcrumbs(database, project) {
    return this.realmClient.callFunction('fetchBreadcrumbs', database, project);
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

  async fetchBreadcrumbs(database, project) {
    return this.realmInterface.fetchBreadcrumbs(database, project);
  }
}

class RealmDocumentDatabase {
  constructor() {
    this.realmInterface = new RealmInterface();
  }

  async connect() {
    await this.realmInterface.connect();
  }

  async fetchAllProducts() {
    return this.realmInterface.fetchAllProducts();
  }

  async fetchDocset(matchConditions) {
    return this.realmInterface.fetchDocset(matchConditions);
  }

  async updateOAChangelogMetadata(metadata) {
    return this.realmInterface.updateOAChangelogMetadata(metadata);
  }

  async fetchBreadcrumbs(database, project) {
    return this.realmInterface.fetchBreadcrumbs(database, project);
  }
}

exports.manifestDocumentDatabase = new ManifestDocumentDatabase(process.env.GATSBY_MANIFEST_PATH);
exports.realmDocumentDatabase = new RealmDocumentDatabase();
exports.RealmDocumentDatabaseClass = RealmDocumentDatabase;
