import React from 'react';
import PropTypes from 'prop-types';
import { REF_TARGETS } from '../../constants';

const RoleTerm = ({ nodeData: { label, target } }) => {
  const labelDisplay = label && label.value ? label.value : target;
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
