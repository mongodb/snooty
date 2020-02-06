import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../ComponentFactory';

const RoleGUILabel = ({ nodeData: { children } }) => (
  <span className="guilabel">
    {children.map((node, i) => (
      <ComponentFactory key={i} nodeData={node} />
    ))}
  </span>
);

RoleGUILabel.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.array.isRequired,
  }).isRequired,
};

export default RoleGUILabel;
