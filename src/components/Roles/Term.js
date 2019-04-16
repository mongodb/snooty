import React from 'react';
import PropTypes from 'prop-types';
import { REF_TARGETS } from '../../constants';

const RoleTerm = ({ nodeData: { label, target } }) => {
  const labelDisplay = label.value || label;

  return (
    <a href={`${REF_TARGETS.glossary}/#term-${target}`} className="reference external">
      {labelDisplay}
    </a>
  );
};

RoleTerm.propTypes = {
  nodeData: PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    target: PropTypes.string.isRequired,
  }).isRequired,
};

export default RoleTerm;
