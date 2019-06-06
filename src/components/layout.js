import React from 'react';
import PropTypes from 'prop-types';
import SiteMetadata from './site-metadata';

const DefaultLayout = ({ children }) => (
  <React.Fragment>
    <SiteMetadata />
    {children}
  </React.Fragment>
);

DefaultLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default DefaultLayout;
