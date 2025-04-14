import { getNestedValue } from './get-nested-value';

/**
 * Given property metadata,
 * return the site title as a string
 *
 * @param {object} metadata
 */
export const getSiteTitle = (metadata) => {
  let title = getNestedValue(['title'], metadata) || '';
  if (!title) {
    return '';
  }
  const version = getNestedValue(['branch'], metadata) || '';
  title += typeof version === 'string' && version?.startsWith('v') ? ` ${version}` : '';
  return title;
};
