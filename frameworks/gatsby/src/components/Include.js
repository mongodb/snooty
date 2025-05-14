import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const Include = ({ nodeData: { children }, ...rest }) =>
  children.map((child, i) => <ComponentFactory {...rest} key={i} nodeData={child} />);

Include.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Include;
