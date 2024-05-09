import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { getCompleteBreadcrumbData } from '../../utils/get-complete-breadcrumb-data.js';
import { assertTrailingSlash } from '../../utils/assert-trailing-slash';
import { useBreadcrumbs } from '../../hooks/use-breadcrumbs';
import useSnootyMetadata from '../../utils/use-snooty-metadata';
import { isRelativeUrl } from '../../utils/is-relative-url.js';
import { baseUrl } from '../../utils/base-url.js';

const getBreadcrumbList = (breadcrumbs) =>
  breadcrumbs.map(({ path, title }, index) => {
    if (isRelativeUrl(path)) {
      path = baseUrl(withPrefix(path), { needsProtocol: true, needsPrefix: true });
    }

    return {
      '@type': 'ListItem',
      position: index + 1,
      name: title,
      item: assertTrailingSlash(path),
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
