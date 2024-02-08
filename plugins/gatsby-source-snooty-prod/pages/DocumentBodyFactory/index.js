const fs = require('node:fs');
const path = require('node:path');

const templateRelativePath = `./DocumentBodyTemplate.js`;

const DocumentBodyFactory = (slug) => {
  const generationDirectory = path.resolve(__dirname, `../generated-pages`);
  try {
    if (!fs.existsSync(generationDirectory)) {
      fs.mkdirSync(generationDirectory);
    }
  } catch (error) {
    throw error;
  }
  slug = slug === '/' ? 'index' : slug.replaceAll('/', '-');
  const templatePath = path.resolve(__dirname, templateRelativePath);
  const generatedPath = path.resolve(__dirname, `${generationDirectory}/${slug}.js`);
  try {
    fs.copyFileSync(templatePath, generatedPath);
  } catch (error) {
    throw error;
  }
  return generatedPath;
};

module.exports = {
  DocumentBodyFactory,
};
