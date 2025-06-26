import { isUnifiedTOCInDevMode } from './is-unified-toc-dev';
import { isBrowser } from './is-browser';

export const isUnifiedTocActive = (pathToCompare: string, pathPrefix: string) => {
  if (isUnifiedTOCInDevMode && isBrowser) {
    const prefixToReplace = pathPrefix ?? '';
    const path = window.location.pathname.replace(prefixToReplace, '');
    if (path === pathToCompare) {
      return true;
    }

    return false;
  }

  return false;
};
