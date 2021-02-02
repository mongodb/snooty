import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const SEO = ({ pageTitle, siteTitle }) => (
  <Helmet>
    <title>
      {pageTitle} — {siteTitle}
    </title>
  </Helmet>
);

SEO.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  siteTitle: PropTypes.string.isRequired,
};

export default SEO;
