import React from 'react';
import PropTypes from 'prop-types';

const RoleRef = props => {
  const {
    nodeData,
    refDocMapping: { REF_TARGETS },
  } = props;
  const label = nodeData.label && nodeData.label.value ? nodeData.label.value : nodeData.label;
  // make sure target is hardcoded in list for now
  // TODO: chat w andrew about how to move forward with sphinx inv files
  if (!REF_TARGETS[nodeData.target]) {
    console.log(`ERROR: ROLE TARGET DOES NOT EXIST => ${nodeData.target}`);
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
    label: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
  }).isRequired,
  refDocMapping: PropTypes.shape({
    REF_TARGETS: PropTypes.object.isRequired,
  }).isRequired,
};

export default RoleRef;
