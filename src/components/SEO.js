import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const SEO = ({ canonicalUrl, pageTitle, siteTitle }) => (
  <Helmet>
    <title>
      {pageTitle} — {siteTitle}
    </title>
    <link rel="canonical" href={canonicalUrl} />
  </Helmet>
);

SEO.propTypes = {
  canonicalUrl: PropTypes.string.isRequired,
  pageTitle: PropTypes.string.isRequired,
  siteTitle: PropTypes.string.isRequired,
};

export default SEO;
