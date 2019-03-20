import React from 'react';
import PropTypes from 'prop-types';

const RoleLink = props => {
  const { nodeData } = props;
  const label = nodeData.label && nodeData.label.value ? nodeData.label.value : nodeData.label;
  return (
    <a href={nodeData.target} className="reference external">
      {label}
    </a>
  );
};

RoleLink.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        value: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

export default RoleLink;
