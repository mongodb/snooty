import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';

const RoleCommand = ({ nodeData: { children }, ...rest }) => (
  <strong>
    {children.map((child, i) => (
      <ComponentFactory {...rest} key={i} nodeData={child} />
    ))}
  </strong>
);

RoleCommand.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default RoleCommand;
