const AdmZip = require('adm-zip');
const BSON = require('bson');
const fs = require('fs');

// Returns the metadata from the manifest file if provided
const fetchManifestMetadata = () => {
  let metadata = {};
  if (process.env.GATSBY_MANIFEST_PATH && !process.env.GATSBY_MANIFEST_PATH.match(/\.zip$/)) {
    // Read metadata from Gatsby Action download
    try {
      metadata = JSON.parse(fs.readFileSync('snooty-metadata.json'));
      return metadata;
    } catch (err) {
      console.error('No Manifest Path was found.');
      return metadata;
    }
  } else if (process.env.GATSBY_MANIFEST_PATH) {
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
