import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useSiteMetadata } from '../hooks/use-site-metadata';

const SiteMetadata = ({ siteTitle }) => {
  const { parserBranch, project } = useSiteMetadata();
  return (
    <Helmet
      bodyAttributes={{
        'data-project': project,
        'data-project-title': siteTitle,
        'data-branch': parserBranch,
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
