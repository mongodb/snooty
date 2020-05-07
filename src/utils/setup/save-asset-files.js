const fs = require('fs').promises;
const path = require('path');
const { ASSETS_COLLECTION } = require('../../build-constants');
const {
  siteMetadata: { database },
} = require('../site-metadata');

const saveFile = async (file, data) => {
  await fs.mkdir(path.join('static', path.dirname(file)), {
    recursive: true,
  });
  await fs.writeFile(path.join('static', file), data, 'binary');
};

// Write all assets to static directory
const saveAssetFiles = async (assets, stitchClient) => {
  if (assets.length) {
    const assetQuery = { _id: { $in: assets } };
    const assetDataDocuments = await stitchClient.callFunction('fetchDocuments', [
      database,
      ASSETS_COLLECTION,
      assetQuery,
    ]);
    await Promise.all(assetDataDocuments.map(({ filename, data: { buffer } }) => saveFile(filename, buffer)));
  }
};

const saveStaticFiles = async staticFiles => {
  await Promise.all(Object.entries(staticFiles).map(([file, data]) => saveFile(file, data.buffer)));
};

module.exports = { saveAssetFiles, saveStaticFiles };
