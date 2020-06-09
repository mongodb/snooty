import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const LiteralInclude = ({ nodeData: { children }, ...rest }) => {
  if (children && children.length) {
    return <ComponentFactory {...rest} nodeData={children[0]} />;
  }
  return <ComponentFactory {...rest} nodeData={{ type: 'code', value: '' }} />;
};

LiteralInclude.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
  }).isRequired,
};

export default LiteralInclude;
