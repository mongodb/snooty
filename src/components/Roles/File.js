import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';

const RoleFile = ({ nodeData: { children } }) => (
  <code className="file docutils literal">
    <span className="pre">
      {children.map((node, i) => (
        <ComponentFactory key={i} nodeData={node} />
      ))}
    </span>
  </code>
);

RoleFile.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
  }).isRequired,
};

export default RoleFile;
