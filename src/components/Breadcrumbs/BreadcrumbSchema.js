import React from 'react';
import PropTypes from 'prop-types';
import { Script, withPrefix } from 'gatsby';

import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { assertTrailingSlash } from '../../utils/assert-trailing-slash';
import { baseUrl } from '../../utils/base-url';

const getBreadcrumbList = (breadcrumb, siteUrl) =>
  breadcrumb.map(({ path, plaintext }, index) => ({
    '@type': 'ListItem',
    position: index + 2,
    name: plaintext,
    item: assertTrailingSlash(`${siteUrl}${withPrefix(path)}`),
  }));

const BreadcrumbSchema = ({ breadcrumb = [], siteTitle, slug }) => {
  const { project, siteUrl } = useSiteMetadata();
  const breadcrumbList = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'MongoDB Documentation',
      item: baseUrl(),
    },
    ...getBreadcrumbList(
      [...(slug !== '/' && project !== 'landing' ? [{ path: '/', plaintext: siteTitle }] : []), ...breadcrumb],
      siteUrl
    ),
  ];
  return (
    <>
      {Array.isArray(breadcrumb) && (
        <Script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbList,
          })}
        </Script>
      )}
    </>
  );
};

BreadcrumbSchema.propTypes = {
  breadcrumb: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      plaintext: PropTypes.string,
    })
  ),
  siteTitle: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default BreadcrumbSchema;
