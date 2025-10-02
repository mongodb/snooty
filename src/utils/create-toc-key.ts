import { TocItem } from '../components/UnifiedSidenav/types';

// Ensures a unique key is created for each toc item
export const tocItemKey = (tocItem: TocItem): string => {
  return (
    tocItem.newUrl +
    tocItem.label +
    `${tocItem.versions ? (tocItem.versions.includes ? 'include list' : 'exclude list') : ''}`
  );
};
