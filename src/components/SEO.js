import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const DEFAULT_TWITTER_SITE = '@mongodb';
const metaUrl = `www.mongodb.com/docs/assets/meta_generic.png`;

const SEO = ({ pageTitle, siteTitle }) => (
  <Helmet>
    <title>
      {pageTitle} — {siteTitle}
    </title>

    {/* Twitter Tags - default values, may be overwritten by Twitter component */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content={DEFAULT_TWITTER_SITE} />
    <meta property="twitter:title" content={pageTitle} />
    <meta name="twitter:image" content={metaUrl} />
    <meta name="twitter:image:alt" content="MongoDB logo featuring a green leaf on a dark green background." />
  </Helmet>
);

SEO.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  siteTitle: PropTypes.string.isRequired,
};

export default SEO;
