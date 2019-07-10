import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import Navbar from './Navbar';

const DefaultLayout = ({ children }) => {
  const { branch, project, title } = useSiteMetadata();
  return (
    <React.Fragment>
      <Helmet
        defaultTitle={title}
        bodyAttributes={{
          'data-project': project,
          'data-project-title': title,
          'data-branch': branch,
          'data-enable-marian': 1,
        }}
      />
      <Navbar />
      {children}
    </React.Fragment>
  );
};

DefaultLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default DefaultLayout;
