import React from 'react';
import PropTypes from 'prop-types';
import { getCompleteBreadcrumbData } from '../../utils/get-complete-breadcrumb-data.js';
import { assertTrailingSlash } from '../../utils/assert-trailing-slash';
import { useBreadcrumbs } from '../../hooks/use-breadcrumbs';
import useSnootyMetadata from '../../utils/use-snooty-metadata';

const getBreadcrumbList = (breadcrumbs, siteUrl) =>
  breadcrumbs.map(({ url, title }, index) => ({
    '@type': 'ListItem',
    position: index + 2,
    name: title,
    item: assertTrailingSlash(url),
  }));

const BreadcrumbSchema = ({ slug }) => {
  const { parentPaths, title: siteTitle } = useSnootyMetadata();

  const queriedCrumbs = useBreadcrumbs();
  const breadcrumbs = getCompleteBreadcrumbData({ siteTitle, slug, queriedCrumbs, parentPaths });

  console.log(breadcrumbs);

  const breadcrumbList = [...getBreadcrumbList([...breadcrumbs])];

  console.log(siteTitle);
  console.log(breadcrumbList);
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
