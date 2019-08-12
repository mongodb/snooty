import React from 'react';
import PropTypes from 'prop-types';
import { getNestedValue } from '../utils/get-nested-value';

const VersionChanged = ({ nodeData }) => (
  <div className="versionchanged">
    <p>
      <span className="versionmodified">Changed in version {getNestedValue(['argument', 0, 'value'], nodeData)}.</span>
    </p>
  </div>
);

VersionChanged.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
      }).isRequired
    ).isRequired,
  }).isRequired,
};

export default VersionChanged;
