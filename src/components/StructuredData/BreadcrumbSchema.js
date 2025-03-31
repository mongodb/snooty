import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useBreadcrumbs } from '../../hooks/use-breadcrumbs';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { BreadcrumbListSd, STRUCTURED_DATA_CLASSNAME } from '../../utils/structured-data.js';
import { useSiteMetadata } from '../../hooks/use-site-metadata.js';
import { getFeatureFlags } from '../../utils/feature-flags';
import { createParentFromToc, findParentBreadCrumb } from '../Breadcrumbs/UnifiedTocBreadCrumbs';
import { useUnifiedToc } from '../../hooks/use-unified-toc';

const BreadcrumbSchema = ({ slug }) => {
  const { isUnifiedToc } = getFeatureFlags();
  const tocTree = useUnifiedToc();
  const { parentPaths, title: siteTitle } = useSnootyMetadata();
  const { siteUrl } = useSiteMetadata();

  const parentPathsSlug = parentPaths[slug];

  const queriedCrumbs = useBreadcrumbs();

  const unifiedTocParents = useMemo(() => {
    if (!isUnifiedToc) return null;

    for (const staticItems of tocTree) {
      createParentFromToc(staticItems, []);
    }

    return findParentBreadCrumb(slug, tocTree);
  }, [slug, tocTree, isUnifiedToc]);

  const breadcrumbSd = React.useMemo(() => {
    const sd = new BreadcrumbListSd({
      siteUrl,
      siteTitle,
      slug,
      queriedCrumbs,
      parentPaths: parentPathsSlug,
      unifiedTocParents,
    });
    return sd.isValid() ? sd.toString() : undefined;
  }, [siteUrl, siteTitle, slug, queriedCrumbs, parentPathsSlug, unifiedTocParents]);

  return (
    <>
      {Array.isArray(queriedCrumbs.breadcrumbs) && breadcrumbSd && (
        <script className={STRUCTURED_DATA_CLASSNAME} type="application/ld+json">
          {breadcrumbSd}
        </script>
      )}
    </>
  );
};

BreadcrumbSchema.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default BreadcrumbSchema;
