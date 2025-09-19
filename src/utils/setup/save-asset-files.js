const fs = require('fs').promises;
const path = require('path');
const { siteMetadata } = require('../site-metadata');
const { ASSETS_COLLECTION } = require('../../build-constants');
const { ManifestDocumentDatabaseClass } = require('../../init/DocumentDatabase');
const { fetchDocumentSorted } = require('../../../plugins/utils/documents');

const GATSBY_IMAGE_EXTENSIONS = ['webp', 'png', 'avif'];

const needsImageOptimization =
  ['dotcomprd', 'dotcomstg'].includes(siteMetadata.snootyEnv) && process.env['OFFLINE_DOCS'] !== 'true';

const saveFile = async (file, data) => {
  // save files both to "public" and "src/images" directories
  // the first is for public access, and the second is for image processing
  await fs.mkdir(path.join('public', path.dirname(file)), {
    recursive: true,
  });
  await fs.writeFile(path.join('public', file), data, 'binary');

  // For staging, skip adding images to src/images dir
  // This will functionally skip image optimization, as the plugins source from that dir
  if (!needsImageOptimization) return;

  const pathList = GATSBY_IMAGE_EXTENSIONS.some((ext) => file.endsWith(ext)) ? ['src', 'images'] : ['public'];
  await fs.mkdir(path.join(...pathList, path.dirname(file)), {
    recursive: true,
  });
  await fs.writeFile(path.join(...pathList, file), data, 'binary');
};

// Write assets to static directory
// Or /src directory if they are supported to be processed
const saveAssetFiles = async (assets, db) => {
  const imageWrites = [];

  for (const [id, filenames] of assets) {
    if (filenames) {
      let buffer;
      if (db instanceof ManifestDocumentDatabaseClass) {
        buffer = await db.getAsset(id);
      } else {
        const assetQuery = { _id: id };
        const assetDataDocuments = await fetchDocumentSorted(siteMetadata.database, ASSETS_COLLECTION, assetQuery);
        buffer = assetDataDocuments[0]?.data?.buffer ?? null;
      }

      if (!buffer) {
        console.error(
          `Failed to fetch asset with checksum ${id}. This should not be possible and indicates an internal problem with the document source.`
        );
        process.exit(1);
      }
      filenames.forEach((filename) => imageWrites.push(saveFile(filename, buffer)));
    }
  }
  await Promise.all(imageWrites);
};

const saveStaticFiles = async (staticFiles) => {
  await Promise.all(
    Object.entries(staticFiles).map(([file, data]) => {
      // Certain files, like manpages, may not have buffers
      const toSave = data.buffer ? data.buffer : data;
      return saveFile(file, toSave);
    })
  );
};

module.exports = { saveAssetFiles, saveStaticFiles, saveFile, GATSBY_IMAGE_EXTENSIONS };
