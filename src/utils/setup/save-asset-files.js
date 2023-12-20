const fs = require('fs').promises;
const path = require('path');

const saveFile = async (file, data) => {
  // TODO
  // CHANGE TO src/images
  // THEN UPDATE PLUGINS OPTIONS
  await fs.mkdir(path.join('src', 'images', path.dirname(file)), {
    recursive: true,
  });
  await fs.writeFile(path.join('src', 'images', file), data, 'binary');

  await fs.mkdir(path.join('public', path.dirname(file)), {
    recursive: true,
  });
  await fs.writeFile(path.join('public', file), data, 'binary');
};

// Write all assets to static directory
const saveAssetFiles = async (assets, db) => {
  const imageWrites = [];
  console.log('saveAssetFiles');

  for (const [id, filenames] of assets) {
    if (filenames) {
      const buffer = await db.getAsset(id);
      if (!buffer) {
        console.error(
          `Failed to fetch asset with checksum ${id}. This should not be possible and indicates an internal problem with the document source.`
        );
        process.exit(1);
      }
      filenames.forEach((filename) => {
        console.log(filename);
        imageWrites.push(saveFile(filename, buffer));
      });
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

module.exports = { saveAssetFiles, saveStaticFiles, saveFile };
