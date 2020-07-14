import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
// eslint-disable-next-line import/no-unresolved
import { useSiteMetadata } from 'useSiteMetadata'; // Alias in webpack.config

const SiteMetadata = ({ pageTitle, siteTitle }) => {
  const { branch, project } = useSiteMetadata();
  return (
    <Helmet
      defaultTitle="MongoDB Documentation"
      title={`${pageTitle} — ${siteTitle}`}
      bodyAttributes={{
        'data-project': project,
        'data-project-title': siteTitle,
        'data-branch': branch,
      }}
    />
  );
};

SiteMetadata.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  siteTitle: PropTypes.string.isRequired,
};

export default SiteMetadata;
