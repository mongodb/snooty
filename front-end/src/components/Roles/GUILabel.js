import React from 'react';
import PropTypes from 'prop-types';

const RoleGUILabel = props => {
  const { nodeData } = props;
  return <span className="guilabel">{nodeData.label}</span>;
};

RoleGUILabel.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        value: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

export default RoleGUILabel;
