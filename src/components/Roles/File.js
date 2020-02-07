import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';

const RoleFile = ({ nodeData: { children } }) => (
  <code class="file docutils literal">
    <span class="pre">
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
