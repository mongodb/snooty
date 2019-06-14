import React from 'react';
import PropTypes from 'prop-types';
import { REF_TARGETS } from '../../constants';
import { getNestedValue } from '../../utils/get-nested-value';

const RoleTerm = ({ nodeData: { label, target } }) => {
  const labelDisplay = getNestedValue(['value'], label) || target;
  return (
    <a href={`${REF_TARGETS.glossary}/#term-${target}`} className="reference external">
      {labelDisplay}
    </a>
  );
};

RoleTerm.propTypes = {
  nodeData: PropTypes.shape({
    label: PropTypes.shape({
      value: PropTypes.string,
    }),
    target: PropTypes.string.isRequired,
  }).isRequired,
};

export default RoleTerm;
