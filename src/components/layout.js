import React from 'react';
import PropTypes from 'prop-types';
import SiteMetadata from './site-metadata';

const DefaultLayout = ({ children }) => (
  <React.Fragment>
    <SiteMetadata />

    <div
      id="navbar"
      data-navprops='{"links": [{"url": "https://docs.mongodb.com/manual/","text": "Server"},{"url": "https://docs.mongodb.com/ecosystem/drivers/","text": "Drivers"},{"url": "https://docs.mongodb.com/cloud/","text": "Cloud"},{"url": "https://docs.mongodb.com/tools/","text": "Tools"},{"url": "https://docs.mongodb.com/guides/","text": "Guides","active": true}]}'
    />
    {children}
  </React.Fragment>
);

DefaultLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default DefaultLayout;
