import { useMemo } from 'react';
import { createParentFromToc, findParentBreadCrumb } from '../components/Breadcrumbs/UnifiedTocBreadCrumbs';
import type { TocItem, BreadCrumb } from '../components/UnifiedSidenav/types';
import { getFullSlug } from '../utils/get-full-slug';
import { useSiteMetadata } from './use-site-metadata';

export function usePageBreadcrumbs(tocTree: TocItem[], slug: string, isUnifiedToc: boolean): BreadCrumb[] | undefined {
  const { pathPrefix } = useSiteMetadata();

  const unifiedTocParents = useMemo(() => {
    if (!isUnifiedToc) return undefined;
    const tree = createParentFromToc(tocTree, []);
    if (!tree) return undefined;

    const fullSlug = getFullSlug(slug, pathPrefix);
    return findParentBreadCrumb(fullSlug, tree);
  }, [slug, tocTree, isUnifiedToc, pathPrefix]);

  return unifiedTocParents;
}
