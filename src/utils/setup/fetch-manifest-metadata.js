const AdmZip = require('adm-zip');
const BSON = require('bson');
const fs = require('fs');
const path = require('path');

// Returns the metadata from the manifest file if provided
const fetchManifestMetadata = () => {
  let metadata = {};
  if (!process.env.GATSBY_MANIFEST_PATH || !process.env.GATSBY_MANIFEST_PATH.match(/\.zip$/)) {
    metadata = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../snooty-metadata.js')));
    return metadata;
  }
  if (process.env.GATSBY_MANIFEST_PATH) {
    const zip = new AdmZip(process.env.GATSBY_MANIFEST_PATH);
    const zipEntries = zip.getEntries();
    for (const entry of zipEntries) {
      if (entry.entryName === 'site.bson') {
        metadata = BSON.deserialize(entry.getData());
      }
    }
  }
  return metadata;
};

module.exports = { fetchManifestMetadata };
