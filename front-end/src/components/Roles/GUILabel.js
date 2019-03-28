import React from 'react';
import PropTypes from 'prop-types';

const RoleGUILabel = props => {
  const {
    nodeData: { label },
  } = props;
  return <span className="guilabel">{label}</span>;
};

RoleGUILabel.propTypes = {
  nodeData: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
};

export default RoleGUILabel;
