import React from 'react';
import PropTypes from 'prop-types';
import { REF_TARGETS } from '../../constants';

const RoleManual = ({ nodeData: { label, target } }) => {
  const labelDisplay = label.value || label;

  return (
    <a href={`${REF_TARGETS.manual}${target.replace('/manual', '')}`} className="reference external">
      {labelDisplay}
    </a>
  );
};

RoleManual.propTypes = {
  nodeData: PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    target: PropTypes.string.isRequired,
  }).isRequired,
};

export default RoleManual;
