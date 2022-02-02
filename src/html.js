import React from 'react';
import PropTypes from 'prop-types';
import { baseUrl } from './utils/dotcom';

const metaUrl = `http://${baseUrl()}/assets/meta_generic.png`;
const metaSecureUrl = `${baseUrl(true)}/assets/meta_generic.png`;
const faviconUrl = `${baseUrl(true)}/assets/favicon.ico`;
const osdUrl = `${baseUrl(true)}/osd.xml`;

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
      <meta property="og:image" content={metaUrl} />
      <meta property="og:image:secure_url" content={metaSecureUrl} />
      <link href="https://fonts.googleapis.com/css?family=Inconsolata" rel="stylesheet" type="text/css" />
      <link rel="shortcut icon" href={faviconUrl} />
      <link rel="search" type="application/opensearchdescription+xml" href={osdUrl} title="MongoDB Help" />
      {headComponents}
    </head>
    <body {...bodyAttributes}>
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
