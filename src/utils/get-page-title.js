import { formatText } from './format-text';
import { getNestedValue } from './get-nested-value';

/*
 * Given slug and a property's slug-title mapping, look up the title for a given page.
 * Returns array of text nodes with formatting or a plaintext string.
 */
export const getPageTitle = (slug, slugTitleMapping) => {
  const slugLookup = slug === '/' ? 'index' : slug;
  const title = getNestedValue([slugLookup], slugTitleMapping);
  return title ? formatText(title) : null;
};
