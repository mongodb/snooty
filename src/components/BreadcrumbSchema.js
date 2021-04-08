import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { Helmet } from 'react-helmet';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { assertTrailingSlash } from '../utils/assert-trailing-slash';

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
      item: 'https://docs.mongodb.com/',
    },
    ...getBreadcrumbList(
      [...(slug !== '/' && project !== 'landing' ? [{ path: '/', plaintext: siteTitle }] : []), ...breadcrumb],
      siteUrl
    ),
  ];
  return (
    <Helmet>
      {Array.isArray(breadcrumb) && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbList,
          })}
        </script>
      )}
    </Helmet>
  );
};

BreadcrumbSchema.propTypes = {
  breadcrumb: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      plaintext: PropTypes.string,
    })
  ).isRequired,
  siteTitle: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default BreadcrumbSchema;
