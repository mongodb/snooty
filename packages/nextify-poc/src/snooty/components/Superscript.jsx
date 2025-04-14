import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Superscript = ({ nodeData, ...rest }) => (
  <sup>
    {nodeData.children.map((child, index) => (
      <ComponentFactory {...rest} key={index} nodeData={child} />
    ))}
  </sup>
);

Superscript.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Superscript;
