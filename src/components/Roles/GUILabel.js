import React from 'react';
import PropTypes from 'prop-types';

const RoleGUILabel = ({
  nodeData: {
    label: { value },
  },
}) => <span className="guilabel">{value}</span>;

RoleGUILabel.propTypes = {
  nodeData: PropTypes.shape({
    label: PropTypes.shape({
      value: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default RoleGUILabel;
