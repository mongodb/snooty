import { getNestedValue } from './get-nested-value';

export const formatIncludeKey = filename => {
  let key = filename;
  if (key.startsWith('/')) {
    key = key.substr(1);
  } else {
    console.warn(`include file ${filename} does not begin with '/'`);
  }

  if (key.endsWith('.rst')) key = key.replace('.rst', '');
  return key;
};

export const getIncludeFile = (includeObj, filename) => {
  const key = formatIncludeKey(filename);
  return getNestedValue([key, 'ast', 'children'], includeObj) || [];
};
