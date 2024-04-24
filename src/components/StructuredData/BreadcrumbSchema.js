import React from 'react';
import PropTypes from 'prop-types';
import { getCompleteBreadcrumbData } from '../../utils/get-complete-breadcrumb-data.js';
import { assertTrailingSlash } from '../../utils/assert-trailing-slash';
import { useBreadcrumbs } from '../../hooks/use-breadcrumbs';
import useSnootyMetadata from '../../utils/use-snooty-metadata';

const getBreadcrumbList = (breadcrumbs, siteUrl) =>
  breadcrumbs.map(({ url, title }, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: title,
    item: assertTrailingSlash(url),
  }));

const BreadcrumbSchema = ({ slug }) => {
  const { parentPaths, title: siteTitle } = useSnootyMetadata();

  const queriedCrumbs = useBreadcrumbs();
  const breadcrumbs = React.useMemo(
    () => getCompleteBreadcrumbData({ siteTitle, slug, queriedCrumbs, parentPaths }),
    [siteTitle, slug, queriedCrumbs, parentPaths]
  );

  const breadcrumbList = [...getBreadcrumbList([...breadcrumbs])];

  return (
    <>
      {Array.isArray(breadcrumbs) && (
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
