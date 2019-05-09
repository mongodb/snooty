import React from 'react';
import PropTypes from 'prop-types';
import { REF_TARGETS } from '../../constants';

const RoleRef = ({ nodeData: { label, target } }) => {
  const labelDisplay = label && label.value ? label.value : target;
  // make sure target is hardcoded in list for now
  // TODO: chat w andrew about how to move forward with sphinx inventory files
  if (!REF_TARGETS[target]) {
    console.error(`ERROR: ROLE TARGET DOES NOT EXIST => ${target}`);
    return '';
  }
  return (
    <a href={REF_TARGETS[target]} className="reference external">
      <span className="xref std std-ref">{labelDisplay}</span>
    </a>
  );
};

RoleRef.propTypes = {
  nodeData: PropTypes.shape({
    label: PropTypes.shape({
      value: PropTypes.string,
    }),
    target: PropTypes.string.isRequired,
  }).isRequired,
};

export default RoleRef;
