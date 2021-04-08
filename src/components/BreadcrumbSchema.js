import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';
import { Helmet } from 'react-helmet';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { assertTrailingSlash } from '../utils/assert-trailing-slash';

const getBreadcrumbList = (breadcrumb, siteUrl) =>
  breadcrumb.map(({ path, plaintext }, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: plaintext,
    item: assertTrailingSlash(`${siteUrl}${withPrefix(path)}`),
  }));

const BreadcrumbSchema = ({ breadcrumb = [], siteTitle, slug }) => {
  const { project, siteUrl } = useSiteMetadata();
  return (
    <Helmet>
      {Array.isArray(breadcrumb) && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: getBreadcrumbList(
              [
                ...(siteUrl === 'https://docs.mongodb.com' ? [{ path: '', plaintext: 'MongoDB Documentation' }] : []),
                ...(slug !== '/' && project !== 'landing' ? [{ path: '/', plaintext: siteTitle }] : []),
                ...breadcrumb,
              ],
              siteUrl
            ),
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
