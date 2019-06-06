import React from 'react';
import { Helmet } from 'react-helmet';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import { getPathPrefix } from '../utils/get-path-prefix';

const SiteMetadata = () => {
  const { branch, project, title } = useSiteMetadata();

  return (
    <Helmet
      defaultTitle={title}
      bodyAttributes={{
        'data-project': project,
        'data-project-title': title,
        'data-branch': branch,
        'data-enable-marian': 1,
      }}
    >
      <html lang="en" />
      <meta name="docsearch:version" content="2.0" />
      <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no,viewport-fit=cover" />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en" />
      <meta property="og:site_name" content={title} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />

      <meta name="twitter:card" content="summary" />

      <link rel="stylesheet" href={`${getPathPrefix()}/docs-tools/guides.css`} type="text/css" />
      <link rel="stylesheet" href={`${getPathPrefix()}/docs-tools/css/navbar.min.css`} type="text/css" />
      <script async src={`${getPathPrefix()}/scripts/segment.js`} />
      <script async src={`${getPathPrefix()}/docs-tools/navbar.min.js`} />
    </Helmet>
  );
};

export default SiteMetadata;
