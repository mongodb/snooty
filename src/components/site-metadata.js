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

      <link href="https://fonts.googleapis.com/css?family=Inconsolata" rel="stylesheet" type="text/css" />
      <link rel="shortcut icon" href="https://media.mongodb.org/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
      <style type="text/css">
        {`
          .hljs {
            background: none !important;
            padding: 0px !important;
            display: inline !important;
          }
        `}
      </style>
      <link
        rel="search"
        type="application/opensearchdescription+xml"
        href="https://docs.mongodb.com/osd.xml"
        title="MongoDB Help"
      />

      <link rel="stylesheet" href={`${getPathPrefix()}/docs-tools/guides.css`} type="text/css" />
      <link rel="stylesheet" href={`${getPathPrefix()}/docs-tools/css/navbar.min.css`} type="text/css" />
      <script async src={`${getPathPrefix()}/scripts/segment.js`} />
      <script async src={`${getPathPrefix()}/docs-tools/navbar.min.js`} />
    </Helmet>
  );
};

export default SiteMetadata;
