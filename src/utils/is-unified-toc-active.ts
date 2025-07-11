import { isUnifiedTOCInDevMode } from './is-unified-toc-dev';
import { isBrowser } from './is-browser';

export const isUnifiedTocActive = (pathToCompare: string) => {
  if (isUnifiedTOCInDevMode && isBrowser) {
    const path = window.location.pathname;
    if (path === pathToCompare) {
      return true;
    }

    return false;
  }

  return false;
};
