import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Root = ({ nodeData: { children }, ...rest }) =>
  children.map((child, i) => <ComponentFactory {...rest} key={i} nodeData={child} />);

Root.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Root;
