import { useMemo } from 'react';
import { createParentFromToc, findParentBreadCrumb } from '../components/Breadcrumbs/UnifiedTocBreadCrumbs';
import type { TocItem, BreadCrumb } from '../components/UnifiedSidenav/UnifiedConstants';

export function usePageBreadcrumbs(tocTree: TocItem[], slug: string, isUnifiedToc: boolean): BreadCrumb[] | undefined {
  const unifiedTocParents = useMemo(() => {
    if (!isUnifiedToc) return undefined;
    const tree = createParentFromToc(tocTree, []);
    if (!tree) return undefined;

    return findParentBreadCrumb(slug, tree);
  }, [slug, tocTree, isUnifiedToc]);

  return unifiedTocParents;
}
