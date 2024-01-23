const AdmZip = require('adm-zip');
const BSON = require('bson');
const fs = require('fs');

// Returns the metadata from the manifest file if provided
const fetchManifestMetadata = () => {
  let metadata = {};
  if (!process.env.GATSBY_MANIFEST_PATH || !process.env.GATSBY_MANIFEST_PATH.includes('.zip')) {
    metadata = fs.readFileSync('snooty-metadata.js');
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
  console.log('keys ', Object.keys(metadata));
  return metadata;
};

module.exports = { fetchManifestMetadata };
