import { getNestedValue } from './get-nested-value';
import { getPlaintext } from './get-plaintext';

/*
 * Given slug and a property's slug-title mapping, look up the title for a given page.
 * Returns title in plaintext, without any formatting.
 */
export const getPageTitle = (slug, slugTitleMapping) => {
  const slugLookup = slug === '/' ? 'index' : slug;
  const title = getNestedValue([slugLookup], slugTitleMapping);
  return title ? getPlaintext(title) : null;
};
