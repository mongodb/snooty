import React from 'react';
import PropTypes from 'prop-types';
import { getCompleteBreadcrumbData, getFullBreadcrumbPath } from '../../utils/get-complete-breadcrumb-data.js';
import { useBreadcrumbs } from '../../hooks/use-breadcrumbs';
import useSnootyMetadata from '../../utils/use-snooty-metadata';

const getBreadcrumbList = (breadcrumbs) =>
  breadcrumbs.map(({ path, title }, index) => {
    path = getFullBreadcrumbPath(path, true);

    return {
      '@type': 'ListItem',
      position: index + 1,
      name: title,
      item: path,
    };
  });

const BreadcrumbSchema = ({ slug }) => {
  const { parentPaths, title: siteTitle } = useSnootyMetadata();

  const queriedCrumbs = useBreadcrumbs();
  const breadcrumbList = React.useMemo(
    () => [...getBreadcrumbList([...getCompleteBreadcrumbData({ siteTitle, slug, queriedCrumbs, parentPaths })])],
    [siteTitle, slug, queriedCrumbs, parentPaths]
  );

  return (
    <>
      {Array.isArray(queriedCrumbs.breadcrumbs) && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbList,
          })}
        </script>
      )}
    </>
  );
};

BreadcrumbSchema.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default BreadcrumbSchema;
