import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const OpenAPI = ({ nodeData: { children }, ...rest }) => (
  <>
    {children.map((node, i) => (
      <ComponentFactory {...rest} key={i} nodeData={node} />
    ))}
  </>
);

OpenAPI.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default OpenAPI;
