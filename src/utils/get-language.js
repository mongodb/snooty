/**
 * Returns the specified language if it is valid, otherwise returns none
 */
import { Language } from '@leafygreen-ui/code';

export const getLanguage = (lang) => {
  if (Object.values(Language).includes(lang)) {
    return lang;
  } else if (lang === 'sh') {
    // Writers commonly use 'sh' to represent shell scripts, but LeafyGreen and Highlight.js use the key 'shell'
    return 'shell';
  } else if (['c', 'cpp'].includes(lang)) {
    // LeafyGreen renders C and C++ languages with "cs"
    return 'cs';
  }
  return 'none';
};
