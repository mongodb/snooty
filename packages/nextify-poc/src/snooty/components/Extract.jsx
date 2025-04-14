import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Extract = ({ nodeData: { children }, ...rest }) =>
  children.map((child, i) => <ComponentFactory {...rest} key={i} nodeData={child} />);

Extract.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Extract;
