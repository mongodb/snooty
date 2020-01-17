import React from 'react';
import PropTypes from 'prop-types';

const RoleFile = ({
  nodeData: {
    label: { value },
  },
}) => (
  <code class="file docutils literal">
    <span class="pre">{value}</span>
  </code>
);

RoleFile.propTypes = {
  nodeData: PropTypes.shape({
    label: PropTypes.shape({
      value: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default RoleFile;
