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
    const promises = [];
    const assetQuery = { _id: { $in: assets } };
    const assetDataDocuments = await stitchClient.callFunction('fetchDocuments', [
      database,
      ASSETS_COLLECTION,
      assetQuery,
    ]);
    assetDataDocuments.forEach(({ filename, data: { buffer } }) => {
      promises.push(saveFile(filename, buffer));
    });
    await Promise.all(promises);
  }
};

const saveStaticFiles = async staticFiles => {
  Object.entries(staticFiles).forEach(([file, data]) => saveFile(file, data));
};

module.exports = { saveAssetFiles, saveStaticFiles };
