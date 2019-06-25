import { getNestedValue } from './get-nested-value';

export const getIncludeFile = (refDocMapping, filename) => {
  let key = filename;
  if (key.startsWith('/')) key = key.substr(1);
  if (key.endsWith('.rst')) key = key.replace('.rst', '');

  return getNestedValue([key, 'ast', 'children'], refDocMapping) || [];
};
