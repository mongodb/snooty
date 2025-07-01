import React from 'react';
import { getLocaleMapping } from '../utils/locale';
import { useSiteMetadata } from '../hooks/use-site-metadata';

const DEFAULT_TWITTER_SITE = '@mongodb';
const metaUrl = `https://www.mongodb.com/docs/assets/meta_generic.png`;

export type SEOProps = {
  pageTitle: string;
  siteTitle: string;
  showDocsLandingTitle: boolean;
  canonical: string;
  slug: string;
  noIndexing: boolean;
};

const SEO = ({ pageTitle, siteTitle, showDocsLandingTitle, canonical, slug, noIndexing }: SEOProps) => {
  // Using static siteUrl instead of location.origin due to origin being undefined at build time
  const { siteUrl } = useSiteMetadata();
  const localeHrefMap = getLocaleMapping(siteUrl, slug);
  // Do not remove class. This is used to prevent Smartling from potentially overwriting these links
  const smartlingNoRewriteClass = 'sl_opaque';

  const hrefLangLinks = Object.entries(localeHrefMap).map(([localeCode, href]) => {
    return (
      <link key={localeCode} className={smartlingNoRewriteClass} rel="alternate" hrefLang={localeCode} href={href} />
    );
  });

  const englishHref = localeHrefMap['en-us'];
  if (englishHref) {
    hrefLangLinks.push(
      <link
        key="x-default"
        className={smartlingNoRewriteClass}
        rel="alternate"
        hrefLang="x-default"
        href={englishHref}
      />
    );
  }

  const title =
    !siteTitle && !pageTitle
      ? 'MongoDB Documentation'
      : showDocsLandingTitle
      ? 'MongoDB Documentation - Homepage'
      : `${pageTitle ? `${pageTitle} - ` : ''}${siteTitle} - MongoDB Docs`;

  return (
    <>
      <title>{title}</title>
      {hrefLangLinks}
      {/* Twitter Tags - default values, may be overwritten by Twitter component */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={DEFAULT_TWITTER_SITE} />
      <meta property="twitter:title" content={title} />
      <meta name="twitter:image" content={metaUrl} />
      <meta name="twitter:image:alt" content="MongoDB logo featuring a green leaf on a dark green background." />
      <meta property="og:title" content={title} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={metaUrl} />
      <meta property="og:image:secure_url" content={metaUrl} />
      <meta property="og:type" content="website" />
      {noIndexing && <meta name="robots" content="noindex" />}
      {canonical && <link data-testid="canonical" id="canonical" rel="canonical" key={canonical} href={canonical} />}
    </>
  );
};

export default SEO;
