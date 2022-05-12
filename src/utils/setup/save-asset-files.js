const fs = require('fs').promises;
const path = require('path');

const saveFile = async (file, data) => {
  await fs.mkdir(path.join('static', path.dirname(file)), {
    recursive: true,
  });
  await fs.writeFile(path.join('static', file), data, 'binary');
};

// Write all assets to static directory
const saveAssetFiles = async (assets, db) => {
  const imageWrites = [];
  for (const [id, filenames] of assets) {
    if (filenames) {
      const buffer = db.getAssets([id]);
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

module.exports = { saveAssetFiles, saveStaticFiles };
