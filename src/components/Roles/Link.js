import React from 'react';
import PropTypes from 'prop-types';
import { REF_TARGETS } from '../../constants';

const RoleLink = props => {
  const {
    nodeData: { label, name, target },
  } = props;
  const labelDisplay = label && label.value ? label.value : label;

  let urlDestination = 'internal';
  let url = target;
  if (name === 'manual') {
    url = REF_TARGETS.manual + target;
    urlDestination = 'external';
  }

  return (
    <a href={url} className={`reference ${urlDestination}`}>
      {labelDisplay}
    </a>
  );
};

RoleLink.propTypes = {
  nodeData: PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    target: PropTypes.string.isRequired,
  }).isRequired,
};

export default RoleLink;
