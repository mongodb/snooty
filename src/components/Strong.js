import React from 'react';
import PropTypes from 'prop-types';
import getNestedValue from '../utils/get-nested-value.mjs';

const Strong = ({ nodeData }) => <strong>{getNestedValue(['children', 0, 'value'], nodeData)}</strong>;

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
