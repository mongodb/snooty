import React from 'react';
import PropTypes from 'prop-types';
import { withPrefix } from 'gatsby';

const HTML = ({ body, bodyAttributes, headComponents, htmlAttributes, preBodyComponents, postBodyComponents }) => (
  <html lang="en" {...htmlAttributes}>
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="robots" content="index" />
      <meta name="release" content="1.0" />
      <meta name="version" content="master" />
      <meta name="DC.Source" content="https://github.com/mongodb/docs-bi-connector/blob/DOCSP-3279/source/index.txt" />
      <meta
        property="og:image"
        content="http://s3.amazonaws.com/info-mongodb-com/_com_assets/cms/mongodb-for-giant-ideas-bbab5c3cf8.png"
      />
      <meta
        property="og:image:secure_url"
        content="https://webassets.mongodb.com/_com_assets/cms/mongodb-for-giant-ideas-bbab5c3cf8.png"
      />
      <link href="https://fonts.googleapis.com/css?family=Inconsolata" rel="stylesheet" type="text/css" />
      <link rel="shortcut icon" href="https://media.mongodb.org/favicon.ico" />
      <link
        rel="search"
        type="application/opensearchdescription+xml"
        href="https://docs.mongodb.com/osd.xml"
        title="MongoDB Help"
      />
      {process.env.GATSBY_SITE === 'guides' ? (
        <link rel="stylesheet" href={withPrefix('docs-tools/guides.css')} type="text/css" />
      ) : (
        <link rel="stylesheet" href={withPrefix('docs-tools/mongodb-docs.css')} type="text/css" />
      )}
      <link rel="stylesheet" href={withPrefix('docs-tools/navbar.min.css')} type="text/css" />
      <script async src={withPrefix('scripts/gtm.js')} />
      {headComponents}
    </head>
    <body {...bodyAttributes}>
      {/* Google Tag Manager (noscript) */}
      <noscript>
        {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-GDFN"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        ></iframe>
      </noscript>
      {/* End Google Tag Manager (noscript) */}
      <script async src={withPrefix('scripts/segment.js')} />
      {preBodyComponents}
      {/* eslint-disable-next-line react/no-danger */}
      <div key="body" id="___gatsby" dangerouslySetInnerHTML={{ __html: body }} />
      {postBodyComponents}
    </body>
  </html>
);

HTML.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  htmlAttributes: PropTypes.object.isRequired,
  headComponents: PropTypes.array.isRequired,
  bodyAttributes: PropTypes.object.isRequired,
  preBodyComponents: PropTypes.array.isRequired,
  body: PropTypes.string.isRequired,
  postBodyComponents: PropTypes.array.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

export default HTML;
