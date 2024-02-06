import { copyFile } from 'node:fs/promises';
import * as path from 'path';

const templateRelativePath = `./DocumentBodyTemplate.js`;

const DocumentBodyFactory = async (slug) => {
  const templatePath = path.resolve(__dirname, templateRelativePath);
  const generatedPath = path.resolve(__dirname, `../generated-pages/${slug}`);
  return copyFile(templatePath, generatedPath);
};

export default DocumentBodyFactory;
