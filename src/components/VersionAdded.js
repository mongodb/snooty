import React from 'react';
import PropTypes from 'prop-types';
import { getNestedValue } from '../utils/get-nested-value';

const VersionAdded = ({ nodeData }) => (
  <div className="versionadded">
    <p>
      <span className="versionmodified">New in version {getNestedValue(['argument', 0, 'value'], nodeData)}.</span>
    </p>
  </div>
);

VersionAdded.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
      }).isRequired
    ).isRequired,
  }).isRequired,
};

export default VersionAdded;
