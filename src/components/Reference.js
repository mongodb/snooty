import React from 'react';
import PropTypes from 'prop-types';
import Link from './Link';
import { getNestedValue } from '../utils/get-nested-value';

const Reference = ({ nodeData }) => (
  <Link className="reference external" to={nodeData.refuri}>
    {getNestedValue(['children', 0, 'value'], nodeData)}
  </Link>
);

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
