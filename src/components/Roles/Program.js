import React from 'react';
import PropTypes from 'prop-types';
import { getNestedValue } from '../../utils/get-nested-value';

const RoleProgram = ({ nodeData: { label, target } }) => {
  const labelDisplay = getNestedValue(['value'], label) || target;
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
