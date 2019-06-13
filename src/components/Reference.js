import React from 'react';
import PropTypes from 'prop-types';
import { getNestedValue } from '../utils/get-nested-value';

const Reference = ({ nodeData }) => {
  return (
    <a className="reference external" href={nodeData.refuri}>
      {getNestedValue(['children', 0, 'value'], nodeData)}
    </a>
  );
};

Reference.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        value: PropTypes.string,
      })
    ).isRequired,
    refuri: PropTypes.string.isRequired,
  }).isRequired,
};

export default Reference;
