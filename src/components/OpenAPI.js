import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const OpenAPI = ({ nodeData: { children } }) => (
  <>
    {children.map((node, i) => (
      <ComponentFactory nodeData={node} key={i} sectionDepth={1} />
    ))}
  </>
);

OpenAPI.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default OpenAPI;
