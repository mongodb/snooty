const AdmZip = require('adm-zip');
const BSON = require('bson');

// Returns the metadata from the manifest file if provided
const fetchManifestMetadata = () => {
  let metadata = {};
  if (process.env.GATSBY_MANIFEST_PATH) {
    const zip = new AdmZip(process.env.GATSBY_MANIFEST_PATH);
    const zipEntries = zip.getEntries();
    for (const entry of zipEntries) {
      if (entry.entryName === 'site.bson') {
        metadata = BSON.deserialize(entry.getData());

        if (process.env.TEST_EMBED_VERSIONS && metadata['project'] === 'cloud-docs') {
          metadata['associated_products'] = [
            {
              name: 'atlas-cli',
              versions: ['v1.1', 'v1.0'],
            },
          ];
        }
      }
    }
  }
  return metadata;
};

module.exports = { fetchManifestMetadata };
