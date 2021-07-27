import React from 'react';
import PropTypes from 'prop-types';

const OpenAPITemplate = ({ children }) => <div>{children}</div>;

OpenAPITemplate.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

export default OpenAPITemplate;
