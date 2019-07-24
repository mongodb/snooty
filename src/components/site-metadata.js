import React from 'react';
import { Helmet } from 'react-helmet';
import { useSiteMetadata } from '../hooks/use-site-metadata';

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
