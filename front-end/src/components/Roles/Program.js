import React from 'react';
import PropTypes from 'prop-types';

const RoleProgram = props => {
  const { nodeData } = props;
  return <strong className="program">{nodeData.label}</strong>;
};

RoleProgram.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        value: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

export default RoleProgram;
