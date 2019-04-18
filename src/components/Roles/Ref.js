import React from 'react';
import PropTypes from 'prop-types';
import { REF_TARGETS } from '../../constants';

const RoleRef = props => {
  const { nodeData } = props;
  const label = nodeData.label && nodeData.label.value ? nodeData.label.value : nodeData.label;
  // make sure target is hardcoded in list for now
  // TODO: chat w andrew about how to move forward with sphinx inventory files
  if (!REF_TARGETS[nodeData.target]) {
    console.error(`ERROR: ROLE TARGET DOES NOT EXIST => ${nodeData.target}`);
    return '';
  }
  return (
    <a href={REF_TARGETS[nodeData.target]} className="reference external">
      <span className="xref std std-ref">{label}</span>
    </a>
  );
};

RoleRef.propTypes = {
  nodeData: PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    target: PropTypes.string.isRequired,
  }).isRequired,
};

export default RoleRef;
