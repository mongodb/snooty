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
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  }).isRequired,
};

export default RoleGUILabel;
