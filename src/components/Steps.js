import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Steps = ({ nodeData: { children }, ...rest }) =>
  children.map((child, i) => <ComponentFactory {...rest} key={i} nodeData={child} stepNum={i + 1} />);

Steps.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Steps;
