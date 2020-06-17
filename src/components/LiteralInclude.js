import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const LiteralInclude = ({ nodeData: { children }, ...rest }) => {
  return children.map(child => <ComponentFactory {...rest} nodeData={child} />);
};

LiteralInclude.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
  }).isRequired,
};

export default LiteralInclude;
