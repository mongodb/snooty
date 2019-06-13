import React from 'react';
import PropTypes from 'prop-types';
import { REF_LABELS, REF_TARGETS } from '../../constants';
import { getNestedValue } from '../../utils/get-nested-value';

const RoleRef = ({ nodeData: { label, target } }) => {
  let labelDisplay;
  if (label) {
    labelDisplay = getNestedValue(['value'], label) || target;
  } else {
    labelDisplay = REF_LABELS[target] || target;
  }
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
