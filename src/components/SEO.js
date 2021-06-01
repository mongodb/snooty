import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const DEFAULT_TWITTER_SITE = '@mongodb';

const SEO = ({ pageTitle, siteTitle }) => (
  <Helmet>
    <title>
      {pageTitle} — {siteTitle}
    </title>

    {/* Twitter Tags - default values, may be overwritten by Twitter component */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content={DEFAULT_TWITTER_SITE} />
    <meta property="twitter:title" content={pageTitle} />
    <meta
      name="twitter:image"
      content="http://s3.amazonaws.com/info-mongodb-com/_com_assets/cms/mongodb-for-giant-ideas-bbab5c3cf8.png"
    />
    <meta
      name="twitter:image:alt"
      content="MongoDB logo featuring a green leaf on a dark gray background. Slogan reads 'For giant ideas'."
    />
  </Helmet>
);

SEO.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  siteTitle: PropTypes.string.isRequired,
};

export default SEO;
