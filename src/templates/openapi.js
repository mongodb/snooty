import React from 'react';
import PropTypes from 'prop-types';

const OpenAPITemplate = ({ children }) => <div className="content">{children}</div>;

OpenAPITemplate.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

export default OpenAPITemplate;
