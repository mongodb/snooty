const { getNestedValue } = require('../src/utils/get-nested-value');

// TODO: Figure out a way to use the same getIncludeFile() in both gatsby and preview
export const getIncludeFile = (includeObj, filename) => {
  let key = filename;
  if (key.startsWith('/')) {
    key = key.substr(1);
  } else {
    console.warn(`include file ${filename} does not begin with '/'`);
  }

  if (key.endsWith('.rst')) key = key.replace('.rst', '');

  return getNestedValue([key, 'ast', 'children'], includeObj) || [];
};