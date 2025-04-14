import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Subscript = ({ nodeData, ...rest }) => (
  <sub>
    {nodeData.children.map((child, index) => (
      <ComponentFactory {...rest} key={index} nodeData={child} />
    ))}
  </sub>
);

Subscript.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Subscript;
