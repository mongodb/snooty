import React from 'react';
import PropTypes from 'prop-types';

const RoleProgram = ({ nodeData: { label, target } }) => {
  const labelDisplay = label && label.value ? label.value : target;
  return <strong className="program">{labelDisplay}</strong>;
};

RoleProgram.propTypes = {
  nodeData: PropTypes.shape({
    label: PropTypes.shape({
      value: PropTypes.string,
    }),
    target: PropTypes.string.isRequired,
  }).isRequired,
};

export default RoleProgram;
