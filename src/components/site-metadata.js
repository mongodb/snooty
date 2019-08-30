import React from 'react';
import { Helmet } from 'react-helmet';
// eslint-disable-next-line import/no-unresolved
import { useSiteMetadata } from 'useSiteMetadata'; // Alias in webpack.config

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
    />
  );
};

export default SiteMetadata;
