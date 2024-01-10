const fs = require('fs').promises;
const path = require('path');

const GATSBY_IMAGE_EXTENSIONS = ['webp', 'png', 'avif'];

const saveFile = async (file, data) => {
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
      const buffer = await db.getAsset(id);
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
