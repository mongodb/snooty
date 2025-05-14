import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';

const Input = ({ nodeData: { children }, ...rest }) => {
  return children.map((child, i) => <ComponentFactory {...rest} key={i} nodeData={child} />);
};

Input.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Input;
