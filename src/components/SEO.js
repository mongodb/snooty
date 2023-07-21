import React from 'react';
import PropTypes from 'prop-types';

const DEFAULT_TWITTER_SITE = '@mongodb';
const metaUrl = `https://www.mongodb.com/docs/assets/meta_generic.png`;

const SEO = ({ pageTitle, siteTitle, showDocsLandingTitle, canonical }) => (
  <>
    <title>{showDocsLandingTitle ? 'MongoDB Documentation' : `${pageTitle} — ${siteTitle}`}</title>
    {/* Twitter Tags - default values, may be overwritten by Twitter component */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content={DEFAULT_TWITTER_SITE} />
    <meta property="twitter:title" content={pageTitle} />
    <meta name="twitter:image" content={metaUrl} />
    <meta name="twitter:image:alt" content="MongoDB logo featuring a green leaf on a dark green background." />
    <link id="canonical" data-testid="canonical" rel="canonical" key={canonical} href={canonical} />
  </>
);

SEO.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  siteTitle: PropTypes.string.isRequired,
  showDocsLandingTitle: PropTypes.bool,
  canonical: PropTypes.string.isRequired,
};

export default SEO;
