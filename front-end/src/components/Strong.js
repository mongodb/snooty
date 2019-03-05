import React from 'react';
import PropTypes from 'prop-types';

const Strong = ({ nodeData }) => <strong>{nodeData.children[0].value}</strong>;

Strong.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Strong;
