import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';

const RoleClass = ({ nodeData: { children, target }, ...rest }) => (
  <a href={`${target}`}>
    {children.map((node, i) => (
      <ComponentFactory key={i} nodeData={node} {...rest} />
    ))}
  </a>
);

RoleClass.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
  }).isRequired,
};

export default RoleClass;
