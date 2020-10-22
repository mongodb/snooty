import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useSiteMetadata } from '../hooks/use-site-metadata';

const SiteMetadata = ({ siteTitle }) => {
  const { branch, project } = useSiteMetadata();
  return (
    <Helmet
      bodyAttributes={{
        'data-project': project,
        'data-project-title': siteTitle,
        'data-branch': branch,
      }}
    >
      <title>MongoDB Documentation</title>
    </Helmet>
  );
};

SiteMetadata.propTypes = {
  siteTitle: PropTypes.string.isRequired,
};

export default SiteMetadata;
