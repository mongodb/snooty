import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';

const RoleProgram = ({ nodeData: { children } }) => {
  return (
    <strong className="program">
      {children.map((node, i) => (
        <ComponentFactory key={i} nodeData={node} />
      ))}
    </strong>
  );
};

RoleProgram.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
  }).isRequired,
};

export default RoleProgram;
