const AdmZip = require('adm-zip');
const BSON = require('bson');
const fs = require('fs');
const { promisify } = require('util');
const { manifestMetadata } = require('../utils/site-metadata');

const readFileAsync = promisify(fs.readFile);

class ManifestDocumentDatabase {
  constructor(path) {
    // Allow no zip if building artifact through Github Action
    this.zip = process.env.GATSBY_BUILD_FROM_JSON !== 'true' ? new AdmZip(path) : null;
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
}

exports.manifestDocumentDatabase = new ManifestDocumentDatabase(process.env.GATSBY_MANIFEST_PATH);
exports.ManifestDocumentDatabaseClass = ManifestDocumentDatabase;
