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
  if (Object.keys(assets).length) {
    const assetQuery = { _id: { $in: Object.keys(assets) } };
    const assetDataDocuments = await stitchClient.callFunction('fetchDocuments', [
      database,
      ASSETS_COLLECTION,
      assetQuery,
    ]);

    const imageWrites = [];
    assetDataDocuments.forEach(({ _id, data: { buffer } }) => {
      assets[_id].forEach(filename => imageWrites.push(saveFile(filename, buffer)));
    });
    await Promise.all(imageWrites);
  }
};

const saveStaticFiles = async staticFiles => {
  await Promise.all(Object.entries(staticFiles).map(([file, data]) => saveFile(file, data.buffer)));
};

module.exports = { saveAssetFiles, saveStaticFiles };
