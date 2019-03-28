import React from 'react';
import PropTypes from 'prop-types';

const RoleProgram = props => {
  const {
    nodeData: { label },
  } = props;
  return <strong className="program">{label}</strong>;
};

RoleProgram.propTypes = {
  nodeData: PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  }).isRequired,
};

export default RoleProgram;
