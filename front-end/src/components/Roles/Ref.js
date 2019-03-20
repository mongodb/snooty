import React from 'react';
import PropTypes from 'prop-types';

const RoleRef = props => {
  const {
    nodeData,
    refDocMapping: { REF_TARGETS },
  } = props;
  const label = nodeData.label && nodeData.label.value ? nodeData.label.value : nodeData.label;
  // make sure target is hardcoded in list for now
  if (!REF_TARGETS[nodeData.target]) {
    return (
      <span>
        ==Role TARGET does not exist:
        {nodeData.target} ==
      </span>
    );
  }
  return (
    <a href={REF_TARGETS[nodeData.target]} className="reference external">
      <span className="xref std std-ref">{label}</span>
    </a>
  );
};

RoleRef.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        value: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  refDocMapping: PropTypes.shape({
    REF_TARGETS: PropTypes.object.isRequired,
  }).isRequired,
};

export default RoleRef;
