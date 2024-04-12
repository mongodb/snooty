import React from 'react';
import PropTypes from 'prop-types';
import { getLocaleMapping } from '../utils/locale';
import { useSiteMetadata } from '../hooks/use-site-metadata';

const DEFAULT_TWITTER_SITE = '@mongodb';
const metaUrl = `https://www.mongodb.com/docs/assets/meta_generic.png`;

const SEO = ({ pageTitle, siteTitle, showDocsLandingTitle, canonical, slug }) => {
  // Using static siteUrl instead of location.origin due to origin being undefined at build time
  const { siteUrl } = useSiteMetadata();
  const localeHrefMap = getLocaleMapping(siteUrl, slug);

  const hrefLangLinks = Object.entries(localeHrefMap).map(([langCode, href]) => {
    const hrefLang = langCode === 'en-us' ? 'x-default' : langCode;
    // Do not remove class. This is used to prevent Smartling from potentially overwriting these links
    const smartlingNoRewriteClass = 'sl_opaque';
    return <link key={hrefLang} className={smartlingNoRewriteClass} rel="alternate" hrefLang={hrefLang} href={href} />;
  });

  return (
    <>
      <title>
        {showDocsLandingTitle || (!siteTitle && !pageTitle)
          ? 'MongoDB Documentation'
          : `${pageTitle ? `${pageTitle} - ` : ''}${siteTitle}`}
      </title>
      {hrefLangLinks}
      {/* Twitter Tags - default values, may be overwritten by Twitter component */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={DEFAULT_TWITTER_SITE} />
      <meta property="twitter:title" content={pageTitle} />
      <meta name="twitter:image" content={metaUrl} />
      <meta name="twitter:image:alt" content="MongoDB logo featuring a green leaf on a dark green background." />
      {canonical && <link data-testid="canonical" id="canonical" rel="canonical" key={canonical} href={canonical} />}
    </>
  );
};

SEO.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  siteTitle: PropTypes.string.isRequired,
  showDocsLandingTitle: PropTypes.bool,
  canonical: PropTypes.string,
};

export default SEO;
