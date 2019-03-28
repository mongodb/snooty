import React from 'react';
import PropTypes from 'prop-types';

const RoleLink = props => {
  const {
    nodeData: { label, target },
  } = props;
  const labelDisplay = label && label.value ? label.value : label;
  return (
    <a href={target} className="reference external">
      {labelDisplay}
    </a>
  );
};

RoleLink.propTypes = {
  nodeData: PropTypes.shape({
    label: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
  }).isRequired,
};

export default RoleLink;
