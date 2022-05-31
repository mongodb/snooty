import React from 'react';
import PropTypes from 'prop-types';

const metaUrl = `http://www.mongodb.com/docs/assets/meta_generic.png`;
const metaSecureUrl = `https://www.mongodb.com/docs/assets/meta_generic.png`;
const faviconUrl = `https://www.mongodb.com/docs/assets/favicon.ico`;

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
      <meta property="og:image" content={metaUrl} />
      <meta property="og:image:secure_url" content={metaSecureUrl} />
      <link href="https://fonts.googleapis.com/css?family=Inconsolata" rel="stylesheet" type="text/css" />
      <link rel="shortcut icon" href={faviconUrl} />
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
