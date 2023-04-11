import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';

import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { assertTrailingSlash } from '../../utils/assert-trailing-slash';
import { baseUrl } from '../../utils/base-url';
import useSnootyMetadata from '../../utils/use-snooty-metadata';

const getBreadcrumbList = (breadcrumbs, siteUrl) =>
  breadcrumbs.map(({ path, plaintext }, index) => ({
    '@type': 'ListItem',
    position: index + 2,
    name: plaintext,
    item: assertTrailingSlash(`${siteUrl}${withPrefix(path)}`),
  }));

const BreadcrumbSchema = ({ slug }) => {
  const { project, siteUrl } = useSiteMetadata();
  const { parentPaths, title: siteTitle } = useSnootyMetadata();
  const breadcrumbs = parentPaths[slug] ?? [];
  const breadcrumbList = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'MongoDB Documentation',
      item: baseUrl(),
    },
    ...getBreadcrumbList(
      [...(slug !== '/' && project !== 'landing' ? [{ path: '/', plaintext: siteTitle }] : []), ...breadcrumbs],
      siteUrl
    ),
  ];
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
